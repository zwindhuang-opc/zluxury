'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/i18n/useTranslation'

const services = [
  {
    key: 'personalShopping',
    icon: '🛍️',
    titleKey: 'conciergePage.services.personalShopping.title',
    descKey: 'conciergePage.services.personalShopping.description',
    priceKey: 'perSession',
  },
  {
    key: 'collectionAdvisory',
    icon: '💎',
    titleKey: 'conciergePage.services.collectionAdvisory.title',
    descKey: 'conciergePage.services.collectionAdvisory.description',
    priceKey: 'perConsultation',
  },
  {
    key: 'investmentGuidance',
    icon: '📈',
    titleKey: 'conciergePage.services.investmentGuidance.title',
    descKey: 'conciergePage.services.investmentGuidance.description',
    priceKey: 'perAnalysis',
  },
  {
    key: 'fullYear',
    icon: '👑',
    titleKey: 'conciergePage.services.fullYear.title',
    descKey: 'conciergePage.services.fullYear.description',
    priceKey: 'annual',
  },
]

const processSteps = [
  { step: '01', key: 'consultation', icon: '💬' },
  { step: '02', key: 'curate', icon: '🔍' },
  { step: '03', key: 'acquire', icon: '📦' },
  { step: '04', key: 'deliver', icon: '✨' },
]

export default function ConciergePage() {
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
            {t('conciergePage.title')}
          </h1>
          <p className="text-xl text-zl-text-muted leading-relaxed mb-8">
            {t('conciergePage.subtitle')}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="#services" className="premium-button px-8 py-3 rounded-xl">
              {t('conciergePage.viewServices')}
            </Link>
            <Link
              href="/vip"
              className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition"
            >
              {t('conciergePage.vipAccess')}
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
            {t('conciergePage.whyTitle')}
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            {t('conciergePage.whySubtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { key: 'discretion', icon: '🤫' },
            { key: 'expertise', icon: '🎓' },
            { key: 'network', icon: '🌐' },
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
                {t(`conciergePage.features.${item.key}.title`)}
              </h3>
              <p className="text-sm text-zl-text-muted leading-relaxed">
                {t(`conciergePage.features.${item.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
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
            {t('conciergePage.servicesTitle')}
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            {t('conciergePage.servicesSubtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((svc, index) => (
            <motion.div
              key={svc.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="luxury-card rounded-2xl p-8 group"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl mb-2 transition-transform duration-300 group-hover:scale-110">
                  {svc.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold font-montserrat mb-2">
                    {t(svc.titleKey)}
                  </h3>
                  <p className="text-sm text-zl-text-muted mb-4 leading-relaxed">
                    {t(svc.descKey)}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-zl-gray/30">
                    <span className="text-2xl font-bold text-zl-accent">
                      {t(`conciergePage.services.${svc.key}.price`)}
                    </span>
                    <span className="text-sm text-zl-text-muted">
                      {t(`businessStrategy.${svc.priceKey}`)}
                    </span>
                  </div>
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
            {t('conciergePage.processTitle')}
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
                  {t(`conciergePage.process.${item.key}.title`)}
                </h3>
                <p className="text-sm text-zl-text-muted">
                  {t(`conciergePage.process.${item.key}.description`)}
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
              {t('conciergePage.ctaTitle')}
            </h2>
            <p className="text-zl-text-muted max-w-2xl mx-auto mb-8">
              {t('conciergePage.ctaSubtitle')}
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/cart" className="premium-button px-8 py-3 rounded-xl text-lg">
                {t('conciergePage.requestService')}
              </Link>
              <Link
                href="/"
                className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition text-lg"
              >
                {t('conciergePage.backHome')}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}