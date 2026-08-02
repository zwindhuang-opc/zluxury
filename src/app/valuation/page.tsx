'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/i18n/useTranslation'

const services = [
  {
    key: 'marketValuation',
    icon: '📊',
    titleKey: 'valuationPage.services.marketValuation.title',
    descKey: 'valuationPage.services.marketValuation.description',
  },
  {
    key: 'insuranceValuation',
    icon: '🛡️',
    titleKey: 'valuationPage.services.insuranceValuation.title',
    descKey: 'valuationPage.services.insuranceValuation.description',
  },
  {
    key: 'resaleValuation',
    icon: '💱',
    titleKey: 'valuationPage.services.resaleValuation.title',
    descKey: 'valuationPage.services.resaleValuation.description',
  },
  {
    key: 'investmentValuation',
    icon: '📈',
    titleKey: 'valuationPage.services.investmentValuation.title',
    descKey: 'valuationPage.services.investmentValuation.description',
  },
]

const processSteps = [
  { step: '01', key: 'submit', icon: '📤' },
  { step: '02', key: 'analyze', icon: '📊' },
  { step: '03', key: 'report', icon: '📋' },
  { step: '04', key: 'certify', icon: '🏆' },
]

export default function ValuationPage() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen pt-24 pb-20">
      <section className="container mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-montserrat mb-6">
            {t('valuationPage.title')}
          </h1>
          <p className="text-xl text-zl-text-muted leading-relaxed mb-8">
            {t('valuationPage.subtitle')}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="#services" className="premium-button px-8 py-3 rounded-xl">
              {t('valuationPage.getValuation')}
            </Link>
            <Link
              href="/authentication"
              className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition"
            >
              {t('valuationPage.verifyFirst')}
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="container mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            { key: 'accurate', icon: '🎯' },
            { key: 'comprehensive', icon: '📋' },
            { key: 'certified', icon: '✓' },
          ].map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-card rounded-2xl p-8 text-center group"
            >
              <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold font-montserrat mb-3 group-hover:text-zl-accent transition">
                {t(`valuationPage.features.${item.key}.title`)}
              </h3>
              <p className="text-sm text-zl-text-muted leading-relaxed">
                {t(`valuationPage.features.${item.key}.description`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="container mb-20" id="services">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            {t('valuationPage.servicesTitle')}
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            {t('valuationPage.servicesSubtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((svc, index) => (
            <motion.div
              key={svc.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="luxury-card rounded-2xl p-6 group"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl mb-2 transition-transform duration-300 group-hover:scale-110">
                  {svc.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold font-montserrat mb-2 group-hover:text-zl-accent transition">
                    {t(svc.titleKey)}
                  </h3>
                  <p className="text-sm text-zl-text-muted leading-relaxed">
                    {t(svc.descKey)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold font-montserrat mb-8 text-center">
            {t('valuationPage.processTitle')}
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {processSteps.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-5xl font-bold text-zl-accent/30 mb-2">{item.step}</div>
                <h3 className="font-semibold font-montserrat mb-2">
                  {t(`valuationPage.process.${item.key}.title`)}
                </h3>
                <p className="text-sm text-zl-text-muted">
                  {t(`valuationPage.process.${item.key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="container mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="glass-card rounded-2xl p-8">
            <h3 className="text-2xl font-bold font-montserrat mb-4">
              {t('valuationPage.reportTitle')}
            </h3>
            <ul className="space-y-3">
              {[
                'itemDescription',
                'conditionAssessment',
                'marketAnalysis',
                'priceRange',
                'investmentRating',
              ].map((key) => (
                <li key={key} className="flex items-center gap-3 text-sm text-zl-text-muted">
                  <svg className="w-4 h-4 text-zl-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t(`valuationPage.reportContents.${key}`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <h3 className="text-2xl font-bold font-montserrat mb-4">
              {t('valuationPage.pricingTitle')}
            </h3>
            <div className="space-y-4">
              {[
                { key: 'standard', price: '$50' },
                { key: 'express', price: '$150' },
                { key: 'premium', price: '$300' },
              ].map((plan) => (
                <div key={plan.key} className="flex items-center justify-between p-4 bg-zl-dark-3 rounded-lg">
                  <div>
                    <span className="font-semibold text-zl-text">
                      {t(`valuationPage.pricing.${plan.key}.name`)}
                    </span>
                    <span className="text-sm text-zl-text-muted ml-2">
                      {t(`valuationPage.pricing.${plan.key}.desc`)}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-zl-accent">{plan.price}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

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
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-zl-gold rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
              {t('valuationPage.ctaTitle')}
            </h2>
            <p className="text-zl-text-muted max-w-2xl mx-auto mb-8">
              {t('valuationPage.ctaSubtitle')}
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/products" className="premium-button px-8 py-3 rounded-xl text-lg">
                {t('valuationPage.startNow')}
              </Link>
              <Link
                href="/"
                className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition text-lg"
              >
                {t('valuationPage.backHome')}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}