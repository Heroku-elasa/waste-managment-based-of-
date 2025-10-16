
import React, { useState } from 'react';
import { useLanguage } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void; // Simulate login
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors = { email: '', password: '' };
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = t('validation.required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = t('validation.email');
      isValid = false;
    }

    if (!password) {
      newErrors.password = t('validation.required');
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = t('validation.passwordLength');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onLogin();
    }
  };

  const SocialButton: React.FC<{ icon: React.ReactNode; text: string; onClick: () => void; className?: string }> = ({ icon, text, onClick, className }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-md text-sm font-medium transition-colors shadow-sm ${className}`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
      <div
        className="bg-white text-slate-800 rounded-lg shadow-xl w-full max-w-sm mx-4 border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-5 border-b border-slate-200 flex justify-between items-center">
          <h2 id="login-modal-title" className="text-xl font-bold">{t('loginModal.title')}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <main className="p-8 space-y-6">
          <div className="flex items-center text-xs text-slate-400">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4">{t('loginModal.or')}</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">{t('loginModal.emailPlaceholder')}</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(p => ({ ...p, email: '' }));
                }}
                placeholder={t('loginModal.emailPlaceholder')} 
                className={`w-full bg-slate-100 rounded-md p-3 focus:outline-none transition-colors ${errors.email ? 'border border-red-500 ring-2 ring-red-500/50' : 'border border-slate-300 focus:ring-2 focus:ring-corp-blue-dark'}`}
                required 
              />
              {errors.email && <p className="mt-2 text-sm text-red-500 animate-fade-in">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">{t('loginModal.passwordPlaceholder')}</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(p => ({ ...p, password: '' }));
                }}
                placeholder={t('loginModal.passwordPlaceholder')} 
                className={`w-full bg-slate-100 rounded-md p-3 focus:outline-none transition-colors ${errors.password ? 'border border-red-500 ring-2 ring-red-500/50' : 'border border-slate-300 focus:ring-2 focus:ring-corp-blue-dark'}`}
                required 
              />
              {errors.password && <p className="mt-2 text-sm text-red-500 animate-fade-in">{errors.password}</p>}
            </div>
            <button type="submit" className="w-full py-3 bg-corp-blue-dark text-white font-semibold rounded-md hover:bg-corp-blue-dark/90 transition-colors">
              {t('loginModal.loginButton')}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default LoginModal;
