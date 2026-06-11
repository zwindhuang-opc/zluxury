/**
 * ZLuxury Configuration Constants
 * 
 * Centralized configuration file for all application settings.
 * Removes hardcoded values from components for maintainability.
 * 
 * Architecture: Configuration Layer
 * Version: 1.0.0
 * Last Updated: 2024-06-11
 */

// ============================================================================
// APPLICATION CONFIG / 应用配置
// ============================================================================

/**
 * Application-wide configuration object
 */
export const APP_CONFIG = {
  /** Application name / 应用名称 */
  name: 'ZLuxury',
  
  /** Application version / 应用版本 */
  version: '1.0.0',
  
  /** Environment mode (development, production, staging) / 环境模式 */
  environment: process.env.NODE_ENV || 'development',
  
  /** Base URL for API calls / API基础URL */
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  
  /** Default language code / 默认语言代码 */
  defaultLanguage: 'zh-CN' as const,
  
  /** Supported languages / 支持的语言 */
  supportedLanguages: ['en', 'zh-CN', 'zh-TW'] as const,
  
  /** Items per page for pagination / 每页项目数 */
  itemsPerPage: 12,
  
  /** Maximum upload size in bytes / 最大上传大小（字节） */
  maxUploadSize: 10 * 1024 * 1024, // 10MB
  
  /** Session timeout in minutes / 会话超时时间（分钟） */
  sessionTimeout: 30,
}

// ============================================================================
// THEME & STYLING CONFIG / 主题和样式配置
// ============================================================================

/**
 * Color palette configuration
 * All colors used throughout the application
 */
export const COLORS = {
  // Primary accent color - Gold / 主色调 - 金色
  accent: '#D4AF37',
  accentHover: '#E6C55A',
  accentLight: 'rgba(212, 175, 55, 0.1)',
  
  // Background colors / 背景色
  background: {
    primary: '#0a0a0a',      // Main background / 主背景
    secondary: '#111111',     // Secondary background / 次背景
    tertiary: '#1a1a1a',      // Tertiary background / 第三背景
    card: '#161616',          // Card background / 卡片背景
  },
  
  // Text colors / 文本色
  text: {
    primary: '#ffffff',       // Primary text / 主要文本
    secondary: '#cccccc',     // Secondary text / 次要文本
    muted: '#888888',         // Muted text / 弱化文本
    link: '#D4AF37',          // Link text / 链接文本
  },
  
  // Status colors / 状态色
  status: {
    success: '#22c55e',       // Success / 成功
    error: '#ef4444',         // Error / 错误
    warning: '#f59e0b',       // Warning / 警告
    info: '#3b82f6',          // Info / 信息
  },
  
  // Border colors / 边框色
  border: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(255, 255, 255, 0.05)',
  },
} as const

// ============================================================================
// VIP MEMBERSHIP TIERS / VIP会员等级配置
// ============================================================================

/**
 * VIP membership tier configurations
 * Each tier has specific benefits and pricing
 */
export const VIP_TIERS = {
  standard: {
    name: 'Standard Member',
    nameCn: '标准会员',
    level: 1,
    discountPercent: 5,
    minSpent: 0,
    benefits: [
      'Free shipping on orders over $500',
      'Access to member-only sales',
      'Birthday rewards'
    ],
    color: '#888888',
    icon: '⭐'
  },
  silver: {
    name: 'Silver Member',
    nameCn: '银卡会员',
    level: 2,
    discountPercent: 10,
    minSpent: 10000,
    benefits: [
      'All Standard benefits',
      '10% discount on all purchases',
      'Priority customer service',
      'Early access to new collections'
    ],
    color: '#C0C0C0',
    icon: '🥈'
  },
  gold: {
    name: 'Gold Member',
    nameCn: '金卡会员',
    level: 3,
    discountPercent: 15,
    minSpent: 50000,
    benefits: [
      'All Silver benefits',
      '15% discount on all purchases',
      'Personal shopping assistant',
      'Exclusive event invitations',
      'Extended returns (60 days)'
    ],
    color: '#FFD700',
    icon: '🥇'
  },
  black: {
    name: 'Black Card Member',
    nameCn: '黑卡会员',
    level: 4,
    discountPercent: 20,
    minSpent: 200000,
    benefits: [
      'All Gold benefits',
      '20% discount on all purchases',
      'Dedicated account manager',
      'Private shopping appointments',
      'Complimentary gift wrapping',
      'VIP lounge access at events'
    ],
    color: '#1a1a1a',
    border: '#333333',
    icon: '💎'
  },
  diamond: {
    name: 'Diamond Elite',
    nameCn: '钻石精英',
    level: 5,
    discountPercent: 25,
    minSpent: 1000000,
    benefits: [
      'All Black Card benefits',
      '25% discount on all purchases',
      'First access to limited editions',
      'Custom product creation service',
      'Private jet booking assistance',
      'Concierge services worldwide',
      'Annual exclusive gala invitation'
    ],
    color: '#B9F2FF',
    icon: '💠'
  }
} as const

// ============================================================================
// PRODUCT CATEGORIES / 产品类别配置
// ============================================================================

/**
 * Product category definitions with metadata
 */
export const CATEGORIES = {
  watches: {
    id: 'watches',
    name: 'Watches',
    nameCn: '腕表',
    icon: '⌚',
    description: 'Luxury timepieces from world-renowned watchmakers',
    brands: ['Rolex', 'Patek Philippe', 'Audemars Piguet', 'Cartier'],
    featured: true
  },
  jewelry: {
    id: 'jewelry',
    name: 'Jewelry',
    nameCn: '珠宝首饰',
    icon: '💎',
    description: 'Exquisite jewelry pieces crafted with precious gems',
    brands: ['Tiffany & Co.', 'Cartier', 'Van Cleef & Arpels', 'Bulgari'],
    featured: true
  },
  handbags: {
    id: 'handbags',
    name: 'Handbags',
    nameCn: '手袋皮具',
    icon: '👜',
    description: 'Designer handbags and leather accessories',
    brands: ['Hermès', 'Louis Vuitton', 'Chanel', 'Gucci'],
    featured: true
  },
  accessories: {
    id: 'accessories',
    name: 'Accessories',
    nameCn: '配饰精品',
    icon: '🕶️',
    description: 'Luxury accessories to complete your look',
    brands: ['Gucci', 'Prada', 'Dior', 'Saint Laurent'],
    featured: false
  },
  fashion: {
    id: 'fashion',
    name: 'Fashion',
    nameCn: '时装服饰',
    icon: '👔',
    description: 'High-end fashion from leading design houses',
    brands: ['Chanel', 'Dior', 'Versace', 'Armani'],
    featured: false
  },
  lifestyle: {
    id: 'lifestyle',
    name: 'Lifestyle',
    nameCn: '生活方式',
    icon: '✨',
    description: 'Premium lifestyle products and experiences',
    brands: ['Various luxury brands'],
    featured: false
  }
} as const

// ============================================================================
// AI AGENT CONFIGURATION / AI代理配置
// ============================================================================

/**
 * AI agent configurations with capabilities and endpoints
 */
export const AI_AGENTS = {
  hermes: {
    id: 'hermes',
    name: 'Hermes Agent',
    nameCn: '赫尔墨斯智能助手',
    description: 'Luxury recommendation specialist',
    color: '#D4AF37',
    capabilities: [
      'Product recommendations',
      'Brand expertise',
      'Style matching',
      'Trend analysis',
      'Personalized suggestions'
    ],
    endpoint: '/api/ai/hermes',
    maxTokens: 1000,
    temperature: 0.7
  },
  openclaw: {
    id: 'openclaw',
    name: 'OpenClaw Engine',
    nameCn: 'OpenClaw引擎',
    description: 'Skills and automation engine',
    color: '#00B4D8',
    capabilities: [
      'Price comparison',
      'Availability check',
      'Order tracking',
      'Automated tasks',
      'Market analysis'
    ],
    endpoint: '/api/ai/openclaw',
    maxTokens: 1500,
    temperature: 0.5
  },
  unicorn: {
    id: 'unicorn',
    name: 'Unicorn Agent',
    nameCn: '独角兽AI助手',
    description: 'Enhanced AI conversation',
    color: '#9B59B6',
    capabilities: [
      'Natural conversation',
      'Context understanding',
      'Multi-turn dialogue',
      'Personalized responses',
      'Creative suggestions'
    ],
    endpoint: '/api/ai/unicorn',
    maxTokens: 2000,
    temperature: 0.9
  }
} as const

// ============================================================================
// API ENDPOINTS / API端点配置
// ============================================================================

/**
 * API endpoint definitions
 */
export const API_ENDPOINTS = {
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    search: '/search',
    categories: '/categories'
  },
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    profile: '/auth/profile'
  },
  cart: {
    get: '/cart',
    add: '/cart',
    update: (id: string) => `/cart/${id}`,
    remove: (id: string) => `/cart/${id}`
  },
  orders: {
    list: '/orders',
    detail: (id: string) => `/orders/${id}`,
    create: '/orders'
  },
  ai: {
    chat: '/ai/ai-chat',
    analyze: '/ai/analyze',
    recommend: '/ai/recommend'
  },
  vip: {
    status: '/vip/status',
    upgrade: '/vip/upgrade',
    benefits: '/vip/benefits'
  }
} as const

// ============================================================================
// VALIDATION RULES / 验证规则
// ============================================================================

/**
 * Form validation rules
 */
export const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
  },
  phone: {
    pattern: /^\+?[\d\s-()]{10,}$/,
    message: 'Please enter a valid phone number'
  },
  creditCard: {
    pattern: /^\d{16}$/,
    message: 'Please enter a valid 16-digit card number'
  }
} as const

// ============================================================================
// FEATURE FLAGS / 功能开关
// ============================================================================

/**
 * Feature flags for enabling/disabling features
 */
export const FEATURES = {
  enableAIAssistant: true,
  enableVIPSystem: true,
  enableWishlist: true,
  enableCompare: true,
  enableReviews: true,
  enableLiveChat: true,
  enableDarkMode: true,
  enableMultiLanguage: true,
  enableCurrencySwitcher: true,
  enableNotifications: true,
  enableOrderTracking: true
} as const

// ============================================================================
// EXPORT DEFAULT CONFIG / 导出默认配置
// ============================================================================

/**
 * Default export containing all configuration
 */
const CONFIG = {
  app: APP_CONFIG,
  colors: COLORS,
  vipTiers: VIP_TIERS,
  categories: CATEGORIES,
  aiAgents: AI_AGENTS,
  apiEndpoints: API_ENDPOINTS,
  validation: VALIDATION_RULES,
  features: FEATURES
}

export default CONFIG