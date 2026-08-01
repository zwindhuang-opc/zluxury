
























































































































































































































































 * - Runtime configuration updates
    * 
 * Usage:
 *   import { config } from '@/lib/config-loader'
 *   
 *   const rate = config.exchangeRate.usdToCny
    *   const port = config.app.port
        *   const isAuthEnabled = config.features.userAuthentication
            * 
 * Architecture: Configuration Layer
 * Version: 2.0.0
    * Last Updated: 2025-06 - 13
        */

// ============================================================================
// TYPE DEFINITIONS / 类型定义
// ============================================================================

/**
 * Application core settings
 */
interface AppConfig {
    /** Application name / 应用名称 */
    name: string;

    /** Current version string (V.MAJOR.MINOR.PATCH) */
    version: string;

    /** Node environment (development/production/staging) */
    environment: 'development' | 'production' | 'staging';

    /** Server port number */
    port: number;

    /** Base URL for the application */
    baseUrl: string;

    /** API base path */
    apiBaseUrl: string;
}

/**
 * Database configuration
 */
interface DatabaseConfig {
    /** PostgreSQL connection string */
    url: string;

    /** Redis connection URL */
    redisUrl: string;

    /** Use mock/fake data instead of real database */
    useMockData: boolean;
}

/**
 * Exchange rate configuration
 */
interface ExchangeRateConfig {
    /** Provider service name (mock/fixer/openexchange) */
    provider: string;

    /** API key for exchange rate service */
    apiKey: string;

    /** Cache duration in minutes */
    cacheMinutes: number;

    /** USD to CNY fallback rate (used when API unavailable) */
    usdToCnyFallback: number;

    /** Current live rate (updated by scheduler) */
    currentUsdToCny: number;

    /** USD to CNY rate */
    usd: number;

    /** EUR to CNY rate */
    eur: number;

    /** GBP to CNY rate */
    gbp: number;

    /** JPY to CNY rate */
    jpy: number;

    /** HKD to CNY rate */
    hkd: number;
}

/**
 * Tax rates for cross-border calculations
 */
interface TaxConfig {
    /** Default import duty rate (0-1) */
    importDutyRate: number;

    /** Value-added tax rate (0-1) */
    vatRate: number;

    /** Consumption tax rate for luxury goods (0-1) */
    consumptionTaxRate: number;

    /** Personal carry allowance per year in CNY */
    personalCarryAllowanceCny: number;
}

/**
 * Shipping configuration
 */
interface ShippingConfig {
    /** Free shipping threshold in CNY */
    freeThreshold: number;

    /** Default warehouse location code */
    defaultWarehouse: string;
}

/**
 * Feature flags for toggling functionality
 */
interface FeatureFlags {
    userAuthentication: boolean;
    shoppingCart: boolean;
    checkout: boolean;
    orderManagement: boolean;
    adminDashboard: boolean;
    productReviews: boolean;
    wishlist: boolean;
    productComparison: boolean;
    liveChat: boolean;
    multiLanguage: boolean;
    currencySwitcher: boolean;
    newsletter: boolean;
    aiAssistant: boolean;
    aiRecommendations: boolean;
}

/**
 * Logging configuration
 */
interface LoggingConfig {
    /** Minimum log level (error/warn/info/debug/trace) */
    level: string;

    /** Directory for log files */
    directory: string;
}

/**
 * Pricing configuration
 */
interface PricingConfig {
    /** Target gross margin (decimal, e.g., 0.30 = 30%) */
    targetMargin: number;

    /** VIP discount rates per tier (decimal) */
    vipDiscountRates: {
        standard: number;
        silver: number;
        gold: number;
        platinum: number;
        black: number;
        diamond: number;
    };

    /** Shipping costs per sourcing channel */
    shippingCostsPerChannel: {
        personalCarry: number;
        hkDirect: { low: number; high: number; threshold: number };
        bondedWarehouse: { low: number; high: number; threshold: number };
        japanAuction: number;
        europeBoutique: number;
        default: number;
    };
}

/**
 * Complete application configuration object
 */
export interface ZLuxuryConfig {
    app: AppConfig;
    database: DatabaseConfig;
    exchangeRate: ExchangeRateConfig;
    tax: TaxConfig;
    shipping: ShippingConfig;
    pricing: PricingConfig;
    features: FeatureFlags;
    logging: LoggingConfig;
    environment: string;
}

// ============================================================================
// HELPER FUNCTIONS / 辅助函数
// ============================================================================

/**
 * Get environment variable with optional default value
 * Supports both NEXT_PUBLIC_ prefixed and non-prefixed variables
 * 
 * @param key - Environment variable name
 * @param defaultValue - Fallback value if not set
 * @returns Environment variable value or default
 * 
 * @example
 * const port = env('PORT', '3000') // Returns process.env.PORT or '3000'
 */
function env(key: string, defaultValue: string = ''): string {
    // Check NEXT_PUBLIC_ prefix first (for client-side access)
    const publicValue = process.env[`NEXT_PUBLIC_${key}`];
    if (publicValue !== undefined && publicValue !== '') return publicValue;

    // Then check without prefix
    const privateValue = process.env[key];
    if (privateValue !== undefined && privateValue !== '') return privateValue;

    return defaultValue;
}

/**
 * Parse environment variable as number
 * Returns default value if parsing fails or not set
 * 
 * @param key - Environment variable name
 * @param defaultValue - Fallback numeric value
 * @returns Parsed number or default
 * 
 * @example
 * const port = envNumber('PORT', 3000)
 */
function envNumber(key: string, defaultValue: number): number {
    const value = env(key, String(defaultValue));
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse environment variable as boolean
 * Accepts: true, 1, yes (case-insensitive)
 * 
 * @param key - Environment variable name
 * @param defaultValue - Fallback boolean value
 * @returns Parsed boolean or default
 * 
 * @example
 * const debug = envBool('DEBUG_MODE', false)
 */
function envBool(key: string, defaultValue: boolean): boolean {
    const value = env(key, String(defaultValue)).toLowerCase();
    return ['true', '1', 'yes'].includes(value);
}

// ============================================================================
// CONFIGURATION LOADER / 配置加载器
// ============================================================================

/**
 * Load and validate complete application configuration
 * Reads from environment variables with sensible defaults
 * 
 * @returns Complete ZLuxuryConfig object
 * @throws Error if critical required values are missing
 */
export function loadConfig(): ZLuxuryConfig {
    const config: ZLuxuryConfig = {
        // ------------------------------------------------------------------
        // APPLICATION SETTINGS / 应用设置
        // ------------------------------------------------------------------
        app: {
            name: env('APP_NAME', 'ZLuxury'),
            version: env('APP_VERSION', '2.0.0'),
| environment: (env('NODE_ENV', 'development') as any) || 'development',
        port: envNumber('PORT', 19000),
            baseUrl: env('APP_URL', 'http://localhost:19000'),
                apiBaseUrl: '/api',
        },

// ------------------------------------------------------------------
// DATABASE SETTINGS / 数据库设置
// ------------------------------------------------------------------
database: {
    url: env('DATABASE_URL', 'postgresql://localhost:5432/zluxury'),
        redisUrl: env('REDIS_URL', 'redis://localhost:6379'),
            useMockData: envBool('USE_MOCK_DATA', true),
        },

// ------------------------------------------------------------------
// EXCHANGE RATE SETTINGS / 汇率设置
// ------------------------------------------------------------------
exchangeRate: {
    provider: env('EXCHANGE_RATE_PROVIDER', 'mock'),
        apiKey: env('EXCHANGE_RATE_API_KEY', ''),
            cacheMinutes: envNumber('EXCHANGE_RATE_CACHE_MINUTES', 60),
                usdToCnyFallback: envNumber('FALLBACK_EXCHANGE_RATE_USD_CNY', 7.24),
                    currentUsdToCny: envNumber('FALLBACK_EXCHANGE_RATE_USD_CNY', 7.24),
                        usd: envNumber('EXCHANGE_RATE_USD', 7.24),
                            eur: envNumber('EXCHANGE_RATE_EUR', 7.78),
                                gbp: envNumber('EXCHANGE_RATE_GBP', 9.32),
                                    jpy: envNumber('EXCHANGE_RATE_JPY', 0.047),
                                        hkd: envNumber('EXCHANGE_RATE_HKD', 0.915),
        },

// ------------------------------------------------------------------
// TAX RATES (Chinese Customs) / 税率设置（中国海关）
// ------------------------------------------------------------------
tax: {
    importDutyRate: envNumber('DEFAULT_IMPORT_DUTY_RATE', 0.20),     // 20% average luxury goods duty
        vatRate: envNumber('DEFAULT_VAT_RATE', 0.13),                    // 13% VAT in China
            consumptionTaxRate: envNumber('DEFAULT_CONSUMPTION_TAX_RATE', 0.10), // 10% consumption tax on luxury items
                personalCarryAllowanceCny: envNumber('PERSONAL_CARRY_ALLOWANCE_CNY', 50000), // ¥50K/year personal allowance
        },

// ------------------------------------------------------------------
// SHIPPING SETTINGS / 物流设置
// ------------------------------------------------------------------
shipping: {
    freeThreshold: envNumber('FREE_SHIPPING_THRESHOLD', 1000),       // Free shipping over ¥1000 CNY
        defaultWarehouse: env('DEFAULT_WAREHOUSE', 'SHANGHAI_FTZ'),      // Shanghai Free Trade Zone
        },

// ------------------------------------------------------------------
// PRICING SETTINGS / 定价设置
// ------------------------------------------------------------------
pricing: {
    targetMargin: envNumber('PRICING_TARGET_MARGIN', 0.30),
        vipDiscountRates: {
        standard: envNumber('VIP_DISCOUNT_STANDARD', 0.0),
            silver: envNumber('VIP_DISCOUNT_SILVER', 0.03),
                gold: envNumber('VIP_DISCOUNT_GOLD', 0.07),
                    platinum: envNumber('VIP_DISCOUNT_PLATINUM', 0.12),
                        black: envNumber('VIP_DISCOUNT_BLACK', 0.15),
                            diamond: envNumber('VIP_DISCOUNT_DIAMOND', 0.22),
            },
    shippingCostsPerChannel: {
        personalCarry: envNumber('SHIPPING_PERSONAL_CARRY', 0),
            hkDirect: {
            low: envNumber('SHIPPING_HK_DIRECT_LOW', 80),
                high: envNumber('SHIPPING_HK_DIRECT_HIGH', 200),
                    threshold: envNumber('SHIPPING_HK_DIRECT_THRESHOLD', 30000),
                },
        bondedWarehouse: {
            low: envNumber('SHIPPING_BONDED_LOW', 50),
                high: envNumber('SHIPPING_BONDED_HIGH', 150),
                    threshold: envNumber('SHIPPING_BONDED_THRESHOLD', 50000),
                },
        japanAuction: envNumber('SHIPPING_JAPAN_AUCTION', 300),
            europeBoutique: envNumber('SHIPPING_EUROPE_BOUTIQUE', 450),
                default: envNumber('SHIPPING_DEFAULT', 100),
            },
},

// ------------------------------------------------------------------
// FEATURE FLAGS / 功能开关
// ------------------------------------------------------------------
features: {
    userAuthentication: envBool('ENABLE_USER_AUTHENTICATION', false),
        shoppingCart: envBool('ENABLE_SHOPPING_CART', true),
            checkout: envBool('ENABLE_CHECKOUT', false),
                orderManagement: envBool('ENABLE_ORDER_MANAGEMENT', true),
                    adminDashboard: envBool('ENABLE_ADMIN_DASHBOARD', false),
                        productReviews: envBool('ENABLE_PRODUCT_REVIEWS', true),
                            wishlist: envBool('ENABLE_WISHLIST', true),
                                productComparison: envBool('ENABLE_PRODUCT_COMPARISON', true),
                                    liveChat: envBool('ENABLE_LIVE_CHAT', false),
                                        multiLanguage: envBool('ENABLE_MULTI_LANGUAGE', true),
                                            currencySwitcher: envBool('ENABLE_CURRENCY_SWITCHER', true),
                                                newsletter: envBool('ENABLE_NEWSLETTER', false),
                                                    aiAssistant: envBool('ENABLE_AI_ASSISTANT', true),
                                                        aiRecommendations: envBool('ENABLE_AI_RECOMMENDATIONS', true),
        },

// ------------------------------------------------------------------
// LOGGING SETTINGS / 日志设置
// ------------------------------------------------------------------
logging: {
    level: env('LOG_LEVEL', 'debug'),
        directory: env('LOG_DIR', './logs'),
        },

environment: env('NODE_ENV', 'development'),
    };

// Validate critical configuration
validateConfig(config);

return config;
}

/**
 * Validate critical configuration values
 * Logs warnings for missing recommended settings
 * 
 * @param config - Configuration object to validate
 * @private
 */
function validateConfig(config: ZLuxuryConfig): void {
    const warnings: string[] = [];

    // Warn about development defaults in production
    if (config.environment === 'production') {
        if (config.database.useMockData) {
            warnings.push('⚠️  Using mock data in production mode!');
        }

        if (config.exchangeRate.provider === 'mock') {
            warnings.push('⚠️  Using mock exchange rates in production!');
        }

        if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('dev-secret')) {
            warnings.push('⚠️  Using default JWT secret in production!');
        }
    }

    // Log warnings if any
    if (warnings.length > 0) {
        console.warn('\n⚠️  Configuration Warnings:');
        warnings.forEach(w => console.warn(`   ${w}`));
        console.log('');
    }
}

// ============================================================================
// SINGLETON INSTANCE / 单例实例
// ============================================================================

/** 
 * Cached configuration instance 
 * Loaded once at module initialization
 */
let cachedConfig: ZLuxuryConfig | null = null;

/**
 * Get configuration singleton instance
 * Loads on first access, caches for subsequent calls
 * 
 * @returns ZLuxuryConfig object
 * 
 * @example
 * import { config } from '@/lib/config-loader'
 * 
 * console.log(config.app.name)        // 'ZLuxury'
 * console.log(config.app.port)        // 13153
 * console.log(config.tax.vatRate)     // 0.13
 * console.log(config.features.aiAssistant) // true
 */
export function getConfig(): ZLuxuryConfig {
    if (!cachedConfig) {
        cachedConfig = loadConfig();

        // Log configuration load (only in development)
        if (cachedConfig.app.environment === 'development') {
            console.log(`\n📋 ${cachedConfig.app.name} v${cachedConfig.app.version} loaded`);
            console.log(`   Environment: ${cachedConfig.app.environment}`);
            console.log(`   Port: ${cachedConfig.app.port}`);
            console.log(`   Mock Data: ${cachedConfig.database.useMockData ? 'Enabled' : 'Disabled'}`);
            console.log(`   Features: ${Object.values(cachedConfig.features).filter(Boolean).length}/${Object.keys(cachedConfig.features).length} enabled\n`);
        }
    }

    return cachedConfig;
}

/**
 * Reset configuration cache (useful for testing)
 * Forces reload on next getConfig() call
 */
export function resetConfig(): void {
    cachedConfig = null;
}

/**
 * Update specific configuration values at runtime
 * Useful for testing or feature flag updates
 * 
 * @param updates - Partial config object with values to update
 */
export function updateConfig(updates: Partial<ZLuxuryConfig>): void {
    if (!cachedConfig) {
        cachedConfig = loadConfig();
    }

    // Deep merge updates into cached config
    Object.keys(updates).forEach((key) => {
        const k = key as keyof ZLuxuryConfig;
        const value = updates[k];
        if (value !== undefined) {
            if (typeof value === 'object' && value !== null) {
                (cachedConfig as any)[k] = {
                    ...(cachedConfig as any)[k],
                    ...value
                };
            } else {
                (cachedConfig as any)[k] = value;
            }
        }
    });
}

// Export singleton instance for convenience
export const config = getConfig();

// Default export
export default config;
