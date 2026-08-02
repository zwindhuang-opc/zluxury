'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/i18n/useTranslation'

const shippingMethods = [
  {
    key: 'personalCarry',
    icon: '✈️',
    titleKey: 'shippingPage.methods.personalCarry.title',
    descKey: 'shippingPage.methods.personalCarry.description',
    timeKey: 'deliveryTime',
    price: 'Premium',
  },
  {
    key: 'bondedWarehouse',
    icon: '📦',
    titleKey: 'shippingPage.methods.bondedWarehouse.title',
    descKey: 'shippingPage.methods.bondedWarehouse.description',
    timeKey: 'deliveryTime',
    price: 'Economy',
  },
  {
    key: 'directMail',
    icon: '📮',
    titleKey: 'shippingPage.methods.directMail.title',
    descKey: 'shippingPage.methods.directMail.description',
    timeKey: 'deliveryTime',
    price: 'Standard',
  },
  {
    key: 'expressCourier',
    icon: '🚀',
    titleKey: 'shippingPage.methods.expressCourier.title',
    descKey: 'shippingPage.methods.expressCourier.description',
    timeKey: 'deliveryTime',
    price: 'Express',
  },
]

const regions = [
  { key: 'asia', icon: '🌏' },
  { key: 'europe', icon: '🇪🇺' },
  { key: 'northAmerica', icon: '🇺🇸' },
  { key: 'middleEast', icon: '🌍' },
]

export default function ShippingPage() {
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
            {t('shippingPage.title')}
          </h1>
          <p className="text-xl text-zl-text-muted leading-relaxed mb-8">
            {t('shippingPage.subtitle')}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="#methods" className="premium-button px-8 py-3 rounded-xl">
              {t('shippingPage.viewMethods')}
            </Link>
            <Link
              href="/cart"
              className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition"
            >
              {t('shippingPage.viewCart')}
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
            { key: 'global', icon: '🌐' },
            { key: 'secure', icon: '🔒' },
            { key: 'tracked', icon: '📍' },
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
                {t(`shippingPage.features.${item.key}.title`)}
              </h3>
              <p className="text-sm text-zl-text-muted leading-relaxed">
                {t(`shippingPage.features.${item.key}.description`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="container mb-20" id="methods">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            {t('shippingPage.methodsTitle')}
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            {t('shippingPage.methodsSubtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {shippingMethods.map((method, index) => (
            <motion.div
              key={method.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="luxury-card rounded-2xl p-6 group"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl mb-2 transition-transform duration-300 group-hover:scale-110">
                  {method.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold font-montserrat group-hover:text-zl-accent transition">
                      {t(method.titleKey)}
                    </h3>
                    <span className="text-xs px-2 py-0.5 bg-zl-accent/20 text-zl-accent rounded-full">
                      {method.price}
                    </span>
                  </div>
                  <p className="text-sm text-zl-text-muted leading-relaxed mb-4">
                    {t(method.descKey)}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-zl-gray/30">
                    <span className="text-sm text-zl-text-muted">
                      {t(`shippingPage.${method.timeKey}`)}: {t(`shippingPage.${method.key}.time`)}
                    </span>
                    <Link
                      href="/products"
                      className="text-sm text-zl-accent hover:text-zl-accent-light transition"
                    >
                      {t('shippingPage.selectMethod')} →
                    </Link>
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
            {t('shippingPage.regionsTitle')}
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {regions.map((region, index) => (
              <motion.div
                key={region.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center p-6 bg-zl-dark-3 rounded-xl"
              >
                <div className="text-4xl mb-3">{region.icon}</div>
                <h3 className="font-semibold font-montserrat mb-2">
                  {t(`shippingPage.regions.${region.key}`)}
                </h3>
                <p className="text-sm text-zl-text-muted">
                  {t(`shippingPage.regions.${region.key}Desc`)}
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
              {t('shippingPage.trackingTitle')}
            </h3>
            <p className="text-zl-text-muted mb-6">
              {t('shippingPage.trackingDescription')}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('shippingPage.trackingPlaceholder')}
                className="flex-1 input-luxury"
              />
              <button className="premium-button px-6 py-3 rounded-lg">
                {t('shippingPage.track')}
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <h3 className="text-2xl font-bold font-montserrat mb-4">
              {t('shippingPage.insuranceTitle')}
            </h3>
            <p className="text-zl-text-muted mb-6">
              {t('shippingPage.insuranceDescription')}
            </p>
            <div className="space-y-3">
              {['fullCoverage', 'damageProtection', 'lossProtection', 'signatureRequired'].map((key) => (
                <div key={key} className="flex items-center gap-2 text-sm text-zl-text-muted">
                  <svg className="w-4 h-4 text-zl-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t(`shippingPage.insuranceFeatures.${key}`)}
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
              {t('shippingPage.ctaTitle')}
            </h2>
            <p className="text-zl-text-muted max-w-2xl mx-auto mb-8">
              {t('shippingPage.ctaSubtitle')}
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/products" className="premium-button px-8 py-3 rounded-xl text-lg">
                {t('shippingPage.startShopping')}
              </Link>
              <Link
                href="/"
                className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition text-lg"
              >
                {t('shippingPage.backHome')}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}