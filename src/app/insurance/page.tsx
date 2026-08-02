'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/i18n/useTranslation'

const plans = [
  {
    key: 'basic',
    icon: '🛡️',
    titleKey: 'insurancePage.plans.basic.title',
    descKey: 'insurancePage.plans.basic.description',
    coverageKey: 'coverage',
    price: '1.5%',
  },
  {
    key: 'premium',
    icon: '💎',
    titleKey: 'insurancePage.plans.premium.title',
    descKey: 'insurancePage.plans.premium.description',
    coverageKey: 'coverage',
    price: '2.5%',
    popular: true,
  },
  {
    key: 'ultimate',
    icon: '👑',
    titleKey: 'insurancePage.plans.ultimate.title',
    descKey: 'insurancePage.plans.ultimate.description',
    coverageKey: 'coverage',
    price: '3.5%',
  },
]

const processSteps = [
  { step: '01', key: 'apply', icon: '📝' },
  { step: '02', key: 'assess', icon: '🔍' },
  { step: '03', key: 'insure', icon: '✅' },
  { step: '04', key: 'claim', icon: '💰' },
]

export default function InsurancePage() {
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
            {t('insurancePage.title')}
          </h1>
          <p className="text-xl text-zl-text-muted leading-relaxed mb-8">
            {t('insurancePage.subtitle')}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="#plans" className="premium-button px-8 py-3 rounded-xl">
              {t('insurancePage.viewPlans')}
            </Link>
            <Link
              href="/valuation"
              className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition"
            >
              {t('insurancePage.getValuation')}
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
            { key: 'peaceOfMind', icon: '😌' },
            { key: 'globalCoverage', icon: '🌍' },
            { key: 'quickClaims', icon: '⚡' },
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
                {t(`insurancePage.features.${item.key}.title`)}
              </h3>
              <p className="text-sm text-zl-text-muted leading-relaxed">
                {t(`insurancePage.features.${item.key}.description`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="container mb-20" id="plans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            {t('insurancePage.plansTitle')}
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            {t('insurancePage.plansSubtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`relative luxury-card rounded-2xl p-8 border ${plan.popular ? 'border-zl-accent/50 ring-2 ring-zl-accent' : 'border-zl-gray/30'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-zl-accent text-zl-dark px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {t('insurancePage.recommended')}
                </div>
              )}
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{plan.icon}</div>
                <h3 className="text-xl font-bold font-montserrat mb-2">
                  {t(plan.titleKey)}
                </h3>
                <p className="text-sm text-zl-text-muted mb-4">
                  {t(plan.descKey)}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-zl-accent">{plan.price}</span>
                  <span className="text-zl-text-muted text-sm">
                    {t('insurancePage.ofValue')}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {['theft', 'damage', 'loss', 'naturalDisaster'].map((bk) => (
                  <li key={bk} className="flex items-center gap-2 text-sm text-zl-text">
                    <svg className="w-4 h-4 text-zl-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {t(`insurancePage.coverage.${bk}`)}
                  </li>
                ))}
              </ul>

              <Link
                href="/cart"
                className={`block text-center py-3 rounded-xl transition ${plan.popular ? 'premium-button' : 'border border-zl-accent text-zl-accent hover:bg-zl-accent/10'}`}
              >
                {t('insurancePage.applyNow')}
              </Link>
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
            {t('insurancePage.processTitle')}
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
                  {t(`insurancePage.process.${item.key}.title`)}
                </h3>
                <p className="text-sm text-zl-text-muted">
                  {t(`insurancePage.process.${item.key}.description`)}
                </p>
              </motion.div>
            ))}
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
              {t('insurancePage.ctaTitle')}
            </h2>
            <p className="text-zl-text-muted max-w-2xl mx-auto mb-8">
              {t('insurancePage.ctaSubtitle')}
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/products" className="premium-button px-8 py-3 rounded-xl text-lg">
                {t('insurancePage.shopInsured')}
              </Link>
              <Link
                href="/"
                className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition text-lg"
              >
                {t('insurancePage.backHome')}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}