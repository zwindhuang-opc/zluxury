/**
 * ZLuxury Order Management System
 * 
 * Complete order lifecycle management for luxury cross-border commerce.
 * 
 * Order Flow:
 * 1. Cart → 2. Checkout → 3. Payment → 4. Sourcing → 5. Shipping → 6. Delivery
 * 
 * Features:
 * - Multi-currency order support (USD, CNY, HKD, EUR, JPY)
 * - Order status tracking with customs integration
 * - VIP tier pricing
 * - Tax/duty calculation
 * - Shipping method selection
 * - Order analytics
 * 
 * Architecture: Business Logic Layer
 * Version: 2.0.0
 */

import { Product, ProductRepository } from './products';
import { PricingResult, PricingEngine } from './pricing';
import { ShippingMethodType, ShipmentRecord, ShippingService } from './shipping';
import { SourcingChannelType } from './sourcing';
import { VipTier } from './auth';

// ============================================================================
// TYPE DEFINITIONS / 类型定义
// ============================================================================

export type OrderStatus =
  | 'pending_payment'     // Waiting for payment / 待付款
  | 'paid'                // Paid, processing / 已付款
  | 'sourcing'            // Procuring from source / 采购中
  | 'in_transit'          // In transit to China / 运输中
  | 'customs_clearance'   // Under customs inspection / 清关中
  | 'delivered'           // Delivered to customer / 已送达
  | 'completed'           // Order completed / 已完成
  | 'cancelled';           // Order cancelled / 已取消

export type PaymentMethod =
  | 'alipay'
  | 'wechat_pay'
  | 'bank_transfer'
  | 'credit_card'
  | 'hk_bank_transfer';

/**
 * Order item interface
 */
export interface OrderItem {
  /** Item ID / 项目ID */
  id: string;

  /** Product reference / 产品引用 */
  productId: string;

  /** Product name / 产品名称 */
  productName: string;

  /** Brand / 品牌 */
  brand: string;

  /** Category / 类别 */
  category: string;

  /** Quantity / 数量 */
  quantity: number;

  /** Unit cost price (CNY) / 单位成本价（元） */
  unitCostPrice: number;

  /** Unit selling price (CNY) / 单位售价（元） */
  unitSellingPrice: number;

  /** Line total / 行小计 */
  lineTotal: number;

  /** Sourcing channel used / 使用货源渠道 */
  sourcingChannel: SourcingChannelType;

  /** Image URL / 图片URL */
  imageUrl?: string;
}

/**
 * Main order interface
 */
export interface Order {
  /** Order ID / 订单号 */
  orderId: string;

  /** Customer ID / 客户ID */
  customerId: string;

  /** Customer name / 客户姓名 */
  customerName: string;

  /** Items in order / 订单商品 */
  items: OrderItem[];

  /** Order status / 订单状态 */
  status: StatusWithTimestamp;

  /** Payment info / 支付信息 */
  payment: {
    method: PaymentMethod;
    paidAt?: string;
    transactionId?: string;
    amount: number;
    currency: string;
  };

  /** Shipping info / 配送信息 */
  shipping: ShipmentRecord | null;

  /** Pricing breakdown / 价格明细 */
  pricing: {
    subtotal: number;           // Cost + tax before discount
    importDuty: number;         // Import duty total
    vatAmount: number;          // VAT total
    consumptionTax: number;     // Consumption tax total
    shippingCost: number;       // Shipping cost
    vipDiscount: number;        // VIP discount
    grandTotal: number;         // Final total
    savingsVsRetail: number;    // Savings vs China retail
    currency: string;
  };

  /** Delivery address / 收货地址 */
  deliveryAddress: {
    recipient: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detail: string;
    postalCode?: string;
  };

  /** Customer notes / 客户备注 */
  customerNotes?: string;

  /** Internal notes / 内部备注 */
  internalNotes?: string;

  /** VIP tier at time of order / 下单时VIP等级 */
  vipTier: VipTier | 'standard';

  /** Created timestamp / 创建时间 */
  createdAt: string;

  /** Updated timestamp / 更新时间 */
  updatedAt: string;

  /** Estimated delivery date / 预计送达日期 */
  estimatedDelivery?: string;
}

/**
 * Status with timestamp for tracking
 */
interface StatusWithTimestamp {
  current: OrderStatus;
  history: Array<{
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }>;
}

/**
 * Order creation request
 */
export interface CreateOrderRequest {
  customerId: string;
  customerName: string;
  items: Array<{
    productId: string;
    quantity: number;
    sourcingChannel: SourcingChannelType;
  }>;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethodType;
  deliveryAddress: Order['deliveryAddress'];
  vipTier: VipTier | 'standard';
  customerNotes?: string;
}

// ============================================================================
// ORDER STATUSES CONFIGURATION / 订单状态配置
// ============================================================================

const ORDER_STATUS_CONFIG: Record<OrderStatus, {
  label: string;
  labelCn: string;
  color: string;
  description: string;
}> = {
  pending_payment: {
    label: 'Pending Payment',
    labelCn: '待付款',
    color: '#f59e0b',
    description: 'Waiting for customer payment confirmation'
  },
  paid: {
    label: 'Paid',
    labelCn: '已付款',
    color: '#3b82f6',
    description: 'Payment received, starting procurement process'
  },
  sourcing: {
    label: 'Sourcing',
    labelCn: '采购中',
    color: '#8b5cf6',
    description: 'Procuring items from designated source channel'
  },
  in_transit: {
    label: 'In Transit',
    labelCn: '运输中',
    color: '#06b6d4',
    description: 'Items are on their way to destination'
  },
  customs_clearance: {
    label: 'Customs Clearance',
    labelCn: '清关中',
    color: '#f97316',
    description: 'Under customs inspection and duty assessment'
  },
  delivered: {
    label: 'Delivered',
    labelCn: '已送达',
    color: '#22c55e',
    description: 'Successfully delivered to customer'
  },
  completed: {
    label: 'Completed',
    labelCn: '已完成',
    color: '#10b981',
    description: 'Order fully completed and confirmed by customer'
  },
  cancelled: {
    label: 'Cancelled',
    labelCn: '已取消',
    color: '#ef4444',
    description: 'Order has been cancelled'
  }
};

// ============================================================================
// ORDER STORAGE (In-memory mock) / 订单存储（内存模拟）
// ============================================================================

const orders: Map<string, Order> = new Map();

// ============================================================================
// ORDER SERVICE CLASS / 订单服务类
// ============================================================================

/**
 * OrderService class implementing order business logic
 */
export class OrderService {

  /**
   * Generate a unique order ID
   *
   * Creates a time-based unique identifier with the format ZL-{timestamp}-{random}.
   * Uses base-36 encoding for compact representation while maintaining uniqueness.
   *
   * @returns Unique order ID string (format: ZL-XXXXXXXX-XXXXXXX)
   */
  private static generateOrderId(): string {
    return `ZL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  }

  /**
   * Create a new order
   * @param request - Order creation data
   * @returns Created order or error
   */
  static createOrder(request: CreateOrderRequest): { success: boolean; order?: Order; error?: string } {
    try {

      const orderId = this.generateOrderId();
      const now = new Date().toISOString();

      // Build order items with pricing
      const items: OrderItem[] = [];
      let subtotal = 0;
      let totalImportDuty = 0;
      let totalVat = 0;
      let totalConsumptionTax = 0;

      for (const item of request.items) {
        const product = ProductRepository.getById(item.productId);
        if (!product) {
          return { success: false, error: `Product ${item.productId} not found` };
        }

        if ((product.stock || 0) < item.quantity) {
          return { success: false, error: `Insufficient stock for ${product.name}` };
        }

        // Calculate pricing using engine
        const pricing = PricingEngine.calculatePrice(
          product.id,
          product.name,
          product.priceCny || Math.round(product.price * 7.24),
          product.category,
          item.sourcingChannel,
          request.vipTier
        );

        const lineTotal = pricing.finalPrice * item.quantity;

        items.push({
          id: `ITEM-${Date.now().toString(36)}`,
          productId: product.id,
          productName: product.name,
          brand: product.brand,
          category: product.category,
          quantity: item.quantity,
          unitCostPrice: pricing.costPriceCny,
          unitSellingPrice: pricing.finalPrice,
          lineTotal,
          sourcingChannel: item.sourcingChannel,
          imageUrl: product.imageUrl
        });

        subtotal += lineTotal;
        totalImportDuty += pricing.importDuty;
        totalVat += pricing.vatAmount;
        totalConsumptionTax += pricing.consumptionTax || 0;
      }

      // Calculate shipping
      const shippingCost = this.calculateShippingCost(subtotal, request.shippingMethod);

      // Calculate VIP discount
      const vipRates: Record<string, number> = { standard: 0, silver: 0.03, gold: 0.07, platinum: 0.12, black: 0.15, diamond: 0.22 };
      const vipDiscount = Math.round(subtotal * (vipRates[request.vipTier] || 0));

      // Calculate savings vs retail
      let savingsVsRetail = 0;
      request.items.forEach(item => {
        const retail = PricingEngine.getChinaRetailPrice(item.productId);
        if (retail) {
          savingsVsRetail += retail - (items.find(i => i.productId === item.productId)?.unitSellingPrice || 0);
        }
      });

      // Create shipment record
      const shipment = ShippingService.createShipment(
        orderId,
        request.shippingMethod,
        `${request.deliveryAddress.province} ${request.deliveryAddress.city} ${request.deliveryAddress.district} ${request.deliveryAddress.detail}`,
        shippingCost
      );

      const order: Order = {
        orderId,
        customerId: request.customerId,
        customerName: request.customerName,
        items,
        status: {
          current: 'pending_payment',
          history: [{ status: 'pending_payment', timestamp: now }]
        },
        payment: {
          method: request.paymentMethod,
          amount: 0,
          currency: 'CNY'
        },
        shipping: shipment,
        pricing: {
          subtotal,
          importDuty: totalImportDuty,
          vatAmount: totalVat,
          consumptionTax: totalConsumptionTax,
          shippingCost: shippingCost,
          vipDiscount,
          grandTotal: subtotal - vipDiscount + shippingCost,
          savingsVsRetail,
          currency: 'CNY'
        },
        deliveryAddress: request.deliveryAddress,
        customerNotes: request.customerNotes,
        vipTier: request.vipTier,
        createdAt: now,
        updatedAt: now
      };

      orders.set(orderId, order);
      return { success: true, order };

    } catch (error) {
      console.error('[OrderService] Create order error:', error);
      return { success: false, error: 'Failed to create order' };
    }
  }

  /**
   * Retrieve an order by its unique identifier
   *
   * Looks up an order in the in-memory store by its order ID.
   * Returns null if no matching order is found.
   *
   * @param orderId - The unique order identifier (format: ZL-XXXXXXXX-XXXXXXX)
   * @returns The matching Order object, or null if not found
   *
   * @example
   * const order = OrderService.getOrder('ZL-ABC123-DEF456');
   * if (order) { console.log(order.status.current); }
   */
  static getOrder(orderId: string): Order | null {
    return orders.get(orderId) || null;
  }

  /**
   * Retrieve all orders for a specific customer
   *
   * Filters the order store to find all orders associated with the
   * given customer ID. Returns an empty array if no orders exist.
   *
   * @param customerId - The unique customer identifier
   * @returns Array of Order objects belonging to the customer
   *
   * @example
   * const customerOrders = OrderService.getCustomerOrders('cust-001');
   * console.log(`Customer has ${customerOrders.length} orders`);
   */
  static getCustomerOrders(customerId: string): Order[] {
    return Array.from(orders.values()).filter(o => o.customerId === customerId);
  }

  /**
   * Update the status of an existing order
   *
   * Transitions an order to a new status and records the change in the
   * order's status history with a timestamp and optional note. The
   * updatedAt timestamp is also refreshed.
   *
   * @param orderId - The unique order identifier
   * @param newStatus - The target OrderStatus value
   * @param note - Optional note describing the status change reason
   * @returns True if the status was successfully updated, false if order not found
   *
   * @example
   * const updated = OrderService.updateStatus('ZL-ABC123', 'shipped', 'Package dispatched');
   */
  static updateStatus(orderId: string, newStatus: OrderStatus, note?: string): boolean {
    const order = orders.get(orderId);
    if (!order) return false;

    order.status.current = newStatus;
    order.status.history.push({ status: newStatus, timestamp: new Date().toISOString(), note });
    order.updatedAt = new Date().toISOString();

    if (newStatus === 'completed') {
      order.status.current = 'completed';
    }

    return true;
  }

  /**
   * Get order statistics summary for analytics
   *
   * Calculates aggregate metrics across all orders including total count,
   * revenue (excluding cancelled orders), average order value, and
   * breakdowns by status and sourcing channel.
   *
   * @returns Object containing:
   *   - totalOrders: Total number of orders placed
   *   - revenue: Total revenue excluding cancelled orders (CNY)
   *   - avgOrderValue: Average order value in CNY
   *   - byStatus: Count of orders per status type
   *   - byChannel: Count of order items per sourcing channel
   */
  static getOrderStats(): {
    totalOrders: number;
    revenue: number;
    avgOrderValue: number;
    byStatus: Record<string, number>;
    byChannel: Record<string, number>;
  } {
    const allOrders = Array.from(orders.values());
    const revenue = allOrders
      .filter(o => o.status.current !== 'cancelled')
      .reduce((sum, o) => sum + o.pricing.grandTotal, 0);

    const byStatus: Record<string, number> = {};
    const byChannel: Record<string, number> = {};

    allOrders.forEach(o => {
      byStatus[o.status.current] = (byStatus[o.status.current] || 0) + 1;
      o.items.forEach(item => {
        byChannel[item.sourcingChannel] = (byChannel[item.sourcingChannel] || 0) + 1;
      });
    });

    return {
      totalOrders: allOrders.length,
      revenue,
      avgOrderValue: allOrders.length > 0 ? revenue / allOrders.length : 0,
      byStatus,
      byChannel
    };
  }

  /**
   * Calculate shipping cost based on order value and shipping method
   *
   * Computes shipping costs for different delivery methods:
   * - PERSONAL_CARRY: Fixed ¥50
   * - BONDED_1210: ¥30 + 1% of order value (capped at ¥200)
   * - DIRECT_MAIL_9610: ¥80 + 2% of order value (capped at ¥400)
   * - COURIER_EXPRESS: ¥150 + 3% of order value (capped at ¥1000)
   *
   * @param orderValue - Total order value in CNY
   * @param method - Selected shipping method type
   * @returns Calculated shipping cost in CNY
   */
  private static calculateShippingCost(orderValue: number, method: ShippingMethodType): number {
    switch (method) {
      case 'PERSONAL_CARRY': return 50;
      case 'BONDED_1210': return Math.min(30 + orderValue * 0.01, 200);
      case 'DIRECT_MAIL_9610': return Math.min(80 + orderValue * 0.02, 400);
      case 'COURIER_EXPRESS': return Math.min(150 + orderValue * 0.03, 1000);
      default: return 100;
    }
  }

  /**
   * Get the display configuration for an order status
   *
   * Retrieves the label, color, and description for a given order status.
   * Used for consistent status display across UI components.
   *
   * @param status - The OrderStatus to look up configuration for
   * @returns Configuration object with label, labelCn, color, and description
   *
   * @example
   * const config = OrderService.getStatusConfig('paid');
   * console.log(`Status: ${config.label}, Color: ${config.color}`);
   */
  static getStatusConfig(status: OrderStatus) {
    return ORDER_STATUS_CONFIG[status];
  }
}

// ============================================================================
// EXPORTS / 导出
// ============================================================================

export default {
  OrderService,
  ORDER_STATUS_CONFIG
};
