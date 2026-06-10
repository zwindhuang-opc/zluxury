# ZLuxury Platform - System Architecture Design

## 1. System Overview

### 1.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  Web App (Next.js)  │  Mobile App  │  WeChat Mini Program      │
│  - Responsive UI     │  - React     │  - WeChat SDK             │
│  - PWA Support       │    Native    │  - WXML/WXSS            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  Next.js API Routes                                              │
│  - Authentication Middleware                                     │
│  - Rate Limiting                                                 │
│  - Request Validation                                            │
│  - CORS Handling                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   AI SERVICE  │   │   BUSINESS    │   │    DATA       │
│     LAYER     │   │    LAYER      │   │    LAYER      │
├───────────────┤   ├───────────────┤   ├───────────────┤
│ OpenAI GPT-4  │   │   Product     │   │  PostgreSQL   │
│ Claude API    │   │   Service     │   │    Redis      │
│ Baidu ERNIE   │   │   Order       │   │   MongoDB     │
│ Alibaba Qwen  │   │   Payment      │   │ Elasticsearch │
│ Tencent Hunyuan│  │   Member       │   │   S3/OSS      │
└───────────────┘   │   Marketing    │   └───────────────┘
                    │   Auction       │
                    │   Authentication│
                    └───────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                            │
├─────────────────────────────────────────────────────────────────┤
│  WeChat Open Platform  │  Alipay  │  Cloud Services           │
│  - Payment             │  - Payment │  - AWS/AliCloud           │
│  - Login               │  - Login   │  - CDN                    │
│  - Mini Program        │  - Marketing│  - SMS/Email             │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

| Layer | Technology | Description |
|-------|------------|-------------|
| **Presentation** | Next.js 14.2 | React framework with App Router |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Animation** | Framer Motion | Animation library |
| **State Management** | Zustand | Lightweight state management |
| **API Layer** | Next.js API Routes | Server-side API endpoints |
| **Database** | PostgreSQL | Primary relational database |
| **Cache** | Redis | Session and data caching |
| **Document Store** | MongoDB | Flexible document storage |
| **Search** | Elasticsearch | Full-text search engine |
| **AI Services** | Multi-provider | OpenAI, Anthropic, Baidu, Alibaba |
| **Authentication** | JWT + OAuth 2.0 | Secure authentication |
| **Payments** | WeChat Pay, Alipay | Chinese payment systems |

## 2. AI Service Architecture

### 2.1 AI Service Diagram

```
┌────────────────────────────────────────────────────────────┐
│                    AI SERVICE ORCHESTRATOR                  │
├────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Intent     │  │   Context    │  │   Response   │   │
│  │  Recognition  │→ │   Manager    │→ │  Generator   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  AI Agent 1   │   │  AI Agent 2   │   │  AI Agent 3   │
│   (Hermes)    │   │  (OpenClaw)   │   │  (Unicorn)    │
├───────────────┤   ├───────────────┤   ├───────────────┤
│ Product       │   │ Automation    │   │ Conversational │
│ Recommendation│   │ Engine        │   │ AI            │
│ - Brand       │   │ - Price Check │   │ - Memory      │
│ - Style       │   │ - Order Track │   │ - Emotion     │
│ - Trends      │   │ - Tasks       │   │ - Context     │
└───────────────┘   └───────────────┘   └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
┌────────────────────────────────────────────────────────────┐
│                    AI MODEL PROVIDERS                       │
├────────────────────────────────────────────────────────────┤
│  OpenAI GPT-4 │ Anthropic Claude │ Baidu ERNIE │ Alibaba │
│     Qwen      │ Tencent Hunyuan  │ Local Model │ Custom   │
└────────────────────────────────────────────────────────────┘
```

### 2.2 AI Agent Specifications

#### Hermes Agent (Product Expert)
- **Primary Function**: Luxury product recommendations
- **Knowledge Base**: 
  - 500+ luxury brands
  - 10,000+ product specifications
  - Style matching algorithms
  - Trend analysis data
- **Capabilities**:
  - Natural language product search
  - Style compatibility matching
  - Price trend analysis
  - Availability checking
  - VIP preference learning

#### OpenClaw Agent (Automation Engine)
- **Primary Function**: Task automation and system integration
- **Capabilities**:
  - Price comparison across platforms
  - Order status tracking
  - Inventory management
  - Automated customer notifications
  - Workflow automation
  - Report generation

#### Unicorn Agent (Conversational AI)
- **Primary Function**: Natural conversation and emotional intelligence
- **Capabilities**:
  - Multi-turn dialogue management
  - Emotion recognition and response
  - Personalization engine
  - Memory and context retention
  - Cultural sensitivity (Chinese customs)
  - Casual conversation support

### 2.3 AI Processing Pipeline

```
User Input → Preprocessing → Intent Classification → Agent Routing
    │              │                  │                    │
    ▼              ▼                  ▼                    ▼
 Text/Noice → Translation → NLU Engine → Context Check → Response Generation
                                                   │
                                        ┌──────────┴──────────┐
                                        ▼                     ▼
                               Knowledge Base         AI Model
                                        │                     │
                                        └──────────┬──────────┘
                                                    ▼
                                          Response Formatting
                                                    │
                                                    ▼
                                          User Display + Feedback
```

## 3. Database Architecture

### 3.1 Database Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        POSTGRESQL                               │
│                    (Primary Database)                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Users   │  │ Products │  │  Orders  │  │   VIP    │     │
│  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤     │
│  │ id       │  │ id       │  │ id       │  │ user_id  │     │
│  │ email    │  │ name     │  │ user_id  │  │ level    │     │
│  │ phone    │  │ brand    │  │ total    │  │ points   │     │
│  │ password │  │ price    │  │ status   │  │ benefits │     │
│  │ wechat   │  │ category │  │ items    │  │ expire   │     │
│  │ created  │  │ stock    │  │ shipping │  │ updated  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                          REDIS                                  │
│                       (Cache Layer)                              │
├─────────────────────────────────────────────────────────────────┤
│  Sessions │ Product Cache │ Rate Limits │ Leaderboard │ Queue  │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                         MONGODB                                 │
│                     (Document Store)                             │
├─────────────────────────────────────────────────────────────────┤
│  Chat History │ Product Reviews │ Search Logs │ Audit Logs     │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Data Models

#### User Model
```typescript
interface User {
  id: string;
  email: string;
  phone: string;
  password: string; // Hashed
  wechatOpenId?: string;
  nickname: string;
  avatar?: string;
  vipLevel: 'standard' | 'silver' | 'gold' | 'black' | 'diamond';
  vipPoints: number;
  preferences: {
    language: 'zh-CN' | 'zh-TW' | 'en';
    currency: 'CNY' | 'USD' | 'HKD';
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

#### Product Model
```typescript
interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  vipDiscounts: {
    silver: number;
    gold: number;
    black: number;
    diamond: number;
  };
  authenticity: {
    certified: boolean;
    certificateImages?: string[];
    blockchainHash?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

#### Chat Message Model
```typescript
interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  agentType: 'hermes' | 'openclaw' | 'unicorn';
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachments?: {
    type: 'image' | 'product' | 'link';
    url: string;
  }[];
  metadata: {
    intent?: string;
    confidence?: number;
    processingTime?: number;
    model?: string;
  };
  createdAt: Date;
}
```

## 4. API Architecture

### 4.1 API Structure

```
/api
├── /v1
│   ├── /auth
│   │   ├── POST /login           # User login
│   │   ├── POST /register         # User registration
│   │   ├── POST /logout           # User logout
│   │   ├── POST /refresh          # Refresh token
│   │   └── POST /wechat           # WeChat login
│   │
│   ├── /products
│   │   ├── GET /                  # List products
│   │   ├── GET /:id               # Get product details
│   │   ├── POST /                 # Create product (admin)
│   │   ├── PUT /:id               # Update product (admin)
│   │   └── DELETE /:id            # Delete product (admin)
│   │
│   ├── /ai
│   │   ├── POST /chat             # Send message to AI
│   │   ├── GET /agents            # List AI agents
│   │   ├── GET /history           # Get chat history
│   │   └── POST /feedback         # Submit feedback
│   │
│   ├── /orders
│   │   ├── GET /                  # List user orders
│   │   ├── GET /:id               # Get order details
│   │   ├── POST /                 # Create order
│   │   ├── PUT /:id/status         # Update order status
│   │   └── POST /:id/cancel        # Cancel order
│   │
│   ├── /payments
│   │   ├── POST /create           # Create payment
│   │   ├── POST /wechat/callback  # WeChat callback
│   │   ├── POST /alipay/callback  # Alipay callback
│   │   └── GET /status/:id        # Get payment status
│   │
│   ├── /vip
│   │   ├── GET /status            # Get VIP status
│   │   ├── GET /benefits          # Get VIP benefits
│   │   ├── POST /upgrade          # Upgrade VIP level
│   │   └── GET /points            # Get VIP points
│   │
│   ├── /auctions
│   │   ├── GET /                  # List auctions
│   │   ├── GET /:id               # Get auction details
│   │   ├── POST /bid              # Place bid
│   │   └── GET /my-bids           # Get user's bids
│   │
│   └── /search
│       ├── GET /                  # Search products
│       ├── GET /suggestions        # Get search suggestions
│       └── GET /trending           # Get trending searches
│
└── /internal
    ├── /admin                     # Admin APIs
    ├── /webhook                   # Webhook handlers
    └── /analytics                 # Analytics APIs
```

### 4.2 API Response Format

```typescript
// Success Response
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2026-06-08T12:00:00.000Z",
    "requestId": "uuid",
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-06-08T12:00:00.000Z",
    "requestId": "uuid"
  }
}
```

## 5. Security Architecture

### 5.1 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL THREATS                             │
│         (DDoS, SQL Injection, XSS, CSRF, etc.)                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY MIDDLEWARE                          │
├─────────────────────────────────────────────────────────────────┤
│  • Rate Limiting (Redis-based)                                   │
│  • CORS Configuration                                           │
│  • Helmet.js (Security Headers)                                 │
│  • Request Validation (Zod)                                     │
│  • CSRF Protection                                               │
│  • XSS Sanitization                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  • JWT Token Validation                                          │
│  • OAuth 2.0 Flow                                                │
│  • WeChat Authentication                                         │
│  • Multi-Factor Authentication                                   │
│  • Session Management                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHORIZATION LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  • Role-Based Access Control (RBAC)                             │
│  • Resource Permissions                                          │
│  • VIP Tier Access                                               │
│  • API Key Management                                            │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOGIN FLOW                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User ──► Email/Password ──► Hash & Verify ──► Generate JWT      │
│                         │                                        │
│                         ▼                                        │
│                  WeChat Login ──► OAuth 2.0 ──► Generate JWT     │
│                         │                                        │
│                         ▼                                        │
│                  Phone OTP ──► Verify OTP ──► Generate JWT       │
│                         │                                        │
│                         ▼                                        │
│                    Return Tokens                                 │
│                  (Access + Refresh)                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 6. Deployment Architecture

### 6.1 Production Deployment

```
┌─────────────────────────────────────────────────────────────────┐
│                        CDN LAYER                                 │
│               (Global Content Delivery)                          │
├─────────────────────────────────────────────────────────────────┤
│  Static Assets │ Images │ Videos │ Fonts │ CSS/JS               │
│  - Cloudflare/AWS CloudFront                                     │
│  - 200+ Edge Locations                                          │
│  - 99.99% Uptime SLA                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LOAD BALANCER                                │
├─────────────────────────────────────────────────────────────────┤
│  AWS ALB / Azure Load Balancer                                   │
│  - Health Checks                                                 │
│  - SSL Termination                                               │
│  - Geographic Routing                                             │
│  - DDoS Protection                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   Server 1    │   │   Server 2    │   │   Server 3    │
│  (Primary)    │   │  (Secondary)  │   │  (Secondary)  │
├───────────────┤   ├───────────────┤   ├───────────────┤
│ Next.js App   │   │ Next.js App   │   │ Next.js App   │
│ - PM2 Cluster │   │ - PM2 Cluster │   │ - PM2 Cluster │
│ - Auto-scaling│   │ - Auto-scaling│   │ - Auto-scaling│
└───────────────┘   └───────────────┘   └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE CLUSTER                             │
├─────────────────────────────────────────────────────────────────┤
│  Primary DB ◄─────► Replica DB ◄─────► Replica DB               │
│  (Write)          (Read)           (Read)                       │
│                                                                   │
│  Redis Cluster                                                  │
│  - Session Cache                                                 │
│  - Rate Limiting                                                 │
│  - Message Queue                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Monitoring & Logging

```
┌─────────────────────────────────────────────────────────────────┐
│                    MONITORING STACK                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Prometheus │  │    Grafana   │  │    ELK       │           │
│  │  (Metrics)   │  │  (Dashboards)│  │  (Logging)   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │    Sentry    │  │   PagerDuty  │  │   DataDog    │           │
│  │ (Error Track)│  │  (Alerting)  │  │ (APM)        │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 7. Performance Optimization

### 7.1 Caching Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    CACHING LAYERS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Browser Cache                                                    │
│  - Static assets: 1 year                                          │
│  - API responses: 5 minutes                                       │
│  - Service Worker: Offline support                                │
│                              │                                    │
│                              ▼                                    │
│  CDN Edge Cache                                                   │
│  - Images: Optimized + WebP/AVIF                                  │
│  - API: Edge functions                                            │
│  - Static: Aggressive caching                                     │
│                              │                                    │
│                              ▼                                    │
│  Redis Cache                                                      │
│  - Product catalog: 10 minutes                                    │
│  - User session: 24 hours                                         │
│  - Search results: 5 minutes                                      │
│  - Rate limits: Real-time                                        │
│                              │                                    │
│                              ▼                                    │
│  Database Cache                                                   │
│  - Query results: Connection pooling                             │
│  - Prepared statements                                            │
│  - Index optimization                                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Page Load Time | < 2s | < 3s |
| API Response | < 200ms | < 300ms |
| Time to First Byte | < 500ms | < 800ms |
| Lighthouse Score | > 90 | 85 |
| Core Web Vitals | Pass | Pass |
| Uptime | 99.9% | 99.5% |

## 8. Disaster Recovery

### 8.1 Backup Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    BACKUP ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Real-time Replication                                            │
│  Primary DB ◄═════════════════════════► Replica DB               │
│       │                                    │                     │
│       │         Async Replication          │                     │
│       └────────────────┬───────────────────┘                     │
│                        ▼                                         │
│                   S3/OSS Bucket                                  │
│                   (Cross-region)                                 │
│                                                                   │
│  Backup Schedule:                                                │
│  - Full backup: Daily at 2:00 AM                                  │
│  - Incremental: Every 6 hours                                    │
│  - Logs: Real-time streaming                                     │
│  - Retention: 30 days                                            │
│                                                                   │
│  Recovery Time Objective (RTO): < 1 hour                         │
│  Recovery Point Objective (RPO): < 1 hour                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 9. Future Enhancements

### Phase 2 (V2.0.0)
- [ ] Blockchain-based product authentication
- [ ] AR/VR product visualization
- [ ] Voice commerce integration
- [ ] Advanced AI agents with emotional intelligence

### Phase 3 (V3.0.0)
- [ ] Open platform for third-party sellers
- [ ] Physical store integration
- [ ] Global expansion
- [ ] White-label solution

---

**Document Version**: 1.0  
**Last Updated**: 2026-06-08  
**Author**: ZLuxury Architecture Team