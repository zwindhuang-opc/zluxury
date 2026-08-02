'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/i18n/useTranslation'

const upcomingAuctions = [
  {
    key: 'watches2026',
    date: '2026-09-15',
    titleKey: 'auctionsPage.lots.watches2026.title',
    categoryKey: 'watches',
    estimateKey: 'estimate',
    icon: '⌚',
  },
  {
    key: 'jewelry2026',
    date: '2026-10-20',
    titleKey: 'auctionsPage.lots.jewelry2026.title',
    categoryKey: 'jewelry',
    estimateKey: 'estimate',
    icon: '💎',
  },
  {
    key: 'bags2026',
    date: '2026-11-10',
    titleKey: 'auctionsPage.lots.bags2026.title',
    categoryKey: 'fashion',
    estimateKey: 'estimate',
    icon: '👜',
  },
  {
    key: 'art2026',
    date: '2026-12-05',
    titleKey: 'auctionsPage.lots.art2026.title',
    categoryKey: 'art',
    estimateKey: 'estimate',
    icon: '🎨',
  },
]

const categories = [
  { key: 'watches', icon: '⌚' },
  { key: 'jewelry', icon: '💎' },
  { key: 'fashion', icon: '👜' },
  { key: 'art', icon: '🎨' },
]

export default function AuctionsPage() {
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
            {t('auctionsPage.title')}
          </h1>
          <p className="text-xl text-zl-text-muted leading-relaxed mb-8">
            {t('auctionsPage.subtitle')}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="#upcoming" className="premium-button px-8 py-3 rounded-xl">
              {t('auctionsPage.viewUpcoming')}
            </Link>
            <Link
              href="#how"
              className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition"
            >
              {t('auctionsPage.howItWorks')}
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
            { key: 'curated', icon: '🎯' },
            { key: 'authenticated', icon: '🛡️' },
            { key: 'global', icon: '🌍' },
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
                {t(`auctionsPage.features.${item.key}.title`)}
              </h3>
              <p className="text-sm text-zl-text-muted leading-relaxed">
                {t(`auctionsPage.features.${item.key}.description`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="container mb-20" id="upcoming">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            {t('auctionsPage.upcomingTitle')}
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            {t('auctionsPage.upcomingSubtitle')}
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <button className="px-4 py-2 bg-zl-accent text-zl-dark rounded-full text-sm font-semibold">
            {t('common.all')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.key}
              className="px-4 py-2 bg-zl-dark-3 text-zl-text-muted rounded-full text-sm hover:text-zl-text transition"
            >
              {cat.icon} {t(`categories.${cat.key}`)}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {upcomingAuctions.map((auction, index) => (
            <motion.div
              key={auction.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="luxury-card rounded-2xl p-6 group"
            >
              <div className="flex gap-6">
                <div className="text-6xl flex-shrink-0">{auction.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 bg-zl-accent/20 text-zl-accent rounded-full">
                      {t(`categories.${auction.categoryKey}`)}
                    </span>
                    <span className="text-xs text-zl-text-muted">
                      {t('auctionsPage.estimated')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-montserrat mb-2 group-hover:text-zl-accent transition">
                    {t(auction.titleKey)}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-zl-text-muted">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {t(`auctionsPage.months.${auction.date.slice(5, 7)}`)} {auction.date.slice(8)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-zl-gray/30">
                    <span className="text-sm text-zl-text-muted">
                      {t(`auctionsPage.${auction.estimateKey}`)}
                    </span>
                    <Link
                      href="/products"
                      className="text-sm text-zl-accent hover:text-zl-accent-light transition"
                    >
                      {t('auctionsPage.viewLot')} →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mb-20" id="how">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold font-montserrat mb-8 text-center">
            {t('auctionsPage.howTitle')}
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', key: 'browse', icon: '🔍' },
              { step: '02', key: 'register', icon: '📝' },
              { step: '03', key: 'bid', icon: '💰' },
              { step: '04', key: 'win', icon: '🎉' },
            ].map((item, index) => (
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
                  {t(`auctionsPage.howSteps.${item.key}.title`)}
                </h3>
                <p className="text-sm text-zl-text-muted">
                  {t(`auctionsPage.howSteps.${item.key}.description`)}
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
              {t('auctionsPage.ctaTitle')}
            </h2>
            <p className="text-zl-text-muted max-w-2xl mx-auto mb-8">
              {t('auctionsPage.ctaSubtitle')}
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/products" className="premium-button px-8 py-3 rounded-xl text-lg">
                {t('auctionsPage.browseAuctions')}
              </Link>
              <Link
                href="/"
                className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition text-lg"
              >
                {t('auctionsPage.backHome')}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}