/**
 * Translation Hook - Client-side only i18n
 * 
 * Uses dynamic imports to avoid SSR issues with react-i18next
 * 
 * @module useTranslation
 * @version 1.3.0
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Translation type
 */
type TranslationFunction = (key: string, options?: Record<string, string | number>) => string;

/**
 * Default translations for SSR fallback
 * Contains all keys used in components to prevent showing raw keys during SSR
 */
const defaultTranslations: Record<string, string> = {
  // Navigation
  'nav.home': '首页',
  'nav.collections': '臻品系列',
  'nav.products': '奢华精品',
  'nav.aiAssistant': 'AI顾问',
  'nav.concierge': '专属服务',
  'nav.about': '品牌故事',
  'nav.signIn': '登录',
  'nav.vipAccess': 'VIP尊享',
  'nav.searchPlaceholder': '搜索奢华精品、品牌、系列...',

  // Hero Section
  'hero.badge': 'AI智能奢华平台',
  'hero.title': '臻享奢华',
  'hero.titleHighlight': '非凡人生',
  'hero.subtitle': '未来奢华购物体验',
  'hero.description': '融合人工智能与顶级奢华，为您呈现独一无二的购物体验。独享专属顾问服务、限量臻品收藏，以及基于Hermes与OpenClaw技术的Unicorn AI智能推荐。',
  'hero.explore': '探索臻品系列',
  'hero.tryAI': '体验AI顾问',
  'hero.stats.products': '臻品精品',
  'hero.stats.brands': '顶级品牌',
  'hero.stats.satisfaction': '客户满意度',
  'hero.categories.watch': '奢华腕表',
  'hero.categories.diamond': '璀璨钻石',
  'hero.categories.bag': '设计师手袋',
  'hero.categories.jewelry': '高级珠宝',

  // AI Section
  'ai.badge': 'AI驱动',
  'ai.vipBadge': 'VIP',
  'ai.poweredBy': 'Unicorn AI智能驱动',
  'ai.features.recommendation': '智能推荐',
  'ai.features.priceAnalysis': '价格分析',
  'ai.features.investment': '投资评级',
  'ai.features.concierge': '专属顾问',

  // Products
  'products.title': '臻品精选',
  'products.subtitle': '发现您的专属奢华',
  'products.viewDetails': '查看详情',
  'products.viewAll': '浏览全部臻品',
  'products.addToCart': '加入购物袋',
  'products.vipPrice': '会员专享价',
  'products.limited': '限量款',
  'products.newArrival': '新品上市',
  'products.investmentGrade': '投资级臻品',
  'products.auction': '拍卖精品',

  // Categories
  'categories.title': '奢华系列',
  'categories.subtitle': '探索顶级品牌臻品',
  'categories.watches': '奢华腕表',
  'categories.jewelry': '高级珠宝',
  'categories.handbags': '设计师手袋',
  'categories.diamonds': '璀璨钻石',
  'categories.fragrances': '奢华香氛',
  'categories.accessories': '精致配饰',
  'categories.fashion': '设计师时装',
  'categories.art': '艺术臻品',
  'categories.cars': '豪华座驾',
  'categories.realEstate': '顶级房产',
  'categories.yachts': '豪华游艇',

  // VIP
  'vip.title': 'VIP尊享会员',
  'vip.subtitle': '开启专属奢华之旅',
  'vip.tiers.standard': '普通会员',
  'vip.tiers.silver': '银卡会员',
  'vip.tiers.gold': '金卡会员',
  'vip.tiers.black': '黑卡会员',
  'vip.tiers.diamond': '钻石会员',
  'vip.benefits.discount': '专属折扣',
  'vip.benefits.concierge': '一对一顾问',
  'vip.benefits.priority': '优先购买权',
  'vip.benefits.events': '私密活动邀请',
  'vip.benefits.investment': '投资建议服务',
  'vip.join': '成为会员',
  'vip.upgrade': '升级会员',

  // Footer
  'footer.description': '融合人工智能与顶级奢华，为尊贵客户提供独一无二的购物体验平台。',
  'footer.platform': '平台服务',
  'footer.browseProducts': '浏览臻品',
  'footer.aiInsights': 'AI洞察',
  'footer.priceAnalysis': '价格分析',
  'footer.company': '品牌信息',
  'footer.aboutUs': '关于我们',
  'footer.careers': '加入我们',
  'footer.press': '媒体中心',
  'footer.blog': '奢华博客',
  'footer.legal': '法律条款',
  'footer.privacy': '隐私政策',
  'footer.terms': '服务条款',
  'footer.cookies': 'Cookie政策',
  'footer.tagline': '为非凡奢华体验而生',
  'footer.copyright': '版权所有',

  // Language
  'language.switch': '语言切换',
  'language.zhCN': '简体中文',
  'language.en': 'English',
  'language.zhTW': '繁體中文',

  // Common
  'common.loading': '加载中...',
  'common.error': '出错了',
  'common.retry': '重试',
  'common.confirm': '确认',
  'common.cancel': '取消',
  'common.save': '保存',
  'common.close': '关闭',
  'common.currency': '¥',
  'common.priceFrom': '起售价',
};

/**
 * Custom translation hook that works with SSR
 * Returns default translations during SSR, actual translations on client
 */
export function useTranslation(): { t: TranslationFunction; i18n: { language: string; changeLanguage: (lang: string) => void } } {
  const [translations, setTranslations] = useState<Record<string, string>>(defaultTranslations);
  const [currentLanguage, setCurrentLanguage] = useState<string>('zh-CN');
  const [i18nInstance, setI18nInstance] = useState<any>(null);

  /**
   * Load i18n on client side
   */
  useEffect(() => {
    // Dynamic import of i18n modules
    const loadI18n = async () => {
      try {
        const i18next = await import('i18next');
        const reactI18next = await import('react-i18next');
        const languageDetector = await import('i18next-browser-languagedetector');

        // Import translations
        const zhCN = await import('./locales/zh-CN.json');
        const en = await import('./locales/en.json');
        const zhTW = await import('./locales/zh-TW.json');

        const resources = {
          en: { translation: en.default },
          'zh-CN': { translation: zhCN.default },
          'zh-TW': { translation: zhTW.default }
        };

        const i18n = i18next.default;

        if (!i18n.isInitialized) {
          i18n
            .use(languageDetector.default)
            .use(reactI18next.initReactI18next)
            .init({
              resources,
              fallbackLng: 'zh-CN',
              debug: false,
              interpolation: {
                escapeValue: false
              },
              detection: {
                order: ['localStorage', 'navigator'],
                caches: ['localStorage']
              }
            });
        }

        setI18nInstance(i18n);
        setCurrentLanguage(i18n.language || 'zh-CN');

        // Update translations when language changes
        i18n.on('languageChanged', (lng: string) => {
          setCurrentLanguage(lng);
        });
      } catch (error) {
        console.error('Failed to load i18n:', error);
      }
    };

    loadI18n();
  }, []);

  /**
   * Translation function
   */
  const t = useCallback((key: string, options?: Record<string, string | number>): string => {
    if (i18nInstance) {
      return i18nInstance.t(key, options) || key;
    }
    return translations[key] || key;
  }, [i18nInstance, translations]);

  /**
   * Change language function
   */
  const changeLanguage = useCallback((lang: string) => {
    if (i18nInstance && typeof window !== 'undefined') {
      i18nInstance.changeLanguage(lang);
      localStorage.setItem('i18nextLng', lang);
      setCurrentLanguage(lang);
    }
  }, [i18nInstance]);

  return {
    t,
    i18n: {
      language: currentLanguage,
      changeLanguage
    }
  };
}

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