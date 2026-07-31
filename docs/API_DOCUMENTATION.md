# ZLuxury API Documentation V2.0

## Overview / 概述

RESTful API for ZLuxury cross-border luxury e-commerce platform.
Base URL: `http://localhost:19000/api`

**Authentication:** Bearer Token (JWT) - *Coming in Sprint 1*
**Rate Limit:** 100 requests/minute per IP
**Response Format:** JSON
**Character Set:** UTF-8

---

## Standard Response Format / 标准响应格式

### Success Response (200)
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2025-06-13T10:30:00.000Z"
}
```

### Error Response (4xx/5xx)
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  },
  "timestamp": "2025-06-13T10:30:00.000Z"
}
```

---

## Endpoints / 端点

### 1. Products API / 产品API

#### Get All Products
```
GET /api/products
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number (1-based) |
| limit | integer | 12 | Items per page (max: 50) |
| category | string | - | Filter by category (watches, jewelry, bags, etc.) |
| sort | string | 'newest' | Sort order: newest, price_asc, price_desc, popular |
| brand | string | - | Filter by brand name |

**Response Example:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "PROD-001",
        "name": "Rolex Submariner Date",
        "brand": "Rolex",
        "brandCn": "劳力士",
        "category": "Watches",
        "price": 12500,
        "priceCny": 90000,
        "currency": "USD",
        "rating": 4.9,
        "reviews": 342,
        "imageUrl": "https://...",
        "isNew": true,
        "isLimited": true,
        "stock": 3,
        "specifications": {
          "Movement": "Automatic",
          "Case Size": "41mm",
          "Water Resistance": "300m"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 15,
      "totalPages": 2
    }
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid query parameters
- `500` - Server error

---

#### Get Product by ID
```
GET /api/products/:id
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Product ID (e.g., PROD-001) |

**Response:** Single product object with full details including:
- Complete specifications
- Pricing breakdown (base price + taxes)
- Sourcing recommendations
- VIP tier pricing
- Related products

---

#### Search Products
```
GET /api/products/search
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | No* | Search query (if omitted, returns all) |
| category | string | No | Category filter |
| brand | string | No | Brand filter |
| minPrice | number | No | Minimum price (CNY) |
| maxPrice | number | No | Maximum price (CNY) |
| limit | number | No | Max results (default: 20) |
| isNew | boolean | No | Only new arrivals |
| isLimited | boolean | No | Only limited editions |

**Example Request:**
```
GET /api/products/search?q=rolex&category=watches&minPrice=50000&maxPrice=150000&limit=10
```

---

### 2. Categories API / 分类API

#### Get All Categories
```
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "watches",
      "name": "Watches",
      "nameCn": "腕表",
      "icon": "⌚",
      "description": "Luxury timepieces from world-renowned watchmakers",
      "brands": ["Rolex", "Patek Philippe", "Audemars Piguet"],
      "productCount": 4,
      "featured": true
    },
    // ... more categories
  ]
}
```

---

### 3. Pricing API / 定价API

#### Get Product Pricing
```
POST /api/pricing
```

**Request Body:**
```json
{
  "productId": "PROD-001",
  "quantity": 1,
  "vipTier": "gold",
  "sourcingChannel": "HK_DIRECT"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "productId": "PROD-001",
    "productName": "Rolex Submariner Date",
    "pricing": {
      "basePriceUsd": 12500.00,
      "exchangeRate": 7.24,
      "basePriceCny": 90500.00,
      "importDutyRate": 0.20,
      "importDutyAmount": 18100.00,
      "vatRate": 0.13,
      "vatAmount": 14118.00,
      "consumptionTaxRate": 0.20,
      "consumptionTaxAmount": 22524.00,
      "totalCostCny": 145242.00,
      "marginRate": 0.25,
      "sellingPriceCny": 181552.50,
      "formattedPrice": "¥181,553"
    },
    "savings": {
      "retailPriceCny": 220000.00,
      "savingsAmount": 38447.50,
      "savingsPercent": 17
    },
    "vipDiscount": {
      "tier": "gold",
      "discountPercent": 0.15,
      "discountedPrice": 154319.63
    },
    "sourcing": {
      "recommendedChannel": "HK_DIRECT",
      "channelName": "Hong Kong Direct Import",
      "estimatedDelivery": "5-7 business days",
      "reliabilityScore": 95
    }
  }
}
```

---

### 4. Sourcing API / 采购渠道API

#### Get Sourcing Recommendations
```
POST /api/sourcing
```

**Request Body:**
```json
{
  "productId": "PROD-001",
  "destinationCountry": "CN",
  "customerType": "individual"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "channels": [
      {
        "type": "HK_DIRECT",
        "name": "Hong Kong Direct",
        "nameCn": "香港直邮",
        "advantages": [
          "No import duty under HK$5000 threshold",
          "Fast delivery (3-5 days)",
          "Authenticity guaranteed"
        ],
        "costBreakdown": {
          "productCost": 90500,
          "shipping": 500,
          "insurance": 200,
          "handlingFee": 300,
          "total": 91500
        },
        "deliveryTime": "3-5 business days",
        "riskLevel": "Low",
        "profitMargin": "18%",
        "recommendationScore": 95
      },
      // ... other channels (JAPAN_AUCTION, EUROPE_BOUTIQUE, etc.)
    ],
    "bestChannel": "HK_DIRECT",
    "analysis": {
      "optimalStrategy": "Split order between HK and Japan for best margin",
      "totalEstimatedProfit": "¥45,000"
    }
  }
}
```

**Sourcing Channel Types:**
| Channel | Code | Best For | Delivery Time | Risk Level |
|---------|------|----------|---------------|------------|
| Hong Kong Direct | HK_DIRECT | Watches, Jewelry | 3-5 days | Low |
| Japan Auction | JAPAN_AUCTION | Rare pieces, Vintage | 7-14 days | Medium |
| Europe Boutique | EUROPE_BOUTIQUE | Fashion, Bags | 7-10 days | Low |
| Bonded Warehouse | BONDED_WAREHOUSE | High-volume items | 2-3 days | Very Low |
| Personal Carry | PERSONAL_CARRY | Ultra-rare items | Variable | Medium |

---

### 5. Shipping API / 物流API

#### Get Shipping Quote
```
POST /api/shipping
```

**Request Body:**
```json
{
  "products": ["PROD-001", "PROD-005"],
  "destination": {
    "country": "CN",
    "city": "Shanghai",
    "postalCode": "200000"
  },
  "shippingMethod": "express"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "quotes": [
      {
        "carrier": "DHL Express",
        "method": "International Priority",
        "costCny": 850.00,
        "deliveryTime": "2-3 business days",
        "tracking": true,
        "insuranceIncluded": true,
        "customsHandling": true
      },
      {
        "carrier": "SF Express",
        "method": "Cross-border Express",
        "costCny": 450.00,
        "deliveryTime": "5-7 business days",
        "tracking": true,
        "insuranceIncluded": false,
        "customsHandling": true
      }
    ],
    "recommended": "SF Express",
    "freeShippingThreshold": 100000,
    "orderTotal": 276105,
    "eligibleForFreeShipping": true
  }
}
```

---

### 6. Orders API / 订单API

#### Create Order
```
POST /api/orders
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "PROD-001",
      "quantity": 1,
      "sourcingChannel": "HK_DIRECT"
    }
  ],
  "shippingAddress": {
    "recipientName": "张三",
    "phone": "+8613800138000",
    "address": "上海市浦东新区陆家嘴环路1000号",
    "city": "上海",
    "province": "上海",
    "postalCode": "200120",
    "country": "CN"
  },
  "paymentMethod": "alipay",
  "vipTier": "gold",
  "specialInstructions": "Please call before delivery"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-20250613-001",
    "status": "pending_payment",
    "items": [...],
    "subtotal": 154319.63,
    "shipping": 0,
    "tax": 0,
    "total": 154319.63,
    "formattedTotal": "¥154,320",
    "paymentUrl": "https://alipay.com/pay/...",
    "estimatedDelivery": "2025-06-20",
    "createdAt": "2025-06-13T10:30:00.000Z"
  }
}
```

**Order Status Flow:**
```
pending_payment → paid → processing → sourcing → shipping → delivered → completed
                              ↘ cancelled
```

---

### 7. Inventory API / 库存API

#### Check Stock Level
```
GET /api/inventory?productId=PROD-001
```

**Response:**
```json
{
  "success": true,
  "data": {
    "productId": "PROD-001",
    "productName": "Rolex Submariner Date",
    "stock": {
      "total": 3,
      "available": 2,
      "reserved": 1
    },
    "warehouses": [
      {
        "location": "HONG_KONG",
        "quantity": 2,
        "status": "available"
      },
      {
        "location": "SHANGHAI_FTZ",
        "quantity": 1,
        "status": "bonded"
      }
    },
    "lowStockAlert": true,
    "restockDate": null,
    "lastUpdated": "2025-06-13T09:00:00.000Z"
  }
}
```

---

### 8. Cart API / 购物车API

#### Get Cart Contents
```
GET /api/cart
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": "PROD-001",
        "name": "Rolex Submariner Date",
        "quantity": 1,
        "unitPrice": 154319.63,
        "totalPrice": 154319.63,
        "imageUrl": "https://..."
      }
    ],
    "summary": {
      "itemCount": 1,
      "subtotal": 154319.63,
      "shipping": 0,
      "tax": 0,
      "total": 154319.63,
      "currency": "CNY"
    }
  }
}
```

---

### 9. AI Assistant API / AI助手API

#### Chat with AI
```
POST /api/ai/chat
```

**Request Body:**
```json
{
  "message": "I'm looking for a dress watch under ¥100,000",
  "agent": "hermes",
  "context": {
    "userId": "user-123",
    "browseHistory": ["/watches", "/product/PROD-002"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reply": "Based on your budget of ¥100,000, I'd recommend considering these elegant dress watches:\n\n1. **Cartier Tank Must** (约 ¥68,000) - Classic rectangular design, perfect for formal occasions\n\n2. **Omega De Ville Prestige** (约 ¥45,000) - Sophisticated with excellent value\n\nWould you like me to show you detailed specifications for either of these?",
    "agent": "hermes",
    "suggestions": [
      {"action": "view_product", "productId": "PROD-009"},
      {"action": "view_product", "productId": "PROD-003"}
    ],
    "confidence": 0.92
  }
}
```

---

## Error Codes / 错误代码

| Code | HTTP Status | Description |
|------|------------|-------------|
| `PRODUCT_NOT_FOUND` | 404 | Product ID does not exist |
| `INSUFFICIENT_STOCK` | 409 | Not enough inventory |
| `INVALID_PRICE` | 400 | Price calculation error |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `RATE_LIMITED` | 429 | Too many requests |
| `PAYMENT_FAILED` | 402 | Payment processing error |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Rate Limiting / 速率限制

All API endpoints are subject to rate limiting:

| Tier | Requests/minute | Applies To |
|------|----------------|------------|
| Anonymous | 100 | Unauthenticated users |
| Registered | 300 | Authenticated users |
| VIP | 600 | Gold+ members |
| Admin | 1000 | Admin accounts |

**Headers returned:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1623567890
```

---

## Webhooks / 回调通知

### Payment Status Updates
```
POST /webhooks/payment
```

**Event Types:**
- `payment.successful`
- `payment.failed`
- `payment.refunded`

### Order Status Changes
```
POST /webhooks/orders
```

**Event Types:**
- `order.created`
- `order.paid`
- `order.shipped`
- `order.delivered`
- `order.cancelled`

---

## SDK & Libraries / 开发工具包

### JavaScript/TypeScript
```typescript
import { ZLuxuryClient } from '@zluxury/sdk';

const client = new ZLuxuryClient({
  baseUrl: 'https://api.zluxury.com',
  apiKey: 'your-api-key'
});

// Search products
const products = await client.products.search({
  category: 'watches',
  minPrice: 50000,
  maxPrice: 150000
});

// Create order
const order = await client.orders.create({
  items: [{ productId: 'PROD-001', quantity: 1 }],
  shippingAddress: { /* ... */ },
  paymentMethod: 'alipay'
});
```

---

## Changelog / 更新日志

### V2.0.0 (2025-06-13)
- ✅ Added pricing engine with tax calculation
- ✅ Added multi-channel sourcing recommendations
- ✅ Added shipping quote integration
- ✅ Enhanced product search with filters
- ✅ Added AI assistant endpoints
- ✅ Improved error handling and validation
- ✅ Added structured response format

### V1.0.0 (2024-06-07)
- Initial release
- Basic CRUD operations
- Simple product catalog

---

*Last Updated: 2025-06-13*
*API Version: 2.0.0*
*Base URL: http://localhost:19000/api*
