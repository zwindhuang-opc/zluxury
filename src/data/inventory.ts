/**
 * ZLuxury Inventory Management Module
 * 
 * Multi-warehouse inventory tracking for luxury cross-border commerce.
 * Tracks stock across:
 * - Hong Kong warehouse (TST/Central pickup)
 * - Shanghai FTZ bonded warehouse (Waigaoqiu)
 * - Japan auction pipeline
 * - Europe boutique pipeline
 * - In-transit inventory
 * 
 * Architecture: Business Logic Layer
 * Version: 2.0.0
 */

import { SourcingChannelType } from './sourcing';

// ============================================================================
// TYPE DEFINITIONS / 类型定义
// ============================================================================

export type WarehouseType =
  | 'HK_WAREHOUSE'        // Hong Kong physical warehouse / 香港实体仓
  | 'SH_BONDED'            // Shanghai FTZ bonded warehouse / 上海保税仓
  | 'JP_PIPELINE'          // Japan auction pipeline / 日本拍卖渠道
  | 'EU_PIPELINE'          // Europe boutique pipeline / 欧洲精品渠道
  | 'IN_TRANSIT';           // In-transit to China / 在途到中国

/**
 * Warehouse location configuration
 */
export interface WarehouseLocation {
  /** Warehouse ID / 仓库ID */
  id: string;

  /** Warehouse type / 仓库类型 */
  type: WarehouseType;

  /** Name / 名称 */
  name: string;

  /** Chinese name / 中文名称 */
  nameCn: string;

  /** Location address / 地址 */
  location: string;

  /** Timezone / 时区 */
  timezone: string;

  /** Capacity (items) / 容量（件） */
  capacity: number;

  /** Current utilization % / 当前使用率% */
  utilization: number;

  /** Active status / 启用状态 */
  active: boolean;
}

/**
 * Inventory record for a product at a specific location
 */
export interface InventoryRecord {
  /** Record ID / 记录ID */
  id: string;

  /** Product ID / 产品ID */
  productId: string;

  /** Product name / 产品名称 */
  productName: string;

  /** Brand / 品牌 */
  brand: string;

  /** Warehouse location / 仓库位置 */
  warehouseId: string;

  /** Warehouse type / 仓库类型 */
  warehouseType: WarehouseType;

  /** Quantity on hand / 现有数量 */
  quantity: number;

  /** Reserved quantity (pending orders) / 预留数量（待处理订单） */
  reservedQuantity: number;

  /** Available quantity = quantity - reserved / 可用数量 */
  availableQuantity: number;

  /** Reorder point / 补货点 */
  reorderPoint: number;

  /** Reorder quantity / 补货数量 */
  reorderQty: number;

  /** Last restocked date / 最后补货日期 */
  lastRestocked?: string;

  /** Next expected arrival / 下次预计到货 */
  nextArrival?: string;

  /** Unit cost at this location / 该位置单位成本 */
  unitCostCny: number;

  /** Condition grade (A=like-new, B=excellent, C=good) / 成色等级 */
  conditionGrade: 'A' | 'B' | 'C';

  /** Authentication status / 鉴定状态 */
  authStatus: 'verified' | 'pending' | 'not_required';

  /** Serial number / reference if applicable / 序列号/编号 */
  serialRef?: string;

  /** Last updated timestamp / 最后更新时间 */
  updatedAt: string;
}

/**
 * Low stock alert
 */
export interface StockAlert {
  alertId: string;
  productId: string;
  productName: string;
  warehouseType: WarehouseType;
  currentStock: number;
  reorderPoint: number;
  severity: 'critical' | 'warning' | 'info';
  message: string;
}

// ============================================================================
// WAREHOUSE CONFIGURATIONS / 仓库配置
// ============================================================================

export const WAREHOUSES: Record<WarehouseType, WarehouseLocation> = {
  HK_WAREHOUSE: {
    id: 'WH-HK-001',
    type: 'HK_WAREHOUSE',
    name: 'Hong Kong Tsim Sha Tsui Hub',
    nameCn: '香港尖沙咀中心仓',
    location: 'Tsim Sha Tsui, Kowloon, Hong Kong SAR',
    timezone: 'Asia/Hong_Kong',
    capacity: 500,
    utilization: 0.62,
    active: true
  },
  SH_BONDED: {
    id: 'WH-SH-001',
    type: 'SH_BONDED',
    name: 'Shanghai Waigaoqiu FTZ Bonded Warehouse',
    nameCn: '上海外高桥自贸区保税仓',
    location: 'Waigaoqiu Free Trade Zone, Pudong, Shanghai',
    timezone: 'Asia/Shanghai',
    capacity: 2000,
    utilization: 0.38,
    active: true
  },
  JP_PIPELINE: {
    id: 'WH-JP-001',
    type: 'JP_PIPELINE',
    name: 'Japan Auction Pipeline',
    nameCn: '日本拍卖渠道库存',
    location: 'Tokyo/Osaka Auction Houses (Virtual)',
    timezone: 'Asia/Tokyo',
    capacity: 200,
    utilization: 0.45,
    active: true
  },
  EU_PIPELINE: {
    id: 'WH-EU-001',
    type: 'EU_PIPELINE',
    name: 'Europe Boutique Pipeline',
    nameCn: '欧洲精品渠道库存',
    location: 'Paris/Milan/Basel Boutiques (Virtual)',
    timezone: 'Europe/Paris',
    capacity: 150,
    utilization: 0.30,
    active: true
  },
  IN_TRANSIT: {
    id: 'WH-TRANSIT',
    type: 'IN_TRANSIT',
    name: 'In Transit to China',
    nameCn: '在途运输中',
    location: 'International Logistics Network',
    timezone: 'UTC',
    capacity: 100,
    utilization: 0.20,
    active: true
  }
};

// ============================================================================
// INVENTORY DATABASE (Mock) / 库存数据库（模拟）
// ============================================================================

const inventoryRecords: Map<string, InventoryRecord> = new Map();

// Initialize with sample data
function initializeInventory() {
  const initialStock: Array<{
    productId: string; productName: string; brand: string;
    warehouseType: WarehouseType; qty: number; reserved: number;
    cost: number; condition: 'A' | 'B' | 'C'; reorderPoint: number;
  }> = [
      // Rolex Submariner
      { productId: 'PROD-001', productName: 'Rolex Submariner Date', brand: 'Rolex', warehouseType: 'HK_WAREHOUSE', qty: 5, reserved: 1, cost: 80500, condition: 'A', reorderPoint: 3 },
      { productId: 'PROD-001', productName: 'Rolex Submariner Date', brand: 'Rolex', warehouseType: 'JP_PIPELINE', qty: 3, reserved: 0, cost: 71000, condition: 'A', reorderPoint: 2 },
      // Patek Philippe
      { productId: 'PROD-002', productName: 'Patek Philippe Nautilus', brand: 'Patek Philippe', warehouseType: 'HK_WAREHOUSE', qty: 1, reserved: 0, cost: 476000, condition: 'A', reorderPoint: 1 },
      // Omega Speedmaster
      { productId: 'PROD-003', productName: 'Omega Speedmaster Moonwatch', brand: 'Omega', warehouseType: 'HK_WAREHOUSE', qty: 10, reserved: 2, cost: 38400, condition: 'A', reorderPoint: 5 },
      { productId: 'PROD-003', productName: 'Omega Speedmaster Moonwatch', brand: 'Omega', warehouseType: 'SH_BONDED', qty: 8, reserved: 1, cost: 39200, condition: 'A', reorderPoint: 5 },
      // AP Royal Oak
      { productId: 'PROD-004', productName: 'Audemars Piguet Royal Oak', brand: 'Audemars Piguet', warehouseType: 'HK_WAREHOUSE', qty: 2, reserved: 1, cost: 201500, condition: 'A', reorderPoint: 2 },
      // Hermes Birkin
      { productId: 'PROD-005', productName: 'Hermes Birkin 25 Togo', brand: 'Hermes', warehouseType: 'HK_WAREHOUSE', qty: 2, reserved: 0, cost: 160200, condition: 'A', reorderPoint: 1 },
      { productId: 'PROD-005', productName: 'Hermes Birkin 25 Togo', brand: 'Hermes', warehouseType: 'EU_PIPELINE', qty: 1, reserved: 0, cost: 65800, condition: 'A', reorderPoint: 1 },
      // Hermes Kelly
      { productId: 'PROD-006', productName: 'Hermes Kelly 28 Sellier', brand: 'Hermes', warehouseType: 'HK_WAREHOUSE', qty: 3, reserved: 1, cost: 126300, condition: 'A', reorderPoint: 2 },
      // LV Capucines
      { productId: 'PROD-007', productName: 'Louis Vuitton Capucines BB', brand: 'Louis Vuitton', warehouseType: 'HK_WAREHOUSE', qty: 15, reserved: 3, cost: 29300, condition: 'A', reorderPoint: 8 },
      { productId: 'PROD-007', productName: 'Louis Vuitton Capucines BB', brand: 'Louis Vuitton', warehouseType: 'EU_PIPELINE', qty: 20, reserved: 2, cost: 24800, condition: 'A', reorderPoint: 10 },
      { productId: 'PROD-007', productName: 'Louis Vuitton Capucines BB', brand: 'Louis Vuitton', warehouseType: 'SH_BONDED', qty: 12, reserved: 0, cost: 25500, condition: 'A', reorderPoint: 8 },
      // Chanel Flap
      { productId: 'PROD-008', productName: 'Chanel Classic Flap Medium', brand: 'Chanel', warehouseType: 'HK_WAREHOUSE', qty: 5, reserved: 2, cost: 62250, condition: 'A', reorderPoint: 3 },
      { productId: 'PROD-008', productName: 'Chanel Classic Flap Medium', brand: 'Chanel', warehouseType: 'EU_PIPELINE', qty: 3, reserved: 1, cost: 61900, condition: 'A', reorderPoint: 2 },
      // Cartier Love Bracelet
      { productId: 'PROD-009', productName: 'Cartier Love Bracelet', brand: 'Cartier', warehouseType: 'HK_WAREHOUSE', qty: 12, reserved: 2, cost: 39370, condition: 'A', reorderPoint: 6 },
      { productId: 'PROD-009', productName: 'Cartier Love Bracelet', brand: 'Cartier', warehouseType: 'EU_PIPELINE', qty: 18, reserved: 3, cost: 41000, condition: 'A', reorderPoint: 8 },
      // VCA Alhambra
      { productId: 'PROD-010', productName: 'VCA Alhambra Pendant', brand: 'Van Cleef & Arpels', warehouseType: 'HK_WAREHOUSE', qty: 8, reserved: 1, cost: 18300, condition: 'A', reorderPoint: 5 },
      // Tiffany T Wire
      { productId: 'PROD-011', productName: 'Tiffany & Co. T Wire Bracelet', brand: 'Tiffany & Co.', warehouseType: 'HK_WAREHOUSE', qty: 20, reserved: 4, cost: 8235, condition: 'A', reorderPoint: 10 },
      // Bulgari Serpenti
      { productId: 'PROD-012', productName: 'Bulgari Serpenti Viper Necklace', brand: 'Bulgari', warehouseType: 'HK_WAREHOUSE', qty: 2, reserved: 0, cost: 105250, condition: 'A', reorderPoint: 1 },
      // Gucci Belt
      { productId: 'PROD-013', productName: 'Gucci GG Marmont Belt', brand: 'Gucci', warehouseType: 'HK_WAREHOUSE', qty: 40, reserved: 8, cost: 2560, condition: 'A', reorderPoint: 15 },
      { productId: 'PROD-013', productName: 'Gucci GG Marmont Belt', brand: 'Gucci', warehouseType: 'SH_BONDED', qty: 30, reserved: 2, cost: 2650, condition: 'A', reorderPoint: 15 },
      // Prada Re-Edition
      { productId: 'PROD-014', productName: 'Prada Re-Edition 2005 Nylon Bag', brand: 'Prada', warehouseType: 'HK_WAREHOUSE', qty: 18, reserved: 3, cost: 10530, condition: 'A', reorderPoint: 10 },
      { productId: 'PROD-014', productName: 'Prada Re-Edition 2005 Nylon Bag', brand: 'Prada', warehouseType: 'JP_PIPELINE', qty: 25, reserved: 2, cost: 9070, condition: 'A', reorderPoint: 10 },
      // Dior Saddle
      { productId: 'PROD-015', productName: 'Dior Saddle Bag Oblique', brand: 'Dior', warehouseType: 'HK_WAREHOUSE', qty: 10, reserved: 2, cost: 18130, condition: 'A', reorderPoint: 5 }
    ];

  initialStock.forEach(item => {
    const record: InventoryRecord = {
      id: `INV-${item.productId}-${item.warehouseType}`,
      productId: item.productId,
      productName: item.productName,
      brand: item.brand,
      warehouseId: WAREHOUSES[item.warehouseType].id,
      warehouseType: item.warehouseType,
      quantity: item.qty,
      reservedQuantity: item.reserved,
      availableQuantity: item.qty - item.reserved,
      reorderPoint: item.reorderPoint,
      reorderQty: Math.max(item.reorderPoint * 2, 5),
      unitCostCny: item.cost,
      conditionGrade: item.condition,
      authStatus: 'verified',
      updatedAt: new Date().toISOString()
    };
    inventoryRecords.set(record.id, record);
  });
}

// Initialize on import
initializeInventory();

// ============================================================================
// INVENTORY SERVICE CLASS / 库存服务类
// ============================================================================

/**
 * InventoryService class implementing inventory management logic
 */
export class InventoryService {

  /**
   * Get all inventory records
   * @param filters - Optional filters
   * @returns Filtered inventory records
   */
  static getInventory(filters?: {
    productId?: string;
    warehouseType?: WarehouseType;
    lowStockOnly?: boolean;
  }): InventoryRecord[] {
    let records = Array.from(inventoryRecords.values());

    if (filters?.productId) {
      records = records.filter(r => r.productId === filters.productId);
    }

    if (filters?.warehouseType) {
      records = records.filter(r => r.warehouseType === filters.warehouseType);
    }

    if (filters?.lowStockOnly) {
      records = records.filter(r => r.availableQuantity <= r.reorderPoint);
    }

    return records.sort((a, b) => a.productId.localeCompare(b.productId));
  }

  /**
   * Get total available stock across all warehouses for a product
   * @param productId - Product ID
   * @returns Total stock info
   */
  static getTotalStock(productId: string): {
    totalQuantity: number;
    totalAvailable: number;
    totalReserved: number;
    byWarehouse: Array<{
      warehouse: WarehouseType;
      warehouseName: string;
      quantity: number;
      available: number;
      cost: number;
    }>;
  } {
    const records = this.getInventory({ productId });

    const byWarehouse = records.map(r => ({
      warehouse: r.warehouseType,
      warehouseName: WAREHOUSES[r.warehouseType].name,
      quantity: r.quantity,
      available: r.availableQuantity,
      cost: r.unitCostCny
    }));

    return {
      totalQuantity: records.reduce((sum, r) => sum + r.quantity, 0),
      totalAvailable: records.reduce((sum, r) => sum + r.availableQuantity, 0),
      totalReserved: records.reduce((sum, r) => sum + r.reservedQuantity, 0),
      byWarehouse
    };
  }

  /**
   * Check if product is in stock and can fulfill order
   * @param productId - Product ID
   * @param quantity - Required quantity
   * @param preferredWarehouse - Preferred warehouse type
   * @returns Availability result
   */
  static checkAvailability(
    productId: string,
    quantity: number,
    preferredWarehouse?: WarehouseType
  ): {
    available: boolean;
    availableQuantity: number;
    fulfillmentSource: WarehouseType | null;
    message: string;
  } {
    let records = this.getInventory({ productId });

    if (preferredWarehouse) {
      records = records.filter(r => r.warehouseType === preferredWarehouse);
    }

    const totalAvailable = records.reduce((sum, r) => sum + r.availableQuantity, 0);

    if (totalAvailable >= quantity) {
      return {
        available: true,
        availableQuantity: totalAvailable,
        fulfillmentSource: records.find(r => r.availableQuantity >= quantity)?.warehouseType || records[0]?.warehouseType || null,
        message: `${quantity} units available`
      };
    }

    return {
      available: false,
      availableQuantity: totalAvailable,
      fulfillmentSource: null,
      message: `Only ${totalAvailable} units available. Need ${quantity}.`
    };
  }

  /**
   * Reserve inventory for an order
   * @param productId - Product ID
   * @param quantity - Quantity to reserve
   * @param warehouseType - Source warehouse
   * @returns Reservation result
   */
  static reserve(productId: string, quantity: number, warehouseType: WarehouseType): {
    success: boolean;
    error?: string;
  } {
    const records = this.getInventory({ productId, warehouseType });
    const record = records[0];

    if (!record || record.availableQuantity < quantity) {
      return {
        success: false,
        error: `Insufficient stock at ${WAREHOUSES[warehouseType].name}`
      };
    }

    record.reservedQuantity += quantity;
    record.availableQuantity -= quantity;
    record.updatedAt = new Date().toISOString();

    return { success: true };
  }

  /**
   * Release previously reserved inventory stock
   *
   * Called when an order is cancelled or modified to free up reserved
   * inventory quantities. Updates both the reservedQuantity and
   * availableQuantity fields for the matching inventory record.
   *
   * @param productId - The unique product identifier
   * @param quantity - Number of units to release from reservation
   * @param warehouseType - The warehouse location to release from
   *
   * @example
   * InventoryService.releaseReservation('PROD-001', 2, 'HK_WAREHOUSE');
   */
  static releaseReservation(productId: string, quantity: number, warehouseType: WarehouseType): void {
    const records = this.getInventory({ productId, warehouseType });
    const record = records[0];
    if (record) {
      record.reservedQuantity = Math.max(0, record.reservedQuantity - quantity);
      record.availableQuantity += quantity;
      record.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Retrieve all low stock alerts across warehouses
   *
   * Scans all inventory records and generates alerts for products
   * that are at or below their reorder point. Alerts are classified
   * by severity: critical (out of stock), warning (below 50% of reorder
   * point), and info (approaching reorder point).
   *
   * @returns Array of StockAlert objects sorted by severity
   *
   * @example
   * const alerts = InventoryService.getAlerts();
   * alerts.forEach(alert => console.log(`${alert.severity}: ${alert.message}`));
   */
  static getAlerts(): StockAlert[] {
    const records = this.getInventory();
    const alerts: StockAlert[] = [];

    records.forEach(record => {
      if (record.availableQuantity <= record.reorderPoint * 0.5) {
        alerts.push({
          alertId: `ALERT-${record.id}`,
          productId: record.productId,
          productName: record.productName,
          warehouseType: record.warehouseType,
          currentStock: record.availableQuantity,
          reorderPoint: record.reorderPoint,
          severity: record.availableQuantity === 0 ? 'critical' : 'warning',
          message: record.availableQuantity === 0
            ? `${record.productName} is OUT OF STOCK at ${WAREHOUSES[record.warehouseType].name}`
            : `${record.productName} running LOW (${record.availableQuantity}/${record.reorderPoint}) at ${WAREHOUSES[record.warehouseType].name}`
        });
      } else if (record.availableQuantity <= record.reorderPoint) {
        alerts.push({
          alertId: `ALERT-${record.id}`,
          productId: record.productId,
          productName: record.productName,
          warehouseType: record.warehouseType,
          currentStock: record.availableQuantity,
          reorderPoint: record.reorderPoint,
          severity: 'info',
          message: `${record.productName} approaching reorder point (${record.availableQuantity}/${record.reorderPoint})`
        });
      }
    });

    return alerts;
  }

  /**
   * Get warehouse summary
   * @returns Summary of all warehouses
   */
  static getWarehouseSummary(): Array<{
    warehouse: WarehouseType;
    name: string;
    nameCn: string;
    totalItems: number;
    totalValue: number;
    utilization: number;
    location: string;
  }> {
    return Object.values(WAREHOUSES).map(wh => {
      const records = this.getInventory({ warehouseType: wh.type });
      return {
        warehouse: wh.type,
        name: wh.name,
        nameCn: wh.nameCn,
        totalItems: records.reduce((sum, r) => sum + r.quantity, 0),
        totalValue: records.reduce((sum, r) => sum + (r.quantity * r.unitCostCny), 0),
        utilization: wh.utilization,
        location: wh.location
      };
    });
  }
}

// ============================================================================
// EXPORTS / 导出
// ============================================================================

export default {
  WAREHOUSES,
  InventoryService
};
