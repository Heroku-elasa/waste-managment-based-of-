
import React, { useState, useEffect } from 'react';
import { useLanguage, DailyTrend, GeneratedPost } from '../types';
import { useToast } from './Toast';
import { marked } from 'marked';

type ContentSource = 'trends' | 'text' | 'search';
type SocialPlatform = 'linkedin' | 'twitter' | 'instagram' | 'facebook';

interface ContentHubPageProps {
    onFetchTrends: () => void;
    isFetchingTrends: boolean;
    trends: DailyTrend[] | null;
    trendsError: string | null;
    onGeneratePost: (topic: string, platform: SocialPlatform) => void;
    isGeneratingPost: boolean;
    generatedPost: GeneratedPost | null;
    onClearPost: () => void;
    onAdaptPost: (postText: string, platform: string) => void;
    isAdapting: boolean;
    adaptedPost: { title: string; content: string } | null;
}

const socialIcons: Record<SocialPlatform, React.ReactNode> = {
    linkedin: <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
    twitter: <svg fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
    instagram: <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07,4.85c.148-3.225,1.664-4.771,4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.74 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.74 24 12 24s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98C23.986 15.667 24 15.259 24 12s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" /></svg>,
    facebook: <svg fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V21.878A10.003 10.003 0 0022 12z" /></svg>,
};


const ContentHubPage: React.FC<ContentHubPageProps> = ({
    onFetchTrends, isFetchingTrends, trends, trendsError,
    onGeneratePost, isGeneratingPost, generatedPost, onClearPost,
    onAdaptPost, isAdapting, adaptedPost,
}) => {
    const { t } = useLanguage();
    const { addToast } = useToast();

    const [activeTab, setActiveTab] = useState<ContentSource>('trends');
    const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
    const [topic, setTopic] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        if (activeTab === 'trends' && !trends && !isFetchingTrends && !trendsError) {
            onFetchTrends();
        }
    }, [activeTab, trends, isFetchingTrends, trendsError, onFetchTrends]);
    
    const handleGenerateClick = () => {
        if (!selectedPlatform) {
            addToast("Please select a social media platform first.", "error");
            return;
        }
        if (!topic.trim()) {
            addToast("Please provide a topic for the post.", "error");
            return;
        }
        onGeneratePost(topic, selectedPlatform);
    };
    
    const handleCopy = () => {
        if (generatedPost?.text) {
            navigator.clipboard.writeText(generatedPost.text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const handleAdaptForWebsite = () => {
        if (generatedPost) {
            onAdaptPost(generatedPost.text, generatedPost.platform);
        }
    };

    const isGenerateDisabled = isGeneratingPost || !selectedPlatform || !topic.trim();

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">{t('contentHub.title')}</h1>
                <p className="mt-4 text-lg text-slate-600">{t('contentHub.subtitle')}</p>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left side: Controls */}
                <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-lg space-y-8">
                    {/* Step 1: Platform Selection */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">{t('contentHub.platformSelectorTitle')}</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {(Object.keys(socialIcons) as SocialPlatform[]).map(platform => (
                                <button key={platform} onClick={() => setSelectedPlatform(platform)} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 ${selectedPlatform === platform ? 'bg-corp-blue-dark/10 border-corp-blue-dark' : 'bg-slate-100 border-slate-200 hover:border-corp-blue-dark/50'}`}>
                                    <span className={`h-6 w-6 ${selectedPlatform === platform ? 'text-corp-blue-dark' : 'text-slate-600'}`}>{socialIcons[platform]}</span>
                                    <span className={`text-xs font-semibold capitalize ${selectedPlatform === platform ? 'text-corp-blue-dark' : 'text-slate-700'}`}>{platform}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: Topic Selection */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">{t('contentHub.topicTitle')}</h2>
                        <div className="flex border-b border-slate-200 mb-4">
                            {(['trends', 'text', 'search'] as ContentSource[]).map(tab => (
                                <button key={tab} onClick={() => {
                                    setActiveTab(tab);
                                    setTopic('');
                                    onClearPost();
                                }} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === tab ? 'border-b-2 border-corp-blue-dark text-corp-blue-dark' : 'text-slate-500 hover:text-slate-900'}`}>
                                    {t(`contentHub.${tab}Tab`)}
                                </button>
                            ))}
                        </div>
                        <div className="min-h-[200px]">
                            {activeTab === 'trends' && (
                                <div className="space-y-3">
                                    {isFetchingTrends && <p className="text-slate-500 text-sm">{t('contentHub.fetchingTrends')}</p>}
                                    {trendsError && <p className="text-red-500 text-sm">{trendsError}</p>}
                                    {trends && trends.map((trend, i) => (
                                        <button key={i} onClick={() => setTopic(trend.title)} className={`w-full p-3 rounded-md text-left transition-colors ${topic === trend.title ? 'bg-corp-blue-dark/10' : 'bg-slate-100 hover:bg-slate-200'}`}>
                                            <h4 className="font-bold text-slate-800">{trend.title}</h4>
                                            <p className="text-xs text-slate-500">{trend.summary}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'text' && (
                                <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder={t('contentHub.customTextPlaceholder')} rows={6} className="w-full bg-slate-100 border-slate-300 rounded-md p-3 focus:ring-corp-blue-dark focus:border-corp-blue-dark text-slate-800 text-sm" />
                            )}
                             {activeTab === 'search' && (
                                <div className="space-y-3">
                                    <p className="text-sm text-slate-500">{t('contentHub.selectSearchTopic')}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {t('contentHub.userSearchSuggestions').map((suggestion: string, i: number) => (
                                            <button
                                                key={i}
                                                onClick={() => setTopic(suggestion)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${topic === suggestion ? 'bg-corp-blue-dark text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                     {/* Step 3: Generate */}
                     <div>
                         {topic && (
                            <div className="p-3 mb-4 bg-slate-100 rounded-md border border-slate-200">
                                <p className="text-xs text-slate-500">Topic:</p>
                                <p className="text-sm text-slate-800 font-semibold">{topic}</p>
                            </div>
                         )}
                         <button onClick={handleGenerateClick} disabled={isGenerateDisabled} className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-corp-blue-dark hover:bg-corp-blue-dark/90 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                            {isGeneratingPost && <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>}
                            <span>{isGeneratingPost ? t('contentHub.generatingPost') : t('contentHub.generateButton')}</span>
                         </button>
                     </div>
                </div>

                 {/* Right side: Results */}
                 <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-lg min-h-[500px] space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">{t('contentHub.resultsTitle')}</h2>
                    
                    {!generatedPost && !isGeneratingPost && (
                        <div className="h-full flex items-center justify-center text-center text-slate-400">
                            <p>{t('contentHub.placeholder')}</p>
                        </div>
                    )}
                    
                    {(isGeneratingPost && !generatedPost) && (
                         <div className="aspect-square bg-slate-100 rounded-md flex items-center justify-center overflow-hidden border border-slate-200">
                            <div className="flex flex-col items-center text-center text-slate-500 p-4">
                                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-corp-blue-dark"></div>
                                <span className="text-sm mt-3">Generating content...</span>
                            </div>
                        </div>
                    )}

                    {generatedPost && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Image Display */}
                            <div className="aspect-square bg-slate-100 rounded-md flex items-center justify-center overflow-hidden border border-slate-200">
                                {generatedPost.imageUrl ? (
                                    <img src={generatedPost.imageUrl} alt="Generated for social media post" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center text-center text-slate-500 p-4">
                                        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-corp-blue-dark"></div>
                                        <span className="text-sm mt-3">Generating image...</span>
                                    </div>
                                )}
                            </div>

                             {/* Text Display & Actions */}
                             <div className="space-y-3">
                                <textarea
                                    readOnly 
                                    value={generatedPost.text || ''}
                                    className="w-full h-40 bg-slate-100 border-slate-300 rounded-md p-3 text-slate-800 text-sm resize-none"
                                />
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={handleCopy} className="flex-1 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-md transition-colors">
                                        {copySuccess ? t('contentHub.copySuccess') : t('contentHub.copyButton')}
                                    </button>
                                    <button onClick={() => addToast(t('contentHub.connectAccountToPublish'), 'info')} className="flex-1 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-md transition-colors">
                                        {t('contentHub.publishToPlatformButton').replace('{platform}', generatedPost.platform)}
                                    </button>
                                    <button onClick={handleAdaptForWebsite} disabled={isAdapting} className="flex-1 px-3 py-2 bg-corp-blue hover:bg-corp-blue-light text-white text-xs font-semibold rounded-md transition-colors disabled:bg-slate-400">
                                        {isAdapting ? t('contentHub.adaptingForWebsite') : t('contentHub.adaptForWebsiteButton')}
                                    </button>
                                </div>
                             </div>
                        </div>
                    )}
                    
                    {(isAdapting || adaptedPost) && (
                        <div className="pt-6 border-t-2 border-dashed border-slate-200 space-y-4">
                            <h3 className="text-lg font-bold text-slate-900">{t('contentHub.websitePreviewTitle')}</h3>
                            {isAdapting && (
                                <div className="flex items-center justify-center py-10">
                                    <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-corp-blue-dark"></div>
                                    <span className="ml-3 text-slate-500 text-sm">{t('contentHub.adaptingForWebsite')}</span>
                                </div>
                            )}
                            {adaptedPost && (
                                <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-4">
                                    <h4 className="text-xl font-bold text-corp-blue-dark">{adaptedPost.title}</h4>
                                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(adaptedPost.content) }} />
                                    <button onClick={() => addToast(t('contentHub.publishedSuccess'), 'success')} className="w-full mt-4 px-3 py-2 bg-corp-blue-dark hover:bg-corp-blue-dark/90 text-white font-semibold rounded-md transition-colors">
                                        {t('contentHub.publishToWebsiteButton')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default ContentHubPage;
