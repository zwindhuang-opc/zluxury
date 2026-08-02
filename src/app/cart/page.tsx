'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/i18n/useTranslation'

const cartItems = [
  {
    id: '1',
    nameKey: 'cartPage.items.watch.name',
    brandKey: 'cartPage.items.watch.brand',
    price: 12500,
    quantity: 1,
    icon: '⌚',
  },
  {
    id: '2',
    nameKey: 'cartPage.items.bag.name',
    brandKey: 'cartPage.items.bag.brand',
    price: 8800,
    quantity: 1,
    icon: '👜',
  },
  {
    id: '3',
    nameKey: 'cartPage.items.ring.name',
    brandKey: 'cartPage.items.ring.brand',
    price: 24000,
    quantity: 1,
    icon: '💍',
  },
]

const shippingOptions = [
  { key: 'standard', timeKey: 'cartPage.shipping.standard.time', price: 'Free' },
  { key: 'express', timeKey: 'cartPage.shipping.express.time', price: '$250' },
  { key: 'premium', timeKey: 'cartPage.shipping.premium.time', price: '$500' },
]

export default function CartPage() {
  const { t } = useTranslation()

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 250
  const total = subtotal + shipping

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
            {t('cartPage.title')}
          </h1>
          <p className="text-xl text-zl-text-muted leading-relaxed mb-8">
            {t('cartPage.subtitle')}
          </p>
        </motion.div>
      </section>

      <section className="container mb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold font-montserrat mb-6">
                {t('cartPage.itemsTitle')} ({cartItems.length})
              </h2>

              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-zl-dark-3 rounded-xl"
                  >
                    <div className="text-5xl flex-shrink-0">{item.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold font-montserrat mb-1">
                        {t(item.nameKey)}
                      </h3>
                      <p className="text-sm text-zl-text-muted">
                        {t(item.brandKey)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded border border-zl-gray flex items-center justify-center hover:border-zl-accent transition">
                          −
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button className="w-8 h-8 rounded border border-zl-gray flex items-center justify-center hover:border-zl-accent transition">
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right min-w-[100px]">
                      <div className="text-lg font-bold text-zl-accent">
                        ${item.price.toLocaleString()}
                      </div>
                    </div>
                    <button className="text-zl-text-muted hover:text-zl-error transition ml-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-zl-gray/30 flex justify-between">
                <Link
                  href="/products"
                  className="text-zl-accent hover:text-zl-accent-light transition"
                >
                  ← {t('cartPage.continueShopping')}
                </Link>
                <button className="text-sm text-zl-text-muted hover:text-zl-error transition">
                  {t('cartPage.clearCart')}
                </button>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold font-montserrat mb-4">
                {t('cartPage.shippingTitle')}
              </h2>
              <div className="space-y-3">
                {shippingOptions.map((option) => (
                  <label
                    key={option.key}
                    className="flex items-center gap-4 p-4 bg-zl-dark-3 rounded-lg cursor-pointer hover:border-zl-accent/30 transition"
                  >
                    <input
                      type="radio"
                      name="shipping"
                      defaultChecked={option.key === 'express'}
                      className="w-4 h-4 text-zl-accent focus:ring-zl-accent"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-zl-text">
                        {t(`cartPage.shipping.${option.key}.name`)}
                      </span>
                      <span className="text-sm text-zl-text-muted ml-2">
                        {t(option.timeKey)}
                      </span>
                    </div>
                    <span className="font-semibold text-zl-accent">{option.price}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold font-montserrat mb-4">
                {t('cartPage.voucherTitle')}
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('cartPage.voucherPlaceholder')}
                  className="flex-1 input-luxury"
                />
                <button className="premium-button px-6 py-3 rounded-lg">
                  {t('cartPage.apply')}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="glass-card rounded-2xl p-8 sticky top-28">
              <h2 className="text-2xl font-bold font-montserrat mb-6">
                {t('cartPage.summaryTitle')}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-zl-text-muted">{t('cartPage.subtotal')}</span>
                  <span className="font-semibold">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zl-text-muted">{t('cartPage.shippingLabel')}</span>
                  <span className="font-semibold text-zl-accent">${shipping}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zl-text-muted">{t('cartPage.insuranceLabel')}</span>
                  <span className="font-semibold">{t('cartPage.included')}</span>
                </div>
              </div>

              <div className="border-t border-zl-gray/30 pt-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-semibold">{t('cartPage.total')}</span>
                  <span className="text-3xl font-bold text-zl-accent">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full text-center premium-button px-8 py-4 rounded-xl text-lg font-semibold mb-4"
              >
                {t('cartPage.checkout')}
              </Link>

              <div className="space-y-3 text-sm">
                {['secureCheckout', 'freeReturns', 'authenticityGuaranteed'].map((key) => (
                  <div key={key} className="flex items-center gap-2 text-zl-text-muted">
                    <svg className="w-4 h-4 text-zl-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {t(`cartPage.guarantees.${key}`)}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            {t('cartPage.recommendTitle')}
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            {t('cartPage.recommendSubtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '💎', key: 'diamond' },
            { icon: '⌚', key: 'watch' },
            { icon: '👜', key: 'bag' },
          ].map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="luxury-card rounded-2xl p-6 group"
            >
              <div className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="font-semibold font-montserrat mb-2 group-hover:text-zl-accent transition">
                {t(`cartPage.recommendations.${item.key}.name`)}
              </h3>
              <p className="text-sm text-zl-text-muted mb-4">
                {t(`cartPage.recommendations.${item.key}.desc`)}
              </p>
              <Link
                href="/products"
                className="text-sm text-zl-accent hover:text-zl-accent-light transition"
              >
                {t('cartPage.viewDetails')} →
              </Link>
            </motion.div>
          ))}
        </div>
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
              {t('cartPage.ctaTitle')}
            </h2>
            <p className="text-zl-text-muted max-w-2xl mx-auto mb-8">
              {t('cartPage.ctaSubtitle')}
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/products" className="premium-button px-8 py-3 rounded-xl text-lg">
                {t('cartPage.continueShopping')}
              </Link>
              <Link
                href="/"
                className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition text-lg"
              >
                {t('cartPage.backHome')}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}