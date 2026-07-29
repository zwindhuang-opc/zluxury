/**
 * ZLuxury Pricing Engine
 * 
 * Dynamic pricing engine for luxury cross-border commerce.
 * Calculates final prices including:
 * - Base cost from sourcing channel
 * - Import duties and taxes (China customs)
 * - VIP tier discounts
 * - Shipping costs
 * - Profit margin optimization
 * 
 * Key tax policies leveraged:
 * - HK free port: 0% import duty on most luxury goods
 * - Cross-border e-commerce (1210): 9.1% effective rate (70% of 13% VAT)
 * - Personal carry exemption: 12,000-15,000 RMB per trip (HK residents)
 * - Japan auction: 20-40% below EU retail prices
 * 
 * Architecture: Business Logic Layer
 * Version: 2.0.0
 */

import { SourcingChannelType, SourcingService } from './sourcing';
import { VipTier } from './auth';
import { getConfig } from '@/lib/config-loader';

// ============================================================================
// TYPE DEFINITIONS / 类型定义
// ============================================================================

/**
 * Customs tariff category for luxury goods
 */
export interface TariffCategory {
  /** Category code / 税则号列 */
  code: string;

  /** Category name / 类别名称 */
  name: string;

  /** Name in Chinese / 中文名称 */
  nameCn: string;

  /** Most Favored Nation (MFN) tariff rate / 最惠国税率 */
  mfnRate: number;           // decimal

  /** Value Added Tax rate / 增值税税率 */
  vatRate: number;            // decimal

  /** Consumption tax rate (if applicable) / 消费税税率 */
  consumptionTaxRate?: number; // decimal

  /** Cross-border e-commerce effective rate (70% of statutory) / 跨境电商综合税率 */
  cbecEffectiveRate: number;   // decimal

  /** Personal carry exemption limit (RMB) / 个人携带免税额度 */
  personalExemptionLimit: number;
}

/**
 * Pricing calculation result
 */
export interface PricingResult {
  /** Product ID / 产品ID */
  productId: string;

  /** Product name / 产品名称 */
  productName: string;

  /** Sourcing channel used / 使用渠道 */
  sourcingChannel: SourcingChannelType;

  /** Cost price in CNY / 人民币成本价 */
  costPriceCny: number;

  /** Import duty amount / 进口关税 */
  importDuty: number;

  /** VAT amount / 增值税金额 */
  vatAmount: number;

  /** Consumption tax amount / 消费税金额 */
  consumptionTax?: number;

  /** Total tax paid / 总税费 */
  totalTax: number;

  /** Shipping cost / 运费 */
  shippingCost: number;

  /** Subtotal before discount / 折扣前小计 */
  subtotal: number;

  /** VIP discount amount / VIP折扣 */
  vipDiscount: number;

  /** Final selling price / 最终售价 */
  finalPrice: number;

  /** Final price with currency / 带货币的最终售价 */
  formattedPrice: string;

  /** Gross profit margin % / 毛利率% */
  grossMargin: number;

  /** Price breakdown for display / 价格明细（用于展示） */
  breakdown: Array<{
    label: string;
    labelCn: string;
    amount: number;
  }>;
}

/**
 * Order-level pricing summary
 */
export interface OrderPricingSummary {
  /** Total items / 商品总数 */
  itemCount: number;

  /** Subtotal (before tax & discount) / 小计 */
  subtotal: number;

  /** Total import duties / 总进口关税 */
  totalDuties: number;

  /** Total VAT / 总增值税 */
  totalVat: number;

  /** Total consumption tax / 总消费税 */
  totalConsumptionTax: number;

  /** Total tax / 总税费 */
  totalTax: number;

  /** Total shipping / 总运费 */
  totalShipping: number;

  /** VIP discount / VIP折扣 */
  vipDiscount: number;

  /** Grand total / 总计 */
  grandTotal: number;

  /** Average margin % / 平均毛利率% */
  averageMargin: number;

  /** Savings vs China retail price / 相对中国零售价节省 */
  savingsVsRetail: number;

  /** Savings percentage / 节省百分比 */
  savingsPercent: number;
}

// ============================================================================
// TARIFF CATEGORIES / 税则分类
// ============================================================================

/**
 * China customs tariff categories for luxury goods
 * Based on HS codes and current regulations
 */
export const TARIFF_CATEGORIES: Record<string, TariffCategory> = {
  watches: {
    code: '9101.21',
    name: 'Wristwatches (Mechanical)',
    nameCn: '机械腕表',
    mfnRate: 0.08,           // 8% MFN duty
    vatRate: 0.13,            // 13% VAT
    consumptionTaxRate: 0.20, // 20% consumption tax on watches >10,000RMB
    cbecEffectiveRate: 0.091, // ~9.1% effective via CBEC
    personalExemptionLimit: 5000
  },
  jewelry: {
    code: '7113.19',
    name: 'Jewelry (Precious Metal/Gemstones)',
    nameCn: '珠宝首饰（贵金属/宝石）',
    mfnRate: 0.08,           // 8%
    vatRate: 0.13,
    consumptionTaxRate: 0.05, // 5% on precious metal jewelry
    cbecEffectiveRate: 0.126, // ~12.6%
    personalExemptionLimit: 12000
  },
  handbags: {
    code: '4202.22',
    name: 'Handbags (Leather)',
    nameCn: '手袋（皮革）',
    mfnRate: 0.06,           // 6%
    vatRate: 0.13,
    cbecEffectiveRate: 0.091, // ~9.1%
    personalExemptionLimit: 8000
  },
  fashion_accessories: {
    code: '4202.12',
    name: 'Fashion Accessories',
    nameCn: '时尚配饰',
    mfnRate: 0.06,
    vatRate: 0.13,
    cbecEffectiveRate: 0.091,
    personalExemptionLimit: 5000
  }
};

/**
 * China retail reference prices (for savings calculation)
 * Based on brand official China pricing
 */
export const CHINA_RETAIL_PRICES: Record<string, number> = {
  'PROD-001': 104400,  // Rolex Submariner: ¥104,400
  'PROD-002': 620000,  // Patek Nautilus: ¥620,000+ (gray market)
  'PROD-003': 47500,   // Omega Speedmaster: ¥47,500
  'PROD-004': 255000,  // AP Royal Oak: ¥255,000
  'PROD-005': 200000,  // Hermes Birkin 25: ¥200,000+
  'PROD-006': 160000,  // Hermes Kelly 28: ¥160,000
  'PROD-007': 37800,   // LV Capucines BB: ¥37,800
  'PROD-008': 78000,   // Chanel Classic Flap: ¥78,000
  'PROD-009': 49800,   // Cartier Love Bracelet: ¥49,800
  'PROD-010': 23200,   // VCA Alhambra: ¥23,200
  'PROD-011': 10500,   // Tiffany T Wire: ¥10,500
  'PROD-012': 135000,  // Bulgari Serpenti: ¥135,000
  'PROD-013': 3300,    // Gucci Belt: ¥3,300
  'PROD-014': 13500,   // Prada Re-Edition: ¥13,500
  'PROD-015': 23400,   // Dior Saddle: ¥23,400
};

// ============================================================================
// VIP DISCOUNT CONFIGURATION / VIP折扣配置
// ============================================================================

const config = getConfig();

const VIP_DISCOUNT_RATES: Record<VipTier | 'standard' | 'black' | 'diamond', number> = {
  standard: config.pricing.vipDiscountRates.standard,
  silver: config.pricing.vipDiscountRates.silver,
  gold: config.pricing.vipDiscountRates.gold,
  platinum: config.pricing.vipDiscountRates.platinum,
  black: config.pricing.vipDiscountRates.black,
  diamond: config.pricing.vipDiscountRates.diamond,
};

// ============================================================================
// PRICING ENGINE CLASS / 定价引擎类
// ============================================================================

/**
 * PricingEngine class implementing dynamic pricing calculations
 */
export class PricingEngine {

  /**
   * Calculate full pricing for a single product
   * @param productId - Product ID
   * @param costPriceCny - Cost price in CNY
   * @param category - Product category (for tariff lookup)
   * @param sourcingChannel - Where product is sourced from
   * @param vipTier - Customer VIP tier
   * @returns Pricing result
   */
  static calculatePrice(
    productId: string,
    productName: string,
    costPriceCny: number,
    category: string,
    sourcingChannel: SourcingChannelType,
    vipTier: VipTier | 'standard' = 'standard'
  ): PricingResult {
    // Get tariff info
    const tariff = this.getTariffForCategory(category);

    // Calculate import duty
    let importDuty = costPriceCny * tariff.mfnRate;

    // Calculate VAT (on cost + duty)
    const taxableValue = costPriceCny + importDuty;
    let vatAmount = taxableValue * tariff.vatRate;

    // Calculate consumption tax if applicable
    let consumptionTax = 0;
    if (tariff.consumptionTaxRate && (taxableValue + vatAmount) > 10000) {
      consumptionTax = (taxableValue + vatAmount) * tariff.consumptionTaxRate / (1 + tariff.consumptionTaxRate);
    }

    // Adjust for sourcing channel
    let totalTax = importDuty + vatAmount + (consumptionTax || 0);

    switch (sourcingChannel) {
      case 'HK_DIRECT':
        // Free port - no import duty when carried personally
        // Only applies if within exemption or using bonded warehouse
        totalTax = costPriceCny * tariff.cbecEffectiveRate;
        break;
      case 'PERSONAL_CARRY':
        // Within exemption limit - zero tax
        if (costPriceCny <= tariff.personalExemptionLimit) {
          totalTax = 0;
        } else {
          // Excess taxed at full rate
          const exempt = Math.min(costPriceCny, tariff.personalExemptionLimit);
          const excess = costPriceCny - exempt;
          totalTax = excess * (tariff.mfnRate + tariff.vatRate);
        }
        break;
      case 'BONDED_WAREHOUSE':
        // CBEC mode: 70% of statutory rate
        totalTax = costPriceCny * tariff.cbecEffectiveRate;
        break;
      case 'JAPAN_AUCTION':
      case 'EUROPE_BOUTIQUE':
        // Via bonded warehouse or personal carry
        totalTax = costPriceCny * tariff.cbecEffectiveRate;
        break;
    }

    // Shipping estimate
    const shippingCost = this.calculateShipping(costPriceCny, sourcingChannel);

    // Subtotal
    const subtotal = costPriceCny + totalTax + shippingCost;

    // Target selling price (with healthy margin)
    const targetMargin = config.pricing.targetMargin;
    let finalPrice = Math.round(subtotal / (1 - targetMargin));

    // Round to nice numbers
    finalPrice = this.roundToNiceNumber(finalPrice);

    // Apply VIP discount
    const vipRate = VIP_DISCOUNT_RATES[vipTier] || 0;
    const vipDiscount = Math.round(finalPrice * vipRate);
    finalPrice = finalPrice - vipDiscount;

    // Calculate actual margin
    const grossMargin = ((finalPrice - subtotal) / finalPrice) * 100;

    // Build breakdown
    const breakdown = [
      { label: 'Cost Price', labelCn: '成本价', amount: costPriceCny },
      { label: 'Import Duty/Tax', labelCn: '进口税费', amount: Math.round(totalTax) },
      { label: 'Shipping', labelCn: '运费', amount: shippingCost },
    ];
    if (vipDiscount > 0) {
      breakdown.push({ label: 'VIP Discount', labelCn: 'VIP折扣', amount: -vipDiscount });
    }

    return {
      productId,
      productName,
      sourcingChannel,
      costPriceCny,
      importDuty: Math.round(importDuty),
      vatAmount: Math.round(vatAmount),
      consumptionTax: consumptionTax ? Math.round(consumptionTax) : undefined,
      totalTax: Math.round(totalTax),
      shippingCost,
      subtotal: Math.round(subtotal),
      vipDiscount,
      finalPrice,
      formattedPrice: `¥${finalPrice.toLocaleString()}`,
      grossMargin: Math.round(grossMargin * 10) / 10,
      breakdown
    };
  }

  /**
   * Calculate order-level pricing summary
   * @param items - Array of individual pricing results
   * @returns Order pricing summary
   */
  static calculateOrderSummary(items: PricingResult[]): OrderPricingSummary {
    const itemCount = items.length;
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const totalDuties = items.reduce((sum, item) => sum + item.importDuty, 0);
    const totalVat = items.reduce((sum, item) => sum + item.vatAmount, 0);
    const totalConsumptionTax = items.reduce((sum, item) => sum + (item.consumptionTax || 0), 0);
    const totalTax = items.reduce((sum, item) => sum + item.totalTax, 0);
    const totalShipping = items.reduce((sum, item) => sum + item.shippingCost, 0);
    const vipDiscount = items.reduce((sum, item) => sum + item.vipDiscount, 0);
    const grandTotal = items.reduce((sum, item) => sum + item.finalPrice, 0);
    const avgMargin = items.length > 0
      ? items.reduce((sum, item) => sum + item.grossMargin, 0) / items.length
      : 0;

    // Calculate savings vs China retail
    let retailTotal = 0;
    items.forEach(item => {
      retailTotal += CHINA_RETAIL_PRICES[item.productId] || item.finalPrice * 1.2;
    });
    const savingsVsRetail = retailTotal - grandTotal;
    const savingsPercent = retailTotal > 0 ? (savingsVsRetail / retailTotal) * 100 : 0;

    return {
      itemCount,
      subtotal: Math.round(subtotal),
      totalDuties: Math.round(totalDuties),
      totalVat: Math.round(totalVat),
      totalConsumptionTax: Math.round(totalConsumptionTax),
      totalTax: Math.round(totalTax),
      totalShipping: Math.round(totalShipping),
      vipDiscount,
      grandTotal,
      averageMargin: Math.round(avgMargin * 10) / 10,
      savingsVsRetail: Math.round(savingsVsRetail),
      savingsPercent: Math.round(savingsPercent * 10) / 10
    };
  }

  /**
   * Get tariff category for a product category
   * @param category - Product category string
   * @returns Tariff category object
   */
  private static getTariffForCategory(category: string): TariffCategory {
    const categoryMap: Record<string, keyof typeof TARIFF_CATEGORIES> = {
      'Watches': 'watches',
      'Jewelry': 'jewelry',
      'Bags': 'handbags',
      'Fashion': 'fashion_accessories'
    };
    const key = categoryMap[category] || 'handbags';
    return TARIFF_CATEGORIES[key];
  }

  /**
   * Estimate shipping cost based on value and channel
   * @param valueCny - Item value in CNY
   * @param channel - Sourcing channel
   * @returns Shipping cost estimate
   */
  private static calculateShipping(valueCny: number, channel: SourcingChannelType): number {
    const shippingConfig = config.pricing.shippingCostsPerChannel;

    switch (channel) {
      case 'PERSONAL_CARRY':
        return shippingConfig.personalCarry;
      case 'HK_DIRECT':
        return valueCny > shippingConfig.hkDirect.threshold
          ? shippingConfig.hkDirect.high
          : shippingConfig.hkDirect.low;
      case 'BONDED_WAREHOUSE':
        return valueCny > shippingConfig.bondedWarehouse.threshold
          ? shippingConfig.bondedWarehouse.high
          : shippingConfig.bondedWarehouse.low;
      case 'JAPAN_AUCTION':
        return shippingConfig.japanAuction;
      case 'EUROPE_BOUTIQUE':
        return shippingConfig.europeBoutique;
      default:
        return shippingConfig.default;
    }
  }

  /**
   * Round price to a "nice" number for psychological pricing
   * @param price - Raw price
   * @returns Rounded nice price
   */
  private static roundToNiceNumber(price: number): number {
    if (price < 1000) {
      return Math.ceil(price / 10) * 10;     // Round to nearest 10
    } else if (price < 10000) {
      return Math.ceil(price / 50) * 50;     // Round to nearest 50
    } else if (price < 100000) {
      return Math.ceil(price / 500) * 500;   // Round to nearest 500
    } else {
      return Math.ceil(price / 1000) * 1000; // Round to nearest 1000
    }
  }

  /**
   * Get China retail price for a product (for comparison display)
   * @param productId - Product ID
   * @returns China retail price or null
   */
  static getChinaRetailPrice(productId: string): number | null {
    return CHINA_RETAIL_PRICES[productId] || null;
  }

  /**
   * Calculate savings percentage vs China retail
   * @param productId - Product ID
   * @param ourPrice - Our selling price in CNY
   * @returns Savings info
   */
  static calculateSavings(productId: string, ourPrice: number): {
    retailPrice: number;
    savings: number;
    percent: number;
  } | null {
    const retail = CHINA_RETAIL_PRICES[productId];
    if (!retail) return null;

    const savings = retail - ourPrice;
    const percent = (savings / retail) * 100;

    return {
      retailPrice: retail,
      savings: Math.round(savings),
      percent: Math.round(percent * 10) / 10
    };
  }
}

// ============================================================================
// EXPORTS / 导出
// ============================================================================

export default {
  TARIFF_CATEGORIES,
  CHINA_RETAIL_PRICES,
  PricingEngine
};
