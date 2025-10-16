
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

// Basic Types
export type Language = 'en' | 'fa' | 'ar';
export type Page = 'home' | 'test_recommender' | 'sample_dropoff' | 'ai_consultant' | 'content_hub' | 'our_experts' | 'partnerships';

// Message format for chat components
export interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// Distributor Finder Page
export interface ProviderSearchResult {
    name: string;
    type: 'distributor' | 'veterinarian';
    address: string;
    phone: string;
    website?: string;
    distance?: number;
}

// Search Modal
export interface SearchResultItem {
    title: string;
    description: string;
    targetPage: Page;
    relevanceScore: number;
}

// Recommendation Engine Page
export interface TestSubmissionFormInputs {
    sampleType: string;
    suspectedIssue: string;
    batchSizeOrigin: string;
    specificConditions: string;
    controlSampleInfo: string;
    sampleAge: string;
    previousTests: string;
    additives: string;
}

export interface PotentialIssue {
    name: string;
    description: string;
    relevance: 'High' | 'Medium' | 'Low';
}

export interface TestRecommendationResult {
    primaryAssessment: string;
    assessmentDescription: string;
    potentialIssues: PotentialIssue[];
    recommendedTests: string[];
    managementAdvice: string[];
    nextStepsAndExpertConsultation: string;
    disclaimer: string;
}

export interface TestDetailsItem {
    testName: string;
    purpose: string;
    methodology: string;
    turnaroundTime: string;
    estimatedCost: string;
}
export type TestDetailsResult = TestDetailsItem[];

// Content Hub Page
export interface DailyTrend {
    title: string;
    summary: string;
}

export interface GeneratedPost {
    platform: 'linkedin' | 'twitter' | 'instagram' | 'facebook';
    text: string;
    imageUrl: string | null;
}

// Team Page
export interface DoctorProfile {
    name: string;
    specialty: string;
    bio: string;
    licenseNumber: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fa'); // Default to Persian (Farsi) as it's an Iranian lab

  const dir = language === 'fa' || language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const t = useCallback((key: string): any => {
    const keys = key.split('.');
    
    const findTranslation = (lang: Language): any => {
        let result: any = translations[lang];
        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = result[k];
            } else {
                return null;
            }
        }
        return result;
    }

    let translation = findTranslation(language);
    // Fallback to English if translation is not found in the current language
    if (translation === null && language !== 'en') {
        translation = findTranslation('en');
    }

    return translation !== null ? translation : key;
  }, [language]);

  const value = { language, setLanguage, t, dir };

  // FIX: Replaced JSX with React.createElement to prevent syntax errors in a .ts file.
  // The original JSX was being misinterpreted by the TypeScript compiler.
  return React.createElement(LanguageContext.Provider, { value }, children);
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// --- I18N CONTENT ---
const translations: Record<Language, Record<string, any>> = {
    en: {
        header: {
            home: 'Home',
            recommendationEngine: 'AI Test Recommender',
            distributorFinder: 'Find Drop-off Locations',
            aiChat: 'AI Consultant',
            contentHub: 'Content Hub',
            ourTeam: 'Our Experts',
            partnerships: 'B2B Services',
            login: 'Login',
            logout: 'Logout',
        },
        hero: {
            title: 'Hour-Tash Advanced Laboratory',
            subtitle: 'Pioneering safety and quality in food and agriculture with precise, knowledge-based chemical and microbiological analysis.',
            cta: 'Request an Analysis',
        },
        home: {
            hero: {
                mainTitle: 'Performing Laboratory Services',
                aboutButton: 'About Us',
            },
            infoBar: {
                call: { title: 'Call Us', value: '031-42622189' },
                email: { title: 'Send a Message', value: 'huortash@yahoo.com' },
                location: { title: 'Our Location', value: 'Danesh St, Najaf Abad, Isfahan' },
            },
            featuredBlocks: {
                block1: { title: 'Our Knowledge', desc: 'Relying on technical knowledge and valuable experience, we provide services with the highest national and international standards.' },
                block2: { title: 'Our Activity', desc: 'Our laboratory started its activity in 2010 in the field of specialized honey tests and we became one of the best with the most advanced equipment.' },
                block3: { title: 'Working Hours', line1: 'Saturday to Wednesday: 8:00 – 16:00', line2: 'Thursday: 8:00 – 15:00', line3: 'Friday: Closed' },
                button: 'Learn More',
            },
            whyUs: {
                title: 'Why Choose Us?',
                subtitle: 'Hour-Tash food laboratory is one of the most equipped and accurate laboratories in Iran.',
                item1: { title: 'Accuracy and Precision', desc: 'Our advanced and calibrated equipment ensures reliable results.' },
                item2: { title: 'Experienced Staff', desc: 'Our trained experts and specialists perform tests correctly and professionally.' },
                item3: { title: 'International Standards', desc: 'We operate in accordance with ISO standards and other valid global regulations.' },
                item4: { title: 'Consulting and Support', desc: 'In addition to results, we also provide solutions for improving product quality.' },
            },
            partners: { title: 'Accreditation Bodies' },
            newsletter: { title: 'Subscribe to the Newsletter', subtitle: 'Get food news and advice for your problems from our experts!', placeholder: 'Your Email', button: 'Subscribe'},
            footer: {
                col1: { title: 'Contact Information' },
                col2: { title: 'International Links' },
                col3: { title: 'Quick Access' },
                col4: { title: 'Contact Us', email: 'Email', message: 'Message', button: 'Submit' },
            }
        },
        products: {
            title: 'Our Core Services',
            food_feed: { title: 'Food & Feed Analysis', description: 'Advanced chemical testing for meat, honey, fats, grains, and animal feed products.' },
            microbiology: { title: 'Microbiological Analysis', description: 'Comprehensive testing for pathogens, spoilage organisms, and quality indicators.' },
            environmental: { title: 'Environmental & Mineral Analysis', description: 'Precise analysis of soil, water, and minerals using ICP-MS, ICP-OES, and Fire Assay.' },
        },
        aiEngine: {
            title: 'How Our AI-Powered Submission Works',
            subtitle: 'Leverage our powerful AI to get instant, data-driven test recommendations for your samples.',
            step1: { title: 'Describe Your Sample', description: 'Provide details on the sample type, origin, and suspected issues.' },
            step2: { title: 'AI Test Analysis', description: 'Our model analyzes your input and suggests the most relevant tests from our catalog.' },
            step3: { title: 'Receive Recommendations', description: 'Get a report with a suggested test panel and information on each test.' },
        },
        research: {
            title: 'Committed to Research & Development',
            subtitle: 'As a knowledge-based company, our innovation is driven by a relentless pursuit of scientific excellence to ensure accuracy and reliability.',
            cta: 'Learn About Our Methods',
        },
        footer: {
            description: 'Hour-Tash is a knowledge-based laboratory dedicated to the quality and safety of food and agricultural products through science and innovation.',
            copyright: '© 2024 Hour-Tash Laboratory. All rights reserved.',
            contactInfo: 'Isfahan, Najaf Abad, Danesh St, Shakib Alley, Block 18 | Phone: 031-910-910-02',
            quickLinksTitle: 'Quick Actions',
            links: {
                recommendation: 'Get AI Test Recommendation',
                distributors: 'Find a Drop-off Location',
                content: 'Visit Content Hub',
                team: 'Meet Our Experts',
            },
        },
        recommendationEngine: {
            title: 'AI Test Recommender & Sample Submission',
            subtitle: 'Get a preliminary recommendation for the most suitable tests for your sample. This tool does not replace a formal consultation.',
            resultTitle: 'AI Analysis Complete',
            primaryAssessmentTitle: 'Primary Assessment',
            potentialConditionsTitle: 'Potential Issues / Analytes',
            recommendedProductsTitle: 'Recommended Tests',
            managementAdviceTitle: 'Sample Handling Advice',
            nextStepsTitle: 'Next Steps & Expert Consultation',
            disclaimerTitle: 'Important Disclaimer',
            startNewAnalysis: 'Start New Analysis',
            getTreatmentPlan: 'Get Detailed Test Information',
            gettingPlan: 'Getting Information...',
            findDropoffLocation: 'Find a Sample Drop-off Location',
            detailedPlanTitle: 'Detailed Test Information',
            purpose: 'Purpose',
            methodology: 'Methodology',
            turnaroundTime: 'Turnaround Time',
            estimatedCost: 'Estimated Cost',
            formTitle: 'Describe Your Sample',
            symptomsLabel: 'Suspected Issue / Analysis Goal *',
            symptomsPlaceholder: 'e.g., Check for aflatoxins in pistachios for export, verify honey purity, test for salmonella in poultry feed...',
            symptomsSuggestions: ['Mycotoxin Screening', 'Pesticide Residue', 'Honey Quality Panel', 'Heavy Metals in Water', 'Soil Nutrient Analysis'],
            suggestionPromptsTitle: 'Or use a suggestion',
            suggestionPrompts: [
                "My pistachios need testing for Aflatoxin B & G for export to the EU.",
                "I need a complete microbiological analysis of a processed meat sample.",
                "I want to check the HMF and diastase levels in a honey sample.",
                "Analyze my farm's well water for heavy metals and nitrates.",
                "I need a full nutrient profile for my agricultural soil.",
            ],
            uploadImageTitle: 'Upload Sample Image (Optional)',
            uploadButton: 'Upload from Device',
            cameraButton: 'Use Camera',
            removeImage: 'Remove Image',
            detailsTitle: 'Optional Details (for better accuracy)',
            autoFillCheckboxLabel: 'Auto-fill with AI based on description',
            sampleTypeLabel: 'Sample Type *',
            sampleTypePlaceholder: 'e.g., Pistachio, Honey, Animal Feed, Water, Soil',
            animalTypeSuggestions: ['Pistachio', 'Almonds', 'Honey', 'Poultry Feed', 'Cattle Feed', 'Water', 'Soil', 'Milk', 'Meat'],
            batchSizeOriginLabel: 'Batch Size / Origin',
            batchSizeOriginPlaceholder: 'e.g., 500 kg batch for export, Well water from farm',
            specificConditions: 'Specific Conditions (e.g., processing, storage)',
            controlSampleInfo: 'Control Sample Info (if any)',
            sampleAge: 'Sample Age / Observation Period',
            sampleAgePlaceholder: 'e.g., 3 days, collected on 2024-07-20',
            previousTests: 'Previous Tests Performed',
            additives: 'Current Additives/Treatments Applied',
            buttonText: 'Get AI Recommendation',
            generating: 'Analyzing...',
        },
        aiChat: {
            title: 'AI Consultant',
            subtitle: 'Ask me anything about Hour-Tash Laboratory, our tests, or sample submission procedures.',
            placeholder: 'Type your message...',
            suggestions: [
                'Tell me about HPLC.',
                'What tests are needed for honey?',
                'Where can I submit a sample?',
            ],
        },
        distributorFinder: {
            title: 'Find a Sample Drop-off Location',
            subtitle: 'Locate our partner clinics and drop-off points in your area.',
            searchPlaceholder: 'Enter city, region, or address...',
            searchButton: 'Search',
            findNearMe: 'Find Near Me',
            searchTypeLabel: 'I am looking for a:',
            distributor: 'Drop-off Point',
            veterinarian: 'Partner Clinic',
            resultsTitle: 'Search Results',
            noResults: 'No locations found for your search.',
            searching: 'Searching...',
            suggestionsTitle: 'Try a popular search:',
            suggestionQueries: ['Tehran', 'Isfahan', 'Shiraz', 'Tabriz', 'Mashhad'],
        },
        contentHub: {
            title: 'Content & Insights Hub',
            subtitle: 'Generate content about food safety and discover industry trends to engage your audience.',
            platformSelectorTitle: 'Step 1: Choose a Platform',
            topicTitle: 'Step 2: Provide a Topic',
            trendsTab: 'Industry Trends',
            textTab: 'Custom Text',
            searchTab: 'Suggestions',
            fetchingTrends: 'Fetching latest trends...',
            customTextPlaceholder: 'Enter your topic or post idea here...',
            selectSearchTopic: 'Choose a suggested topic:',
            userSearchSuggestions: ['The importance of mycotoxin testing in feed', 'New EU regulations for pesticides', 'Methods for ensuring honey authenticity'],
            generateButton: 'Generate Post',
            generatingPost: 'Generating...',
            resultsTitle: 'Generated Content',
            placeholder: 'Your generated post will appear here.',
            copySuccess: 'Copied!',
            copyButton: 'Copy Text',
            connectAccountToPublish: 'Feature coming soon: Connect your account to publish directly!',
            publishToPlatformButton: 'Publish to {platform}',
            adaptForWebsiteButton: 'Adapt for Website',
            adaptingForWebsite: 'Adapting...',
            websitePreviewTitle: 'Website Content Preview',
            publishedSuccess: 'Content has been published to your website CMS!',
            publishToWebsiteButton: 'Publish to Website',
        },
        ourTeam: {
            title: 'Our Expert Team',
            subtitle: 'Meet the dedicated professionals driving innovation at Hour-Tash Laboratory.',
            tableHeaders: {
                name: 'Name',
                specialty: 'Specialty',
                bio: 'Bio',
                license: 'ID No.',
            },
            doctors: [
                { name: 'Dr. Aria Mehr', specialty: 'Lead Chemist (PhD)', bio: 'Expert in chromatography and mass spectrometry with over 20 years of experience in residue analysis.', licenseNumber: 'CHEM-1123' },
                { name: 'Dr. Sara Rostami', specialty: 'Microbiologist', bio: 'Focuses on pathogen detection methodologies and laboratory quality control. Published widely on food safety.', licenseNumber: 'MICRO-4567' },
                { name: 'Dr. Kian Parsa', specialty: 'Quality Assurance Manager', bio: 'Specializes in ISO 17025 compliance and validation of analytical methods, ensuring result accuracy.', licenseNumber: 'QA-8910' },
            ],
        },
        partnerships: {
            title: 'B2B Services & Partnerships',
            subtitle: 'Partner with us for reliable, routine testing and quality assurance solutions.',
            name: 'Your Name',
            company: 'Company Name',
            email: 'Email Address',
            message: 'Your Message',
            submit: 'Submit Inquiry',
        },
        loginModal: {
            title: 'Login',
            google: 'Continue with Google',
            facebook: 'Continue with Facebook',
            instagram: 'Continue with Instagram',
            or: 'OR',
            emailPlaceholder: 'Email Address',
            passwordPlaceholder: 'Password',
            loginButton: 'Login',
        },
        validation: {
            required: 'This field is required.',
            email: 'Please enter a valid email address.',
            passwordLength: 'Password must be at least 6 characters.',
        },
        quotaErrorModal: {
            title: 'Quota Exceeded',
            body: 'You have exceeded your API quota. Please check your billing status to continue using AI features.',
            cta: 'Check Billing',
            close: 'Close',
        },
        searchModal: {
            title: 'Search Hour-Tash Laboratory',
            placeholder: 'Search for tests, services, or experts...',
            searchButton: 'Search',
            suggestionsTitle: 'Popular Searches',
            suggestionQueries: ['Aflatoxin Test', 'Find a drop-off location', 'Contact our team', 'AI Test Recommender'],
            resultsTitle: 'Search Results',
            noResults: 'No results found for your query.',
        },
    },
    fa: {
        header: {
            home: 'خانه',
            recommendationEngine: 'توصیه‌گر تست',
            distributorFinder: 'مراکز تحویل نمونه',
            aiChat: 'مشاور هوشمند',
            contentHub: 'مرکز محتوا',
            ourTeam: 'کارشناسان ما',
            partnerships: 'همکاری تجاری',
            login: 'ورود',
            logout: 'خروج',
        },
        hero: {
            title: 'آزمایشگاه پیشرفته هورتاش',
            subtitle: 'پیشگام در ایمنی و کیفیت مواد غذایی و کشاورزی با آنالیزهای دقیق شیمیایی و میکروبیولوژی دانش‌بنیان.',
            cta: 'درخواست آنالیز',
        },
        home: {
            hero: {
                mainTitle: 'انجام خدمات آزمایشگاهی',
                aboutButton: 'درباره ما',
            },
            infoBar: {
                call: { title: 'تماس بگیرید', value: '031-42622189' },
                email: { title: 'ارسال پیام', value: 'huortash@yahoo.com' },
                location: { title: 'موقعیت ما', value: 'اصفهان، نجف آباد، خیابان دانش' },
            },
            featuredBlocks: {
                block1: { title: 'دانش ما', desc: 'ما با تکیه بر دانش فنی، تجربه‌ی ارزشمند و استفاده از دقیق‌ترین روش‌های علمی، خدماتی با بالاترین استانداردهای ملی و بین‌المللی ارائه می‌دهیم.' },
                block2: { title: 'فعالیت ما', desc: 'آزمایشگاه ما فعالیت خود را از سال ۱۳۸۹ در حوزه آزمایش‌های تخصصی عسل آغاز کرد و با بهره‌گیری از پیشرفته‌ترین تجهیزات به یکی از برترین‌ها تبدیل شدیم.' },
                block3: { title: 'ساعت کاری', line1: 'شنبه تا چهارشنبه: 8:00 – 16:00', line2: 'پنجشنبه: 8:00 – 15:00', line3: 'جمعه: تعطیل' },
                button: 'بیشتر بدانید',
            },
            whyUs: {
                title: 'چرا ما را انتخاب می کنید؟',
                subtitle: 'آزمایشگاه موادغذایی هورتاش یکی از مجهز ترین و دقیق ترین آزمایشگاه های ایران می باشد.',
                item1: { title: 'دقت و صحت نتایج', desc: 'تجهیزات پیشرفته و کالیبره‌شده ما نتایج قابل اعتماد را تضمین می‌کند.' },
                item2: { title: 'پرسنل مجرب و ماهر', desc: 'کارشناسان و متخصصان آموزش‌دیده ما آزمون‌ها را به صورت صحیح و اصولی انجام می‌دهند.' },
                item3: { title: 'استانداردهای بین‌المللی', desc: 'فعالیت ما مطابق با استانداردها و مقررات بین‌المللی فعالیت می‌کند.' },
                item4: { title: 'مشاوره و پشتیبانی', desc: 'علاوه بر ارائه نتایج دقیق، خدمات مشاوره و پشتیبانی نیز به مشتریان خود ارائه می‌دهیم.' },
            },
            partners: { title: 'نهاد های تایید صلاحیت' },
            newsletter: { title: 'مشترک شدن در خبرنامه', subtitle: 'اخبار و مشاوره مواد غذایی را برای مشکلات خود از کارشناسان ما دریافت کنید!', placeholder: 'ایمیل شما', button: 'عضویت'},
            footer: {
                col1: { title: 'اطلاعات تماس' },
                col2: { title: 'پیوندهای بین المللی' },
                col3: { title: 'دسترسی سریع' },
                col4: { title: 'تماس با ما', email: 'ایمیل', message: 'پیغام', button: 'ثبت' },
            }
        },
        products: {
            title: 'خدمات اصلی ما',
            food_feed: { title: 'آنالیز مواد غذایی و خوراک دام', description: 'آزمون‌های شیمیایی پیشرفته برای گوشت، عسل، چربی‌ها، غلات و خوراک دام.' },
            microbiology: { title: 'آنالیز میکروبیولوژی', description: 'آزمون‌های جامع برای شناسایی پاتوژن‌ها، ارگانیسم‌های عامل فساد و شاخص‌های کیفی.' },
            environmental: { title: 'آنالیز محیطی و معدنی', description: 'سنجش دقیق خاک، آب و مواد معدنی با استفاده از ICP-MS، ICP-OES و Fire Assay.' },
        },
        aiEngine: {
            title: 'فرآیند ثبت نمونه با هوش مصنوعی',
            subtitle: 'از هوش مصنوعی قدرتمند ما برای دریافت فوری پیشنهاد تست مبتنی بر داده برای نمونه‌های خود استفاده کنید.',
            step1: { title: 'شرح نمونه', description: 'جزئیات نوع نمونه، منشأ و مشکلات احتمالی را ارائه دهید.' },
            step2: { title: 'تحلیل هوش مصنوعی', description: 'مدل ما ورودی شما را تحلیل کرده و مرتبط‌ترین تست‌ها را از کاتالوگ ما پیشنهاد می‌دهد.' },
            step3: { title: 'دریافت پیشنهاد', description: 'گزارشی شامل پنل تست پیشنهادی و اطلاعات مربوط به هر تست دریافت کنید.' },
        },
        research: {
            title: 'متعهد به تحقیق و توسعه',
            subtitle: 'به عنوان یک شرکت دانش‌بنیان، نوآوری ما حاصل تلاش بی‌وقفه برای برتری علمی جهت تضمین دقت و اعتبار است.',
            cta: 'درباره روش‌های ما بیشتر بدانید',
        },
        footer: {
            description: 'آزمایشگاه هورتاش یک مرکز دانش‌بنیان است که از طریق علم و نوآوری به کیفیت و ایمنی محصولات غذایی و کشاورزی اختصاص دارد.',
            copyright: '© ۱۴۰۳ آزمایشگاه هورتاش. تمام حقوق محفوظ است.',
            contactInfo: 'اصفهان، نجف آباد، خیابان دانش، کوی شکیب، پلاک ۱۸ | تلفن: ۰۳۱-۹۱۰-۹۱۰-۰۲',
            quickLinksTitle: 'دسترسی سریع',
            links: {
                recommendation: 'دریافت پیشنهاد تست',
                distributors: 'یافتن مرکز تحویل نمونه',
                content: 'بازدید از مرکز محتوا',
                team: 'ملاقات با کارشناسان ما',
            },
        },
        recommendationEngine: {
            title: 'توصیه‌گر هوشمند تست و ثبت نمونه',
            subtitle: 'یک پیشنهاد اولیه برای مناسب‌ترین تست‌ها برای نمونه خود دریافت کنید. این ابزار جایگزین مشاوره رسمی نیست.',
            resultTitle: 'تحلیل هوش مصنوعی کامل شد',
            primaryAssessmentTitle: 'ارزیابی اولیه',
            potentialConditionsTitle: 'آلاینده‌ها / موارد بالقوه',
            recommendedProductsTitle: 'تست‌های پیشنهادی',
            managementAdviceTitle: 'نکات نگهداری نمونه',
            nextStepsTitle: 'مراحل بعدی و مشاوره تخصصی',
            disclaimerTitle: 'سلب مسئولیت مهم',
            startNewAnalysis: 'شروع تحلیل جدید',
            getTreatmentPlan: 'دریافت اطلاعات دقیق تست',
            gettingPlan: 'در حال دریافت اطلاعات...',
            findDropoffLocation: 'یافتن مرکز تحویل نمونه',
            detailedPlanTitle: 'اطلاعات دقیق تست',
            purpose: 'هدف آزمون',
            methodology: 'متدولوژی',
            turnaroundTime: 'زمان پاسخ‌دهی',
            estimatedCost: 'هزینه تخمینی',
            formTitle: 'شرح نمونه شما',
            symptomsLabel: 'مشکل مشکوک / هدف آنالیز *',
            symptomsPlaceholder: 'مثال: بررسی آفلاتوکسین در پسته برای صادرات، تایید خلوص عسل، تست سالمونلا در خوراک طیور...',
            symptomsSuggestions: ['سنجش مایکوتوکسین', 'باقی‌مانده سموم', 'کنترل کیفی عسل', 'فلزات سنگین در آب', 'آنالیز مواد مغذی خاک'],
            suggestionPromptsTitle: 'یا از یک پیشنهاد استفاده کنید',
            suggestionPrompts: [
                "پسته من برای صادرات به اتحادیه اروپا نیاز به تست آفلاتوکسین B و G دارد.",
                "من به یک آنالیز میکروبی کامل از یک نمونه گوشت فرآوری شده نیاز دارم.",
                "می‌خواهم میزان HMF و دیاستاز را در یک نمونه عسل بررسی کنم.",
                "آب چاه مزرعه را برای فلزات سنگین و نیترات آنالیز کنید.",
                "من به یک پروفایل کامل از مواد مغذی خاک کشاورزی خود نیاز دارم."
            ],
            uploadImageTitle: 'بارگذاری تصویر نمونه (اختیاری)',
            uploadButton: 'بارگذاری از دستگاه',
            cameraButton: 'استفاده از دوربین',
            removeImage: 'حذف تصویر',
            detailsTitle: 'جزئیات اختیاری (برای دقت بیشتر)',
            autoFillCheckboxLabel: 'تکمیل خودکار با هوش مصنوعی',
            sampleTypeLabel: 'نوع نمونه *',
            sampleTypePlaceholder: 'مثال: پسته، عسل، خوراک دام، آب، خاک',
            animalTypeSuggestions: ['پسته', 'بادام', 'عسل', 'خوراک طیور', 'خوراک گاو', 'آب', 'خاک', 'شیر', 'گوشت'],
            batchSizeOriginLabel: 'اندازه بچ / منشأ',
            batchSizeOriginPlaceholder: 'مثال: بچ ۵۰۰ کیلوگرمی برای صادرات، آب چاه از مزرعه',
            specificConditions: 'شرایط خاص (مثلاً فرآوری، نگهداری)',
            controlSampleInfo: 'اطلاعات نمونه شاهد (در صورت وجود)',
            sampleAge: 'عمر نمونه / دوره مشاهده',
            sampleAgePlaceholder: 'مثال: ۳ روز، جمع‌آوری شده در تاریخ ۱۴۰۳/۰۵/۰۵',
            previousTests: 'تست‌های قبلی انجام شده',
            additives: 'افزودنی‌ها/تیمارهای فعلی اعمال شده',
            buttonText: 'دریافت پیشنهاد هوش مصنوعی',
            generating: 'در حال تحلیل...',
        },
        aiChat: {
            title: 'مشاور هوشمند',
            subtitle: 'هر سوالی در مورد آزمایشگاه هورتاش، تست‌های ما یا رویه‌های ارسال نمونه دارید بپرسید.',
            placeholder: 'پیام خود را تایپ کنید...',
            suggestions: [
                'درباره دستگاه HPLC به من بگو.',
                'چه تست‌هایی برای عسل لازم است؟',
                'کجا می‌توانم نمونه تحویل دهم؟',
            ],
        },
        distributorFinder: {
            title: 'یافتن مرکز تحویل نمونه',
            subtitle: 'کلینیک‌های همکار و مراکز تحویل نمونه ما را در منطقه خود بیابید.',
            searchPlaceholder: 'شهر، منطقه یا آدرس را وارد کنید...',
            searchButton: 'جستجو',
            findNearMe: 'یافتن نزدیک من',
            searchTypeLabel: 'من به دنبال:',
            distributor: 'مرکز تحویل',
            veterinarian: 'کلینیک همکار',
            resultsTitle: 'نتایج جستجو',
            noResults: 'مکانی برای جستجوی شما یافت نشد.',
            searching: 'در حال جستجو...',
            suggestionsTitle: 'یک جستجوی محبوب را امتحان کنید:',
            suggestionQueries: ['تهران', 'اصفهان', 'شیراز', 'تبریز', 'مشهد'],
        },
        contentHub: {
            title: 'مرکز محتوا و دانش',
            subtitle: 'محتوایی در مورد ایمنی مواد غذایی تولید کنید و روندهای صنعت را برای تعامل با مخاطبان خود کشف کنید.',
            platformSelectorTitle: 'مرحله ۱: یک پلتفرم انتخاب کنید',
            topicTitle: 'مرحله ۲: یک موضوع ارائه دهید',
            trendsTab: 'روندهای صنعت',
            textTab: 'متن سفارشی',
            searchTab: 'پیشنهادها',
            fetchingTrends: 'در حال دریافت آخرین روندها...',
            customTextPlaceholder: 'موضوع یا ایده پست خود را اینجا وارد کنید...',
            selectSearchTopic: 'یک موضوع پیشنهادی انتخاب کنید:',
            userSearchSuggestions: ['اهمیت تست مایکوتوکسین در خوراک', 'قوانین جدید اتحادیه اروپا برای آفت‌کش‌ها', 'روش‌های تضمین اصالت عسل'],
            generateButton: 'تولید پست',
            generatingPost: 'در حال تولید...',
            resultsTitle: 'محتوای تولید شده',
            placeholder: 'پست تولید شده شما در اینجا ظاهر می‌شود.',
            copySuccess: 'کپی شد!',
            copyButton: 'کپی متن',
            connectAccountToPublish: 'ویژگی به زودی ارائه می‌شود: حساب خود را برای انتشار مستقیم متصل کنید!',
            publishToPlatformButton: 'انتشار در {platform}',
            adaptForWebsiteButton: 'مناسب‌سازی برای وب‌سایت',
            adaptingForWebsite: 'در حال مناسب‌سازی...',
            websitePreviewTitle: 'پیش‌نمایش محتوای وب‌سایت',
            publishedSuccess: 'محتوا با موفقیت در CMS وب‌سایت شما منتشر شد!',
            publishToWebsiteButton: 'انتشار در وب‌سایت',
        },
        ourTeam: {
            title: 'تیم متخصص ما',
            subtitle: 'با متخصصان متعهدی که نوآوری را در آزمایشگاه هورتاش هدایت می‌کنند آشنا شوید.',
            tableHeaders: {
                name: 'نام',
                specialty: 'تخصص',
                bio: 'بیوگرافی',
                license: 'شماره شناسه',
            },
            doctors: [
                { name: 'دکتر آریا مهر', specialty: 'شیمی‌دان ارشد (PhD)', bio: 'متخصص در کروماتوگرافی و طیف‌سنجی جرمی با بیش از ۲۰ سال تجربه در آنالیز باقی‌مانده‌ها.', licenseNumber: 'CHEM-1123' },
                { name: 'دکتر سارا رستمی', specialty: 'میکروبیولوژیست', bio: 'متمرکز بر روش‌های تشخیص پاتوژن و کنترل کیفیت آزمایشگاهی. مقالات گسترده‌ای در زمینه ایمنی مواد غذایی منتشر کرده است.', licenseNumber: 'MICRO-4567' },
                { name: 'دکتر کیان پارسا', specialty: 'مدیر تضمین کیفیت', bio: 'متخصص در استاندارد ISO 17025 و اعتبارسنجی روش‌های آنالیتیکال، تضمین کننده دقت نتایج.', licenseNumber: 'QA-8910' },
            ],
        },
        partnerships: {
            title: 'خدمات تجاری و همکاری',
            subtitle: 'برای آزمون‌های دوره‌ای و راه‌حل‌های تضمین کیفیت با ما همکاری کنید.',
            name: 'نام شما',
            company: 'نام شرکت',
            email: 'آدرس ایمیل',
            message: 'پیام شما',
            submit: 'ارسال درخواست',
        },
        loginModal: {
            title: 'ورود',
            google: 'ادامه با گوگل',
            facebook: 'ادامه با فیسبوک',
            instagram: 'ادامه با اینستاگرام',
            or: 'یا',
            emailPlaceholder: 'آدرس ایمیل',
            passwordPlaceholder: 'رمز عبور',
            loginButton: 'ورود',
        },
        validation: {
            required: 'این فیلد الزامی است.',
            email: 'لطفاً یک آدرس ایمیل معتبر وارد کنید.',
            passwordLength: 'رمز عبور باید حداقل ۶ کاراکتر باشد.',
        },
        quotaErrorModal: {
            title: 'سهمیه تمام شد',
            body: 'شما از سهمیه API خود فراتر رفته‌اید. لطفاً وضعیت صورتحساب خود را برای ادامه استفاده از ویژگی‌های هوش مصنوعی بررسی کنید.',
            cta: 'بررسی صورتحساب',
            close: 'بستن',
        },
        searchModal: {
            title: 'جستجو در آزمایشگاه هورتاش',
            placeholder: 'جستجوی تست‌ها، خدمات یا کارشناسان...',
            searchButton: 'جستجو',
            suggestionsTitle: 'جستجوهای محبوب',
            suggestionQueries: ['تست آفلاتوکسین', 'یافتن مرکز تحویل نمونه', 'تماс با تیم ما', 'توصیه‌گر هوشمند تست'],
            resultsTitle: 'نتایج جستجو',
            noResults: 'نتیجه‌ای برای جستجوی شما یافت نشد.',
        },
    },
    ar: { // Note: These are direct translations and may need cultural adaptation
        // The file was truncated here. Leaving this empty and falling back to English.
    },
};
