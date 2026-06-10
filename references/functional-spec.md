# ZLuxury Platform - Functional Specifications

## 1. 系统概述 (System Overview)

### 1.1 项目简介

ZLuxury 是一个专业的高端奢品在线交易平台，集成了人工智能驱动的智能客服系统。平台为追求品质生活的中国高端用户提供服务，整合了爱马仕(Hermès)、香奈儿(Chanel)、路易威登(Louis Vuitton)等国际顶级奢侈品牌商品。

### 1.2 核心功能模块

| 模块 | 功能描述 | 优先级 |
|------|----------|--------|
| 智能AI客服 | 多AI智能体协同工作 | P0 |
| 商品展示 | 高端奢品展示与搜索 | P0 |
| 用户系统 | 注册、登录、VIP体系 | P0 |
| 购物车 | 购物车管理与VIP折扣 | P0 |
| 订单系统 | 订单创建、支付、跟踪 | P1 |
| 拍卖系统 | 奢品在线拍卖 | P1 |
| 鉴定服务 | AI辅助奢品鉴定 | P2 |

## 2. 智能AI客服系统 (AI Customer Service System)

### 2.1 功能描述

智能AI客服系统是平台的核心功能，提供7×24小时全天候客户服务。系统由三个专业AI智能体组成，每个智能体专注于不同的服务领域。

#### 2.1.1 AI智能体规格

| 智能体 | 名称 | 定位 | 核心能力 |
|--------|------|------|----------|
| Hermes | 爱马仕顾问 | 奢品推荐专家 | 品牌知识、搭配建议、趋势分析、VIP服务 |
| OpenClaw | 智能助理 | 自动化引擎 | 价格对比、库存查询、订单跟踪、任务执行 |
| Unicorn | 智慧对话 | 情感智能 | 自然对话、情感理解、上下文记忆、个性化响应 |

#### 2.1.2 功能特性

**对话功能：**
- 多轮对话管理
- 上下文记忆（最近20轮对话）
- 意图识别与分类
- 实体提取（品牌、商品、价格等）
- 情感分析（正面/中性/负面）
- 实时翻译（中/英/粤）

**智能推荐：**
- 基于浏览历史的推荐
- 基于购买记录的推荐
- 基于对话上下文的推荐
- 相似商品推荐
- 新品推荐
- VIP专属推荐

**自动化功能：**
- 价格查询与比较
- 库存状态查询
- 订单状态查询
- 物流信息跟踪
- 支付状态确认
- 预约提醒设置

### 2.2 用户交互流程

```
用户点击聊天图标
        ↓
显示聊天窗口
        ↓
选择AI智能体（Hermes/OpenClaw/Unicorn）
        ↓
输入问题或选择快捷操作
        ↓
AI智能体分析问题
        ↓
生成并返回响应
        ↓
用户评价回复（👍/👎）
        ↓
继续对话或结束
```

### 2.3 数据模型

#### ChatSession（聊天会话）
```typescript
interface ChatSession {
  id: string;                    // 会话ID (UUID)
  userId: string;                // 用户ID
  agentType: AgentType;          // 智能体类型
  status: 'active' | 'closed';   // 会话状态
  startedAt: Date;              // 开始时间
  endedAt?: Date;               // 结束时间
  messageCount: number;          // 消息数量
  rating?: 'positive' | 'negative'; // 评价
  language: 'zh' | 'en';        // 使用语言
  metadata: {
    device: string;             // 设备类型
    browser: string;            // 浏览器
    source: string;            // 来源页面
  };
}
```

#### ChatMessage（聊天消息）
```typescript
interface ChatMessage {
  id: string;                    // 消息ID (UUID)
  sessionId: string;            // 会话ID
  role: 'user' | 'assistant' | 'system'; // 角色
  content: string;              // 消息内容
  agentType?: AgentType;        // 智能体类型
  timestamp: Date;              // 时间戳
  attachments?: Attachment[];   // 附件
  metadata: {
    intent?: string;            // 识别的意图
    confidence?: number;       // 置信度
    processingTime?: number;   // 处理时间(ms)
    model?: string;            // 使用的AI模型
    tokens?: number;           // 消耗的token数
  };
  translations?: {
    zh: string;
    en: string;
  };
  rating?: 'helpful' | 'not_helpful';
}
```

#### AIKnowledgeBase（知识库）
```typescript
interface AIKnowledgeBase {
  id: string;
  category: 'brand' | 'product' | 'policy' | 'faq';
  question: string;
  answer: string;
  keywords: string[];
  language: 'zh' | 'en' | 'both';
  agentType: AgentType;        // 主要服务智能体
  confidence: number;          // 匹配置信度阈值
  usageCount: number;          // 使用次数
  lastUsed: Date;              // 最后使用时间
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.4 API接口规范

#### 发送消息
```
POST /api/ai/chat
```

**请求体：**
```json
{
  "message": "我想买一个手表",
  "agentType": "hermes",
  "sessionId": "sess_abc123",
  "context": {
    "userId": "user_123",
    "vipLevel": "gold",
    "recentProducts": ["prod_001", "prod_002"],
    "language": "zh"
  }
}
```

**响应体：**
```json
{
  "success": true,
  "data": {
    "messageId": "msg_xyz789",
    "content": "根据您的需求，我为您推荐以下手表...",
    "agentType": "hermes",
    "intent": "product_recommendation",
    "confidence": 0.95,
    "attachments": [
      {
        "type": "product",
        "data": {
          "id": "prod_001",
          "name": "劳力士潜航者",
          "price": 85000
        }
      }
    ],
    "suggestions": [
      "查看更多手表",
      "联系人工客服",
      "预约到店体验"
    ]
  },
  "meta": {
    "processingTime": 1234,
    "tokens": 256,
    "model": "gpt-4"
  }
}
```

#### 获取聊天历史
```
GET /api/ai/history?sessionId=sess_abc123&limit=20&offset=0
```

#### 评价消息
```
POST /api/ai/feedback
```

### 2.5 性能指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 响应时间 | < 3秒 | 从发送到显示的时间 |
| 意图识别准确率 | > 90% | 正确识别用户意图的比例 |
| 问题解决率 | > 85% | AI能直接解决的比例 |
| 用户满意度 | > 95% | 好评占所有评价的比例 |
| 可用性 | 99.9% | 系统正常运行时间 |

## 3. 商品管理系统 (Product Management System)

### 3.1 功能描述

商品管理系统负责奢品的展示、搜索、分类和推荐。系统支持多语言、多货币、VIP折扣等特性。

### 3.2 商品分类

| 一级分类 | 二级分类 | 示例品牌 |
|----------|----------|----------|
| 腕表 | 机械表、石英表、智能表 | 劳力士、百达翡丽、欧米茄 |
| 珠宝 | 戒指、项链、耳环、手镯 | 卡地亚、蒂芙尼、宝格丽 |
| 箱包 | 手袋、钱包、背包、旅行箱 | 爱马仕、LV、香奈儿 |
| 时装 | 男女装、配饰、鞋履 | 古驰、普拉达、迪奥 |
| 艺术品 | 画作、雕塑、限量版 | 拍卖行、艺术馆 |
| 收藏品 | 邮票、钱币、古董 | 苏富比、佳士得 |

### 3.3 数据模型

#### Product（商品）
```typescript
interface Product {
  id: string;
  name: string;
  nameEn: string;                    // 英文名称
  brand: string;
  brandEn: string;
  category: string;
  subcategory?: string;
  description: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;            // 原价（用于显示折扣）
  currency: 'CNY' | 'USD' | 'EUR';
  images: ProductImage[];
  video?: string;
  specifications: Record<string, string>;
  stock: number;
  soldCount: number;
  rating: number;                    // 4.5
  reviewCount: number;
  tags: string[];
  
  // VIP折扣
  vipDiscounts: {
    silver: number;                  // 0.95
    gold: number;                    // 0.90
    black: number;                   // 0.85
    diamond: number;                 // 0.80
  };
  
  // 鉴定信息
  authentication: {
    certified: boolean;
    certificateNumber?: string;
    certificateImages?: string[];
    blockchainHash?: string;
    verifiedAt?: Date;
  };
  
  // 状态
  status: 'active' | 'inactive' | 'out_of_stock' | 'pending';
  isFeatured: boolean;
  isNewArrival: boolean;
  isLimitedEdition: boolean;
  
  // 时间戳
  createdAt: Date;
  updatedAt: Date;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}
```

### 3.4 API接口

#### 获取商品列表
```
GET /api/products
```

**查询参数：**
```
?category=腕表
&brand=劳力士
&minPrice=50000
&maxPrice=200000
&sort=price_asc|price_desc|newest|popular
&page=1
&limit=20
&featured=true
&newArrival=true
```

#### 获取商品详情
```
GET /api/products/:id
```

#### 搜索商品
```
GET /api/search
?q=劳力士手表
&filters=category,brand,price
&suggestions=true
```

## 4. 用户与会员系统 (User & VIP System)

### 4.1 功能描述

用户系统提供注册、登录、个人资料管理等功能。VIP会员体系为不同等级的用户提供差异化服务和专属权益。

### 4.2 会员等级

| 等级 | 英文名 | 准入条件 | 折扣 | 专属权益 |
|------|--------|----------|------|----------|
| 普通会员 | Standard | 注册即享 | 无 | 基础购物、积分累计 |
| 银卡会员 | Silver | 累计消费5万 | 9.5折 | 专属客服、优先发货 |
| 金卡会员 | Gold | 累计消费20万 | 9折 | 新品预览、专属顾问 |
| 黑卡会员 | Black | 累计消费100万 | 8.5折 | 定制服务、全球联保 |
| 钻石会员 | Diamond | 受邀加入 | 专定价 | 全面定制、专属活动 |

### 4.3 数据模型

#### User（用户）
```typescript
interface User {
  id: string;
  email: string;
  phone: string;
  passwordHash: string;
  
  // 第三方登录
  wechatOpenId?: string;
  appleId?: string;
  
  // 基本信息
  nickname: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'other';
  birthday?: Date;
  
  // VIP信息
  vipLevel: VIPLevel;
  vipPoints: number;
  totalSpent: number;
  vipExpireDate?: Date;
  
  // 偏好设置
  preferences: {
    language: 'zh-CN' | 'zh-TW' | 'en';
    currency: 'CNY' | 'USD' | 'EUR';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      wechat: boolean;
    };
    favoriteCategories: string[];
  };
  
  // 地址管理
  addresses: Address[];
  defaultAddressId?: string;
  
  // 状态
  status: 'active' | 'inactive' | 'banned';
  emailVerified: boolean;
  phoneVerified: boolean;
  
  // 时间戳
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
}

interface Address {
  id: string;
  label: string;                    // 标签：家、公司等
  recipient: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  street: string;
  postalCode: string;
  isDefault: boolean;
}
```

### 4.4 认证流程

#### 手机号登录
```
1. 用户输入手机号
2. 系统发送验证码
3. 用户输入验证码
4. 系统验证并创建会话
5. 返回JWT Token
```

#### 微信登录
```
1. 用户点击微信登录
2. 跳转微信授权页面
3. 用户授权
4. 回调获取OpenId
5. 绑定或创建账户
6. 返回JWT Token
```

## 5. 购物车系统 (Shopping Cart System)

### 5.1 功能描述

购物车系统支持商品添加、数量修改、VIP折扣计算等功能。

### 5.2 数据模型

#### CartItem（购物车商品）
```typescript
interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  addedAt: Date;
  notes?: string;                  // 用户备注
}
```

#### Cart（购物车）
```typescript
interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;                // 小计（原价格）
  discount: number;                // VIP折扣金额
  total: number;                   // 最终价格
  vipLevel: VIPLevel;
  calculatedAt: Date;              // 最后计算时间
}
```

### 5.3 VIP折扣计算
```typescript
function calculateCartDiscount(cart: Cart, user: User): Cart {
  const vipDiscount = cart.items.reduce((total, item) => {
    const product = getProduct(item.productId);
    const discountRate = product.vipDiscounts[user.vipLevel];
    const itemTotal = product.price * item.quantity;
    return total + (itemTotal * (1 - discountRate));
  }, 0);
  
  return {
    ...cart,
    subtotal: calculateSubtotal(cart.items),
    discount: vipDiscount,
    total: calculateSubtotal(cart.items) - vipDiscount,
    vipLevel: user.vipLevel,
    calculatedAt: new Date()
  };
}
```

## 6. 订单系统 (Order System)

### 6.1 订单流程

```
1. 确认购物车
        ↓
2. 选择收货地址
        ↓
3. 选择支付方式
        ↓
4. 确认订单信息
        ↓
5. 创建订单（待支付）
        ↓
6. 支付订单
        ↓
7. 支付成功（已支付）
        ↓
8. 商家发货（已发货）
        ↓
9. 确认收货（已完成）
        ↓
10. 可评价（已评价）
```

### 6.2 订单状态

| 状态 | 英文 | 说明 |
|------|------|------|
| pending | 待支付 | 订单已创建，等待支付 |
| paid | 已支付 | 支付成功，等待发货 |
| shipped | 已发货 | 商家已发货，等待收货 |
| delivered | 已收货 | 用户已确认收货 |
| completed | 已完成 | 订单完成 |
| cancelled | 已取消 | 订单取消 |
| refunded | 已退款 | 已退款 |

### 6.3 数据模型

#### Order（订单）
```typescript
interface Order {
  id: string;
  orderNumber: string;             // ZL2024060800001
  
  // 用户信息
  userId: string;
  
  // 商品信息
  items: OrderItem[];
  
  // 价格信息
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  paidAmount: number;
  
  // 地址信息
  shippingAddress: Address;
  billingAddress: Address;
  
  // 支付信息
  payment: {
    method: 'wechat' | 'alipay' | 'card' | 'bank';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
    paidAt?: Date;
  };
  
  // 物流信息
  shipping: {
    carrier: string;              // 顺丰、中通等
    trackingNumber?: string;
    shippedAt?: Date;
    deliveredAt?: Date;
  };
  
  // 状态
  status: OrderStatus;
  statusHistory: StatusChange[];
  
  // 发票
  invoice?: {
    type: 'personal' | 'company';
    title?: string;
    taxNumber?: string;
    email?: string;
  };
  
  // 备注
  notes?: string;
  adminNotes?: string;
  
  // 时间戳
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

interface OrderItem {
  id: string;
  productId: string;
  productSnapshot: Product;        // 商品快照（下单时价格）
  quantity: number;
  unitPrice: number;
  total: number;
  vipDiscount: number;
  status: 'pending' | 'shipped' | 'delivered';
}
```

## 7. 支付系统 (Payment System)

### 7.1 支持的支付方式

| 支付方式 | 代码 | 说明 | 手续费 |
|----------|------|------|--------|
| 微信支付 | wechat | 微信APP/小程序/H5 | 0.6% |
| 支付宝 | alipay | 支付宝APP/H5 | 0.6% |
| 银联支付 | unionpay | 银行卡支付 | 0.7% |
| PayPal | paypal | 国际支付 | 3.5% |
| 银行转账 | bank | 线下转账 | 免费 |

### 7.2 支付流程

#### 微信支付
```
1. 创建支付订单
        ↓
2. 调用微信支付API
        ↓
3. 返回支付二维码/跳转链接
        ↓
4. 用户支付
        ↓
5. 微信异步回调
        ↓
6. 更新订单状态
        ↓
7. 发送通知
```

## 8. API通用规范

### 8.1 认证方式

所有需要认证的API都需要在Header中携带Token：
```
Authorization: Bearer <jwt_token>
```

### 8.2 请求格式

```typescript
// 请求头
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>",
  "X-Language": "zh-CN",
  "X-Request-Id": "uuid"
}
```

### 8.3 响应格式

```typescript
// 成功响应
{
  "success": true,
  "data": T,
  "meta": {
    "timestamp": string,
    "requestId": string,
    "pagination?: {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number
    }
  }
}

// 错误响应
{
  "success": false,
  "error": {
    "code": string,
    "message": string,
    "details": Array<{
      "field": string,
      "message": string
    }>
  },
  "meta": {
    "timestamp": string,
    "requestId": string
  }
}
```

### 8.4 错误码

| 错误码 | 说明 |
|--------|------|
| VALIDATION_ERROR | 参数验证失败 |
| AUTH_REQUIRED | 需要登录 |
| AUTH_INVALID | 认证信息无效 |
| PERMISSION_DENIED | 权限不足 |
| NOT_FOUND | 资源不存在 |
| CONFLICT | 资源冲突 |
| RATE_LIMITED | 请求过于频繁 |
| INTERNAL_ERROR | 服务器内部错误 |

## 9. 非功能性需求

### 9.1 性能指标

| 指标 | 目标值 |
|------|--------|
| 页面加载时间 | < 3秒 |
| API响应时间 | < 200ms |
| 并发用户数 | > 10,000 |
| 系统可用性 | > 99.9% |
| 数据库QPS | > 5,000 |

### 9.2 安全要求

- 所有数据传输使用HTTPS
- 敏感数据加密存储
- JWT Token有效期2小时
- Refresh Token有效期7天
- 密码强度要求：8位以上，包含大小写字母和数字
- 支付密码二次验证
- 异常登录检测与告警

### 9.3 兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Android Chrome 90+
- 微信内置浏览器 8.0+

---

**文档版本**: 1.0  
**最后更新**: 2026-06-08  
**作者**: ZLuxury技术团队  
**审核状态**: 已完成