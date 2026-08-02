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
import { useTranslation } from '@/i18n/useTranslation'

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
  /** Tier key for i18n lookup / 等级i18n查找键 */
  key: 'silver' | 'gold' | 'platinum';
  /** Monthly price (USD) / 月度价格（美元） */
  price: number;
  /** List of benefit keys for i18n lookup / 权益i18n查找键列表 */
  benefitKeys: string[];
}

/**
 * Commission rate by category
 */
interface CommissionRate {
  /** Category key for i18n lookup / 类别i18n查找键 */
  key: 'watchesJewelry' | 'fashionBags' | 'artCollectibles' | 'realEstateYachts';
  /** Commission percentage range / 佣金比例范围 */
  rate: string;
}

/**
 * AI service pricing
 */
interface AiService {
  /** Service key for i18n lookup / 服务i18n查找键 */
  key: 'hermesApi' | 'openClawSuite' | 'unicornChat' | 'fullPlatform';
  /** Price description / 价格描述 */
  price: string;
}

/**
 * Concierge package
 */
interface ConciergePackage {
  /** Package key for i18n lookup / 套餐i18n查找键 */
  key: 'personalShopping' | 'collectionAdvisory' | 'investmentGuidance' | 'fullYearConcierge';
  /** Package price / 套餐价格 */
  price: number;
  /** Unit key for i18n lookup (e.g. per session, annual) / 价格单位i18n查找键 */
  unitKey: 'perSession' | 'perConsultation' | 'perAnalysis' | 'annual';
}

/**
 * Business strategy entry configuration
 */
interface BusinessStrategyEntry {
  /** Unique strategy ID / 策略唯一ID */
  id: 'subscription' | 'commission' | 'ai-services' | 'concierge';
  /** Strategy key for i18n lookup / 策略i18n查找键 */
  strategyKey: 'subscription' | 'commission' | 'aiServices' | 'concierge';
  /** VIP tier pricing (for subscription) / VIP等级价格 */
  tiers?: VipTier[];
  /** Commission rates (for commission) / 佣金费率 */
  rates?: CommissionRate[];
  /** AI service pricing (for ai-services) / AI服务价格 */
  services?: AiService[];
  /** Concierge packages / 礼宾服务套餐 */
  packages?: ConciergePackage[];
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
  /** Demographic keys with thresholds / 目标客户群体键与阈值 */
  demographics: Array<{ key: 'hnwi' | 'uhnwi' | 'aspiring'; threshold: string }>;
}

/**
 * Business strategy data with all 4 revenue streams
 * Contains complete pricing, benefits, and market positioning
 */
const businessStrategies: BusinessStrategyEntry[] = [
  {
    id: 'subscription',
    strategyKey: 'subscription',
    tiers: [
      { key: 'silver', price: 99, benefitKeys: ['earlyAccess', 'prioritySupport', 'discount'] },
      { key: 'gold', price: 299, benefitKeys: ['exclusiveEvents', 'discount', 'personalShopper'] },
      { key: 'platinum', price: 999, benefitKeys: ['whiteGlove', 'discount', 'privateCollections'] }
    ],
  },
  {
    id: 'commission',
    strategyKey: 'commission',
    rates: [
      { key: 'watchesJewelry', rate: '3-5%' },
      { key: 'fashionBags', rate: '5-8%' },
      { key: 'artCollectibles', rate: '8-12%' },
      { key: 'realEstateYachts', rate: '1-3%' }
    ],
  },
  {
    id: 'ai-services',
    strategyKey: 'aiServices',
    services: [
      { key: 'hermesApi', price: 'custom' },
      { key: 'openClawSuite', price: activeBusinessConfig.aiServicePrices.openClaw },
      { key: 'unicornChat', price: activeBusinessConfig.aiServicePrices.unicorn },
      { key: 'fullPlatform', price: activeBusinessConfig.aiServicePrices.fullPlatform }
    ],
  },
  {
    id: 'concierge',
    strategyKey: 'concierge',
    packages: [
      { key: 'personalShopping', price: 150, unitKey: 'perSession' },
      { key: 'collectionAdvisory', price: 500, unitKey: 'perConsultation' },
      { key: 'investmentGuidance', price: 1000, unitKey: 'perAnalysis' },
      { key: 'fullYearConcierge', price: 5000, unitKey: 'annual' }
    ],
  }
]

/**
 * Global market analysis data for luxury goods industry
 * Contains market size, growth metrics, key regions, and target demographics
 */
const marketAnalysis: MarketAnalysis & { regionKeys: string[] } = {
  totalMarket: '1.5 trillion USD',
  growthRate: '8.5% CAGR',
  onlineSegment: '25% of total market',
  aiAdoption: '15% and growing rapidly',
  keyRegions: ['North America', 'Europe', 'Asia-Pacific', 'Middle East'],
  regionKeys: ['northAmerica', 'europe', 'asiaPacific', 'middleEast'],
  demographics: [
    { key: 'hnwi', threshold: activeBusinessConfig.demographicThresholds.hnwi },
    { key: 'uhnwi', threshold: activeBusinessConfig.demographicThresholds.uhnwi },
    { key: 'aspiring', threshold: activeBusinessConfig.demographicThresholds.aspiring }
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
 * AI benefit config for section rendering
 */
const aiBenefitConfigs = [
  { agentKey: 'hermes', borderClass: 'border-zl-gold', textClass: 'text-zl-gold' },
  { agentKey: 'openclaw', borderClass: 'border-zl-accent', textClass: 'text-zl-accent' },
  { agentKey: 'unicorn', borderClass: 'border-zl-accent-light', textClass: 'text-zl-accent-light' }
]

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
  const { t } = useTranslation()

  return (
    <section className="py-20 bg-zl-dark-2">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            {t('businessStrategy.title').split(' ')[0]} <span className="text-gradient">{t('businessStrategy.title').split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            {t('businessStrategy.subtitle')}
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
            {t('businessStrategy.marketAnalysis')}
          </h3>

          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 bg-zl-dark-3 rounded-lg">
              <div className="text-2xl font-bold text-zl-accent mb-2">{activeBusinessConfig.marketStats.totalMarketLabel}</div>
              <div className="text-sm text-zl-text-muted">{t('businessStrategy.stats.globalMarket')}</div>
            </div>
            <div className="text-center p-4 bg-zl-dark-3 rounded-lg">
              <div className="text-2xl font-bold text-zl-success mb-2">{marketAnalysis.growthRate.split(' ')[0]}</div>
              <div className="text-sm text-zl-text-muted">{t('businessStrategy.stats.growthRate')}</div>
            </div>
            <div className="text-center p-4 bg-zl-dark-3 rounded-lg">
              <div className="text-2xl font-bold text-zl-gold mb-2">{marketAnalysis.onlineSegment.split('%')[0]}%</div>
              <div className="text-sm text-zl-text-muted">{t('businessStrategy.stats.onlineSegment')}</div>
            </div>
            <div className="text-center p-4 bg-zl-dark-3 rounded-lg">
              <div className="text-2xl font-bold text-zl-accent-light mb-2">{marketAnalysis.aiAdoption.split('%')[0]}%</div>
              <div className="text-sm text-zl-text-muted">{t('businessStrategy.stats.aiAdoption')}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-zl-accent mb-3 uppercase tracking-wider">{t('businessStrategy.keyRegions')}</h4>
              <div className="flex flex-wrap gap-2">
                {marketAnalysis.regionKeys.map((regionKey) => (
                  <span key={regionKey} className="px-3 py-1 bg-zl-dark-3 text-zl-text-muted rounded-full text-sm">
                    {t(`businessStrategy.regions.${regionKey}`)}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zl-accent mb-3 uppercase tracking-wider">{t('businessStrategy.targetDemographics')}</h4>
              <div className="space-y-2">
                {marketAnalysis.demographics.map((demo) => (
                  <div key={demo.key} className="flex items-center gap-2 text-sm text-zl-text-muted">
                    <span className="w-2 h-2 bg-zl-accent rounded-full"></span>
                    {t(`businessStrategy.demographics.${demo.key}`, { threshold: demo.threshold })}
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
                  <h3 className="text-lg font-semibold font-montserrat">{t(`businessStrategy.strategies.${strategy.strategyKey}.title`)}</h3>
                  <p className="text-sm text-zl-text-muted">{t(`businessStrategy.strategies.${strategy.strategyKey}.description`)}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {strategy.tiers?.map((tier) => (
                  <div key={tier.key} className="p-3 bg-zl-dark-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-zl-text font-semibold">{t(`vip.tiers.${tier.key}`)}</span>
                      <span className="text-sm font-semibold text-zl-accent">${tier.price}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tier.benefitKeys.map((bk) => (
                        <span key={bk} className="text-xs px-2 py-0.5 rounded bg-zl-dark text-zl-text-muted">
                          {t(`vip.benefits.${bk}`)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {strategy.rates?.map((rate) => (
                  <div key={rate.key} className="flex items-center justify-between p-3 bg-zl-dark-3 rounded-lg">
                    <span className="text-sm text-zl-text">{t(`businessStrategy.categories.${rate.key}`)}</span>
                    <span className="text-sm font-semibold text-zl-accent">{rate.rate}</span>
                  </div>
                ))}

                {strategy.services?.map((service) => (
                  <div key={service.key} className="flex items-center justify-between p-3 bg-zl-dark-3 rounded-lg">
                    <span className="text-sm text-zl-text">{t(`businessStrategy.services.${service.key}`)}</span>
                    <span className="text-sm font-semibold text-zl-accent">
                      {service.price === 'custom' ? t('businessStrategy.customPricing') : service.price}
                    </span>
                  </div>
                ))}

                {strategy.packages?.map((pkg) => (
                  <div key={pkg.key} className="flex items-center justify-between p-3 bg-zl-dark-3 rounded-lg">
                    <span className="text-sm text-zl-text">{t(`businessStrategy.packages.${pkg.key}`)}</span>
                    <span className="text-sm font-semibold text-zl-accent">
                      ${pkg.price}<span className="text-zl-text-muted ml-1">{t(`businessStrategy.${pkg.unitKey}`)}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-zl-gray">
                <div className="text-xs text-zl-accent uppercase tracking-wider mb-2">{t('businessStrategy.revenueModel')}</div>
                <p className="text-sm text-zl-text-muted">{t(`businessStrategy.strategies.${strategy.strategyKey}.revenueModel`)}</p>
              </div>

              <div className="mt-3">
                <div className="text-xs text-zl-gold uppercase tracking-wider mb-2">{t('businessStrategy.targetAudience')}</div>
                <p className="text-sm text-zl-text-muted">{t(`businessStrategy.strategies.${strategy.strategyKey}.target`)}</p>
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
            {t('businessStrategy.aiBenefits.title')}
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {aiBenefitConfigs.map(({ agentKey, borderClass, textClass }) => (
              <div key={agentKey} className={`p-4 bg-zl-dark-3 rounded-lg border-l-2 ${borderClass}`}>
                <h4 className={`font-semibold ${textClass} mb-2`}>{t(`businessStrategy.aiBenefits.${agentKey}.name`)}</h4>
                <ul className="space-y-1 text-sm text-zl-text-muted">
                  {[0, 1, 2, 3].map((idx) => (
                    <li key={idx}>&bull; {t(`businessStrategy.aiBenefits.${agentKey}.benefits.${idx}`)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
