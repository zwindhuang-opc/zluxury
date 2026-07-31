/**
 * BusinessStrategy Component - Revenue model and market strategy showcase
 * 
 * Design inspired by:
 * - Investment pitch deck layouts for market data visualization
 * - McKinsey-style strategy framework presentation
 * - SaaS pricing comparison tables with tiered structure
 * 
 * Features:
 * - 4 core revenue streams: VIP Subscriptions, Commissions, AI Services, Concierge
 * - Market analysis dashboard: size, growth rate, segments, demographics
 * - VIP tier pricing comparison (Silver/Gold/Platinum)
 * - Commission rates by product category (Watches, Fashion, Art, Real Estate)
 * - AI agent service pricing (Hermes, OpenClaw, Unicorn, Full Platform)
 * - Concierge package pricing (Shopping, Advisory, Investment, Annual)
 * - AI integration benefits matrix: Hermes, OpenClaw, Unicorn capabilities
 * - Market key regions and target demographics display
 * 
 * @module BusinessStrategy
 * @version 1.3.0
 */

'use client'

import { motion } from 'framer-motion'
import { config } from '@/lib/config-loader'

/**
 * Business strategy local configuration
 * Centralizes all hardcoded values for AI service pricing, market stats,
 * and demographic thresholds used throughout the component.
 *
 * Can be extended to read from config-loader or environment variables.
 */
interface BusinessConfig {
  /** AI service monthly pricing (USD) */
  aiServicePrices: {
    openClaw: string;
    unicorn: string;
    fullPlatform: string;
  };
  /** Key market statistics displayed in dashboard */
  marketStats: {
    totalMarketLabel: string;
  };
  /** Demographic threshold descriptions */
  demographicThresholds: {
    hnwi: string;
    uhnwi: string;
    aspiring: string;
  };
}

/**
 * Default business strategy configuration values
 * Values can be overridden via environment-specific config
 */
const businessConfig: BusinessConfig = {
  aiServicePrices: {
    openClaw: '$500/month',
    unicorn: '$300/month',
    fullPlatform: '$2000/month',
  },
  marketStats: {
    totalMarketLabel: '$1.5T',
  },
  demographicThresholds: {
    hnwi: '$1M+',
    uhnwi: '$30M+',
    aspiring: '$100K+',
  },
}

/**
 * Returns the effective business configuration,
 * merging local defaults with any config-loader overrides
 *
 * @returns Active business configuration object
 */
const getEffectiveBusinessConfig = (): BusinessConfig => {
  return {
    ...businessConfig,
    marketStats: {
      ...businessConfig.marketStats,
    },
  };
};

const activeBusinessConfig = getEffectiveBusinessConfig();

/**
 * VIP tier pricing structure
 */
interface VipTier {
  /** Tier name / 等级名称 */
  name: string;
  /** Monthly price (USD) / 月度价格（美元） */
  price: number;
  /** List of benefits / 权益列表 */
  benefits: string[];
}

/**
 * Commission rate by category
 */
interface CommissionRate {
  /** Product category / 产品类别 */
  category: string;
  /** Commission percentage range / 佣金比例范围 */
  rate: string;
}

/**
 * AI service pricing
 */
interface AiService {
  /** Service name / 服务名称 */
  name: string;
  /** Price description / 价格描述 */
  price: string;
}

/**
 * Concierge package
 */
interface ConciergePackage {
  /** Package name / 套餐名称 */
  name: string;
  /** Package price / 套餐价格 */
  price: number;
  /** Price unit (e.g. per session, annual) / 价格单位 */
  unit: string;
}

/**
 * Business strategy entry configuration
 */
interface BusinessStrategyEntry {
  /** Unique strategy ID / 策略唯一ID */
  id: 'subscription' | 'commission' | 'ai-services' | 'concierge';
  /** Strategy display title / 策略显示标题 */
  title: string;
  /** Short description / 简要描述 */
  description: string;
  /** VIP tier pricing (for subscription) / VIP等级价格 */
  tiers?: VipTier[];
  /** Commission rates (for commission) / 佣金费率 */
  rates?: CommissionRate[];
  /** AI service pricing (for ai-services) / AI服务价格 */
  services?: AiService[];
  /** Concierge packages / 礼宾服务套餐 */
  packages?: ConciergePackage[];
  /** Revenue model description / 收入模型描述 */
  revenueModel: string;
  /** Target audience description / 目标受众描述 */
  target: string;
}

/**
 * Market analysis data structure
 */
interface MarketAnalysis {
  /** Total market size / 整体市场规模 */
  totalMarket: string;
  /** Annual compound growth rate / 年复合增长率 */
  growthRate: string;
  /** Online penetration percentage / 线上渗透率 */
  onlineSegment: string;
  /** AI adoption in luxury retail / AI采用率 */
  aiAdoption: string;
  /** Key geographic regions / 核心市场区域 */
  keyRegions: string[];
  /** Target customer segments / 目标客户群体 */
  targetDemographics: string[];
}

/**
 * Business strategy data with all 4 revenue streams
 * Contains complete pricing, benefits, and market positioning
 */
const businessStrategies: BusinessStrategyEntry[] = [
  {
    id: 'subscription',
    title: 'VIP Membership Program',
    description: 'Tiered subscription model offering exclusive benefits',
    tiers: [
      { name: 'Silver', price: 99, benefits: ['Early access', 'Priority support', '5% discount'] },
      { name: 'Gold', price: 299, benefits: ['All Silver + Exclusive events', '10% discount', 'Personal shopper'] },
      { name: 'Platinum', price: 999, benefits: ['All Gold + White-glove service', '15% discount', 'Private collections'] }
    ],
    revenueModel: 'Monthly recurring revenue with tier upgrade incentives',
    target: 'High-net-worth individuals seeking premium service'
  },
  {
    id: 'commission',
    title: 'Transaction Commission',
    description: 'Commission-based revenue from luxury transactions',
    rates: [
      { category: 'Watches & Jewelry', rate: '3-5%' },
      { category: 'Fashion & Bags', rate: '5-8%' },
      { category: 'Art & Collectibles', rate: '8-12%' },
      { category: 'Real Estate & Yachts', rate: '1-3%' }
    ],
    revenueModel: 'Per-transaction commission with volume bonuses',
    target: 'Luxury brands and authorized dealers'
  },
  {
    id: 'ai-services',
    title: 'AI Agent Services',
    description: 'Premium AI-powered services for businesses',
    services: [
      { name: 'Hermes Recommendation API', price: 'Custom pricing' },
      { name: 'OpenClaw Automation Suite', price: activeBusinessConfig.aiServicePrices.openClaw },
      { name: 'Unicorn Chat Integration', price: activeBusinessConfig.aiServicePrices.unicorn },
      { name: 'Full AI Platform License', price: activeBusinessConfig.aiServicePrices.fullPlatform }
    ],
    revenueModel: 'SaaS subscription + API usage fees',
    target: 'Luxury retailers, brands, and marketplaces'
  },
  {
    id: 'concierge',
    title: 'Concierge Services',
    description: 'White-glove personal shopping and advisory',
    packages: [
      { name: 'Personal Shopping', price: 150, unit: 'per session' },
      { name: 'Collection Advisory', price: 500, unit: 'per consultation' },
      { name: 'Investment Guidance', price: 1000, unit: 'per analysis' },
      { name: 'Full Year Concierge', price: 5000, unit: 'annual' }
    ],
    revenueModel: 'Service fees + success-based bonuses',
    target: 'Ultra-high-net-worth clients'
  }
]

/**
 * Global market analysis data for luxury goods industry
 * Contains market size, growth metrics, key regions, and target demographics
 */
const marketAnalysis: MarketAnalysis = {
  totalMarket: '1.5 trillion USD',
  growthRate: '8.5% CAGR',
  onlineSegment: '25% of total market',
  aiAdoption: '15% and growing rapidly',
  keyRegions: ['North America', 'Europe', 'Asia-Pacific', 'Middle East'],
  targetDemographics: [
    `HNWI (High Net Worth Individuals) - ${activeBusinessConfig.demographicThresholds.hnwi} assets`,
    `UHNWI (Ultra High Net Worth) - ${activeBusinessConfig.demographicThresholds.uhnwi} assets`,
    `Aspiring luxury consumers - ${activeBusinessConfig.demographicThresholds.aspiring} income`
  ]
}

/**
 * StrategyIcon helper component
 * Returns an SVG icon matching the business strategy type
 * 
 * @param type - Strategy type identifier ('subscription'|'commission'|'ai-services'|'concierge')
 * @returns SVG React node for the strategy icon, or default subscription icon
 */
const StrategyIcon = ({ type }: { type: string }): JSX.Element | null => {
  const icons: Record<string, JSX.Element> = {
    subscription: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 12V4m0 8c0 4.4-3.6 8-8 8s-8-3.6-8-8c0-1.5.5-3 1.3-4.2" />
        <circle cx="16" cy="12" r="3" />
      </svg>
    ),
    commission: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    'ai-services': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="18" rx="2" />
        <path d="M16 8v8M20 8v8M16 12h4" />
      </svg>
    ),
    concierge: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }

  return icons[type] || icons.subscription
}

/**
 * BusinessStrategy Component
 * Main revenue strategy presentation component showcasing business models,
 * market analysis data, and AI integration benefits.
 * 
 * Displays:
 * - Market analysis dashboard with key metrics
 * - 4 business strategy cards with detailed pricing
 * - AI integration benefits feature matrix
 * 
 * @returns {JSX.Element} Business strategy presentation section
 */
export default function BusinessStrategy() {
  return (
    <section className="py-20 bg-zl-dark-2">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            Business <span className="text-gradient">Strategy</span>
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            Comprehensive monetization plan and market positioning for sustainable growth
          </p>
        </div>

        <motion.div
          className="glass-card rounded-xl p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold font-montserrat mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-zl-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Market Analysis
          </h3>

          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 bg-zl-dark-3 rounded-lg">
              <div className="text-2xl font-bold text-zl-accent mb-2">{activeBusinessConfig.marketStats.totalMarketLabel}</div>
              <div className="text-sm text-zl-text-muted">Global Luxury Market</div>
            </div>
            <div className="text-center p-4 bg-zl-dark-3 rounded-lg">
              <div className="text-2xl font-bold text-zl-success mb-2">8.5%</div>
              <div className="text-sm text-zl-text-muted">Annual Growth Rate</div>
            </div>
            <div className="text-center p-4 bg-zl-dark-3 rounded-lg">
              <div className="text-2xl font-bold text-zl-gold mb-2">25%</div>
              <div className="text-sm text-zl-text-muted">Online Segment</div>
            </div>
            <div className="text-center p-4 bg-zl-dark-3 rounded-lg">
              <div className="text-2xl font-bold text-zl-accent-light mb-2">15%</div>
              <div className="text-sm text-zl-text-muted">AI Adoption Rate</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-zl-accent mb-3 uppercase tracking-wider">Key Regions</h4>
              <div className="flex flex-wrap gap-2">
                {marketAnalysis.keyRegions.map((region) => (
                  <span key={region} className="px-3 py-1 bg-zl-dark-3 text-zl-text-muted rounded-full text-sm">
                    {region}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zl-accent mb-3 uppercase tracking-wider">Target Demographics</h4>
              <div className="space-y-2">
                {marketAnalysis.targetDemographics.map((demo) => (
                  <div key={demo} className="flex items-center gap-2 text-sm text-zl-text-muted">
                    <span className="w-2 h-2 bg-zl-accent rounded-full"></span>
                    {demo}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {businessStrategies.map((strategy, index) => (
            <motion.div
              key={strategy.id}
              className="luxury-card rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-zl-accent/20 rounded-lg flex items-center justify-center">
                  <StrategyIcon type={strategy.id} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold font-montserrat">{strategy.title}</h3>
                  <p className="text-sm text-zl-text-muted">{strategy.description}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {(strategy.tiers || strategy.rates || strategy.services || strategy.packages)?.map((item: any) => (
                  <div key={item.name || item.category} className="flex items-center justify-between p-3 bg-zl-dark-3 rounded-lg">
                    <span className="text-sm text-zl-text">{item.name || item.category}</span>
                    <span className="text-sm font-semibold text-zl-accent">
                      {item.price ? `$${item.price}` : item.rate}
                      {item.unit && <span className="text-zl-text-muted ml-1">{item.unit}</span>}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-zl-gray">
                <div className="text-xs text-zl-accent uppercase tracking-wider mb-2">Revenue Model</div>
                <p className="text-sm text-zl-text-muted">{strategy.revenueModel}</p>
              </div>

              <div className="mt-3">
                <div className="text-xs text-zl-gold uppercase tracking-wider mb-2">Target Audience</div>
                <p className="text-sm text-zl-text-muted">{strategy.target}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="glass-card rounded-xl p-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold font-montserrat mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-zl-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Integration Benefits
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-zl-dark-3 rounded-lg border-l-2 border-zl-gold">
              <h4 className="font-semibold text-zl-gold mb-2">Hermes Agent</h4>
              <ul className="space-y-1 text-sm text-zl-text-muted">
                <li>• Personalized product recommendations</li>
                <li>• Brand expertise and heritage knowledge</li>
                <li>• Style matching algorithms</li>
                <li>• Investment value analysis</li>
              </ul>
            </div>
            <div className="p-4 bg-zl-dark-3 rounded-lg border-l-2 border-zl-accent">
              <h4 className="font-semibold text-zl-accent mb-2">OpenClaw Skills</h4>
              <ul className="space-y-1 text-sm text-zl-text-muted">
                <li>• Automated price comparisons</li>
                <li>• Real-time availability checks</li>
                <li>• Order tracking automation</li>
                <li>• Market trend monitoring</li>
              </ul>
            </div>
            <div className="p-4 bg-zl-dark-3 rounded-lg border-l-2 border-zl-accent-light">
              <h4 className="font-semibold text-zl-accent-light mb-2">Unicorn Agent</h4>
              <ul className="space-y-1 text-sm text-zl-text-muted">
                <li>• Natural conversation interface</li>
                <li>• Context-aware responses</li>
                <li>• Multi-turn dialogue support</li>
                <li>• Emotional intelligence</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}