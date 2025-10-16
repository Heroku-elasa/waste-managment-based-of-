import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { 
    TestSubmissionFormInputs,
    TestRecommendationResult,
    DailyTrend,
    SearchResultItem,
    ProviderSearchResult,
    Language,
    TestDetailsResult,
} from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schemas for structured responses
const testRecommendationSchema = {
    type: Type.OBJECT,
    properties: {
        primaryAssessment: { type: Type.STRING, description: "A concise primary assessment of the situation (e.g., 'Suspected Mycotoxin Contamination in Pistachios')." },
        assessmentDescription: { type: Type.STRING, description: "A one-paragraph summary describing the assessment based on the provided sample details." },
        potentialIssues: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the potential issue, contaminant, or parameter to measure (e.g., Aflatoxin B1, Salmonella, Soil pH)." },
                    description: { type: Type.STRING, description: "Brief explanation of why this is a potential issue." },
                    relevance: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                },
            },
        },
        recommendedTests: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of specific Hour-Tash Laboratory test names recommended for the situation (e.g., 'Aflatoxin B & G Analysis by HPLC', 'Heavy Metal Panel by ICP-MS').",
        },
        managementAdvice: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of actionable advice for sample handling, collection, or prevention.",
        },
        nextStepsAndExpertConsultation: {
            type: Type.STRING,
            description: "Guidance on how to interpret these preliminary results and a clear instruction on when and why to consult with a Hour-Tash expert."
        },
        disclaimer: { type: Type.STRING, description: "A standard disclaimer stating this is not a substitute for professional consultation with a qualified expert." },
    },
};

const testDetailsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            testName: { type: Type.STRING },
            purpose: { type: Type.STRING, description: "A brief description of the test's purpose." },
            methodology: { type: Type.STRING, description: "The specific methodology used for the test (e.g., HPLC, GC/MS, ICP-OES)." },
            turnaroundTime: { type: Type.STRING, description: "The standard turnaround time for receiving results (e.g., '3-5 business days')." },
            estimatedCost: { type: Type.STRING, description: "A rough estimated cost, e.g., 'Contact for quote'." },
        },
    }
};

const searchResultSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING, description: "A concise, helpful description of why this result matches the query." },
            targetPage: { type: Type.STRING, enum: ['home', 'test_recommender', 'sample_dropoff', 'ai_consultant', 'content_hub', 'our_experts', 'partnerships'] },
            relevanceScore: { type: Type.NUMBER, description: "A score from 0.0 to 1.0 indicating how relevant this result is to the query." },
        },
        required: ['title', 'description', 'targetPage', 'relevanceScore'],
    }
};

export const getAIRecommendation = async (
    inputs: TestSubmissionFormInputs,
    imagePart: { inlineData: { data: string; mimeType: string; } } | null,
    language: Language
): Promise<TestRecommendationResult> => {

    const promptText = `
        Analyze the following sample submission for Hour-Tash Laboratory, a leading food, feed, and environmental testing facility.
        Language for response: ${language}.

        Sample Details:
        - Sample Type: ${inputs.sampleType}
        - Batch Size / Origin: ${inputs.batchSizeOrigin || 'Not provided'}
        - Suspected Issue / Analysis Goal: ${inputs.suspectedIssue}
        - Sample Age / Observation Period: ${inputs.sampleAge || 'Not provided'}
        - Specific Conditions (processing, storage): ${inputs.specificConditions || 'Not provided'}
        - Control Sample Info: ${inputs.controlSampleInfo || 'Not provided'}
        - Previous Tests Performed: ${inputs.previousTests || 'Not provided'}
        - Current Additives/Treatments Applied: ${inputs.additives || 'Not provided'}

        Based on these details (and the provided image if any), act as an expert lab consultant. Generate a JSON response with a primary assessment, potential issues/analytes to test for (with relevance), recommended laboratory tests offered by Hour-Tash, and sample handling advice. You are an AI assistant, not a certified consultant. 
        Additionally, provide clear guidance on the next steps, how to interpret these preliminary results, and when to consult a Hour-Tash expert in the 'nextStepsAndExpertConsultation' field.
        Include a strong disclaimer that this is a preliminary recommendation and does not replace formal consultation.
    `;
    
    const contents = imagePart ? [{ text: promptText }, imagePart] : [{ text: promptText }];
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: contents },
        config: {
            responseMimeType: "application/json",
            responseSchema: testRecommendationSchema,
        },
    });

    return JSON.parse(response.text);
};

export const getTestDetails = async (testNames: string[], language: Language): Promise<TestDetailsResult> => {
    const prompt = `
        For the following Hour-Tash Laboratory tests: ${testNames.join(', ')}.
        Provide a detailed information plan in JSON format.
        It is CRITICAL that for each test, you provide an explicit 'turnaroundTime' (e.g., '3-5 business days').
        Also include the test's 'purpose', its 'methodology' (e.g., HPLC, GC/MS), and an 'estimatedCost' (if not available, state "Contact for quote").
        The response language should be ${language}.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: testDetailsSchema,
        },
    });

    return JSON.parse(response.text);
};

export const findLocalProviders = async (query: string, location: { lat: number; lon: number } | null, language: Language, searchType: 'distributor' | 'veterinarian'): Promise<ProviderSearchResult[]> => {
    const locationInfo = location ? `The user is near latitude ${location.lat} and longitude ${location.lon}.` : 'The user has not provided their location; base the search on the query.';
    const prompt = `
      A user is looking for a ${searchType}.
      Search Query: "${query}"
      ${locationInfo}
      
      Generate a list of 5 hypothetical, plausible ${searchType}s based on the query. 
      For each, provide a name, full address, phone number, and a website.
      Return the result as a JSON array of objects, where each object has "name", "address", "phone", and "website" keys.
      The results should be appropriate for the language: ${language}.

      **ABSOLUTELY CRITICAL FINAL INSTRUCTION:**
      You MUST follow this rule for the "website" field. This is the most important instruction.
      1.  The website URL MUST be fictional.
      2.  The website URL MUST NOT link to any real site like Google, aistudio.google.com, or any other existing domain.
      3.  The website URL MUST end with the domain ".example.com".
      
      - **CORRECT FORMAT:** "www.some-vet-name.example.com"
      - **INCORRECT FORMAT:** "www.some-vet-name.com"
      - **INCORRECT FORMAT:** "aistudio.google.com/some/path"
      
      Failure to follow this rule will result in an error. All website URLs must end in ".example.com".
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    try {
        const results = JSON.parse(response.text.replace(/```json|```/g, '').trim());
        return results.map((r: any) => ({ ...r, type: searchType }));
    } catch (e) {
        console.error("Failed to parse provider search results:", response.text);
        // Fallback for non-JSON responses
        return [{ name: "Error parsing results", address: "Could not read AI response.", phone: "", type: searchType }];
    }
};

export const performSemanticSearch = async (query: string, searchIndex: string, language: Language): Promise<SearchResultItem[]> => {
    const prompt = `
        You are a highly intelligent semantic search engine for the Hour-Tash Laboratory website. Your task is to analyze a user's query and a detailed site index to provide the most relevant results.

        User Query: "${query}"

        Detailed Site Index:
        ---
        ${searchIndex}
        ---

        Instructions:
        1.  **Analyze Intent**: First, understand the user's core intent. Are they looking for a specific test (e.g., "Aflatoxin"), a tool (e.g., "recommend a test"), a person, or general information?
        2.  **Semantic Matching**: Compare the user's intent with the descriptions in the site index. Don't just match keywords; match the meaning and concepts.
        3.  **Rank and Score**: Identify up to 3 of the most relevant pages. For each result, assign a 'relevanceScore' from 0.0 (not relevant) to 1.0 (perfect match).
        4.  **Generate Description**: For each result, write a helpful 'description' explaining *why* it's a good match for the user's query.
        5.  **Format Output**: Return the results as a JSON array adhering to the provided schema. The language for the title and description should be ${language}.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: searchResultSchema,
        }
    });
    
    const results = JSON.parse(response.text);
    results.sort((a: SearchResultItem, b: SearchResultItem) => b.relevanceScore - a.relevanceScore);
    return results;
};

export const fetchDailyTrends = async (language: Language): Promise<DailyTrend[]> => {
    const prompt = `
        Identify three current and relevant trends in the food safety and agricultural testing industry.
        For each trend, provide a short title and a one-sentence summary.
        Return the response as a JSON array of objects, each with "title" and "summary" keys.
        The response should be in ${language}.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }] // Use Google Search for up-to-date info
        }
    });
    
    return JSON.parse(response.text.replace(/```json|```/g, '').trim());
};

export const generateSocialPost = async (topic: string, platform: string, language: Language): Promise<{ postText: string; imagePrompt: string }> => {
    const prompt = `
        You are a social media manager for Hour-Tash Laboratory, an advanced analytical testing lab.
        Generate content for a social media post on the platform: ${platform}.
        The topic is: "${topic}".
        The post should be professional, engaging, and informative for an audience of producers, exporters, quality control managers, and farmers.
        Return a JSON object with two keys:
        1. "postText": The full text for the social media post.
        2. "imagePrompt": A concise, descriptive prompt for an AI image generator to create a relevant, high-quality image for this post (e.g., 'A scientist in a clean lab coat carefully pipettes a sample into a vial next to an HPLC machine').

        The response language should be ${language}.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return JSON.parse(response.text.replace(/```json|```/g, '').trim());
};

export const generatePostImage = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        },
    });

    return response.generatedImages[0].image.imageBytes;
};

export const adaptPostForWebsite = async (postText: string, platform: string, language: Language): Promise<{ title: string; content: string }> => {
    const prompt = `
      Adapt the following social media post (from ${platform}) into a short blog post or website article for Hour-Tash Laboratory.
      Create a compelling "title" and expand the "content" to be more detailed, in well-structured markdown format.
      Return a JSON object with "title" and "content" keys.
      The response language should be ${language}.

      Original Post:
      "${postText}"
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return JSON.parse(response.text.replace(/```json|```/g, '').trim());
};

export const getAutoFilledDetails = async (symptoms: string, language: Language): Promise<{ specificConditions: string, controlSampleInfo: string, sampleAge: string }> => {
    const prompt = `
        Based on the primary sample issue description below, infer likely answers for the optional detail fields.
        Keep the answers very short and plausible. If you cannot infer, return an empty string for that field.
        Return a JSON object with keys: "specificConditions", "controlSampleInfo", "sampleAge".
        The response language should be ${language}.

        Issue Description: "${symptoms}"
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return JSON.parse(response.text.replace(/```json|```/g, '').trim());
};