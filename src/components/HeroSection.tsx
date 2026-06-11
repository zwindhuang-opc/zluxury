/**
 * HeroSection Component - Professional luxury hero section
 * 
 * Design inspired by:
 * - Cartier: Minimal navigation, high emotional appeal, heritage luxury
 * - Tiffany & Co.: Clean layouts, iconic branding, timeless elegance
 * - Bulgari: Brand storytelling, artistic luxury, cinematic visuals
 * - Rolex: Timeless elegance, cutting-edge technology
 * 
 * Features:
 * - Elegant serif typography (Cormorant Garamond)
 * - Gold accent luxury styling
 * - Professional SVG luxury imagery (no fake images)
 * - Cinematic animations
 * - Multi-language support
 * 
 * @module HeroSection
 * @version 1.3.0
 */

'use client'

import { motion } from 'framer-motion'
import { useTranslation } from '@/i18n/useTranslation'

/**
 * HeroSection Component
 * Professional luxury hero section with cinematic design
 * 
 * @returns {JSX.Element} HeroSection component
 */
export default function HeroSection() {
  // Translation hook / 翻译钩子
  const { t } = useTranslation()

  return (
    <section className="py-24 relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background - Luxury gradient / 奢华渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-zl-dark via-zl-dark-2 to-zl-dark"></div>

      {/* Gold accent lines / 金色装饰线条 */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zl-gold/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zl-gold/20 to-transparent"></div>

      {/* Decorative corner elements / 角落装饰元素 */}
      <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-zl-gold/20"></div>
      <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-zl-gold/20"></div>
      <div className="absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-zl-gold/20"></div>
      <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-zl-gold/20"></div>

      {/* Ambient glow effects / 环境光效 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zl-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zl-accent/5 rounded-full blur-3xl"></div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content - Typography focused / 左侧内容 */}
          <motion.div
            className="space-y-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge - Elegant minimal style / 优雅徽章 */}
            <motion.div
              className="inline-flex items-center gap-3 px-5 py-2.5 border border-zl-gold/30 rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Animated dot / 动态指示点 */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zl-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-zl-gold"></span>
              </span>
              <span
                className="text-xs tracking-[0.25em] uppercase text-zl-gold font-light"
                style={{ fontFamily: "'Montserrat', 'Noto Sans SC', sans-serif" }}
              >
                {t('hero.badge')}
              </span>
            </motion.div>

            {/* Title - Elegant serif typography / 优雅衬线标题 */}
            <div className="space-y-4">
              <h1
                className="text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.1] tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif" }}
              >
                <span className="text-zl-text">{t('hero.title')}</span>
                <br />
                <span className="text-zl-gold italic">{t('hero.titleHighlight')}</span>
              </h1>

              {/* Subtitle - Modern sans-serif / 现代无衬线副标题 */}
              <p
                className="text-xl md:text-2xl text-zl-text-muted tracking-[0.1em] uppercase font-light"
                style={{ fontFamily: "'Montserrat', 'Noto Sans SC', sans-serif" }}
              >
                {t('hero.subtitle')}
              </p>
            </div>

            {/* Description / 描述 */}
            <p
              className="text-lg text-zl-text-muted/80 max-w-xl leading-relaxed font-light"
              style={{ fontFamily: "'Inter', 'Noto Sans SC', sans-serif" }}
            >
              {t('hero.description')}
            </p>

            {/* CTA Buttons - Elegant minimal style / 优雅按钮 */}
            <div className="flex flex-wrap gap-6 items-center pt-4">
              <motion.button
                className="group relative px-10 py-4 border border-zl-gold text-sm font-medium uppercase tracking-[0.2em] overflow-hidden transition-all duration-500"
                style={{ fontFamily: "'Montserrat', 'Noto Sans SC', sans-serif" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button background animation / 按钮背景动画 */}
                <span className="absolute inset-0 bg-zl-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                <span className="relative text-zl-gold group-hover:text-zl-dark transition-colors duration-500">
                  {t('hero.explore')}
                </span>
              </motion.button>

              <motion.button
                className="px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-zl-text-muted hover:text-zl-accent transition-colors border border-transparent hover:border-zl-accent/30"
                style={{ fontFamily: "'Montserrat', 'Noto Sans SC', sans-serif" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('hero.tryAI')}
              </motion.button>
            </div>

            {/* Stats - Elegant minimal style / 统计数据 */}
            <div className="grid grid-cols-3 gap-12 pt-10 border-t border-zl-gold/10">
              <div className="space-y-2">
                <div
                  className="text-4xl font-semibold text-zl-gold"
                  style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif" }}
                >
                  50,000+
                </div>
                <div
                  className="text-xs text-zl-text-muted uppercase tracking-[0.15em]"
                  style={{ fontFamily: "'Montserrat', 'Noto Sans SC', sans-serif" }}
                >
                  {t('hero.stats.products')}
                </div>
              </div>
              <div className="space-y-2">
                <div
                  className="text-4xl font-semibold text-zl-gold"
                  style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif" }}
                >
                  200+
                </div>
                <div
                  className="text-xs text-zl-text-muted uppercase tracking-[0.15em]"
                  style={{ fontFamily: "'Montserrat', 'Noto Sans SC', sans-serif" }}
                >
                  {t('hero.stats.brands')}
                </div>
              </div>
              <div className="space-y-2">
                <div
                  className="text-4xl font-semibold text-zl-gold"
                  style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif" }}
                >
                  99.9%
                </div>
                <div
                  className="text-xs text-zl-text-muted uppercase tracking-[0.15em]"
                  style={{ fontFamily: "'Montserrat', 'Noto Sans SC', sans-serif" }}
                >
                  {t('hero.stats.satisfaction')}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Professional luxury imagery / 右侧视觉 */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            {/* Main visual frame / 主视觉框架 */}
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Outer decorative frame / 外部装饰框 */}
              <div className="absolute inset-0 border-2 border-zl-gold/20 rounded-lg"></div>
              <div className="absolute inset-4 border border-zl-gold/10 rounded-lg"></div>

              {/* Professional luxury SVG illustration / 专业奢华SVG插图 */}
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background gradient / 背景渐变 */}
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="50%" stopColor="#E5C158" />
                    <stop offset="100%" stopColor="#B8962E" />
                  </linearGradient>
                  <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00B4D8" />
                    <stop offset="100%" stopColor="#0096C7" />
                  </linearGradient>
                  <radialGradient id="diamondGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#E5C158" />
                    <stop offset="100%" stopColor="#D4AF37" />
                  </radialGradient>
                </defs>

                {/* Luxury Watch - Rolex inspired / 奢华腕表 */}
                <g transform="translate(50, 80)">
                  {/* Watch case / 表壳 */}
                  <circle cx="60" cy="60" r="55" fill="#0f0f0f" stroke="url(#goldGradient)" strokeWidth="2" />
                  <circle cx="60" cy="60" r="48" fill="#1a1a1a" stroke="#D4AF37" strokeWidth="0.5" />

                  {/* Watch face / 表盘 */}
                  <circle cx="60" cy="60" r="40" fill="#0a0a0a" />

                  {/* Hour markers / 时标 */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                    <g key={i} transform={`rotate(${angle} 60 60)`}>
                      {i % 3 === 0 ? (
                        <rect x="58" y="22" width="4" height="10" fill="#D4AF37" />
                      ) : (
                        <circle cx="60" cy="25" r="1.5" fill="#8a8a8a" />
                      )}
                    </g>
                  ))}

                  {/* Watch hands / 表针 */}
                  <line x1="60" y1="60" x2="60" y2="30" stroke="url(#goldGradient)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="60" y1="60" x2="85" y2="60" stroke="url(#accentGradient)" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Center jewel / 中央宝石 */}
                  <circle cx="60" cy="60" r="4" fill="url(#diamondGradient)" />

                  {/* Brand name / 品牌名 */}
                  <text x="60" y="75" textAnchor="middle" fill="#D4AF37" fontSize="6" fontFamily="Montserrat" letterSpacing="0.1em">
                    ZLUXURY
                  </text>
                </g>

                {/* Diamond Ring - Tiffany inspired / 钻戒 */}
                <g transform="translate(250, 60)">
                  {/* Ring band / 戒指环 */}
                  <ellipse cx="50" cy="80" rx="35" ry="12" fill="none" stroke="url(#goldGradient)" strokeWidth="3" />

                  {/* Diamond / 钻石 */}
                  <path
                    d="M50 40 L65 55 L50 70 L35 55 Z"
                    fill="url(#diamondGradient)"
                    stroke="#FFFFFF"
                    strokeWidth="0.5"
                  />

                  {/* Diamond facets / 钻石切面 */}
                  <path d="M50 40 L50 70" stroke="#FFFFFF" strokeWidth="0.3" opacity="0.5" />
                  <path d="M35 55 L65 55" stroke="#FFFFFF" strokeWidth="0.3" opacity="0.5" />

                  {/* Sparkle effects / 闪耀效果 */}
                  <circle cx="50" cy="55" r="2" fill="#FFFFFF" opacity="0.9" />
                  <circle cx="45" cy="48" r="1" fill="#FFFFFF" opacity="0.6" />
                  <circle cx="55" cy="62" r="1" fill="#FFFFFF" opacity="0.6" />
                </g>

                {/* Designer Handbag - Hermès inspired / 设计师手袋 */}
                <g transform="translate(240, 200)">
                  {/* Bag body / 包身 */}
                  <rect x="20" y="40" width="80" height="60" rx="5" fill="#1a1a1a" stroke="url(#goldGradient)" strokeWidth="1.5" />

                  {/* Bag flap / 包盖 */}
                  <path d="M20 40 Q60 20 100 40" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" />

                  {/* Handle / 手柄 */}
                  <path d="M40 40 Q40 15 60 15 Q80 15 80 40" fill="none" stroke="url(#goldGradient)" strokeWidth="2" />

                  {/* Clasp / 锁扣 */}
                  <rect x="55" y="35" width="10" height="8" rx="2" fill="#D4AF37" />
                  <circle cx="60" cy="39" r="2" fill="#0f0f0f" />

                  {/* Brand label / 品牌标签 */}
                  <text x="60" y="75" textAnchor="middle" fill="#D4AF37" fontSize="5" fontFamily="Montserrat" letterSpacing="0.05em">
                    ZLUXURY
                  </text>
                </g>

                {/* Pearl Necklace - Bulgari inspired / 珍珠项链 */}
                <g transform="translate(80, 250)">
                  {/* Necklace chain / 项链链 */}
                  <path
                    d="M20 20 Q60 60 100 20"
                    fill="none"
                    stroke="url(#goldGradient)"
                    strokeWidth="1"
                  />

                  {/* Pearls / 珍珠 */}
                  {[25, 40, 55, 70, 85].map((x, i) => (
                    <g key={i}>
                      <circle cx={x} cy={35 + Math.sin((i - 2) * 0.5) * 15} r="6" fill="#F5F5F5" stroke="#D4AF37" strokeWidth="0.5" />
                      <circle cx={x - 2} cy={33 + Math.sin((i - 2) * 0.5) * 15} r="1.5" fill="#FFFFFF" opacity="0.8" />
                    </g>
                  ))}

                  {/* Center pendant / 中央吊坠 */}
                  <circle cx="60" cy="50" r="8" fill="url(#diamondGradient)" stroke="#D4AF37" strokeWidth="1" />
                </g>

                {/* AI Badge - Modern tech indicator / AI标识 */}
                <g transform="translate(150, 320)">
                  <rect x="0" y="0" width="100" height="30" rx="15" fill="#00B4D8" opacity="0.15" />
                  <rect x="0" y="0" width="100" height="30" rx="15" fill="none" stroke="#00B4D8" strokeWidth="1" />
                  <text x="50" y="20" textAnchor="middle" fill="#00B4D8" fontSize="10" fontFamily="Montserrat" fontWeight="600" letterSpacing="0.1em">
                    {t('ai.badge')}
                  </text>
                </g>

                {/* Category labels / 分类标签 */}
                <text x="110" y="200" textAnchor="middle" fill="#8a8a8a" fontSize="8" fontFamily="Montserrat" letterSpacing="0.05em">
                  {t('hero.categories.watch')}
                </text>
                <text x="300" y="140" textAnchor="middle" fill="#8a8a8a" fontSize="8" fontFamily="Montserrat" letterSpacing="0.05em">
                  {t('hero.categories.diamond')}
                </text>
                <text x="300" y="280" textAnchor="middle" fill="#8a8a8a" fontSize="8" fontFamily="Montserrat" letterSpacing="0.05em">
                  {t('hero.categories.bag')}
                </text>
                <text x="130" y="330" textAnchor="middle" fill="#8a8a8a" fontSize="8" fontFamily="Montserrat" letterSpacing="0.05em">
                  {t('hero.categories.jewelry')}
                </text>
              </svg>

              {/* Floating AI indicator / 浮动AI标识 */}
              <motion.div
                className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-gradient-to-br from-zl-accent to-zl-accent-dark flex items-center justify-center shadow-lg"
                animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span
                  className="text-zl-dark font-bold text-sm tracking-wider"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  AI
                </span>
              </motion.div>

              {/* Floating VIP badge / 浮动VIP徽章 */}
              <motion.div
                className="absolute -bottom-6 -left-6 w-14 h-14 rounded-full bg-gradient-to-br from-zl-gold to-zl-gold-light flex items-center justify-center shadow-lg"
                animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <span
                  className="text-zl-dark font-bold text-xs tracking-wider"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  VIP
                </span>
              </motion.div>

              {/* Unicorn Agent badge / Unicorn代理徽章 */}
              <motion.div
                className="absolute top-1/2 -right-8 transform -translate-y-1/2 px-4 py-2 bg-zl-dark-2 border border-zl-gold/30 rounded-lg"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span
                  className="text-zl-gold text-xs tracking-[0.15em] uppercase"
                  style={{ fontFamily: "'Montserrat', 'Noto Sans SC', sans-serif" }}
                >
                  {t('ai.poweredBy')}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative line / 底部装饰线 */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px h-16 bg-gradient-to-b from-zl-gold/50 to-transparent"></div>
    </section>
  )
}