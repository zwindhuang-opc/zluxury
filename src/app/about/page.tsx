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

// ============================================================================
// DATA
// ============================================================================

const coreValues = [
  {
    title: 'Authenticity',
    description:
      'Every piece is meticulously authenticated through our network of trusted experts and auction house partnerships.',
    icon: '🛡️',
  },
  {
    title: 'AI-Personalized',
    description:
      'Our Unicorn AI engine learns your preferences to recommend pieces that match your unique taste and lifestyle.',
    icon: '🤖',
  },
  {
    title: 'Global Sourcing',
    description:
      'Direct channels from Hong Kong, Japan, Europe, and bonded warehouses ensure the best prices and fastest delivery.',
    icon: '🌐',
  },
  {
    title: 'VIP Concierge',
    description:
      'Dedicated personal shoppers for our premium members, providing white-glove service from selection to delivery.',
    icon: '💎',
  },
]

const businessModel = [
  {
    step: '01',
    title: 'Sourcing',
    description:
      'We procure luxury items through multiple channels: Hong Kong direct, Japan auctions, European boutiques, and Shanghai FTZ bonded warehouses.',
  },
  {
    step: '02',
    title: 'Authentication',
    description:
      'Every item undergoes rigorous authentication by certified appraisers. Serial numbers, condition grading, and provenance are all verified.',
  },
  {
    step: '03',
    title: 'AI Matching',
    description:
      'Our Unicorn AI engine analyzes your browsing, purchase history, and preferences to recommend pieces tailored to your taste and lifestyle.',
  },
  {
    step: '04',
    title: 'Delivery',
    description:
      'Choose from four shipping modes including personal carry (0-1 day), bonded warehouse (2-5 days), direct mail (7-14 days), and express courier (3-7 days).',
  },
]

const stats = [
  { value: '500+', label: 'Authenticated Products' },
  { value: '15+', label: 'Luxury Brands' },
  { value: '4', label: 'Sourcing Channels' },
  { value: '30%', label: 'Average Savings vs Retail' },
]

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
            About <span className="text-gradient">ZLuxury</span>
          </h1>
          <p className="text-xl text-zl-text-muted leading-relaxed mb-8">
            Redefining luxury commerce through the fusion of artificial
            intelligence and timeless elegance. We connect discerning
            collectors with the world&apos;s finest pieces, authenticated and
            delivered with unparalleled care.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/products" className="premium-button px-8 py-3 rounded-xl">
              Explore Collection
            </Link>
            <Link
              href="/collections"
              className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition"
            >
              View Collections
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
            <h2 className="text-2xl font-bold font-montserrat mb-4">Our Mission</h2>
            <p className="text-zl-text-muted leading-relaxed">
              To democratize luxury by making authentic, high-end pieces
              accessible to collectors worldwide through transparent pricing,
              AI-driven personalization, and a seamless cross-border shopping
              experience. We believe luxury should be inclusive, intelligent,
              and deeply personal.
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
            <h2 className="text-2xl font-bold font-montserrat mb-4">Our Vision</h2>
            <p className="text-zl-text-muted leading-relaxed">
              To become the world&apos;s leading AI-powered luxury marketplace
              by 2030, connecting collectors with rare and exclusive pieces
              from every corner of the globe. We envision a future where
              technology enhances the human experience of acquiring and
              cherishing beautiful objects.
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
            Core <span className="text-gradient">Values</span>
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            The principles that guide everything we do — from sourcing to
            customer service.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="luxury-card rounded-xl p-6 text-center group"
            >
              <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                {value.icon}
              </div>
              <h3 className="text-lg font-semibold font-montserrat mb-2 group-hover:text-zl-accent transition">
                {value.title}
              </h3>
              <p className="text-sm text-zl-text-muted leading-relaxed">
                {value.description}
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
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            Our unique business model combines global sourcing with
            AI-powered personalization to deliver unmatched value.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {businessModel.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative"
            >
              <div className="luxury-card rounded-xl p-6 h-full">
                <div className="text-5xl font-bold text-zl-accent/30 mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold font-montserrat mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-zl-text-muted leading-relaxed">
                  {step.description}
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
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold font-montserrat text-zl-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-zl-text-muted uppercase tracking-wide">
                  {stat.label}
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
              Ready to Experience Luxury Differently?
            </h2>
            <p className="text-zl-text-muted max-w-2xl mx-auto mb-8">
              Join ZLuxury today and discover a new paradigm in luxury
              shopping — where artificial intelligence meets timeless
              craftsmanship.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/products" className="premium-button px-8 py-3 rounded-xl text-lg">
                Shop Now
              </Link>
              <Link
                href="/collections"
                className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition text-lg"
              >
                Browse Collections
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}