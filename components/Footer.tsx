
import React from 'react';
import { useLanguage, Page } from '../types';

interface SiteFooterProps {
    setPage: (page: Page) => void;
}

const SiteFooter: React.FC<SiteFooterProps> = ({ setPage }) => {
    const { t } = useLanguage();

    const quickLinks = {
        'International Links': [
            { label: 'ISO', href: 'https://www.iso.org/' },
            { label: 'IEC', href: 'https://www.iec.ch/' },
            { label: 'CODEX', href: 'https://www.fao.org/fao-who-codexalimentarius/en/' },
            { label: 'IAF', href: 'https://iaf.nu/en/home/' },
        ],
        'Quick Access': [
            { label: t('header.home'), page: 'home' },
            { label: t('header.recommendationEngine'), page: 'test_recommender' },
            { label: t('header.ourTeam'), page: 'our_experts' },
            { label: t('header.contentHub'), page: 'content_hub' },
        ],
    };

    return (
        <footer id="footer" className="bg-slate-800 text-slate-300">
            <div className="bg-corp-blue-light text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-2xl font-bold">{t('home.newsletter.title')}</h2>
                        <p className="text-sm opacity-80 mt-1">{t('home.newsletter.subtitle')}</p>
                    </div>
                    <form className="flex items-center gap-2">
                        <input type="email" placeholder={t('home.newsletter.placeholder')} className="w-full bg-white/20 border-white/30 rounded-md p-3 text-white placeholder-white/70 focus:ring-2 focus:ring-white focus:outline-none" />
                        <button type="submit" className="px-6 py-3 bg-white text-corp-blue-light font-bold rounded-md hover:bg-slate-200 transition-colors">{t('home.newsletter.button')}</button>
                    </form>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-white text-lg">{t('home.footer.col1.title')}</h3>
                        <p className="text-sm leading-relaxed">{t('footer.contactInfo')}</p>
                         <div className="space-y-2 text-sm">
                            <a href="mailto:huortash@yahoo.com" className="flex items-center gap-2 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> huortash@yahoo.com</a>
                            <a href="http://hourtash.ir" className="flex items-center gap-2 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9" /></svg> hourtash.ir</a>
                         </div>
                    </div>

                    {/* International Links */}
                     <div>
                        <h3 className="font-bold text-white text-lg">{t('home.footer.col2.title')}</h3>
                        <ul className="space-y-2 mt-4 text-sm">
                            {quickLinks['International Links'].map(link => (
                                <li key={link.label}><a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{link.label}</a></li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Quick Access */}
                    <div>
                        <h3 className="font-bold text-white text-lg">{t('home.footer.col3.title')}</h3>
                         <ul className="space-y-2 mt-4 text-sm">
                            {quickLinks['Quick Access'].map(link => (
                                <li key={link.page}>
                                    <button onClick={() => setPage(link.page as Page)} className="hover:text-white transition-colors text-right w-full rtl:text-right">{link.label}</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Contact Form */}
                    <div>
                        <h3 className="font-bold text-white text-lg">{t('home.footer.col4.title')}</h3>
                        <form className="space-y-3 mt-4">
                            <input type="email" placeholder={t('home.footer.col4.email')} className="w-full bg-slate-700/80 border-slate-600 rounded-md p-2 text-white placeholder-slate-400 text-sm focus:ring-1 focus:ring-corp-blue focus:outline-none"/>
                            <textarea placeholder={t('home.footer.col4.message')} rows={2} className="w-full bg-slate-700/80 border-slate-600 rounded-md p-2 text-white placeholder-slate-400 text-sm focus:ring-1 focus:ring-corp-blue focus:outline-none"></textarea>
                            <button type="submit" className="w-full px-4 py-2 bg-corp-blue-dark text-white font-semibold rounded-md hover:bg-corp-blue-dark/90 transition-colors text-sm">{t('home.footer.col4.button')}</button>
                        </form>
                    </div>
                </div>
            </div>
            
            <div className="bg-slate-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-slate-400">
                    <p>{t('footer.copyright')}</p>
                </div>
            </div>
        </footer>
    );
};

export default SiteFooter;
