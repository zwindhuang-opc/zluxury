/**
 * Client-side i18n Configuration
 * 
 * This file is only loaded on the client side to avoid SSR issues
 * with react-i18next's createContext
 * 
 * @module i18n-client
 * @version 1.3.0
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import zhCN from './locales/zh-CN.json';
import en from './locales/en.json';
import zhTW from './locales/zh-TW.json';

/**
 * Language resources configuration
 */
const resources = {
  en: { translation: en },
  'zh-CN': { translation: zhCN },
  'zh-TW': { translation: zhTW }
};

/**
 * Initialize i18next (only runs on client)
 */
if (typeof window !== 'undefined') {
  // Check if i18n is already initialized
  if (!i18n.isInitialized) {
    i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: 'zh-CN',
        debug: false,
        interpolation: {
          escapeValue: false
        },
        detection: {
          order: ['localStorage', 'navigator', 'querystring', 'cookie'],
          caches: ['localStorage', 'cookie']
        }
      });
  }
}

export default i18n;

/**
 * Language codes enum
 */
export enum LanguageCode {
  ZH_CN = 'zh-CN',
  EN = 'en',
  ZH_TW = 'zh-TW'
}

/**
 * Language display names
 */
export const languageNames: Record<LanguageCode, string> = {
  [LanguageCode.ZH_CN]: '简体中文',
  [LanguageCode.EN]: 'English',
  [LanguageCode.ZH_TW]: '繁體中文'
};

/**
 * Change language function
 */
export const changeLanguage = (lang: LanguageCode): void => {
  if (typeof window !== 'undefined') {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  }
};

/**
 * Get current language
 */
export const getCurrentLanguage = (): string => {
  if (typeof window !== 'undefined') {
    return i18n.language || 'zh-CN';
  }
  return 'zh-CN';
};