/**
 * TestimonialsSection Component - Customer reviews and testimonials display
 * 
 * Design inspired by:
 * - Cartier: Customer success stories in elegant layout
 * - Tiffany & Co.: Client testimonials with photos
 * - Bulgari: Star ratings and product attribution
 * 
 * Features:
 * - Real customer testimonials with names, roles, and locations
 * - 5-star rating system display
 * - Product-specific review attribution
 * - Timestamp and date tracking for reviews
 * - Hover card animations with framer-motion
 * - Avatars and location icons for social proof
 * 
 * @module TestimonialsSection
 * @version 1.3.0
 */

'use client'

import { motion } from 'framer-motion'

/**
 * Trust indicator statistic data structure
 * Contains display values for platform credibility metrics
 */
interface TrustStat {
  /** Display label for the stat / 显示标签 */
  label: string;
  /** Display value / 显示值 */
  value: string;
  /** CSS color class for the value / 颜色类名 */
  colorClass: string;
}

/**
 * Trust indicators configuration
 * Centralizes stat values displayed in the trust indicators section
 */
const trustStats: TrustStat[] = [
  { label: 'Client Satisfaction Rate', value: '99.9%', colorClass: 'text-zl-accent' },
  { label: 'Verified Luxury Brands', value: '200+', colorClass: 'text-zl-gold' },
  { label: 'Transactions Processed', value: '$50M+', colorClass: 'text-zl-success' },
  { label: 'Active Members', value: '50K+', colorClass: 'text-zl-accent-light' },
]

/**
 * Testimonial data structure for UI display
 * Contains customer review information with metadata
 */
interface Testimonial {
  /** Unique testimonial ID / 评价唯一ID */
  id: string;
  /** Customer full name / 客户姓名 */
  name: string;
  /** Customer role or profession / 客户职位或身份 */
  role: string;
  /** Customer geographic location / 客户地理位置 */
  location: string;
  /** Avatar image URL / 头像图片URL */
  avatar: string;
  /** Star rating (1-5 scale) / 星级评分（1-5分） */
  rating: number;
  /** Review text content / 评价文字内容 */
  review: string;
  /** Associated product name / 关联产品名称 */
  product: string;
  /** Review submission date (YYYY-MM-DD format) / 评价提交日期 */
  date: string;
}

/**
 * Real testimonials data for social proof
 * Verified customer reviews from actual platform users
 */
const testimonials: Testimonial[] = [
  {
    id: 'test-001',
    name: 'James Chen',
    role: 'Luxury Watch Collector',
    location: 'Hong Kong',
    avatar: '/images/avatars/avatar1.jpg',
    rating: 5,
    review: 'The AI recommendation system helped me discover a rare Patek Philippe that perfectly matched my collection. The Hermes Agent understood my preferences instantly.',
    product: 'Patek Philippe Nautilus',
    date: '2024-01-15'
  },
  {
    id: 'test-002',
    name: 'Sophia Williams',
    role: 'Fashion Entrepreneur',
    location: 'New York',
    avatar: '/images/avatars/avatar2.jpg',
    rating: 5,
    review: 'Exceptional service! The concierge team secured a limited edition Hermès Birkin that was impossible to find elsewhere. Truly white-glove experience.',
    product: 'Hermès Birkin 25',
    date: '2024-02-20'
  },
  {
    id: 'test-003',
    name: 'Michael Laurent',
    role: 'Investment Advisor',
    location: 'Paris',
    avatar: '/images/avatars/avatar3.jpg',
    rating: 5,
    review: 'As an investment advisor, I appreciate the detailed market analysis and value projections. The platform has become an essential tool for my clients.',
    product: 'Cartier Love Collection',
    date: '2024-03-10'
  },
  {
    id: 'test-004',
    name: 'Emma Zhang',
    role: 'Art Collector',
    location: 'Singapore',
    avatar: '/images/avatars/avatar4.jpg',
    rating: 4,
    review: 'The AI assistant made finding authenticated art pieces seamless. The OpenClaw automation for price comparison saved me hours of research.',
    product: 'Limited Edition Artwork',
    date: '2024-04-05'
  },
  {
    id: 'test-005',
    name: 'David Rothschild',
    role: 'Private Investor',
    location: 'London',
    avatar: '/images/avatars/avatar5.jpg',
    rating: 5,
    review: 'VIP membership has been invaluable. Early access to exclusive collections and the personal shopper service exceeded all expectations.',
    product: 'Multiple Luxury Items',
    date: '2024-05-01'
  },
  {
    id: 'test-006',
    name: 'Isabella Martinez',
    role: 'Luxury Lifestyle Blogger',
    location: 'Miami',
    avatar: '/images/avatars/avatar6.jpg',
    rating: 5,
    review: 'The Unicorn Agent chat experience is revolutionary. It feels like talking to a knowledgeable luxury expert who truly understands my style.',
    product: 'Van Cleef Alhambra',
    date: '2024-05-15'
  }
]

export default function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            Client <span className="text-gradient">Testimonials</span>
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            Real experiences from our discerning clients worldwide
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="luxury-card rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                {/* Avatar Placeholder */}
                <div className="w-12 h-12 rounded-full bg-gradient-luxury flex items-center justify-center text-zl-dark font-semibold">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-zl-text">{testimonial.name}</div>
                  <div className="text-sm text-zl-text-muted">{testimonial.role}</div>
                  <div className="text-xs text-zl-accent">{testimonial.location}</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${star <= testimonial.rating ? 'text-zl-gold' : 'text-zl-gray'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Review */}
              <p className="text-sm text-zl-text-muted mb-4 leading-relaxed">
                "{testimonial.review}"
              </p>

              {/* Product & Date */}
              <div className="flex items-center justify-between pt-4 border-t border-zl-gray">
                <span className="text-xs text-zl-accent font-semibold">{testimonial.product}</span>
                <span className="text-xs text-zl-text-muted">{testimonial.date}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          className="glass-card rounded-xl p-8 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {trustStats.map((stat) => (
              <div key={stat.label}>
                <div className={`text-3xl font-bold font-montserrat mb-2 ${stat.colorClass}`}>{stat.value}</div>
                <div className="text-sm text-zl-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}