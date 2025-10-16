
import React from 'react';
import { useLanguage, Page } from '../types';

const HomePage: React.FC<{ setPage: (page: Page) => void; }> = ({ setPage }) => {
    const { t } = useLanguage();

    const whyChooseUsItems = [
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: t('home.whyUs.item1.title'), desc: t('home.whyUs.item1.desc') },
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M4 10a2 2 0 114 0 2 2 0 01-4 0z" /></svg>, title: t('home.whyUs.item2.title'), desc: t('home.whyUs.item2.desc') },
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.737 16.95l.923-2.902M16.263 16.95l-.923-2.902M12 22a10 10 0 110-20 10 10 0 010 20z" /></svg>, title: t('home.whyUs.item3.title'), desc: t('home.whyUs.item3.desc') },
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H17z" /></svg>, title: t('home.whyUs.item4.title'), desc: t('home.whyUs.item4.desc') }
    ];

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section 
                className="relative bg-cover bg-center text-white py-32 sm:py-48"
                style={{ backgroundImage: "url('https://hourtash.ir/wp-content/uploads/2025/03/IMG_1827.jpg')" }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <p className="text-lg sm:text-xl font-light">{t('hero.title')}</p>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mt-4">
                        {t('home.hero.mainTitle')}
                    </h1>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <button onClick={() => setPage('test_recommender')} className="px-8 py-3 bg-corp-blue-dark text-white font-semibold rounded-md hover:bg-corp-blue-dark/90 transition-colors border border-corp-blue-dark shadow-lg">
                           {t('hero.cta')}
                        </button>
                         <button onClick={() => setPage('our_experts')} className="px-8 py-3 bg-transparent border border-white text-white font-semibold rounded-md hover:bg-white hover:text-corp-blue-dark transition-colors shadow-lg">
                           {t('home.hero.aboutButton')}
                        </button>
                    </div>
                </div>
            </section>
            
            {/* Info Bar */}
            <section className="bg-slate-50 border-b border-slate-200">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3">
                    <div className="p-6 flex items-center gap-4 border-b md:border-b-0 md:border-l border-slate-200">
                        <div className="text-corp-blue-light text-4xl flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{t('home.infoBar.call.title')}</h3>
                            <p className="text-slate-500 font-mono text-sm">{t('home.infoBar.call.value')}</p>
                        </div>
                    </div>
                    <div className="p-6 flex items-center gap-4 border-b md:border-b-0 md:border-l border-slate-200">
                        <div className="text-corp-blue text-4xl flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{t('home.infoBar.email.title')}</h3>
                            <p className="text-slate-500 font-mono text-sm">{t('home.infoBar.email.value')}</p>
                        </div>
                    </div>
                     <div className="p-6 flex items-center gap-4">
                        <div className="text-corp-blue-dark text-4xl flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{t('home.infoBar.location.title')}</h3>
                            <p className="text-slate-500 text-sm">{t('home.infoBar.location.value')}</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Featured Blocks */}
             <section className="py-16 bg-slate-100">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 md:-mt-32 relative z-10">
                    <div className="bg-corp-blue-light text-white p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-3">{t('home.featuredBlocks.block1.title')}</h3>
                        <p className="text-sm mb-6 leading-relaxed">{t('home.featuredBlocks.block1.desc')}</p>
                        <button onClick={() => setPage('our_experts')} className="px-5 py-2 bg-transparent border border-white text-white font-semibold rounded-md hover:bg-white hover:text-corp-blue-light transition-colors">{t('home.featuredBlocks.button')}</button>
                    </div>
                    <div className="bg-corp-blue text-white p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-3">{t('home.featuredBlocks.block2.title')}</h3>
                        <p className="text-sm mb-6 leading-relaxed">{t('home.featuredBlocks.block2.desc')}</p>
                        <button onClick={() => setPage('partnerships')} className="px-5 py-2 bg-transparent border border-white text-white font-semibold rounded-md hover:bg-white hover:text-corp-blue transition-colors">{t('home.featuredBlocks.button')}</button>
                    </div>
                    <div className="bg-corp-blue-dark text-white p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-3">{t('home.featuredBlocks.block3.title')}</h3>
                        <ul className="text-sm space-y-2">
                           <li>{t('home.featuredBlocks.block3.line1')}</li>
                           <li>{t('home.featuredBlocks.block3.line2')}</li>
                           <li>{t('home.featuredBlocks.block3.line3')}</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section id="faq" className="py-16 sm:py-24">
                 <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{t('home.whyUs.title')}</h2>
                        <p className="mt-3 text-slate-600">{t('home.whyUs.subtitle')}</p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {whyChooseUsItems.map(item => (
                            <div key={item.title} className="text-center p-6">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-200 text-corp-blue mx-auto mb-4">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                                <p className="text-sm text-slate-500 mt-2">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                 </div>
            </section>
            
             {/* Partners/Clients */}
             <section className="py-16 bg-slate-200/70">
                <div className="container mx-auto px-4">
                    <h2 className="text-center text-2xl font-bold text-slate-800 mb-8">{t('home.partners.title')}</h2>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
                        {[
                            'https://hourtash.ir/wp-content/uploads/2025/03/8.png',
                            'https://hourtash.ir/wp-content/uploads/2025/03/6.png',
                            'https://hourtash.ir/wp-content/uploads/2025/03/3.png',
                            'https://hourtash.ir/wp-content/uploads/2025/03/5.png',
                            'https://hourtash.ir/wp-content/uploads/2025/03/10.png',
                            'https://hourtash.ir/wp-content/uploads/2025/03/2.png',
                        ].map((logo, index) => (
                            <img key={index} src={logo} alt={`Partner logo ${index + 1}`} className="h-12 sm:h-16 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" />
                        ))}
                    </div>
                </div>
             </section>

        </div>
    );
};

export default HomePage;
