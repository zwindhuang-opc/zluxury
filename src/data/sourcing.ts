/**
 * ZLuxury Sourcing Channels Module
 * 
 * Manages product sourcing from multiple global channels.
 * Core business advantage: HKID + Shanghai residency enables
 * multi-channel procurement with optimal tax/duty positioning.
 * 
 * Sourcing Channels:
 * - HK_DIRECT: Hong Kong retail/authorized dealers (0% VAT/duty)
 * - JAPAN_AUCTION: Japanese auction houses (20-40% below EU prices)
 * - EUROPE_BOUTIQUE: European boutiques with tax refund (~12-26% savings)
 * - BONDED_WAREHOUSE: Shanghai FTZ bonded warehouse (1210 mode)
 * - PERSONAL_CARRY: HK resident personal carry (12-15k RMB exemption)
 * 
 * Architecture: Business Logic Layer
 * Version: 2.0.0
 */

import { getConfig } from '@/lib/config-loader';

// ============================================================================
// TYPE DEFINITIONS / 类型定义
// ============================================================================

/**
 * Sourcing channel type identifiers
 */
export type SourcingChannelType =
    | 'HK_DIRECT'      // Hong Kong authorized dealer / 香港授权经销商
    | 'JAPAN_AUCTION'   // Japanese auction house / 日本拍卖行
    | 'EUROPE_BOUTIQUE' // European boutique + tax refund / 欧洲精品店+退税
    | 'BONDED_WAREHOUSE' // Shanghai FTZ bonded warehouse (1210) / 上海自贸区保税仓
    | 'PERSONAL_CARRY';  // HK resident personal carry / 港人自携入境

/**
 * Sourcing channel configuration
 */
export interface SourcingChannel {
    /** Channel ID / 渠道ID */
    id: string;

    /** Channel type / 渠道类型 */
    type: SourcingChannelType;

    /** Display name / 显示名称 */
    name: string;

    /** Chinese display name / 中文名称 */
    nameCn: string;

    /** Origin country/region / 来源地 */
    origin: string;

    /** Currency used in this channel / 使用货币 */
    currency: string;

    /** Average cost markup over wholesale (decimal) / 批发价加成率 */
    costMarkup: number;

    /** Estimated delivery time in days / 预计交货天数 */
    deliveryDays: { min: number; max: number };

    /** Tax rate applied at import (decimal) / 进口税率 */
    importTaxRate: number;

    /** Whether this channel requires HKID / 是否需要香港身份证 */
    requiresHKID: boolean;

    /** Whether this channel requires business license / 是否需要营业执照 */
    requiresBusinessLicense: boolean;

    /** Monthly capacity limit (items) / 月度容量限制 */
    monthlyCapacity?: number;

    /** Risk level (1-5) / 风险等级 */
    riskLevel: 1 | 2 | 3 | 4 | 5;

    /** Active status / 启用状态 */
    active: boolean;

    /** Channel description / 渠道描述 */
    description: string;
}

/**
 * Product sourcing record - links a product to its source
 */
export interface ProductSourcing {
    /** Product ID / 产品ID */
    productId: string;

    /** Channel ID / 渠道ID */
    channelId: string;

    /** Cost price in original currency / 原币种成本价 */
    costPrice: number;

    /** Cost price in CNY / 人民币成本价 */
    costPriceCny: number;

    /** Minimum order quantity / 最小订购量 */
    moq: number;

    /** Current stock available at source / 渠道当前库存 */
    availableStock: number;

    /** Last updated timestamp / 最后更新时间 */
    lastUpdated: string;

    /** Supplier notes / 供应商备注 */
    notes?: string;
}

/**
 * Price comparison across channels
 */
export interface PriceComparison {
    /** Product ID / 产品ID */
    productId: string;

    /** Comparisons by channel / 各渠道比价 */
    comparisons: Array<{
        channel: SourcingChannel;
        costPrice: number;
        costPriceCny: number;
        finalPriceCny: number;   // After all taxes/duties
        margin: number;          // Profit margin %
        recommended: boolean;    // Recommended channel
        reason?: string;         // Recommendation reason
    }>;

    /** Best overall channel / 最佳综合渠道 */
    bestChannel: SourcingChannelType;

    /** Best margin channel / 最高利润渠道 */
    highestMarginChannel: SourcingChannelType;

    /** Fastest delivery channel / 最快交货渠道 */
    fastestChannel: SourcingChannelType;
}

// ============================================================================
// SOURCING CHANNEL CONFIGURATION / 渠道配置
// ============================================================================

/**
 * All configured sourcing channels
 * Based on real-world HK/Shanghai cross-border luxury trade research
 */
export const SOURCING_CHANNELS: Record<SourcingChannelType, SourcingChannel> = {
    HK_DIRECT: {
        id: 'SRC-HK-001',
        type: 'HK_DIRECT',
        name: 'Hong Kong Authorized Dealer',
        nameCn: '香港授权经销商',
        origin: 'Hong Kong SAR',
        currency: 'HKD',
        costMarkup: 0.05,        // 5% above wholesale
        deliveryDays: { min: 1, max: 3 },
        importTaxRate: 0.0,       // 0% - free port
        requiresHKID: false,
        requiresBusinessLicense: false,
        riskLevel: 1,
        active: true,
        description: 'Authorized dealers in Hong Kong Tsim Sha Tsui/Central. 0% import duty. Authenticity guaranteed.'
    },

    JAPAN_AUCTION: {
        id: 'SRC-JP-001',
        type: 'JAPAN_AUCTION',
        name: 'Japanese Auction House',
        nameCn: '日本拍卖行',
        origin: 'Japan',
        currency: 'JPY',
        costMarkup: 0.08,
        deliveryDays: { min: 7, max: 14 },
        importTaxRate: 0.0,       // Via bonded warehouse or personal carry
        requiresHKID: false,
        requiresBusinessLicense: true,
        monthlyCapacity: 100,
        riskLevel: 2,
        active: true,
        description: 'Brand Off, Komehyo, Reclo auctions. 20-40% below EU prices. High authenticity standards.'
    },

    EUROPE_BOUTIQUE: {
        id: 'SRC-EU-001',
        type: 'EUROPE_BOUTIQUE',
        name: 'European Boutique + Tax Refund',
        nameCn: '欧洲精品店+退税',
        origin: 'France/Italy/Switzerland',
        currency: 'EUR',
        costMarkup: 0.03,
        deliveryDays: { min: 10, max: 21 },
        importTaxRate: 0.091,     // 9.1% effective via cross-border e-commerce
        requiresHKID: false,
        requiresBusinessLicense: true,
        riskLevel: 2,
        active: true,
        description: 'Paris/Milan boutiques with ~12% tax refund. Best for Chanel, LV, Hermes.'
    },

    BONDED_WAREHOUSE: {
        id: 'SRC-SH-001',
        type: 'BONDED_WAREHOUSE',
        name: 'Shanghai FTZ Bonded Warehouse (1210)',
        nameCn: '上海自贸区保税仓(1210模式)',
        origin: 'Shanghai Free Trade Zone',
        currency: 'CNY',
        costMarkup: 0.02,
        deliveryDays: { min: 2, max: 5 },
        importTaxRate: 0.091,     // 9.1% effective (70% of statutory rate)
        requiresHKID: false,
        requiresBusinessLicense: true,
        monthlyCapacity: 500,
        riskLevel: 1,
        active: true,
        description: 'Waigaoqiao/Yangshan bonded warehouse. 1210 CBEC mode. 9.1% effective tax rate.'
    },

    PERSONAL_CARRY: {
        id: 'SRC-HK-CARRY',
        type: 'PERSONAL_CARRY',
        name: 'Personal Carry (HK Resident)',
        nameCn: '港人自携入境（个人物品）',
        origin: 'Hong Kong → Mainland China',
        currency: 'HKD',
        costMarkup: 0.00,
        deliveryDays: { min: 0, max: 1 },
        importTaxRate: 0.0,       // Within exemption limit
        requiresHKID: true,        // REQUIRES HKID
        requiresBusinessLicense: false,
        monthlyCapacity: 6,        // ~2 trips/month × 3 items
        riskLevel: 3,              // Customs scrutiny risk
        active: true,
        description: '12,000 RMB tax-free per trip (15k at duty-free). Max 15 days between trips.'
    }
};

// ============================================================================
// PRODUCT SOURCING DATABASE / 产品货源数据库
// ============================================================================

/**
 * Product sourcing records - maps each product to available sources
 */
export const PRODUCT_SOURCING: ProductSourcing[] = [
    // === WATCHES ===
    {
        productId: 'PROD-001', // Rolex Submariner
        channelId: 'SRC-HK-001',
        costPrice: 88000,      // HKD
        costPriceCny: 80500,
        moq: 1,
        availableStock: 8,
        lastUpdated: '2025-06-13',
        notes: 'HK AD price, allocation dependent'
    },
    {
        productId: 'PROD-001',
        channelId: 'SRC-JP-001',
        costPrice: 1450000,     // JPY
        costPriceCny: 71000,
        moq: 1,
        availableStock: 3,
        lastUpdated: '2025-06-13'
    },
    {
        productId: 'PROD-002', // Patek Philippe Nautilus
        channelId: 'SRC-HK-001',
        costPrice: 520000,     // HKD
        costPriceCny: 476000,
        moq: 1,
        availableStock: 1,
        lastUpdated: '2025-06-13',
        notes: 'Waitlist only, extremely limited'
    },
    {
        productId: 'PROD-002',
        channelId: 'SRC-EU-001',
        costPrice: 72000,      // EUR
        costPriceCny: 558000,
        moq: 1,
        availableStock: 0,
        lastUpdated: '2025-06-13',
        notes: 'Discontinued, waitlist 5+ years'
    },
    {
        productId: 'PROD-003', // Omega Speedmaster
        channelId: 'SRC-HK-001',
        costPrice: 42000,      // HKD
        costPriceCny: 38400,
        moq: 1,
        availableStock: 15,
        lastUpdated: '2025-06-13'
    },
    {
        productId: 'PROD-003',
        channelId: 'SRC-EU-001',
        costPrice: 5500,       // EUR
        costPriceCny: 42700,
        moq: 1,
        availableStock: 20,
        lastUpdated: '2025-06-13'
    },
    {
        productId: 'PROD-004', // AP Royal Oak
        channelId: 'SRC-HK-001',
        costPrice: 220000,     // HKD
        costPriceCny: 201500,
        moq: 1,
        availableStock: 2,
        lastUpdated: '2025-06-13',
        notes: 'High demand, allocation required'
    },
    // === BAGS ===
    {
        productId: 'PROD-005', // Hermes Birkin 25
        channelId: 'SRC-HK-001',
        costPrice: 175000,     // HKD
        costPriceCny: 160200,
        moq: 1,
        availableStock: 2,
        lastUpdated: '2025-06-13',
        notes: 'Quota system, relationship-based allocation'
    },
    {
        productId: 'PROD-005',
        channelId: 'SRC-EU-001',
        costPrice: 8500,       // EUR
        costPriceCny: 65800,
        moq: 1,
        availableStock: 1,
        lastUpdated: '2025-06-13'
    },
    {
        productId: 'PROD-006', // Hermes Kelly 28
        channelId: 'SRC-HK-001',
        costPrice: 138000,     // HKD
        costPriceCny: 126300,
        moq: 1,
        availableStock: 3,
        lastUpdated: '2025-06-13'
    },
    {
        productId: 'PROD-007', // LV Capucines BB
        channelId: 'SRC-HK-001',
        costPrice: 32000,      // HKD
        costPriceCny: 29300,
        moq: 1,
        availableStock: 25,
        lastUpdated: '2025-06-13'
    },
    {
        productId: 'PROD-007',
        channelId: 'SRC-EU-001',
        costPrice: 3200,       // EUR
        costPriceCny: 24800,
        moq: 1,
        availableStock: 30,
        lastUpdated: '2025-06-13'
    },
    {
        productId: 'PROD-008', // Chanel Classic Flap
        channelId: 'SRC-HK-001',
        costPrice: 68000,      // HKD
        costPriceCny: 62250,
        moq: 1,
        availableStock: 8,
        lastUpdated: '2025-06-13'
    },
    {
        productId: 'PROD-008',
        channelId: 'SRC-EU-001',
        costPrice: 8000,       // EUR
        costPriceCny: 61900,
        moq: 1,
        availableStock: 5,
        lastUpdated: '2025-06-13'
    },
    {
        productId: 'PROD-014', // Prada Re-Edition
        channelId: 'SRC-HK-001',
        costPrice: 11500,      // HKD
        costPriceCny: 10530,
        moq: 1,
        availableStock: 35,
        lastUpdated: '2025-06-13'
    },
    {
        productId: 'PROD-014',
        channelId: 'SRC-JP-001',
        costPrice: 185000,     // JPY
        costPriceCny: 9070,
        moq: 1,
        availableStock: 50,
        lastUpdated: '2025-06-13'
    },
    {
        productId: 'PROD-015', // Dior Saddle
        channelId: 'SRC-HK-001',
        costPrice: 19800,      // HKD
        costPriceCny: 18130,
        moq: 1,
        availableStock: 15,
        lastUpdated: '2025-06-13'
    },
    // === JEWELRY ===
    {
        productId: 'PROD-009', // Cartier Love Bracelet
        channelId: 'SRC-HK-001',
        costPrice: 43000,      // HKD
        costPriceCny: 39370,
        moq: 1,
        availableStock: 18,
        lastUpdated: '2025-06-13'
    },
    {
        productId: 'PROD-009',
        channelId: 'SRC-EU-001',
        costPrice: 5300,       // EUR
        costPriceCny: 41000,
        moq: 1,
        availableStock: 25,
        lastUpdated: '2025-06-13'
    },
    {
        productId: 'PROD-010', // VCA Alhambra
        channelId: 'SRC-HK-001',
        costPrice: 20000,      // HKD
        costPriceCny: 18300,
        moq: 1,
        availableStock: 12,
        lastUpdated: '2025-06-13'
    },
    {
        productId: 'PROD-011', // Tiffany T Wire
        channelId: 'SRC-HK-001',
        costPrice: 9000,       // HKD
        costPriceCny: 8235,
        moq: 1,
        availableStock: 28,
        lastUpdated: '2025-06-13'
    },
    {
        productId: 'PROD-012', // Bulgari Serpenti
        channelId: 'SRC-HK-001',
        costPrice: 115000,     // HKD
        costPriceCny: 105250,
        moq: 1,
        availableStock: 2,
        lastUpdated: '2025-06-13'
    },
    // === FASHION ===
    {
        productId: 'PROD-013', // Gucci Belt
        channelId: 'SRC-HK-001',
        costPrice: 2800,       // HKD
        costPriceCny: 2560,
        moq: 1,
        availableStock: 60,
        lastUpdated: '2025-06-13'
    }
];

// ============================================================================
// EXCHANGE RATES / 汇率
// ============================================================================

/**
 * Fallback exchange rates (base: CNY)
 * Used when config-loader values are unavailable
 */
const FALLBACK_EXCHANGE_RATES = {
    USD: 7.24,
    EUR: 7.78,
    GBP: 9.32,
    JPY: 0.047,
    HKD: 0.915,
} as const;

/**
 * Exchange rates (base: CNY)
 * Loaded from config-loader with fallback to hardcoded values
 */
const config = getConfig();

export const EXCHANGE_RATES = {
    USD: config.exchangeRate.usd || FALLBACK_EXCHANGE_RATES.USD,
    EUR: config.exchangeRate.eur || FALLBACK_EXCHANGE_RATES.EUR,
    GBP: config.exchangeRate.gbp || FALLBACK_EXCHANGE_RATES.GBP,
    JPY: config.exchangeRate.jpy || FALLBACK_EXCHANGE_RATES.JPY,
    HKD: config.exchangeRate.hkd || FALLBACK_EXCHANGE_RATES.HKD,
} as const;

// ============================================================================
// SOURCING SERVICE CLASS / 货源服务类
// ============================================================================

/**
 * SourcingService class implementing sourcing business logic
 */
export class SourcingService {

    /**
     * Get all active sourcing channels
     * @returns Array of active channels
     */
    static getActiveChannels(): SourcingChannel[] {
        return Object.values(SOURCING_CHANNELS).filter(ch => ch.active);
    }

    /**
     * Get channel by type
     * @param type - Channel type
     * @returns Sourcing channel or null
     */
    static getChannel(type: SourcingChannelType): SourcingChannel | null {
        return SOURCING_CHANNELS[type] || null;
    }

    /**
     * Get sourcing options for a specific product
     * @param productId - Product ID
     * @returns Array of sourcing options
     */
    static getProductSourcing(productId: string): ProductSourcing[] {
        return PRODUCT_SOURCING.filter(s => s.productId === productId);
    }

    /**
     * Get price comparison across all channels for a product
     * @param productId - Product ID
     * @param sellingPriceCny - Target selling price in CNY
     * @returns Price comparison object
     */
    static comparePrices(
        productId: string,
        sellingPriceCny: number
    ): PriceComparison | null {
        const sourcings = this.getProductSourcing(productId);

        if (sourcings.length === 0) return null;

        type ComparisonItem = NonNullable<PriceComparison['comparisons'][number]>;

        const comparisons: ComparisonItem[] = sourcings.map(s => {
            const channel = SOURCING_CHANNELS[s.channelId as SourcingChannelType];
            if (!channel) return null;

            let finalPriceCny = s.costPriceCny;

            // Add import tax if applicable
            if (channel.importTaxRate > 0) {
                finalPriceCny *= (1 + channel.importTaxRate);
            }

            // Add shipping estimate (roughly 1-3% of value)
            const shippingEstimate = Math.max(finalPriceCny * 0.02, 100);
            finalPriceCny += shippingEstimate;

            const margin = ((sellingPriceCny - finalPriceCny) / sellingPriceCny) * 100;

            return {
                channel,
                costPrice: s.costPrice,
                costPriceCny: s.costPriceCny,
                finalPriceCny: Math.round(finalPriceCny),
                margin: Math.round(margin * 10) / 10,
                recommended: margin >= 20 && channel.riskLevel <= 2,
                reason: margin >= 30 ? 'Excellent margin' : margin >= 20 ? 'Good margin' : 'Thin margin'
            };
        }).filter(c => c !== null) as ComparisonItem[];

        if (comparisons.length === 0) return null;

        // Find best channels by different criteria
        const byMargin = [...comparisons].sort((a, b) => b.margin - a.margin);
        const bySpeed = [...comparisons].sort((a, b) => a.channel.deliveryDays.min - b.channel.deliveryDays.min);
        const byRisk = [...comparisons].sort((a, b) => a.channel.riskLevel - b.channel.riskLevel);

        // Best overall: good margin + low risk + reasonable speed
        const bestOverall = comparisons.find((c: ComparisonItem) => c.recommended) || byRisk[0];

        return {
            productId,
            comparisons,
            bestChannel: bestOverall?.channel.type || byMargin[0]?.channel.type || 'HK_DIRECT',
            highestMarginChannel: byMargin[0]?.channel.type || 'HK_DIRECT',
            fastestChannel: bySpeed[0]?.channel.type || 'HK_DIRECT'
        };
    }

    /**
     * Get recommended sourcing strategy based on order profile
     * @param totalValueCny - Total order value in CNY
     * @param urgency - Order urgency level
     * @param hasHKID - Whether customer has HKID
     * @returns Recommended channel and reasoning
     */
    static recommendChannel(
        totalValueCny: number,
        urgency: 'low' | 'medium' | 'high',
        hasHKID: boolean
    ): { channel: SourcingChannel; reason: string; estimatedMargin: number } {
        const channels = this.getActiveChannels();

        // Filter by eligibility
        const eligible = channels.filter(ch => !ch.requiresHKID || hasHKID);

        if (urgency === 'high') {
            // Prioritize speed
            const fast = eligible.sort((a, b) => a.deliveryDays.min - b.deliveryDays.min)[0];
            return {
                channel: fast,
                reason: `Fastest delivery (${fast.deliveryDays.min}-${fast.deliveryDays.max} days)`,
                estimatedMargin: 25
            };
        }

        if (totalValueCny <= 15000 && hasHKID) {
            // Perfect for personal carry within exemption
            return {
                channel: SOURCING_CHANNELS.PERSONAL_CARRY,
                reason: `Order value ¥${totalValueCny.toLocaleString()} is within HK resident tax-free exemption (¥12,000-¥15,000). Zero duty.`,
                estimatedMargin: 45
            };
        }

        if (totalValueCny > 100000) {
            // Large orders go through bonded warehouse
            return {
                channel: SOURCING_CHANNELS.BONDED_WAREHOUSE,
                reason: `Large order (¥${totalValueCny.toLocaleString()}) optimized through Shanghai FTZ bonded warehouse. 9.1% effective tax rate.`,
                estimatedMargin: 22
            };
        }

        // Default: Japan auction for best margins on mid-range items
        return {
            channel: SOURCING_CHANNELS.JAPAN_AUCTION,
            reason: `Japan auction offers 20-40% below European retail. Optimal for this order size.`,
            estimatedMargin: 35
        };
    }

    /**
     * Calculate monthly sourcing capacity across all channels
     * @returns Capacity summary
     */
    static getCapacitySummary(): {
        totalMonthlyCapacity: number;
        channels: Array<{
            name: string;
            type: SourcingChannelType;
            capacity: number | 'unlimited';
            utilized: number;
            remaining: number | 'unlimited';
        }>
    } {
        const channels = this.getActiveChannels();
        return {
            totalMonthlyCapacity: 656, // Sum of limited capacities
            channels: channels.map(ch => ({
                name: ch.name,
                type: ch.type,
                capacity: ch.monthlyCapacity || 'unlimited',
                utilized: Math.floor(Math.random() * (typeof ch.monthlyCapacity === 'number' ? ch.monthlyCapacity : 50)),
                remaining: ch.monthlyCapacity ? Math.max(0, ch.monthlyCapacity - Math.floor(ch.monthlyCapacity * 0.6)) : 'unlimited'
            }))
        };
    }
}

// ============================================================================
// EXPORTS / 导出
// ============================================================================

export default {
    SOURCING_CHANNELS,
    PRODUCT_SOURCING,
    EXCHANGE_RATES,
    SourcingService
};
