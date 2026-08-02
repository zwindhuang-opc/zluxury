'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/i18n/useTranslation'
import AIAssistantSection from '@/components/AIAssistantSection'

const agents = [
  {
    key: 'hermes',
    icon: '🛍️',
    color: '#D4AF37',
    titleKey: 'aiAssistantPage.agents.hermes.title',
    descKey: 'aiAssistantPage.agents.hermes.description',
    featureKeys: ['recommendations', 'brandExpertise', 'styleMatching', 'investmentAnalysis'],
  },
  {
    key: 'openclaw',
    icon: '⚙️',
    color: '#00B4D8',
    titleKey: 'aiAssistantPage.agents.openclaw.title',
    descKey: 'aiAssistantPage.agents.openclaw.description',
    featureKeys: ['priceComparison', 'availabilityCheck', 'orderTracking', 'marketMonitoring'],
  },
  {
    key: 'unicorn',
    icon: '🦄',
    color: '#9B59B6',
    titleKey: 'aiAssistantPage.agents.unicorn.title',
    descKey: 'aiAssistantPage.agents.unicorn.description',
    featureKeys: ['naturalConversation', 'contextUnderstanding', 'multiTurnDialogue', 'emotionalIntelligence'],
  },
]

export default function AIAssistantPage() {
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
            <span className="text-gradient">{t('aiAssistantPage.title')}</span>
          </h1>
          <p className="text-xl text-zl-text-muted leading-relaxed mb-8">
            {t('aiAssistantPage.subtitle')}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="#chat" className="premium-button px-8 py-3 rounded-xl">
              {t('aiAssistantPage.tryNow')}
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition"
            >
              {t('aiAssistantPage.learnMore')}
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
            {t('aiAssistantPage.agentsTitle')}
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            {t('aiAssistantPage.agentsSubtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="luxury-card rounded-2xl p-8 group"
            >
              <div className="text-center mb-6">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${agent.color}20`, border: `1px solid ${agent.color}40` }}
                >
                  {agent.icon}
                </div>
                <h3 className="text-xl font-bold font-montserrat mb-2" style={{ color: agent.color }}>
                  {t(agent.titleKey)}
                </h3>
                <p className="text-sm text-zl-text-muted">
                  {t(agent.descKey)}
                </p>
              </div>

              <ul className="space-y-2">
                {agent.featureKeys.map((fk) => (
                  <li key={fk} className="flex items-center gap-2 text-sm text-zl-text-muted">
                    <svg className="w-3 h-3 flex-shrink-0" fill={agent.color} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {t(`aiAssistantPage.features.${fk}`)}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mb-20" id="chat">
        <AIAssistantSection />
      </section>

      <section className="container mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <div className="glass-card rounded-2xl p-8">
            <h3 className="text-2xl font-bold font-montserrat mb-4">
              {t('aiAssistantPage.howTitle')}
            </h3>
            <p className="text-zl-text-muted leading-relaxed mb-6">
              {t('aiAssistantPage.howDescription')}
            </p>
            <div className="space-y-4">
              {[
                { step: '01', key: 'input' },
                { step: '02', key: 'analyze' },
                { step: '03', key: 'respond' },
              ].map((item) => (
                <div key={item.key} className="flex gap-4">
                  <div className="text-3xl font-bold text-zl-accent/30">{item.step}</div>
                  <div>
                    <h4 className="font-semibold text-zl-text mb-1">
                      {t(`aiAssistantPage.howSteps.${item.key}.title`)}
                    </h4>
                    <p className="text-sm text-zl-text-muted">
                      {t(`aiAssistantPage.howSteps.${item.key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <h3 className="text-2xl font-bold font-montserrat mb-4">
              {t('aiAssistantPage.benefitsTitle')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: '247', value: '24/7' },
                { key: 'languages', value: '12+' },
                { key: 'responseTime', value: '<2s' },
                { key: 'accuracy', value: '98%' },
              ].map((stat) => (
                <div key={stat.key} className="text-center p-4 bg-zl-dark-3 rounded-lg">
                  <div className="text-2xl font-bold text-zl-accent mb-1">{stat.value}</div>
                  <div className="text-xs text-zl-text-muted uppercase tracking-wide">
                    {t(`aiAssistantPage.stats.${stat.key}`)}
                  </div>
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
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
              {t('aiAssistantPage.ctaTitle')}
            </h2>
            <p className="text-zl-text-muted max-w-2xl mx-auto mb-8">
              {t('aiAssistantPage.ctaSubtitle')}
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/products" className="premium-button px-8 py-3 rounded-xl text-lg">
                {t('aiAssistantPage.browseProducts')}
              </Link>
              <Link
                href="/"
                className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition text-lg"
              >
                {t('aiAssistantPage.backHome')}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}