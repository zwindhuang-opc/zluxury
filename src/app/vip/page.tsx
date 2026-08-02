'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/i18n/useTranslation'

const vipTiers = [
  {
    key: 'silver',
    icon: '🥈',
    colorClass: 'from-gray-400 to-gray-300',
    borderClass: 'border-gray-400/30',
    price: 99,
    benefitKeys: ['earlyAccess', 'prioritySupport', 'discount'],
    popular: false,
  },
  {
    key: 'gold',
    icon: '🥇',
    colorClass: 'from-zl-gold to-zl-gold-light',
    borderClass: 'border-zl-gold/50',
    price: 299,
    benefitKeys: ['exclusiveEvents', 'discount', 'personalShopper'],
    popular: true,
  },
  {
    key: 'platinum',
    icon: '💎',
    colorClass: 'from-zl-accent to-zl-accent-light',
    borderClass: 'border-zl-accent/50',
    price: 999,
    benefitKeys: ['whiteGlove', 'discount', 'privateCollections'],
    popular: false,
  },
]

export default function VipPage() {
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
            {t('vipPage.title')}
          </h1>
          <p className="text-xl text-zl-text-muted leading-relaxed mb-8">
            {t('vipPage.subtitle')}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="#tiers" className="premium-button px-8 py-3 rounded-xl">
              {t('vipPage.viewPlans')}
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition"
            >
              {t('vipPage.learnMore')}
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
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            {t('vipPage.whyTitle')}
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            {t('vipPage.whySubtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { key: 'exclusiveAccess', icon: '🔓' },
            { key: 'personalConcierge', icon: '👤' },
            { key: 'curatedSelection', icon: '🎨' },
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
                {t(`vipPage.features.${item.key}.title`)}
              </h3>
              <p className="text-sm text-zl-text-muted leading-relaxed">
                {t(`vipPage.features.${item.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mb-20" id="tiers">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            {t('vipPage.tiersTitle')}
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            {t('vipPage.tiersSubtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {vipTiers.map((tier, index) => (
            <motion.div
              key={tier.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`relative luxury-card rounded-2xl p-8 border ${tier.borderClass} ${tier.popular ? 'ring-2 ring-zl-gold' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-zl-gold text-zl-dark px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {t('vipPage.mostPopular')}
                </div>
              )}
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{tier.icon}</div>
                <h3 className="text-2xl font-bold font-montserrat mb-2">
                  {t(`vipPage.tiers.${tier.key}.name`)}
                </h3>
                <p className="text-sm text-zl-text-muted mb-4">
                  {t(`vipPage.tiers.${tier.key}.description`)}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-zl-accent">${tier.price}</span>
                  <span className="text-zl-text-muted text-sm">/ {t('vipPage.perMonth')}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.benefitKeys.map((bk) => (
                  <li key={bk} className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-zl-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-zl-text">{t(`vip.benefits.${bk}`)}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/cart"
                className={`block text-center py-3 rounded-xl transition ${tier.popular ? 'elite-button text-zl-dark' : 'premium-button'}`}
              >
                {t('vipPage.joinNow')}
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
          <h2 className="text-3xl font-bold font-montserrat mb-6 text-center">
            {t('vipPage.compareTitle')}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zl-gray">
                  <th className="pb-4 pr-4 font-semibold text-zl-text">{t('vipPage.featuresColumn')}</th>
                  {vipTiers.map((tier) => (
                    <th key={tier.key} className="pb-4 px-4 text-center font-semibold">
                      {t(`vipPage.tiers.${tier.key}.name`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['discount', 'earlyAccess', 'concierge', 'events', 'personalShopper'].map((feat) => (
                  <tr key={feat} className="border-b border-zl-gray/30">
                    <td className="py-4 pr-4 text-sm text-zl-text-muted">
                      {t(`vip.benefits.${feat}`)}
                    </td>
                    {vipTiers.map((tier) => {
                      const hasBenefit = tier.benefitKeys.includes(feat)
                      return (
                        <td key={tier.key} className="py-4 px-4 text-center">
                          {hasBenefit ? (
                            <svg className="w-5 h-5 text-zl-accent mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="text-zl-gray">—</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
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
              {t('vipPage.ctaTitle')}
            </h2>
            <p className="text-zl-text-muted max-w-2xl mx-auto mb-8">
              {t('vipPage.ctaSubtitle')}
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/products" className="premium-button px-8 py-3 rounded-xl text-lg">
                {t('vipPage.shopNow')}
              </Link>
              <Link
                href="/"
                className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition text-lg"
              >
                {t('vipPage.backHome')}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}