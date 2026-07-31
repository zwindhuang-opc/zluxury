# ZLuxury — Master Project Plan

**Document Version:** 1.0.0
**Last Updated:** 2026-07-31
**Status:** Active
**Classification:** Internal

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Charter](#2-project-charter)
3. [Architecture Overview](#3-architecture-overview)
4. [Unicorn Agent Design](#4-unicorn-agent-design)
5. [Sprint Breakdown (Agile/Scrum)](#5-sprint-breakdown-agilescrum)
6. [PMP Management](#6-pmp-management)
7. [Technical Specifications](#7-technical-specifications)
8. [Design Map](#8-design-map)
9. [Testing Strategy](#9-testing-strategy)
10. [Version Control Plan](#10-version-control-plan)
11. [Cross-Project References](#11-cross-project-references)

---

## 1. Executive Summary

### 1.1 Project Vision

ZLuxury is a **AI-powered luxury e-commerce platform** that delivers authentic, curated luxury goods to global consumers through a hybrid Unicorn Agent intelligence system. The platform merges **Hermes** (self-evolving luxury recommendation engine) with **OpenClaw** (multi-channel market intelligence gateway) to provide personalized shopping experiences, real-time auction analysis, and cross-border sourcing optimization.

### 1.2 Project Goals

| # | Goal | Description | Target |
|---|------|-------------|--------|
| G1 | Premium UX | Deliver a world-class luxury shopping experience matching Farfetch / MyTheresa quality | Lighthouse > 95, AOV > ¥15,000 |
| G2 | AI Intelligence | Deploy the merged Hermes + OpenClaw Unicorn Agent for personalized recommendations and market analysis | 90%+ recommendation accuracy |
| G3 | Multi-Channel Sourcing | Integrate real product data from HK, Japan, Europe, and Shanghai FTZ channels | 4 sourcing channels live |
| G4 | Global Reach | Support English, Simplified Chinese, and Traditional Chinese with multi-currency display | 3 languages, 5 currencies |
| G5 | Scalable Foundation | Build on Next.js 14 App Router with centralized configuration, no hardcoded values | 100% config-driven |

### 1.3 Key Stakeholders

| Role | Entity | Interest |
|------|--------|----------|
| Product Owner | vcfhuang / ZLuxury Team | Business strategy, ROI, brand positioning |
| Tech Lead | ZLuxury AI Dev Team | Architecture, code quality, delivery |
| AI Specialist | Hermes + OpenClaw Integration | Agent intelligence, Kanban orchestration |
| UX Designer | ANNA AI Design Reference | Luxury visual identity, conversion optimization |
| DevOps | CI/CD Pipeline | Reliability, deployment automation |
| Business Ops | Formula Money / zvhouse | Financial modeling, real estate synergy |

---

## 2. Project Charter

### 2.1 Purpose

ZLuxury addresses a gap in the luxury e-commerce market by combining **AI-driven personalization** with **cross-border sourcing agility**. Leveraging HKID residency, Shanghai FTZ bonded warehousing, Japan auction relationships, and European boutique direct channels, ZLuxury delivers authentic luxury goods at competitive prices with AI-curated recommendations.

### 2.2 Objectives

1. **Deliver a complete e-commerce platform** with product catalog, cart, checkout flow (UI-level), and AI assistant integration
2. **Eliminate all hardcoding** — every exchange rate, product price, API endpoint, and configuration value must be driven by centralized config or real API data
3. **Implement JSDoc documentation** across all modules for long-term maintainability
4. **Establish structured logging** (Log4j-style) for observability, debugging, and business analytics
5. **Build the Unicorn Agent** (Hermes + OpenClaw merge) with Kanban-based multi-agent orchestration
6. **Support i18n** for EN, zh-CN, zh-TW with proper translation files and language switcher
7. **Deploy versioned releases** using semantic versioning with GitHub backup workflow

### 2.3 Scope

**In Scope:**
- Luxury product catalog (watches, jewelry, handbags, fashion, accessories, lifestyle)
- AI assistant interface (Hermes, OpenClaw, Unicorn)
- VIP membership tiers (Standard → Silver → Gold → Black → Diamond)
- Multi-language / multi-currency display
- Centralized configuration layer (`src/config/constants.ts`)
- Logging system (Log4j-inspired, `src/lib/logger.ts`)
- Unicorn Agent with ETCLOVG+K capability layers
- Kanban multi-agent orchestration
- Kanban-style issue tracking and sprint management

**Out of Scope (Future Phases):**
- Real payment gateway integration (Stripe, Alipay, WeChat Pay) — Phase 2
- Physical inventory management system — Phase 2
- Mobile native app (iOS/Android) — Phase 3
- Full backend database (PostgreSQL) — Phase 2
- Real auction API integration — Phase 2
- Admin dashboard — Phase 2

### 2.4 Constraints

| Constraint | Detail | Rationale |
|------------|--------|-----------|
| **Port Restriction** | Ports **3XXX** and **8XXX** are **prohibited** | Avoid conflicts with other internal projects (zsms uses port 3XXX range; zunicorn-agent uses 8XXX range) |
| **Approved Ports** | Dev: **19000**, Alternative: **42008** | Available range; avoids collision with existing services |
| **Package Dependencies** | Must use **centralizedhub** packages for shared utilities | Promotes code reuse across the Z-family project ecosystem |
| **Agent Integration** | Must use **zunicorn-agent** package for Hermes/OpenClaw bridge | Standardized AI agent interface across all projects |
| **No Hardcoding** | All values must come from `constants.ts`, environment variables, or real APIs | Configurability and maintainability |
| **Design Reference** | Must follow **ANNA AI** luxury design patterns | Visual consistency with sister project anna_ai |

---

## 3. Architecture Overview

### 3.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENT TIER (Browser)                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────────────┐   │
│  │  Next.js 14  │  │  React 18    │  │  Tailwind CSS 3.4  |  Framer Motion│   │
│  │  App Router  │  │  TS 5.x      │  │  i18next 23.x    |  react-icons  │   │
│  └──────────────┘  └──────────────┘  └──────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────────┤
│                          STATE LAYER                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  Zustand 4.x  |  Global cart state  |  VIP tier state  |  UI preferences│ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                          DATA / API LAYER                                    │
│  ┌─────────────┐ ┌─────────────┐ ┌────────────┐ ┌────────────────────────┐  │
│  │  products   │ │  pricing    │ │  cart      │ │  unicorn-agent (AI)    │  │
│  └─────────────┘ └─────────────┘ └────────────┘ └────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│                          AI / AGENT LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                    UNICORN AGENT (Hermes + OpenClaw)                    │ │
│  │  ┌──────────────┐    ┌──────────────┐    ┌───────────────────────────┐ │ │
│  │  │   HERMES     │◄──►│  OPENCLAW    │◄──►│  KANBAN ORCHESTRATOR      │ │ │
│  │  │  Self-Evolv- │    │  Multi-Chan- │    │  Multi-Agent Task Router  │ │ │
│  │  │  ing Reco-   │    │  nel Gate-   │    │  (ETCLOVG+K Layers)      │ │ │
│  │  │  mmendations │    │  way         │    │                           │ │ │
│  │  └──────────────┘    └──────────────┘    └───────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                          INFRASTRUCTURE LAYER                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────────────────┐ │
│  │    19000    │ │   42008     │ │   Logger    │ │  centralizedhub        │ │
│  │  (Dev Port) │ │  (Alt Port) │ │  (Log4j)    │ │  zunicorn-agent bridge │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Framework** | Next.js | 14.2 | React App Router with SSR/SSG |
| **Language** | TypeScript | 5.x | Static type safety |
| **UI Styling** | Tailwind CSS | 3.4 | Utility-first luxury theming |
| **State Mgmt** | Zustand | 4.5 | Lightweight global state |
| **Animations** | Framer Motion | 11.x | Smooth page transitions, micro-interactions |
| **i18n** | i18next / react-i18next | 23.x / 14.x | EN, zh-CN, zh-TW support |
| **Charts** | Recharts | 2.x | Auction data visualization |
| **Icons** | react-icons | 5.x | Luxury brand icons and UI |
| **HTTP** | Axios | 1.6 | API client for external data |
| **Logging** | Custom Log4j-style Logger | 1.0 | Structured logging (DEBUG → FATAL) |
| **AI** | Hermes + OpenClaw → Unicorn | TBD | Merged intelligence agent |
| **Reference** | Trae text-to-image API | v1 | Product imagery generation |

### 3.3 Directory Structure

```
zluxury/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx               # Root layout (providers, i18n, Zustand)
│   │   ├── page.tsx                 # Homepage
│   │   ├── globals.css              # Tailwind + luxury theme tokens
│   │   ├── about/page.tsx           # About / brand story
│   │   ├── collections/page.tsx     # Collections gallery
│   │   ├── products/page.tsx        # Full product catalogue
│   │   ├── categories/page.tsx      # Category index
│   │   ├── category/[id]/           # Dynamic category page
│   │   └── product/[id]/            # Dynamic product detail
│   ├── components/                   # Reusable UI components
│   │   ├── Header.tsx               # Navigation, search, language switcher
│   │   ├── HeroSection.tsx          # Landing hero
│   │   ├── FeaturedProducts.tsx     # Hero products grid
│   │   ├── CategoriesSection.tsx    # Category showcase
│   │   ├── AIAssistantSection.tsx   # AI chat widget
│   │   ├── BusinessStrategy.tsx     # Sourcing channel diagram
│   │   ├── TestimonialsSection.tsx  # Social proof
│   │   └── Footer.tsx               # Site footer
│   ├── config/
│   │   └── constants.ts             # Centralized config (colors, tiers, rates)
│   ├── data/
│   │   ├── products.ts              # Product repository
│   │   ├── pricing.ts               # Pricing engine (exchange rates)
│   │   ├── cart.ts                  # Cart state
│   │   ├── orders.ts                # Order lifecycle
│   │   ├── shipping.ts              # Shipping quotes
│   │   ├── sourcing.ts              # Sourcing channel logic
│   │   ├── inventory.ts             # Inventory tracking
│   │   ├── ai.ts                    # AI service bridge
│   │   ├── ai-service.ts            # AI API client
│   │   ├── unicorn-agent.ts         # ⭐ Unicorn Agent (Hermes + OpenClaw)
│   │   └── auth.ts                  # Auth service
│   ├── i18n/
│   │   ├── index.ts                 # i18next initialization
│   │   ├── useTranslation.ts        # Custom translation hook
│   │   └── locales/                 # Translation files (en, zh-CN, zh-TW)
│   ├── lib/
│   │   ├── logger.ts                # Log4j-style logger
│   │   └── config-loader.ts         # Config loader with env fallback
│   ├── store/
│   │   └── index.ts                 # Zustand global store
│   ├── utils/
│   │   ├── images.ts                # Image utilities
│   │   └── logger.ts                # Client-side logger
│   └── ai/
│       └── agents.ts                # AI agent registry
├── docs/                             # Project documentation
├── public/                           # Static assets
├── scripts/                          # Build/deploy/backup scripts
├── VERSION.json                      # Version metadata
├── CHANGELOG.md                      # Change log
└── PROJECT_PLAN.md                   # ⭐ This file
```

### 3.4 Data Flow

```
User Request
    │
    ▼
Next.js Route (app/page.tsx)
    │
    ▼
Component (e.g., FeaturedProducts.tsx)
    │
    ├──► config/constants.ts  (Centralized config)
    │         │
    │         ├──► EXCHANGE_RATES (env-driven)
    │         ├──► COLORS (luxury palette)
    │         ├──► VIP_TIERS (membership levels)
    │         └──► AI_AGENTS (agent endpoints)
    │
    ├──► data/products.ts  (Product repository)
    │         │
    │         └──► Lib/config-loader.ts  (Fallback to env vars)
    │
    ├──► data/pricing.ts  (Dynamic pricing)
    │         │
    │         └──► FX Rate calculation  (No hardcoding)
    │
    └──► data/unicorn-agent.ts  (AI intelligence)
              │
              ├──► Hermes (recommendations)
              ├──► OpenClaw (market intelligence)
              └──► Kanban orchestrator
    │
    ▼
Zustand Store (Global State)
    │
    ▼
UI Render (Tailwind + Framer Motion)
    │
    ▼
Logger (Log4j output to console + file)
```

---

## 4. Unicorn Agent Design

### 4.1 Architecture: Hermes + OpenClaw Merge

The **Unicorn Agent** is the consolidated intelligence core of ZLuxury. It merges two specialized AI engines:

| Agent | Role | Core Capabilities |
|-------|------|-------------------|
| **Hermes** | Self-Evolving Luxury Consultant | Product recommendations, brand expertise, style matching, VIP tier optimization, personalization learning |
| **OpenClaw** | Multi-Channel Market Intelligence Gateway | Auction analysis, price trend prediction, sourcing channel optimization, real-time market data, deal discovery |

The merge produces a unified agent that:
- Cross-references Hermes recommendations against OpenClaw market data
- Provides investment-grade analysis alongside shopping recommendations
- Orchestrates multiple sub-agents via a Kanban task board
- Self-evolves by learning from user interactions and market feedback

### 4.2 ETCLOVG+K Capability Layers

The Unicorn Agent's capability stack is organized into **ETCLOVG+K** layers:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ETCLOVG+K CAPABILITY LAYERS                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  E — E-Commerce Layer                                               │
│      ├── Product catalog navigation                                │
│      ├── Cart / checkout orchestration                             │
│      ├── Order lifecycle management                                │
│      └── Payment processing bridge                                 │
│                                                                     │
│  T — Trading Layer                                                  │
│      ├── Real-time auction data parsing                            │
│      ├── Price comparison across channels                          │
│      ├── FX rate execution                                         │
│      └── Sourcing cost optimization                                │
│                                                                     │
│  C — Curation Layer                                                │
│      ├── AI-powered product recommendations                        │
│      ├── Personalized collection curation                          │
│      ├── Style-matching engine                                     │
│      └── Trend analysis                                            │
│                                                                     │
│  L — Logistics Layer                                                │
│      ├── Multi-channel shipping selection                          │
│      ├── Customs documentation generation                          │
│      ├── FTZ bonded warehouse integration                          │
│      └── Delivery tracking                                         │
│                                                                     │
│  O — Operations Layer                                               │
│      ├── VIP tier management                                       │
│      ├── Membership benefit tracking                               │
│      ├── Customer profiling                                        │
│      └── Concierge service routing                                 │
│                                                                     │
│  V — Value Layer                                                   │
│      ├── Investment-grade product analysis                         │
│      ├── Resale value prediction                                   │
│      ├── Rarity assessment                                         │
│      └── Price trend forecasting                                   │
│                                                                     │
│  G — Growth Layer                                                  │
│      ├── User acquisition analytics                               │
│      ├── Conversion optimization                                   │
│      ├── Retention modeling                                        │
│      └── Referral engine                                           │
│                                                                     │
│  +  K — Kanban Orchestration Layer                                │
│      ├── Multi-agent task board                                    │
│      ├── Priority-based task routing                               │
│      ├── Agent collaboration protocols                             │
│      └── Real-time status tracking                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.3 Kanban Multi-Agent Orchestration

The Unicorn Agent uses a **Kanban board** to orchestrate multiple specialized sub-agents:

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   BACKLOG    │  │   IN PROGRESS│  │   REVIEWING  │  │    DONE      │
├──────────────┤  ├──────────────┤  ├──────────────┤  ├──────────────┤
│ Task 001:    │  │ Task 003:    │  │ Task 005:    │  │ Task 002:    │
│ Hermes reco- │  │ OpenClaw auc-│  │ Cross-vali-  │  │ Price trend  │
│ mmendation   │  │ tion parsing │  │ dation       │  │ analysis     │
│              │  │              │  │              │  │              │
│ Task 004:    │  │ Task 006:    │  │ Task 008:    │  │ Task 007:    │
│ User profile │  │ Sourcing opt-│  │ VIP tier up- │  │ Cart optimi- │
│ learning     │  │ imization    │  │ grade check  │  │ zation       │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

**Orchestration Rules:**
1. Each task enters the **BACKLOG** with priority (P0–P3) and assigned agent
2. Kanban pulls tasks into **IN PROGRESS** based on agent capacity (max 3 concurrent)
3. Tasks move to **REVIEWING** when agent completes analysis (awaiting cross-agent validation)
4. Reviewed tasks move to **DONE** and trigger downstream workflows (e.g., update UI, notify user)
5. Failed tasks return to **BACKLOG** with error context for reassignment

### 4.4 Agent Communication Protocol

```
Hermes ──► [Kanban Router] ──► OpenClaw
  │                               │
  │  Reco request                 │  Market data request
  │  {productId, userProfile}     │  {category, priceRange}
  │                               │
  ▼                               ▼
[Unified Context Engine]
  │
  ├── Merged Analysis: {hermesRecos, openClawInsights, combinedScore}
  │
  ▼
[Response Formatter]
  │
  ├── Natural language response
  ├── Actionable suggestions
  └── Next-best-action recommendations
```

---

## 5. Sprint Breakdown (Agile/Scrum)

### Sprint Cycle Definition

| Attribute | Value |
|-----------|-------|
| **Duration** | 2 weeks (10 business days) |
| **Sprint Planning** | Day 1 (2 hours) |
| **Daily Standup** | 15 minutes per day |
| **Sprint Review** | Last day (1 hour demo) |
| **Sprint Retrospective** | Last day (30 minutes) |
| **Velocity Target** | 30–40 story points per sprint |

---

### Sprint 1: Foundation & Cleanup

**Goal:** Remove hardcoding, add JSDoc, setup structured logging

| ID | Task | Story Points | Priority | Status |
|----|------|-------------|----------|--------|
| S1-01 | Audit all files for hardcoded values (7.24, port numbers, URLs) | 5 | P0 | Planned |
| S1-02 | Migrate hardcoded values to `config/constants.ts` | 5 | P0 | Planned |
| S1-03 | Implement Log4j-style logger in `lib/logger.ts` | 5 | P0 | Planned |
| S1-04 | Add JSDoc to all exported functions | 8 | P0 | Planned |
| S1-05 | Create environment variable template (`.env.example`) | 3 | P1 | Planned |
| S1-06 | Fix TypeScript strict mode errors | 4 | P0 | Planned |
| S1-07 | Centralize API endpoint definitions | 3 | P1 | Planned |
| S1-08 | Configure ESLint + Prettier | 2 | P2 | Planned |

**Total:** 35 story points

**Definition of Done:**
- [ ] Zero hardcoded exchange rates or magic numbers in components
- [ ] Logging implemented for all user actions (cart, navigation, AI)
- [ ] JSDoc coverage ≥ 80% of public functions
- [ ] TypeScript compiles with zero errors
- [ ] Application runs on port **19000** without warnings

---

### Sprint 2: GUI Redesign

**Goal:** Luxury brand UI, ANNA AI design patterns, premium visual experience

| ID | Task | Story Points | Priority | Status |
|----|------|-------------|----------|--------|
| S2-01 | Redesign color palette (deep black + gold accent `#D4AF37`) | 3 | P0 | Planned |
| S2-02 | Implement luxury typography system (serif headings, sans body) | 3 | P0 | Planned |
| S2-03 | Add smooth Framer Motion page transitions | 5 | P0 | Planned |
| S2-04 | Redesign Header with search, language switcher, VIP indicator | 5 | P0 | Planned |
| S2-05 | Create luxury product card component (zoom on hover, gold border) | 5 | P0 | Planned |
| S2-06 | Implement Hero section with Trae text-to-image API banners | 5 | P1 | Planned |
| S2-07 | Add Footer with brand story, social links, newsletter | 3 | P1 | Planned |
| S2-08 | Build responsive grid (mobile: 2-col, tablet: 3-col, desktop: 4-col) | 4 | P0 | Planned |

**Total:** 33 story points

**Definition of Done:**
- [ ] All pages follow luxury brand aesthetic (black background, gold accents, serif typography)
- [ ] Mobile responsive down to 320px width
- [ ] Lighthouse performance score ≥ 90
- [ ] Lighthouse accessibility score ≥ 90
- [ ] Zero visual regressions across all pages

---

### Sprint 3: Real Data Integration

**Goal:** Replace mock data with real APIs and dynamic data sources

| ID | Task | Story Points | Priority | Status |
|----|------|-------------|----------|--------|
| S3-01 | Integrate live exchange rate API (USD/CNY, EUR/CNY, GBP/CNY, JPY/CNY) | 8 | P0 | Planned |
| S3-02 | Connect product data to centralizedhub package | 6 | P0 | Planned |
| S3-03 | Implement Trae text-to-image API for product imagery | 6 | P0 | Planned |
| S3-04 | Connect AI chat to real API endpoint (zunicorn-agent) | 8 | P0 | Planned |
| S3-05 | Add error boundaries and fallback UI for API failures | 4 | P1 | Planned |
| S3-06 | Implement loading skeletons for all data-fetching views | 3 | P1 | Planned |
| S3-07 | Add currency switcher (USD ↔ CNY) with live rate display | 3 | P1 | Planned |

**Total:** 38 story points

**Definition of Done:**
- [ ] Exchange rates update dynamically (no hardcoded 7.24)
- [ ] Product images load from real CDN (no broken Unsplash URLs)
- [ ] AI assistant responds with real API (not mock)
- [ ] Graceful fallback UI when APIs are unavailable
- [ ] All price calculations use current exchange rates

---

### Sprint 4: Unicorn Agent

**Goal:** Hermes + OpenClaw integration, skills, Kanban orchestration

| ID | Task | Story Points | Priority | Status |
|----|------|-------------|----------|--------|
| S4-01 | Finalize Hermes self-evolving recommendation engine | 8 | P0 | Planned |
| S4-02 | Finalize OpenClaw multi-channel gateway | 8 | P0 | Planned |
| S4-03 | Implement Kanban multi-agent orchestrator | 8 | P0 | Planned |
| S4-04 | Build ETCLOVG+K capability layer routing | 6 | P0 | Planned |
| S4-05 | Create skill registry (product search, price check, cart ops, etc.) | 5 | P1 | Planned |
| S4-06 | Implement cross-agent communication protocol | 5 | P0 | Planned |
| S4-07 | Add agent response formatter (natural language + structured) | 4 | P1 | Planned |

**Total:** 44 story points

**Definition of Done:**
- [ ] Unicorn Agent class in `src/data/unicorn-agent.ts` fully functional
- [ ] Kanban board with BACKLOG → IN PROGRESS → REVIEWING → DONE columns
- [ ] Hermes + OpenClaw cross-referencing produces combined analysis
- [ ] Agent responses include investment rating, price prediction, VIP benefit calc
- [ ] Revenue calculation working (commission + subscription value)

---

### Sprint 5: i18n, Docs & Polish

**Goal:** Multi-language, documentation, testing, performance

| ID | Task | Story Points | Priority | Status |
|----|------|-------------|----------|--------|
| S5-01 | Complete zh-CN and zh-TW translation files | 5 | P0 | Planned |
| S5-02 | Add language switcher UI (header dropdown) | 3 | P0 | Planned |
| S5-03 | Write API documentation (`docs/API_DOCUMENTATION.md`) | 5 | P1 | Planned |
| S5-04 | Write architecture documentation | 5 | P1 | Planned |
| S5-05 | Write setup guide (`SETUP_GUIDE.md`) | 3 | P1 | Planned |
| S5-06 | Add unit tests for core functions (logger, pricing, cart) | 8 | P0 | Planned |
| S5-07 | Add E2E test suite for critical user flows | 6 | P1 | Planned |
| S5-08 | Performance optimization (code splitting, lazy loading) | 5 | P1 | Planned |

**Total:** 40 story points

**Definition of Done:**
- [ ] All 3 languages (EN, zh-CN, zh-TW) fully translated
- [ ] Documentation covers API, architecture, setup, deployment
- [ ] Unit test coverage ≥ 70%
- [ ] Page load time < 3 seconds (LCP)
- [ ] Lighthouse score ≥ 90 across all categories

---

### Sprint 6: Version Control & Launch

**Goal:** Backup, screenshots, deployment, launch readiness

| ID | Task | Story Points | Priority | Status |
|----|------|-------------|----------|--------|
| S6-01 | Create GitHub repository and configure remote | 3 | P0 | Planned |
| S6-02 | Set up CI/CD workflow (`.github/workflows/deploy.yml`) | 5 | P0 | Planned |
| S6-03 | Take product screenshots for all pages | 5 | P0 | Planned |
| S6-04 | Generate changelog for V1.0.0 release | 3 | P0 | Planned |
| S6-05 | Create deployment checklist and runbook | 5 | P1 | Planned |
| S6-06 | Final smoke test on production build | 5 | P0 | Planned |
| S6-07 | Launch announcement and documentation finalization | 3 | P1 | Planned |

**Total:** 29 story points

**Definition of Done:**
- [ ] Code pushed to GitHub main branch
- [ ] V1.0.0 tag created with changelog
- [ ] Production build passes (`npm run build`)
- [ ] Screenshots archived in `screenshots/V1.0.0/`
- [ ] Rollback plan documented and verified

---

## 6. PMP Management

### 6.1 Issue Log

| ID | Title | Type | Priority | Status | Owner | Sprint |
|----|-------|------|----------|--------|-------|--------|
| ISS-001 | Hardcoded exchange rate (7.24) in multiple files | Bug | P0 | Open | Dev Team | S1 |
| ISS-002 | No structured logging system | Feature | P0 | Open | Dev Team | S1 |
| ISS-003 | Missing JSDoc on 60% of functions | Quality | P0 | Open | Dev Team | S1 |
| ISS-004 | Images use external Unsplash URLs (may break) | Bug | P1 | Open | Dev Team | S3 |
| ISS-005 | AI assistant uses mock responses only | Feature | P0 | Open | Dev Team | S3 |
| ISS-006 | No error boundaries in UI | Quality | P1 | Open | Dev Team | S3 |
| ISS-007 | Unicorn Agent not integrated with UI | Feature | P0 | Open | Dev Team | S4 |
| ISS-008 | Missing Traditional Chinese translations | Bug | P1 | Open | Dev Team | S5 |
| ISS-009 | No automated tests | Quality | P0 | Open | Dev Team | S5 |
| ISS-010 | No CI/CD pipeline | DevOps | P0 | Open | Dev Team | S6 |

### 6.2 Risk Register

| ID | Risk | Probability | Impact | Mitigation Strategy | Owner |
|----|------|-------------|--------|---------------------|-------|
| R-01 | Exchange rate API outage | Medium | High | Implement multi-provider fallback; cache rates for 10 min | Tech Lead |
| R-02 | AI API rate limiting | Medium | High | Token bucket caching; fallback rule-based responses | AI Specialist |
| R-03 | Image CDN failures | Low | Medium | Local asset fallback; Trae text-to-image as backup | Frontend Dev |
| R-04 | Port 19000 conflict with zsms (3XXX) / zunicorn-agent (8XXX) | Medium | Low | Pre-check port availability; fall back to 42008 | DevOps |
| R-05 | Next.js SSR hydration errors | Medium | Medium | Client-side initialization pattern; suppress hydration warnings | Frontend Dev |
| R-06 | Bundle size exceeds 100KB target | Medium | Medium | Code splitting; dynamic imports; tree-shaking | Tech Lead |
| R-07 | Security vulnerability in dependencies | Low | High | Regular `npm audit`; dependency pinning; Snyk integration | DevOps |
| R-08 | Cross-project version conflicts (centralizedhub, zunicorn-agent) | Medium | Medium | Version lock in `package-lock.json`; integration test suite | Tech Lead |

### 6.3 Stakeholder Matrix

| Stakeholder | Power | Interest | Strategy | Engagement |
|-------------|-------|----------|----------|------------|
| Product Owner (vcfhuang) | High | High | Manage closely | Daily updates, sprint demos |
| AI Specialist | High | High | Manage closely | Pair programming on agent integration |
| UX Designer (ANNA AI) | Medium | High | Keep informed | Design reviews, sprint 2 sign-off |
| DevOps | Medium | Medium | Keep informed | Weekly infra sync |
| Business Ops (Formula Money) | Low | High | Keep informed | Monthly strategy reviews |
| Centralizedhub Maintainer | High | Medium | Manage closely | API contract testing |

---

## 7. Technical Specifications

### 7.1 Port Configuration

| Service | Port | Notes |
|---------|------|-------|
| **ZLuxury Dev** | **19000** | Primary development port (Next.js `next dev -p 19000`) |
| **ZLuxury Alt** | **42008** | Fallback port if 19000 is occupied |
| **Prohibited Range** | **3XXX** | Avoid: zsms project uses 3XXX range |
| **Prohibited Range** | **8XXX** | Avoid: zunicorn-agent project uses 8XXX range |
| **Production** | TBD | Configurable via `process.env.PORT` |

### 7.2 Centralizedhub Packages

The following packages from the **centralizedhub** ecosystem are used:

| Package | Purpose | Version |
|---------|---------|---------|
| `@zluxury/centralizedhub` | Shared configuration utilities | Latest |
| `@zluxury/zunicorn-agent` | Hermes + OpenClaw bridge | Latest |
| `@zluxury/logger` | Standardized logging interface | Latest |

### 7.3 Environment Variables

```env
# Application
NODE_ENV=development
NEXT_PUBLIC_API_URL=/api

# Exchange Rates (fallback values)
FALLBACK_EXCHANGE_RATE_USD_CNY=7.24
EXCHANGE_RATE_EUR=7.78
EXCHANGE_RATE_GBP=9.32
EXCHANGE_RATE_JPY=0.047
EXCHANGE_RATE_HKD=0.915

# AI Agent
UNICORN_NAME=Unicorn
UNICORN_ROLE=Unified Intelligence
UNICORN_PREMIUM_RATE=500
UNICORN_ENTERPRISE_RATE=5000
UNICORN_COMMISSION_RATE=8
UNICORN_MAX_ANALYSIS_DEPTH=5
UNICORN_RESPONSE_TIMEOUT=10000

# Ports
PORT=19000
ALT_PORT=42008

# Logging
LOG_LEVEL=debug
LOG_FILE=logs/zluxury.log
```

### 7.4 Logging Levels (Log4j Standard)

| Level | Usage | Example |
|-------|-------|---------|
| `FATAL` | System-critical errors | Database connection lost, unable to recover |
| `ERROR` | Recoverable errors | API call failed, product not found |
| `WARN` | Warning conditions | Exchange rate using fallback, slow query detected |
| `INFO` | General operational messages | User added item to cart, page loaded |
| `DEBUG` | Detailed debugging | Function entry/exit, variable values, full stack traces |

### 7.5 VIP Tier Configuration

| Tier | Annual Spend | Discount | Points Rate | Exclusive Access |
|------|-------------|----------|------------|-----------------|
| Standard | ¥0 | 5% | 1x | No |
| Silver | ¥10,000 | 10% | 1.5x | No |
| Gold | ¥50,000 | 15% | 2x | Early access |
| Black | ¥200,000 | 20% | 3x | Priority + personal consultant |
| Diamond | ¥1,000,000 | 25% | 5x | All benefits + VIP events |

---

## 8. Design Map

### 8.1 UI/UX Wireframe References

Wireframe references are stored at `e:\AI_Projects\zsms\reference` and include:

| File | Content | Usage |
|------|---------|-------|
| `reference_links.md` | External reference links | Design inspiration |
| `0.webp` | Hero section wireframe | Homepage hero layout |
| `0 (1).webp` | Product detail wireframe | Product page structure |
| `0 (2).webp` | Category page wireframe | Category grid layout |
| `0 (3).webp` | AI assistant wireframe | Chat interface design |
| `0 (4).webp` | VIP membership wireframe | Membership page layout |
| `0.png` | Navigation / header wireframe | Header component design |

**Design Principles (from ANNA AI reference):**
- **Luxury minimalism:** Abundant whitespace, thin borders, elegant spacing
- **Dark mode first:** Deep black backgrounds (`#0a0a0a`) with gold accents (`#D4AF37`)
- **Typography hierarchy:** Serif headings (Playfair/Cormorant), sans-serif body (Inter)
- **Micro-interactions:** Subtle hover animations, smooth page transitions, loading skeletons
- **Trust signals:** Authenticity badges, brand heritage, security indicators

### 8.2 Component Hierarchy

```
RootLayout (app/layout.tsx)
├── Providers (i18n, Zustand, Theme)
├── Header (components/Header.tsx)
│   ├── Logo / Brand Mark
│   ├── Primary Navigation
│   │   ├── Home
│   │   ├── Collections
│   │   ├── Products
│   │   ├── Categories
│   │   ├── About
│   │   └── AI Assistant
│   ├── Search Bar (with AI suggestions)
│   ├── Language Switcher (EN, 中文繁體, 简体中文)
│   ├── Currency Switcher (USD, CNY)
│   ├── VIP Indicator
│   └── Cart Badge
│
├── Main Content (dynamic by route)
│   │
│   ├── Homepage (app/page.tsx)
│   │   ├── HeroSection (components/HeroSection.tsx)
│   │   │   ├── Animated hero banner (Trae text-to-image API)
│   │   │   ├── Brand tagline
│   │   │   └── CTA buttons (Shop, Learn More)
│   │   ├── FeaturedProducts (components/FeaturedProducts.tsx)
│   │   │   └── ProductCard[] (grid of 4)
│   │   ├── CategoriesSection (components/CategoriesSection.tsx)
│   │   │   └── CategoryCard[] (grid of 6)
│   │   ├── AIAssistantSection (components/AIAssistantSection.tsx)
│   │   │   └── ChatPreview + "Talk to Unicorn" CTA
│   │   ├── BusinessStrategy (components/BusinessStrategy.tsx)
│   │   │   ├── HK Direct Channel
│   │   │   ├── Japan Auction
│   │   │   ├── Europe Boutique
│   │   │   └── Shanghai FTZ
│   │   ├── TestimonialsSection (components/TestimonialsSection.tsx)
│   │   │   └── TestimonialCard[] (carousel)
│   │   └── VIPSection (not yet implemented)
│   │
│   ├── Product Listing (app/products/page.tsx)
│   │   ├── FilterBar (category, price, brand, sort)
│   │   ├── ProductGrid (responsive 2/3/4 columns)
│   │   └── Pagination (12 items per page)
│   │
│   ├── Product Detail (app/product/[id]/page.tsx)
│   │   ├── ProductGallery (image carousel + zoom)
│   │   ├── ProductInfo (name, brand, price, VIP pricing)
│   │   ├── SpecificationsTable
│   │   ├── UnicornAnalysis (AI-generated: rating, prediction, suggestions)
│   │   ├── AddToCart / AddToWishlist
│   │   ├── RelatedProducts
│   │   └── Breadcrumb navigation
│   │
│   ├── Category Page (app/category/[id]/page.tsx)
│   │   ├── CategoryHeader (name, description, icon)
│   │   ├── FilterBar
│   │   └── ProductGrid
│   │
│   ├── Collections (app/collections/page.tsx)
│   │   ├── CollectionHero
│   │   └── CollectionGrid
│   │
│   └── About (app/about/page.tsx)
│       ├── BrandStory
│       ├── SourcingNetwork
│       └── ContactUs
│
└── Footer (components/Footer.tsx)
    ├── Brand column
    ├── Shop links
    ├── Help links
    ├── Newsletter signup
    ├── Social icons
    └── Copyright + legal links
```

### 8.3 Data Flow Diagram

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  User    │────►│  Next.js     │────►│  Zustand     │
│  Browser │     │  App Router  │     │  Global Store│
└──────────┘     └──────┬───────┘     └──────┬───────┘
                         │                     │
                         ▼                     ▼
                ┌──────────────┐     ┌──────────────┐
                │  Components  │     │  Cart State  │
                │  (UI Layer)  │     │  VIP State   │
                └──────┬───────┘     │  UI Prefs    │
                       │             └──────┬───────┘
                       ▼                    │
                ┌──────────────┐            │
                │  Data Layer  │◄───────────┘
                │  (services)   │
                └──────┬───────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
   ┌───────────┐ ┌───────────┐ ┌──────────────┐
   │ products  │ │ pricing   │ │   unicorn-   │
   │ (repo)    │ │ (engine)  │ │   agent      │
   └─────┬─────┘ └─────┬─────┘ └──────┬───────┘
         │             │              │
         ▼             ▼              ▼
   ┌───────────┐ ┌───────────┐ ┌──────────────┐
   │centralized│ │ FX Rate   │ │ Hermes +     │
   │   hub     │ │ API       │ │ OpenClaw AI  │
   └───────────┘ └───────────┘ └──────────────┘
```

---

## 9. Testing Strategy

### 9.1 Test Pyramid

```
          ┌───────────────┐
          │  E2E Tests    │  ← Critical user flows
          │  (Playwright) │     Cart → Checkout flow
          └───────┬───────┘
                  │
          ┌───────────────┐
          │ Integration   │  ← API + DB boundary
          │  Tests        │     AI agent + pricing integration
          └───────┬───────┘
                  │
          ┌───────────────┐
          │  Unit Tests   │  ← Pure functions, components
          │  (Vitest)     │     Logger, pricing calc, agent logic
          └───────────────┘
```

### 9.2 Test Plan

#### Unit Tests (70%+ Coverage Target)

| Module | Test Cases | Priority |
|--------|-----------|----------|
| `lib/logger.ts` | DEBUG, INFO, WARN, ERROR, FATAL levels; format output; console/file transport | P0 |
| `config/constants.ts` | EXCHANGE_RATES values; COLORS palette; VIP_TIERS data; AI_AGENTS config | P0 |
| `data/pricing.ts` | FX conversion; VIP discount calculation; tax computation | P0 |
| `data/cart.ts` | Add to cart; remove item; update quantity; cart total calculation | P0 |
| `data/unicorn-agent.ts` | analyzeProduct; calculateRevenue; generateResponse; cache management | P0 |
| `data/products.ts` | searchProducts; getProductById; category filtering | P1 |
| `store/index.ts` | Zustand store actions; state persistence | P1 |

#### Integration Tests

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| AI Agent Full Flow | 1. Initialize UnicornAgent 2. Load product 3. Set user profile 4. Run analyzeProduct | Combined analysis with Hermes recos + OpenClaw insights |
| Pricing Pipeline | 1. Get product 2. Apply exchange rate 3. Apply VIP discount 4. Calculate tax | Correct final price in CNY |
| Cart Lifecycle | 1. Add 3 items 2. Update quantity 3. Remove 1 item 4. Checkout | Correct cart total, proper state updates |

#### E2E Tests

| Flow | Pages | Critical Assertions |
|------|-------|---------------------|
| Browse → View Detail | Home → Product List → Product Detail | Product renders, images load, price displays |
| Add to Cart | Product Detail → Cart | Cart count updates, item persists on navigation |
| AI Chat | Home → AI Assistant → Chat | Agent responds with structured analysis |
| Language Switch | Any page → Language dropdown → 中文繁體 | All text switches to Traditional Chinese |
| VIP Tier Display | Product Detail → VIP pricing | Different prices shown per tier |

### 9.3 Quality Gates

| Gate | Metric | Target |
|------|--------|--------|
| **Build Success** | Build exits with code 0 | Mandatory |
| **TypeScript** | Zero type errors | Mandatory |
| **ESLint** | Zero errors, warnings < 5 | Mandatory |
| **Unit Coverage** | Lines covered ≥ 70% | Sprint 5 target |
| **Lighthouse** | Performance ≥ 90, Accessibility ≥ 90 | Sprint 2 target |
| **Bundle Size** | First load JS < 150KB | Sprint 5 target |
| **Console Errors** | Zero in production build | Mandatory |

---

## 10. Version Control Plan

### 10.1 Semantic Versioning Convention

```
V{MAJOR}.{MINOR}.{PATCH}
  │       │       │
  │       │       └── Bug fixes, hotfixes (0–99)
  │       └────────── New features, backward-compatible changes (0–9)
  └────────────────── Breaking changes, major releases (0–9)
```

**Version History:**

| Version | Description | Date |
|---------|-------------|------|
| V1.0.0 | Initial MVP foundation | 2024-06-11 |
| V2.0.0 | Major revamp — Cross-border e-commerce business model | 2025-06-13 |
| **V2.1.0** | Foundation & Cleanup (Sprint 1) | TBD |
| **V2.2.0** | GUI Redesign (Sprint 2) | TBD |
| **V2.3.0** | Real Data Integration (Sprint 3) | TBD |
| **V2.4.0** | Unicorn Agent (Sprint 4) | TBD |
| **V2.5.0** | i18n, Docs & Polish (Sprint 5) | TBD |
| **V3.0.0** | Production Launch (Sprint 6) | TBD |

### 10.2 GitHub Backup Workflow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Local Dev   │────►│  GitHub      │────►│  Production  │
│  (19000)     │     │  Repository  │     │  Deployment  │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                   ┌────────┴────────┐
                   ▼                 ▼
            ┌──────────────┐  ┌──────────────┐
            │  Feature     │  │  Backup      │
            │  Branches    │  │  Branch      │
            └──────────────┘  └──────────────┘
```

**Backup Commands:**
```bash
# Full backup with version tag
npm run backup           # Creates timestamped backup in /backups/

# GitHub push with version
npm run github:push      # Commits, tags, and pushes to GitHub

# GitHub backup (full snapshot)
npm run github:backup    # Creates full repository backup

# Setup GitHub remote
npm run github:setup     # Initializes GitHub remote configuration
```

### 10.3 Branch Management

| Branch | Purpose | Lifecycle | Protection |
|--------|---------|-----------|------------|
| `main` | Production-ready code | Permanent | Protected — requires PR review |
| `develop` | Integration branch | Permanent | Protected — requires CI pass |
| `feature/*` | Feature development | Temporary (per sprint) | No restriction |
| `release/*` | Release preparation | Temporary (per release) | Read-only after cut |
| `hotfix/*` | Emergency production fixes | Temporary (as needed) | Merges directly to main |

**Branch Flow:**
```
main ───────────────────────────────────────────► (Production)
  ▲
  │  release/v2.1.0
  │  ┌─────────────────────────────────────────┐
  │  │  develop ─── feature/unicorn-agent      │
  │  │    ▲                                     │
  │  │    │  feature/gui-redesign               │
  │  │    │  feature/real-data                  │
  │  │    │  feature/i18n-polish                │
  │  │    │                                     │
  │  │  hotfix/security-patch ──► main          │
  │  └─────────────────────────────────────────┘
  │
  └── tags: v2.1.0, v2.2.0, ..., v3.0.0
```

### 10.4 Deployment Checklist

```markdown
## Pre-Deployment
- [ ] All tests pass (unit + integration)
- [ ] Production build succeeds (`npm run build`)
- [ ] VERSION.json updated with new version
- [ ] CHANGELOG.md updated with release notes
- [ ] .env.production configured
- [ ] Backups created locally
- [ ] GitHub push completed with version tag

## Deployment
- [ ] Trigger CI/CD via GitHub Actions
- [ ] Verify deployment success
- [ ] Run smoke tests on production URL
- [ ] Verify all pages load correctly
- [ ] Confirm AI agent responds in production

## Post-Deployment
- [ ] Monitor error logs for 1 hour
- [ ] Verify Lighthouse scores in production
- [ ] Update stakeholder communication
- [ ] Archive screenshots for release
- [ ] Close sprint in project management
```

---

## 11. Cross-Project References

### 11.1 Related Projects

| Project | Path | Relationship | Integration |
|---------|------|-------------|-------------|
| **zsms** | `e:\AI_Projects\zsms` | Sister project | Reference folder at `e:\AI_Projects\zsms\reference` contains UI wireframes and design patterns used by ZLuxury |
| **centralizedhub** | Package | Shared utilities | Provides centralized configuration, logging, and API client packages consumed by ZLuxury |
| **zunicorn-agent** | Package | AI agent bridge | Provides the standardized Hermes/OpenClaw bridge interface; ZLuxury's `unicorn-agent.ts` implements this bridge |
| **anna_ai** | Project | Design reference | ANNA AI luxury design patterns define ZLuxury's visual identity (dark theme, gold accents, serif typography) |
| **zvhouse** | Project | Business synergy | Luxury real estate platform; shares VIP membership infrastructure and high-net-worth client base |
| **Formula Money** | Project | Financial modeling | Provides cross-border payment, FX hedging, and financial analytics for pricing engine |
| **zsmartcar** | Project | Tech stack reference | Automotive AI platform; shares component patterns and Zustand state management patterns |

### 11.2 Reference Folder

The design reference folder at `e:\AI_Projects\zsms\reference` contains wireframe images (`.webp`, `.png`) and reference links (`reference_links.md`) that inform ZLuxury's UI/UX decisions. These references were created during the zsms project and are directly applicable to ZLuxury's luxury e-commerce visual design.

---

## Appendix A: File Structure Overview

```
zluxury/
├── src/
│   ├── app/                          # Next.js App Router pages
│   ├── components/                   # React UI components
│   ├── config/                       # Centralized constants
│   ├── data/                         # Data layer (products, pricing, AI)
│   ├── i18n/                         # Internationalization
│   ├── lib/                          # Utility libraries (logger, config-loader)
│   ├── store/                        # Zustand state management
│   └── utils/                        # Helper functions
├── docs/                             # Documentation
├── scripts/                          # Build/deploy/backup
├── public/                           # Static assets
├── VERSION.json                      # Version metadata
├── CHANGELOG.md                      # Change history
├── SETUP_GUIDE.md                    # Setup instructions
├── README.md                         # Project overview
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── postcss.config.js                 # PostCSS configuration
├── package.json                      # Dependencies and scripts
├── .env.example                      # Environment variable template
└── .gitignore                        # Git ignore rules
```

## Appendix B: Key API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | List products (paginated) |
| `/api/products/[id]` | GET | Get product detail |
| `/api/products/search` | GET | Search products by query |
| `/api/categories` | GET | List all categories |
| `/api/cart` | GET/POST | Cart operations |
| `/api/ai/chat` | POST | AI chat with Unicorn Agent |
| `/api/ai/hermes` | POST | Hermes-specific recommendations |
| `/api/ai/openclaw` | POST | OpenClaw market intelligence |
| `/api/vip/status` | GET | VIP membership status |
| `/api/exchange-rates` | GET | Current exchange rates |

---

**Document Owner:** ZLuxury Development Team
**Review Frequency:** Per sprint (every 2 weeks)
**Next Review:** Sprint 1 completion
**Approved By:** Product Owner