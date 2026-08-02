'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/i18n/useTranslation'

const methods = [
  {
    key: 'serialNumber',
    icon: '🔢',
    titleKey: 'authenticationPage.methods.serialNumber.title',
    descKey: 'authenticationPage.methods.serialNumber.description',
  },
  {
    key: 'certOfAuthenticity',
    icon: '📜',
    titleKey: 'authenticationPage.methods.certOfAuthenticity.title',
    descKey: 'authenticationPage.methods.certOfAuthenticity.description',
  },
  {
    key: 'brandVerification',
    icon: '🏷️',
    titleKey: 'authenticationPage.methods.brandVerification.title',
    descKey: 'authenticationPage.methods.brandVerification.description',
  },
  {
    key: 'expertAppraisal',
    icon: '🔍',
    titleKey: 'authenticationPage.methods.expertAppraisal.title',
    descKey: 'authenticationPage.methods.expertAppraisal.description',
  },
]

const processSteps = [
  { step: '01', key: 'submit', icon: '📤' },
  { step: '02', key: 'examine', icon: '🔬' },
  { step: '03', key: 'verify', icon: '✅' },
  { step: '04', key: 'certify', icon: '🏆' },
]

export default function AuthenticationPage() {
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
            {t('authenticationPage.title')}
          </h1>
          <p className="text-xl text-zl-text-muted leading-relaxed mb-8">
            {t('authenticationPage.subtitle')}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="#verify" className="premium-button px-8 py-3 rounded-xl">
              {t('authenticationPage.startVerification')}
            </Link>
            <Link
              href="/products"
              className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition"
            >
              {t('authenticationPage.shopAuthentic')}
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
            { key: 'expertNetwork', icon: '🤝' },
            { key: 'blockchain', icon: '🔗' },
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
                {t(`authenticationPage.features.${item.key}.title`)}
              </h3>
              <p className="text-sm text-zl-text-muted leading-relaxed">
                {t(`authenticationPage.features.${item.key}.description`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="container mb-20" id="verify">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            {t('authenticationPage.methodsTitle')}
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            {t('authenticationPage.methodsSubtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {methods.map((m, index) => (
            <motion.div
              key={m.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="luxury-card rounded-2xl p-6 group"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl mb-2 transition-transform duration-300 group-hover:scale-110">
                  {m.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold font-montserrat mb-2 group-hover:text-zl-accent transition">
                    {t(m.titleKey)}
                  </h3>
                  <p className="text-sm text-zl-text-muted leading-relaxed">
                    {t(m.descKey)}
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
            {t('authenticationPage.processTitle')}
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
                  {t(`authenticationPage.process.${item.key}.title`)}
                </h3>
                <p className="text-sm text-zl-text-muted">
                  {t(`authenticationPage.process.${item.key}.description`)}
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
              {t('authenticationPage.ctaTitle')}
            </h2>
            <p className="text-zl-text-muted max-w-2xl mx-auto mb-8">
              {t('authenticationPage.ctaSubtitle')}
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/products" className="premium-button px-8 py-3 rounded-xl text-lg">
                {t('authenticationPage.browseProducts')}
              </Link>
              <Link
                href="/"
                className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition text-lg"
              >
                {t('authenticationPage.backHome')}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}