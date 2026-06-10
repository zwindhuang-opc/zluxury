## [1.1.0] - 2026-06-10

### MINOR
Added AI-powered luxury platform with Chinese localization and multi-agent system

# ZLuxury Platform Changelog

All notable changes to the ZLuxury platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-07

### MAJOR
Initial release of ZLuxury - Professional Online Luxury Commerce Platform with AI-Powered Auction & Marketplace System

**Features:**
- Complete Next.js 14.2 backend architecture with API routes
- Real product catalog with 17 luxury items (watches, jewelry, handbags, art)
- Authentication system with JWT tokens and user management
- Shopping cart functionality with VIP tier discounts
- AI assistant integration (Hermes, OpenClaw, Unicorn agents)
- State management with Zustand and persistence
- Responsive design with Tailwind CSS
- Comprehensive version control system (V.MAJOR.MINOR.PATCH)
- Automated backup scripts
- GitHub integration for vcfhuang@qq.com
- Branch management (main, develop, feature branches)

**API Endpoints:**
- `/api/products` - Product listing, search, filtering
- `/api/products/[id]` - Single product operations
- `/api/categories` - Category management
- `/api/auth` - User authentication
- `/api/cart` - Shopping cart operations
- `/api/ai` - AI assistant services
- `/api/search` - Product search

**Data Layer:**
- ProductRepository with 17 real luxury products
- CategoryRepository with 6 categories
- UserRepository with authentication
- CartService with VIP discount logic
- AIService with multi-agent support

**Scripts:**
- `npm run version:major` - Bump major version
- `npm run version:minor` - Bump minor version
- `npm run version:patch` - Bump patch version
- `npm run git:push` - Push to GitHub
- `npm run git:setup` - Setup repository structure
- `npm run git:feature` - Create feature branch
- `npm run backup` - Create backup archive

**Branch Strategy:**
- `main` - Production releases
- `develop` - Development integration
- `feature/*` - Feature development branches
