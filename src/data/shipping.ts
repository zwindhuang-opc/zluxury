/**
 * ZLuxury Shipping & Logistics Module
 * 
 * Manages shipping methods for cross-border luxury goods delivery.
 * Core advantage: Multiple shipping modes optimized for HKID + Shanghai residency.
 * 
 * Shipping Modes:
 * - PERSONAL_CARRY: HK resident carries through checkpoint (0-1 day)
 * - BONDED_1210: Shanghai FTZ bonded warehouse (2-5 days) 
 * - DIRECT_MAIL_9610: Direct mail from overseas (7-21 days)
 * - COURIER_EXPRESS: Premium courier (DHL/FedEx) (3-10 days)
 * 
 * Architecture: Business Logic Layer
 * Version: 2.0.0
 */

// ============================================================================
// TYPE DEFINITIONS / 类型定义
// ============================================================================

export type ShippingMethodType =
  | 'PERSONAL_CARRY'    // Personal carry at checkpoint / 自携过关
  | 'BONDED_1210'       // Bonded warehouse 1210 mode / 保税仓1210模式
  | 'DIRECT_MAIL_9610'  // Direct mail 9610 mode / 直邮9610模式
  | 'COURIER_EXPRESS';  // International express courier / 国际快递

/**
 * Shipping method configuration
 */
export interface ShippingMethod {
  /** Method ID / 方式ID */
  id: string;

  /** Method type / 方式类型 */
  type: ShippingMethodType;

  /** Display name / 显示名称 */
  name: string;

  /** Chinese name / 中文名称 */
  nameCn: string;

  /** Description / 描述 */
  description: string;

  /** Estimated delivery time range (days) / 预计交货时间（天） */
  deliveryDays: { min: number; max: number };

  /** Base cost (CNY) / 基础费用（元） */
  baseCost: number;

  /** Cost as percentage of order value / 订单价值百分比费用 */
  percentageRate: number;

  /** Maximum cost cap (CNY) / 费用上限（元） */
  maxCost?: number;

  /** Free shipping threshold (CNY) / 免运费门槛（元） */
  freeThreshold: number;

  /** Whether tracking is available / 是否可追踪 */
  hasTracking: boolean;

  /** Whether insurance is included / 是否含保险 */
  includesInsurance: boolean;

  /** Insurance coverage limit (CNY) / 保险覆盖上限（元） */
  insuranceLimit: number;

  /** Risk of customs inspection (1-5) / 海关查验风险(1-5) */
  inspectionRisk: number;

  /** Requires HKID / 需要香港身份证 */
  requiresHKID: boolean;

  /** Requires real-name authentication / 需要实名认证 */
  requiresRealNameAuth: boolean;

  /** Active status / 启用状态 */
  active: boolean;
}

/**
 * Shipping quote result
 */
export interface ShippingQuote {
  /** Shipping method / 配送方式 */
  method: ShippingMethod;

  /** Calculated cost / 计算费用 */
  cost: number;

  /** Estimated delivery date / 预计送达日期 */
  estimatedDelivery: string;

  /** Whether this is recommended / 是否推荐 */
  recommended: boolean;

  /** Recommendation reason / 推荐理由 */
  recommendationReason?: string;
}

/**
 * Order shipment record
 */
export interface ShipmentRecord {
  /** Shipment ID / 运单号 */
  shipmentId: string;

  /** Order ID / 订单号 */
  orderId: string;

  /** Shipping method used / 使用配送方式 */
  method: ShippingMethodType;

  /** Status / 状态 */
  status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'customs' | 'delivered';

  /** Tracking number / 追踪号码 */
  trackingNumber?: string;

  /** Origin location / 发货地 */
  origin: string;

  /** Destination / 目的地 */
  destination: string;

  /** Cost / 费用 */
  cost: number;

  /** Created timestamp / 创建时间 */
  createdAt: string;

  /** Shipped timestamp / 发货时间 */
  shippedAt?: string;

  /** Delivered timestamp / 送达时间 */
  deliveredAt?: string;

  /** Notes / 备注 */
  notes?: string;
}

// ============================================================================
// SHIPPING METHOD CONFIGURATIONS / 配送方式配置
// ============================================================================

export const SHIPPING_METHODS: Record<ShippingMethodType, ShippingMethod> = {
  PERSONAL_CARRY: {
    id: 'SHIP-CARRY',
    type: 'PERSONAL_CARRY',
    name: 'Personal Carry (HK Resident)',
    nameCn: '港人自携（香港居民）',
    description: 'Carry goods personally through Shenzhen Bay or Futian checkpoint. Fastest and most tax-efficient for items under exemption limit.',
    deliveryDays: { min: 0, max: 1 },
    baseCost: 50,           // Transport within HK/Shenzhen
    percentageRate: 0,
    freeThreshold: 0,
    hasTracking: false,
    includesInsurance: true,
    insuranceLimit: 50000,
    inspectionRisk: 3,      // Moderate risk if frequent
    requiresHKID: true,
    requiresRealNameAuth: true,
    active: true
  },

  BONDED_1210: {
    id: 'SHIP-1210',
    type: 'BONDED_1210',
    name: 'Shanghai FTZ Bonded Warehouse (1210)',
    nameCn: '上海自贸区保税仓配送（1210模式）',
    description: 'Pre-cleared goods stored in Waigaoqiao bonded warehouse. Ships directly to customer with pre-paid taxes.',
    deliveryDays: { min: 2, max: 5 },
    baseCost: 30,
    percentageRate: 0.01,   // 1% of order value
    maxCost: 200,
    freeThreshold: 50000,   // Free over ¥50k
    hasTracking: true,
    includesInsurance: true,
    insuranceLimit: 500000,
    inspectionRisk: 1,       // Very low - pre-cleared
    requiresHKID: false,
    requiresRealNameAuth: true,
    active: true
  },

  DIRECT_MAIL_9610: {
    id: 'SHIP-9610',
    type: 'DIRECT_MAIL_9610',
    name: 'Direct Mail Cross-Border (9610)',
    nameCn: '跨境直邮（9610模式）',
    description: 'Direct mail from overseas warehouse to China address. Tax collected at delivery.',
    deliveryDays: { min: 7, max: 14 },
    baseCost: 80,
    percentageRate: 0.02,   // 2% of order value
    maxCost: 400,
    freeThreshold: 100000,
    hasTracking: true,
    includesInsurance: true,
    insuranceLimit: 300000,
    inspectionRisk: 2,       // Low risk with proper declaration
    requiresHKID: false,
    requiresRealNameAuth: true,
    active: true
  },

  COURIER_EXPRESS: {
    id: 'SHIP-DHL',
    type: 'COURIER_EXPRESS',
    name: 'Premium Express (DHL/FedEx)',
    nameCn: '国际特快专递（DHL/联邦快递）',
    description: 'Premium international courier service. Best for high-value items requiring full insurance.',
    deliveryDays: { min: 3, max: 7 },
    baseCost: 150,
    percentageRate: 0.03,   // 3% of order value
    maxCost: 1000,
    freeThreshold: 0,        // Never free
    hasTracking: true,
    includesInsurance: true,
    insuranceLimit: 2000000,
    inspectionRisk: 4,       // Higher scrutiny on express parcels
    requiresHKID: false,
    requiresRealNameAuth: true,
    active: true
  }
};

// ============================================================================
// SHIPPING SERVICE CLASS / 物流服务类
// ============================================================================

/**
 * ShippingService class implementing shipping business logic
 */
export class ShippingService {

  /**
   * Get all available shipping methods
   *
   * Filters configured shipping methods to return only those that are
   * active and accessible to the customer. If hasHKID is false,
   * methods requiring HKID are excluded.
   *
   * @param hasHKID - Whether the customer has a Hong Kong ID (default: false)
   * @returns Array of eligible ShippingMethod objects
   *
   * @example
   * const methods = ShippingService.getAvailableMethods(true);
   * methods.forEach(m => console.log(`${m.name}: ${m.deliveryDays.min}-${m.deliveryDays.max} days`));
   */
  static getAvailableMethods(hasHKID: boolean = false): ShippingMethod[] {
    return Object.values(SHIPPING_METHODS).filter(method => {
      if (!method.active) return false;
      if (method.requiresHKID && !hasHKID) return false;
      return true;
    });
  }

  /**
   * Get shipping quotes for an order
   *
   * Calculates shipping costs and estimated delivery dates for all
   * available shipping methods. Applies free shipping thresholds and
   * cost caps. Returns a recommended method based on urgency, order
   * value, and customer profile.
   *
   * @param orderValueCny - Total order value in CNY
   * @param hasHKID - Whether the customer has HKID (default: false)
   * @param urgency - Delivery urgency preference: 'low', 'medium', or 'high' (default: 'medium')
   * @returns Array of ShippingQuote objects with cost, delivery date, and recommendation
   *
   * @example
   * const quotes = ShippingService.getQuotes(50000, true, 'high');
   * const recommended = quotes.find(q => q.recommended);
   * console.log(`Recommended: ${recommended?.method.name} - ¥${recommended?.cost}`);
   */
  static getQuotes(
    orderValueCny: number,
    hasHKID: boolean = false,
    urgency: 'low' | 'medium' | 'high' = 'medium'
  ): ShippingQuote[] {
    const methods = this.getAvailableMethods(hasHKID);

    return methods.map(method => {
      // Calculate cost
      let cost = method.baseCost + (orderValueCny * method.percentageRate);

      // Apply cap
      if (method.maxCost && cost > method.maxCost) {
        cost = method.maxCost;
      }

      // Check free threshold
      if (orderValueCny >= method.freeThreshold) {
        cost = 0;
      }

      // Calculate estimated delivery date
      const now = new Date();
      const deliveryDate = new Date(now.getTime() + method.deliveryDays.max * 24 * 60 * 60 * 1000);
      const estimatedDelivery = deliveryDate.toISOString().split('T')[0];

      // Determine recommendation
      let recommended = false;
      let recommendationReason = '';

      if (urgency === 'high') {
        recommended = method.type === 'PERSONAL_CARRY' || method.deliveryDays.min <= 3;
        recommendationReason = recommended ? 'Fastest option for your needs' : '';
      } else if (orderValueCny <= 15000 && hasHKID && method.type === 'PERSONAL_CARRY') {
        recommended = true;
        recommendationReason = 'Best value: zero tax + fastest delivery within exemption limit';
      } else if (method.inspectionRisk <= 2 && cost < orderValueCny * 0.02) {
        recommended = true;
        recommendationReason = 'Best balance of cost, speed, and reliability';
      }

      return {
        method,
        cost: Math.round(cost),
        estimatedDelivery,
        recommended,
        recommendationReason: recommendationReason || undefined
      };
    });
  }

  /**
   * Recommend best shipping method based on order profile
   *
   * Analyzes the order value, customer HKID status, and product category
   * to suggest the optimal shipping method. Uses a priority-based
   * decision tree: small value + HKID → personal carry; high value →
   * bonded warehouse; no HKID → direct mail; default → bonded warehouse.
   *
   * @param orderValueCny - Order value in CNY
   * @param hasHKID - Whether customer has HKID
   * @param itemCategory - Primary product category for contextual recommendation
   * @returns Object with recommended method, reasoning text, and total cost
   *
   * @example
   * const rec = ShippingService.recommend(8000, true, 'Watches');
   * console.log(`Recommended: ${rec.method.name}`);
   * console.log(`Reason: ${rec.reason}`);
   */
  static recommend(
    orderValueCny: number,
    hasHKID: boolean,
    itemCategory: string
  ): { method: ShippingMethod; reason: string; totalCost: number } {

    // Perfect scenario: small value + HKID
    if (orderValueCny <= 12000 && hasHKID) {
      return {
        method: SHIPPING_METHODS.PERSONAL_CARRY,
        reason: `Order value ¥${orderValueCny.toLocaleString()} is within HK resident tax-free exemption. Carry personally for zero duty and same-day delivery.`,
        totalCost: 50
      };
    }

    // High value: use bonded warehouse
    if (orderValueCny >= 100000) {
      return {
        method: SHIPPING_METHODS.BONDED_1210,
        reason: `High-value order (¥${orderValueCny.toLocaleString()}) via Shanghai FTZ bonded warehouse. Pre-cleared customs, full insurance up to ¥500k.`,
        totalCost: Math.min(30 + orderValueCny * 0.01, 200)
      };
    }

    // Medium value without HKID
    if (!hasHKID) {
      return {
        method: SHIPPING_METHODS.DIRECT_MAIL_9610,
        reason: `Cross-border direct mail with tax collection at delivery. Reliable tracking and insurance included.`,
        totalCost: Math.min(80 + orderValueCny * 0.02, 400)
      };
    }

    // Default: bonded warehouse for balance
    return {
      method: SHIPPING_METHODS.BONDED_1210,
      reason: `Optimal choice: pre-cleared customs, fast delivery (2-5 days), competitive pricing.`,
      totalCost: Math.min(30 + orderValueCny * 0.01, 200)
    };
  }

  /**
   * Create a new shipment record for an order
   *
   * Generates a unique shipment ID and initializes a shipment record
   * with the specified method, destination, and cost. Automatically
   * determines the origin location based on the shipping method type.
   * For personal carry method, adds a note indicating customer will
   * carry through checkpoint.
   *
   * @param orderId - The associated order ID
   * @param method - Selected shipping method type
   * @param destination - Delivery address description
   * @param cost - Calculated shipping cost in CNY
   * @returns Newly created ShipmentRecord with status 'pending'
   *
   * @example
   * const shipment = ShippingService.createShipment(
   *   'ZL-ABC123', 'BONDED_1210', 'Shanghai Pudong', 80
   * );
   * console.log(`Shipment ${shipment.shipmentId} created`);
   */
  static createShipment(
    orderId: string,
    method: ShippingMethodType,
    destination: string,
    cost: number
  ): ShipmentRecord {
    const origins: Record<ShippingMethodType, string> = {
      PERSONAL_CARRY: 'Hong Kong → Shenzhen (Personal)',
      BONDED_1210: 'Shanghai Waigaoqiu FTZ Bonded Warehouse',
      DIRECT_MAIL_9610: 'Overseas Warehouse (Japan/Europe)',
      COURIER_EXPRESS: 'Hong Kong/International Hub'
    };

    return {
      shipmentId: `SHP-${Date.now().toString(36).toUpperCase()}`,
      orderId,
      method,
      status: 'pending',
      origin: origins[method],
      destination,
      cost,
      createdAt: new Date().toISOString(),
      notes: method === 'PERSONAL_CARRY' ? 'Customer will carry through checkpoint' : undefined
    };
  }
}

// ============================================================================
// EXPORTS / 导出
// ============================================================================

export default {
  SHIPPING_METHODS,
  ShippingService
};
