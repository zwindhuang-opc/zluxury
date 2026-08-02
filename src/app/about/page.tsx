/**
 * ZLuxury About Page
 *
 * Describes ZLuxury's mission, vision, and business model.
 * Showcases the company's unique value proposition in luxury
 * cross-border e-commerce with AI-powered personalization.
 *
 * Features:
 * - Mission and vision statements
 * - Business model overview
 * - Core values and competitive advantages
 * - Team and technology highlights
 *
 * Architecture: Next.js App Router Page Component
 * Version: 1.0.0
 * Last Updated: 2026-07-29
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/i18n/useTranslation'

// ============================================================================
// ABOUT PAGE COMPONENT
// ============================================================================

/**
 * AboutPage Component
 *
 * Presents ZLuxury's mission, vision, and business model to visitors.
 * Uses animated sections and a professional luxury aesthetic.
 */
export default function AboutPage() {
  const { t } = useTranslation()
  return (
    <main className="min-h-screen pt-24 pb-20">
      {/* Hero Section */}
      <section className="container mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-montserrat mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-zl-text-muted leading-relaxed mb-8">
            {t('about.subtitle')}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/products" className="premium-button px-8 py-3 rounded-xl">
              {t('about.exploreCollection')}
            </Link>
            <Link
              href="/collections"
              className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition"
            >
              {t('about.viewCollections')}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="container mb-20">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl p-8"
          >
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold font-montserrat mb-4">{t('about.mission.title')}</h2>
            <p className="text-zl-text-muted leading-relaxed">
              {t('about.mission.description')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl p-8"
          >
            <div className="text-4xl mb-4">✨</div>
            <h2 className="text-2xl font-bold font-montserrat mb-4">{t('about.vision.title')}</h2>
            <p className="text-zl-text-muted leading-relaxed">
              {t('about.vision.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            {t('about.coreValues.title')}
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            {t('about.coreValues.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { key: 'authenticity', icon: '🛡️' },
            { key: 'aiPersonalized', icon: '🤖' },
            { key: 'globalSourcing', icon: '🌐' },
            { key: 'vipConcierge', icon: '💎' },
          ].map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="luxury-card rounded-xl p-6 text-center group"
            >
              <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold font-montserrat mb-2 group-hover:text-zl-accent transition">
                {t(`about.coreValues.${item.key}`)}
              </h3>
              <p className="text-sm text-zl-text-muted leading-relaxed">
                {t(`about.coreValues.${item.key}Desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Business Model */}
      <section className="container mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            {t('about.howItWorks.title')}
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            {t('about.howItWorks.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { key: 'sourcing', step: '01' },
            { key: 'authentication', step: '02' },
            { key: 'aiMatching', step: '03' },
            { key: 'delivery', step: '04' },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative"
            >
              <div className="luxury-card rounded-xl p-6 h-full">
                <div className="text-5xl font-bold text-zl-accent/30 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold font-montserrat mb-3">
                  {t(`about.howItWorks.steps.${item.key}.title`)}
                </h3>
                <p className="text-sm text-zl-text-muted leading-relaxed">
                  {t(`about.howItWorks.steps.${item.key}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', labelKey: 'authenticatedProducts' },
              { value: '15+', labelKey: 'luxuryBrands' },
              { value: '4', labelKey: 'sourcingChannels' },
              { value: '30%', labelKey: 'averageSavings' },
            ].map((stat, index) => (
              <motion.div
                key={stat.labelKey}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold font-montserrat text-zl-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-zl-text-muted uppercase tracking-wide">
                  {t(`about.stats.${stat.labelKey}`)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-zl-accent rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
              {t('about.cta.title')}
            </h2>
            <p className="text-zl-text-muted max-w-2xl mx-auto mb-8">
              {t('about.cta.subtitle')}
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/products" className="premium-button px-8 py-3 rounded-xl text-lg">
                {t('about.cta.shopNow')}
              </Link>
              <Link
                href="/collections"
                className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition text-lg"
              >
                {t('about.cta.browseCollections')}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}