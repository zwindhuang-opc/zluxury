# ZLuxury Platform

Professional Online Luxury Commerce Platform - AI-Powered Auction & Marketplace System

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Version Control](#version-control)
- [GitHub Integration](#github-integration)
- [Branch Management](#branch-management)
- [Deployment](#deployment)

## 🎯 Overview

ZLuxury is a professional luxury e-commerce platform featuring AI-powered auction and marketplace capabilities. The platform integrates multiple AI agents (Hermes, OpenClaw, Unicorn) to provide intelligent product recommendations, auction insights, and personalized shopping experiences.

## ✨ Features

### Core Features
- **Product Catalog**: 17 luxury items across 6 categories (Watches, Jewelry, Handbags, Art, Cars, Real Estate)
- **Authentication System**: JWT-based authentication with user management
- **Shopping Cart**: Full cart functionality with VIP tier discounts (5-15%)
- **AI Assistant Integration**: Multi-agent AI system for personalized recommendations
- **Search & Filtering**: Advanced product search and category filtering
- **Responsive Design**: Mobile-first design with Tailwind CSS

### AI Agents
- **Hermes Agent**: Product recommendations and luxury insights
- **OpenClaw Agent**: Auction analysis and market trends
- **Unicorn Agent**: Personalized shopping assistance

### Technical Features
- **Next.js 14.2**: Modern React framework with App Router
- **TypeScript**: Type-safe development
- **Zustand**: Lightweight state management with persistence
- **API Routes**: RESTful API endpoints for all operations
- **Repository Pattern**: Clean data access layer
- **Version Control**: Semantic versioning (V.MAJOR.MINOR.PATCH)

## 🛠 Technology Stack

### Frontend
- **Next.js 14.2** - React framework with App Router
- **React 18.2** - UI library
- **TypeScript 5.0** - Type-safe JavaScript
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Zustand 4.5** - State management
- **Framer Motion 11.0** - Animation library
- **React Icons 5.0** - Icon library

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **JWT Authentication** - Secure token-based auth
- **Repository Pattern** - Data access abstraction

### Development Tools
- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking
- **Git** - Version control
- **npm** - Package management

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/vcfhuang@qq.com/zluxury.git
cd zluxury
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5200
```

## 🚀 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server on port 5200
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Version Control
npm run version:major   # Bump major version (1.0.0 -> 2.0.0)
npm run version:minor   # Bump minor version (1.0.0 -> 1.1.0)
npm run version:patch   # Bump patch version (1.0.0 -> 1.0.1)
npm run version:bump    # Custom version bump

# Git Operations
npm run git:setup      # Setup repository structure
npm run git:push       # Push to GitHub
npm run git:feature    # Create feature branch

# Backup
npm run backup         # Create backup archive

# Deployment
npm run deploy         # Build and start production server
```

### Development Workflow

1. **Create feature branch**
```bash
npm run git:feature feature-name
```

2. **Make changes and commit**
```bash
git add .
git commit -m "Your commit message"
```

3. **Push to GitHub**
```bash
npm run git:push
```

4. **Bump version when ready**
```bash
npm run version:minor "Added new feature"
```

## 📡 API Documentation

### Base URL
```
http://localhost:5200/api
```

### Endpoints

#### Products
- `GET /products` - Get all products
- `GET /products/[id]` - Get single product
- `POST /products` - Create new product
- `PUT /products/[id]` - Update product
- `DELETE /products/[id]` - Delete product

#### Categories
- `GET /categories` - Get all categories

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

#### Cart
- `GET /cart` - Get cart items
- `POST /cart` - Add item to cart
- `PUT /cart/[id]` - Update cart item
- `DELETE /cart/[id]` - Remove cart item

#### AI Assistant
- `POST /ai/chat` - Send message to AI agent
- `GET /ai/agents` - Get available AI agents

#### Search
- `GET /search?q=query` - Search products

## 🏷️ Version Control

### Version Format
```
V.MAJOR.MINOR.PATCH
```

- **MAJOR**: Breaking changes or major feature releases
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### Version Bumping

```bash
# Major version (breaking changes)
npm run version:major "Major feature update"

# Minor version (new features)
npm run version:minor "Added new AI agent"

# Patch version (bug fixes)
npm run version:patch "Fixed cart calculation bug"
```

### Version Files
- `package.json` - Current version number
- `VERSION.md` - Detailed version information
- `CHANGELOG.md` - Complete change history
- Git tags - Version tags (V.1.0.0, V.1.1.0, etc.)

## 🌐 GitHub Integration

### Configuration
- **GitHub User**: vcfhuang@qq.com
- **Repository**: zluxury
- **Remote URL**: https://github.com/vcfhuang@qq.com/zluxury.git

### Setup GitHub Remote

```bash
# Add remote repository
git remote add origin https://github.com/vcfhuang@qq.com/zluxury.git

# Or use SSH
git remote add origin git@github.com:vcfhuang@qq.com/zluxury.git
```

### Push to GitHub

```bash
# Push current branch
npm run git:push

# Push specific branch
npm run git:push main

# Push with backup
npm run git:push --backup
```

## 🌿 Branch Management

### Branch Structure

```
main          # Production releases (V.1.0.0, V.1.1.0, etc.)
develop       # Development integration
feature/*     # Feature development branches
```

### Branch Workflow

1. **Development Branch**
```bash
git checkout develop
git pull origin develop
```

2. **Feature Branch**
```bash
npm run git:feature feature-name
# Make changes
git commit -am "Feature implementation"
npm run git:push
```

3. **Release Branch**
```bash
# From develop to main
git checkout main
git merge develop
npm run version:minor "Release notes"
npm run git:push
```

### Branch Protection Rules

- **main branch**: Protected, requires pull requests
- **develop branch**: Integration branch for features
- **feature branches**: Temporary branches for specific features

## 🚢 Deployment

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Environment Variables

Create `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5200/api

# GitHub Configuration
GITHUB_USER=vcfhuang@qq.com
GITHUB_REPO=zluxury

# AI Agent Configuration
HERMES_API_KEY=your_hermes_api_key
OPENCLAW_API_KEY=your_openclaw_api_key
UNICORN_API_KEY=your_unicorn_api_key
```

### Deployment Platforms

- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative deployment platform
- **Docker**: Containerized deployment
- **VPS**: Self-hosted deployment

## 📊 Project Structure

```
zluxury/
├── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── auth/
│   │   │   ├── cart/
│   │   │   ├── ai/
│   │   │   └── search/
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   ├── data/            # Data layer
│   │   ├── products.ts
│   │   ├── auth.ts
│   │   ├── cart.ts
│   │   └── ai.ts
│   └── store/           # State management
│       └── index.ts
├── scripts/            # Automation scripts
│   ├── version-bump.js
│   ├── git-push.js
│   └── backup.js
├── public/             # Static assets
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── postcss.config.js
├── VERSION.md
├── CHANGELOG.md
└── README.md
```

## 🔒 Security

- JWT-based authentication
- Secure API endpoints
- Environment variable protection
- Input validation
- SQL injection prevention
- XSS protection

## 📝 License

MIT License - See LICENSE file for details

## 👥 Team

**ZLuxury Team**
- Project Owner: vcfhuang@qq.com
- Development Team: AI-Powered Development

## 📞 Support

For support and questions:
- Email: vcfhuang@qq.com
- GitHub: https://github.com/vcfhuang@qq.com/zluxury
- Issues: https://github.com/vcfhuang@qq.com/zluxury/issues

## 🎉 Acknowledgments

- Next.js team for the amazing framework
- React community for excellent libraries
- AI agents (Hermes, OpenClaw, Unicorn) for intelligent features
- Luxury brands for product inspiration

---

**Version**: V.1.0.0  
**Last Updated**: 2026-06-07  
**Status**: Production Ready ✅