

import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import SiteHeader from './components/Header';
import HomePage from './components/HomePage';
import PartnershipsPage from './components/PartnershipsPage';
import QuotaErrorModal from './components/QuotaErrorModal';
import LoginModal from './components/LoginModal';
import AIChatPage from './components/AIChatPage';
import TeamPage from './components/TeamPage';
import DistributorFinderPage from './components/DistributorFinderPage';
import RecommendationEnginePage from './components/RecommendationEnginePage';
import SearchModal from './components/SearchModal';
import FloatingChatbot from './components/FloatingChatbot';
import ContentHubPage from './components/ContentHubPage';
import { Page, ProviderSearchResult, Message, SearchResultItem, useLanguage, TestSubmissionFormInputs, TestRecommendationResult, DailyTrend, GeneratedPost, TestDetailsResult } from './types';
import { useToast } from './components/Toast';
import { performSemanticSearch, findLocalProviders, getAIRecommendation, fetchDailyTrends, generateSocialPost, generatePostImage, getTestDetails, adaptPostForWebsite } from './services/geminiService';
import SiteFooter from './components/Footer';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const systemInstruction = `You are a professional, helpful, and knowledgeable AI assistant for Hour-Tash Laboratory, a leading, knowledge-based laboratory for chemical and microbiological analysis. Your purpose is to assist users, who are primarily producers, farmers, exporters, and quality control managers, by providing accurate information about Hour-Tash's testing services.

**Your capabilities:**
*   Answer questions about tests for food, animal feed, and agricultural products. This includes information on tests for feed additives (like toxin binders, pellet binders, acidifiers), Mycotoxin screening (Aflatoxin, Zearalenone), pesticide residue analysis, heavy metal analysis, microbiological counts, honey analysis, etc.
*   Provide information on the laboratory, its certifications, and equipment (HPLC, GC, GC/MS, LC/MS/MS).
*   Help users find information on the website.

**App Features & Navigation:**
You can also guide users to the right tools on our website. When a user's query matches one of the features below, you should recommend they use it and provide a special link.
*   **AI Test Recommender**: Use this for users asking for test recommendations for a specific sample or suspected issue. Suggest it with the link format: [AI Test Recommender](page:test_recommender)
*   **Find Sample Drop-off**: Use this for users asking where they can submit their samples. Suggest it with the link format: [Find Sample Drop-off](page:sample_dropoff)
*   **Our Experts**: Use this when users ask about the lab's personnel or specialists. Suggest it with the link format: [Our Experts](page:our_experts)
*   **B2B Services**: Use this for inquiries about partnerships or contracts. Suggest it with the link format: [B2B Services](page:partnerships)
*   **Content Hub**: Use this for users asking about food safety news, industry trends, or marketing content. Suggest it with the link format: [Content Hub](page:content_hub)

Example response: "For a comprehensive analysis of potential pesticide residues in your pistachio sample, I highly recommend using our [AI Test Recommender](page:test_recommender) for a personalized test panel suggestion."

**Tone and Style:**
*   Maintain a professional, scientific, and helpful tone at all times.
*   Use relevant emojis (like 🔬, 🧪, 🍯, 🌾, 📈) to make your responses more engaging.

**Crucial Safety Instructions:**
*   **DO NOT PROVIDE A DIAGNOSIS OR DECLARE A SAMPLE 'SAFE' OR 'UNSAFE'.** You are an AI assistant providing information on testing. The interpretation of results must be done by qualified experts.
*   Your information should be general. Do not give specific regulatory advice for a given country, but you can mention that the lab performs tests required for export to certain regions (e.g., EU). Always defer to official standards and qualified consultants.`;


const App: React.FC = () => {
  const [currentPage, setPage] = useState<Page>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isQuotaExhausted, setIsQuotaExhausted] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // AI Chat State
  const [chatHistory, setChatHistory] = useState<Message[]>([{ role: 'model', parts: [{ text: "سلام! من دستیار هوشمند آزمایشگاه هورتاش هستم. امروز چگونه می‌توانم به شما در زمینه خدمات آنالیز کمک کنم؟" }] }]);
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Distributor Finder State
  const [providerResults, setProviderResults] = useState<ProviderSearchResult[] | null>(null);
  const [isFindingProviders, setIsFindingProviders] = useState(false);
  
  // Search State
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  // Recommendation Engine State
  const [recommendationResult, setRecommendationResult] = useState<TestRecommendationResult | null>(null);
  const [isGettingRecommendation, setIsGettingRecommendation] = useState(false);
  const [testDetails, setTestDetails] = useState<TestDetailsResult | null>(null);
  const [isFetchingTestDetails, setIsFetchingTestDetails] = useState(false);
  
  // Content Hub State
  const [dailyTrends, setDailyTrends] = useState<DailyTrend[] | null>(null);
  const [isFetchingTrends, setIsFetchingTrends] = useState(false);
  const [trendsError, setTrendsError] = useState<string | null>(null);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [adaptedPost, setAdaptedPost] = useState<{title: string, content: string} | null>(null);
  const [isAdapting, setIsAdapting] = useState(false);


  const { addToast } = useToast();
  const { language, t } = useLanguage();
  
  const searchIndex = `
    Service Categories: 
    - ${t('products.food_feed.title')}: ${t('products.food_feed.description')} Keywords: chemical analysis, meat, honey, fats, grains, feed.
    - ${t('products.microbiology.title')}: ${t('products.microbiology.description')} Keywords: pathogens, spoilage, quality indicators, microbiological testing.
    - ${t('products.environmental.title')}: ${t('products.environmental.description')} Keywords: soil, water, minerals, ICP-MS, ICP-OES, Fire Assay.

    Company Experts:
    - ${t('ourTeam.doctors.0.name')}: ${t('ourTeam.doctors.0.specialty')} - ${t('ourTeam.doctors.0.bio')}
    - ${t('ourTeam.doctors.1.name')}: ${t('ourTeam.doctors.1.specialty')} - ${t('ourTeam.doctors.1.bio')}
    - ${t('ourTeam.doctors.2.name')}: ${t('ourTeam.doctors.2.specialty')} - ${t('ourTeam.doctors.2.bio')}

    Website Pages & Tools:
    - Page: Home ('home'). Content: Main page with service categories and company overview. Introduction to Hour-Tash Laboratory.
    - Tool: AI Test Recommender ('test_recommender'). Content: AI-powered tool to get test suggestions for a sample. Users describe their sample (e.g., pistachios, honey, soil) and suspected issues to get a list of recommended tests like aflatoxin screening, purity analysis, or nutrient profiles.
    - Page: Sample Drop-off Locations ('sample_dropoff'). Content: A map and search tool to find partner clinics and physical locations where clients can submit their samples for analysis.
    - Tool: AI Consultant ('ai_consultant'). Content: A chat interface to talk with an AI expert about Hour-Tash's services, specific tests like HPLC or GC/MS, and procedures.
    - Page: Content Hub ('content_hub'). Content: A tool to discover food safety news, industry trends, and generate marketing content for social media or websites.
    - Page: Our Experts ('our_experts'). Content: A page to meet our team of specialists, including Dr. Aria Mehr, Dr. Sara Rostami, and Dr. Kian Parsa, with their biographies and specialties.
    - Page: B2B Services ('partnerships'). Content: Information on contract testing, partnerships, and business-to-business collaborations. Includes a contact form for inquiries.
  `;
    
  const handleApiError = (error: unknown): string => {
    let message = "An unexpected error occurred.";
    if (error instanceof Error) {
        message = error.message;
    } else if (typeof error === 'string') {
        message = error;
    }
    
    if (message.includes('429') || message.includes('quota')) {
        setIsQuotaExhausted(true);
        message = "API quota exceeded. Please check your billing or try again later.";
    }
    
    addToast(message, 'error');
    return message;
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    addToast("You have been logged out.", "info");
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    addToast("Login successful!", "success");
  };

  const handleAiSendMessage = async (message: string) => {
    const userMessage: Message = { role: 'user', parts: [{ text: message }] };
    
    const historyForApi = [...chatHistory, userMessage];
    
    setChatHistory(prev => [...prev, userMessage, { role: 'model', parts: [{ text: '' }] }]);
    setIsStreaming(true);

    try {
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: historyForApi,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        let fullResponse = '';
        for await (const chunk of responseStream) {
            fullResponse += chunk.text;
            setChatHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = { role: 'model', parts: [{ text: fullResponse }] };
                return newHistory;
            });
        }
    } catch (error) {
        handleApiError(error);
        setChatHistory(prev => prev.slice(0, -1)); 
    } finally {
        setIsStreaming(false);
    }
  };
  
  const handleProviderSearch = async (
    searchMethod: 'geo' | 'text',
    query: string,
    searchType: 'distributor' | 'veterinarian' = 'distributor'
  ) => {
      setIsFindingProviders(true);
      setProviderResults(null);
      try {
          let location: { lat: number; lon: number } | null = null;
          if (searchMethod === 'geo') {
              try {
                  location = await new Promise((resolve) => {
                      navigator.geolocation.getCurrentPosition(
                          position => resolve({
                              lat: position.coords.latitude,
                              lon: position.coords.longitude
                          }),
                          (error: GeolocationPositionError) => {
                              console.error(`Geolocation error: Code ${error.code} - ${error.message}`);
                              let errorMessage = "An unknown error occurred.";
                              switch(error.code) {
                                  case 1: // PERMISSION_DENIED
                                      errorMessage = "Geolocation permission denied by user.";
                                      break;
                                  case 2: // POSITION_UNAVAILABLE
                                      errorMessage = "Location information is unavailable.";
                                      break;
                                  case 3: // TIMEOUT
                                      errorMessage = "The request to get user location timed out.";
                                      break;
                              }
                              addToast(`Geolocation failed: ${errorMessage} Searching without location.`, 'error');
                              resolve(null);
                          },
                          { timeout: 10000 }
                      );
                  });
              } catch (geoError) {
                  console.error("Geolocation promise error:", geoError);
                  addToast("Could not get your location.", "error");
              }
          }
          const results = await findLocalProviders(query, location, language, searchType);
          setProviderResults(results);
      } catch (err) {
          handleApiError(err);
      } finally {
          setIsFindingProviders(false);
      }
  };
  
  const handleGetRecommendation = async (inputs: TestSubmissionFormInputs, image: { base64: string, mimeType: string } | null) => {
    setIsGettingRecommendation(true);
    setRecommendationResult(null);
    setTestDetails(null);
    try {
        const imagePart = image 
            ? { inlineData: { data: image.base64, mimeType: image.mimeType } } 
            : null;
        const result = await getAIRecommendation(inputs, imagePart, language);
        setRecommendationResult(result);
    } catch(err) {
        handleApiError(err);
    } finally {
        setIsGettingRecommendation(false);
    }
  };
  
  const handleGetTestDetails = async (testNames: string[]) => {
    setIsFetchingTestDetails(true);
    setTestDetails(null);
    try {
      const result = await getTestDetails(testNames, language);
      setTestDetails(result);
    } catch(err) {
      handleApiError(err);
    } finally {
      setIsFetchingTestDetails(false);
    }
  };
  
  const handleFindDropoffLocation = async (primaryAssessment: string) => {
      await handleProviderSearch('geo', primaryAssessment, 'distributor');
      setPage('sample_dropoff');
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchResults(null);
    setSearchError(null);

    try {
      const results = await performSemanticSearch(query, searchIndex, language);
      setSearchResults(results);
    } catch (err) {
      const msg = handleApiError(err);
      setSearchError(msg);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleFetchTrends = async () => {
    setIsFetchingTrends(true);
    setTrendsError(null);
    setDailyTrends(null);
    try {
        const trends = await fetchDailyTrends(language);
        setDailyTrends(trends);
    } catch (err) {
        const msg = handleApiError(err);
        setTrendsError(msg);
    } finally {
        setIsFetchingTrends(false);
    }
  };

  const handleGeneratePost = async (topic: string, platform: GeneratedPost['platform']) => {
    setIsGeneratingPost(true);
    setGeneratedPost({ platform, text: '...', imageUrl: null }); // Set loading state for text
    setAdaptedPost(null);
    try {
        const { postText, imagePrompt } = await generateSocialPost(topic, platform, language);
        setGeneratedPost({ platform, text: postText, imageUrl: null }); // Update with generated text
        
        addToast("Text generated, now creating image...", "info");
        const imageBase64 = await generatePostImage(imagePrompt);
        const imageUrl = `data:image/jpeg;base64,${imageBase64}`;
        setGeneratedPost({ platform, text: postText, imageUrl: imageUrl });
        addToast("Image successfully generated!", "success");

    } catch (err) {
        handleApiError(err);
        setGeneratedPost(null);
    } finally {
        setIsGeneratingPost(false);
    }
  };

  const handleAdaptPost = async (postText: string, platform: string) => {
      setIsAdapting(true);
      setAdaptedPost(null);
      try {
          const result = await adaptPostForWebsite(postText, platform, language);
          setAdaptedPost(result);
          addToast("Content adapted for website successfully!", "success");
      } catch (error) {
          handleApiError(error);
      } finally {
          setIsAdapting(false);
      }
  };

  const handleNavigateFromSearch = (page: Page) => {
    setPage(page);
    setIsSearchModalOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setPage={setPage} />;
      case 'test_recommender':
        return <RecommendationEnginePage 
            onGetRecommendation={handleGetRecommendation}
            isLoading={isGettingRecommendation}
            result={recommendationResult}
            onClearResult={() => {
                setRecommendationResult(null);
                setTestDetails(null);
            }}
            onGetTestDetails={handleGetTestDetails}
            isFetchingTestDetails={isFetchingTestDetails}
            testDetails={testDetails}
            onFindDropoffLocation={handleFindDropoffLocation}
        />;
      case 'sample_dropoff':
        return <DistributorFinderPage 
            onSearch={handleProviderSearch}
            isLoading={isFindingProviders}
            results={providerResults}
            isQuotaExhausted={isQuotaExhausted}
        />;
      case 'ai_consultant':
        return <AIChatPage
            chatHistory={chatHistory} 
            isStreaming={isStreaming} 
            onSendMessage={handleAiSendMessage}
            setPage={setPage}
        />;
      case 'content_hub':
        return <ContentHubPage
            onFetchTrends={handleFetchTrends}
            isFetchingTrends={isFetchingTrends}
            trends={dailyTrends}
            trendsError={trendsError}
            onGeneratePost={handleGeneratePost}
            isGeneratingPost={isGeneratingPost}
            generatedPost={generatedPost}
            onClearPost={() => {
                setGeneratedPost(null);
                setAdaptedPost(null);
            }}
            onAdaptPost={handleAdaptPost}
            isAdapting={isAdapting}
            adaptedPost={adaptedPost}
        />;
      case 'our_experts':
        return <TeamPage />;
      case 'partnerships':
        return <PartnershipsPage setPage={setPage} />;
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
      <div className="bg-slate-50 text-slate-800 font-sans">
        <SiteHeader
          currentPage={currentPage}
          setPage={setPage}
          isAuthenticated={isAuthenticated}
          onLoginClick={() => setIsLoginModalOpen(true)}
          onLogoutClick={handleLogout}
          onSearchClick={() => setIsSearchModalOpen(true)}
        />
        <main>
            {renderPage()}
        </main>
        <SiteFooter setPage={setPage} />
        <QuotaErrorModal isOpen={isQuotaExhausted} onClose={() => setIsQuotaExhausted(false)} />
        <LoginModal 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)} 
            onLogin={handleLogin} 
        />
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          onSearch={handleSearch}
          isLoading={isSearching}
          results={searchResults}
          error={searchError}
          onNavigate={handleNavigateFromSearch}
        />
        <FloatingChatbot
            chatHistory={chatHistory}
            isStreaming={isStreaming}
            onSendMessage={handleAiSendMessage}
            setPage={setPage}
        />
      </div>
  );
};

export default App;