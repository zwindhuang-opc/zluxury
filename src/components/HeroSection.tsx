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

          {/* Right Content - Real Luxury Product Imagery / 右侧真实产品视觉 */}
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

              {/* Real luxury product image / 真实奢侈品产品图片 */}
              <div className="relative w-full h-full overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1607207927040-0d3e9465f25a?w=800&q=80"
                  alt="Luxury Collection - Watches, Jewelry & Handbags / 奢华系列 - 腕表、珠宝与手袋"
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={(e) => {
                    // Fallback if image blocked by ORB / ORB阻止时的备用方案
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-zl-dark-2 to-zl-dark';
                      fallback.innerHTML = `
                    <div class="text-center p-8">
                      <div class="text-6xl mb-4">💎</div>
                      <h3 class="text-2xl font-bold text-zl-gold font-montserrat">ZLUXURY</h3>
                      <p class="text-zl-text-muted mt-2">Exclusive Collection</p>
                    </div>
                  `;
                      parent.appendChild(fallback);
                    }
                  }}
                />

                {/* Image overlay gradient for text readability / 图片渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-zl-dark/60 via-transparent to-transparent"></div>

                {/* Floating product labels / 浮动产品标签 */}
                <div className="absolute bottom-8 left-8 right-8 space-y-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-zl-dark/80 backdrop-blur-sm rounded-full border border-zl-gold/30">
                    <span className="w-2 h-2 bg-zl-gold rounded-full animate-pulse"></span>
                    <span className="text-xs text-zl-gold uppercase tracking-wider font-medium">Exclusive Collection</span>
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed backdrop-blur-sm bg-black/20 p-3 rounded-lg">
                    Curated selection from Rolex, Hermès, Cartier & more
                  </p>
                </div>
              </div>

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