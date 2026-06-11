/**
 * Header Component - Professional luxury navigation with language switcher
 * 
 * Design inspired by:
 * - Cartier: Minimal navigation, high emotional appeal
 * - Tiffany & Co.: Clean layouts, iconic branding
 * - Bulgari: Brand storytelling blended with navigation
 * 
 * Features:
 * - Multi-language support (Chinese default)
 * - Elegant serif typography
 * - Gold accent luxury styling
 * - Responsive mobile menu
 * 
 * @module Header
 * @version 1.3.0
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation, LanguageCode, languageNames } from '@/i18n/useTranslation'

/**
 * Header Component
 * Professional luxury navigation bar with language switcher
 * 
 * @returns {JSX.Element} Header component
 */
export default function Header() {
  // Translation hook / 翻译钩子
  const { t, i18n } = useTranslation()

  // State management / 状态管理
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState<string>('zh-CN')
  const [scrolled, setScrolled] = useState(false)

  /**
   * Initialize language on component mount
   * Gets saved language preference or defaults to Chinese
   */
  useEffect(() => {
    setCurrentLang(i18n.language)

    // Scroll detection for header styling / 滚动检测用于头部样式
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [i18n.language])

  /**
   * Handle language change
   * Updates language and closes dropdown
   * @param {LanguageCode} lang - Language code to switch to
   */
  const handleLanguageChange = (lang: LanguageCode) => {
    i18n.changeLanguage(lang)
    setCurrentLang(lang)
    setIsLangOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-zl-dark/98 border-b border-zl-gold/20 backdrop-blur-xl shadow-lg'
        : 'bg-zl-dark/95 border-b border-zl-dark-3'
        }`}
    >
      <div className="container">
        <div className="flex items-center justify-between py-5">
          {/* Logo - Professional luxury design / 专业奢华Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            {/* Logo SVG - Elegant crown design / 优雅皇冠设计 */}
            <div className="w-14 h-14 flex items-center justify-center relative">
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:scale-105"
              >
                {/* Crown base / 皇冠底座 */}
                <path
                  d="M14 42 L42 42 L42 28 L14 28 Z"
                  fill="#0f0f0f"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                />
                {/* Crown peaks / 皇冠尖顶 */}
                <path
                  d="M14 28 L18 18 L22 28 L26 14 L30 28 L34 18 L38 28 L42 28"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Crown jewels / 皇冠宝石 */}
                <circle cx="26" cy="14" r="3" fill="#00B4D8" />
                <circle cx="18" cy="18" r="2" fill="#D4AF37" />
                <circle cx="34" cy="18" r="2" fill="#D4AF37" />
                {/* Center diamond / 中央钻石 */}
                <path
                  d="M28 32 L32 36 L28 40 L24 36 Z"
                  fill="#D4AF37"
                  stroke="#E5C158"
                  strokeWidth="0.5"
                />
                {/* AI indicator / AI标识 */}
                <circle cx="28" cy="36" r="1" fill="#00B4D8" opacity="0.8" />
              </svg>
            </div>

            {/* Brand name - Elegant serif typography / 优雅衬线字体 */}
            <div className="flex flex-col">
              <span
                className="text-2xl font-semibold tracking-[0.2em] font-serif text-zl-text group-hover:text-zl-gold transition-colors duration-300"
                style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif SC', serif" }}
              >
                ZLUXURY
              </span>
              <span className="text-[10px] text-zl-gold tracking-[0.3em] uppercase font-light">
                {t('ai.badge')} · {t('ai.vipBadge')}
              </span>
            </div>
          </Link>

          {/* Navigation - Minimal elegant style / 极简优雅导航 */}
          <nav className="hidden lg:flex items-center gap-10">
            <Link
              href="/"
              className="nav-link text-sm tracking-[0.15em] uppercase text-zl-text hover:text-zl-gold transition-colors"
              style={{ fontFamily: "'Montserrat', 'Noto Sans SC', sans-serif" }}
            >
              {t('nav.home')}
            </Link>
            <Link
              href="/collections"
              className="nav-link text-sm tracking-[0.15em] uppercase text-zl-text-muted hover:text-zl-gold transition-colors"
            >
              {t('nav.collections')}
            </Link>
            <Link
              href="/products"
              className="nav-link text-sm tracking-[0.15em] uppercase text-zl-text-muted hover:text-zl-gold transition-colors"
            >
              {t('nav.products')}
            </Link>
            <Link
              href="/ai-assistant"
              className="nav-link text-sm tracking-[0.15em] uppercase text-zl-text-muted hover:text-zl-gold transition-colors"
            >
              {t('nav.aiAssistant')}
            </Link>
            <Link
              href="/concierge"
              className="nav-link text-sm tracking-[0.15em] uppercase text-zl-text-muted hover:text-zl-gold transition-colors"
            >
              {t('nav.concierge')}
            </Link>
          </nav>

          {/* Actions - Right side / 右侧操作区 */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Language Switcher / 语言切换 */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-3 py-2 text-zl-text-muted hover:text-zl-gold transition-colors"
                onClick={() => setIsLangOpen(!isLangOpen)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="text-xs tracking-wider uppercase">{languageNames[currentLang as LanguageCode] || '简体中文'}</span>
              </button>

              {/* Language dropdown / 语言下拉菜单 */}
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 py-2 bg-zl-dark-2 border border-zl-gold/20 rounded-lg shadow-xl min-w-[120px]">
                  {(Object.keys(languageNames) as LanguageCode[]).map((lang) => (
                    <button
                      key={lang}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${currentLang === lang
                        ? 'text-zl-gold bg-zl-dark-3'
                        : 'text-zl-text-muted hover:text-zl-text hover:bg-zl-dark-3'
                        }`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {languageNames[lang]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button / 搜索按钮 */}
            <button
              className="p-2 text-zl-text-muted hover:text-zl-gold transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User Menu / 用户菜单 */}
            <button className="p-2 text-zl-text-muted hover:text-zl-gold transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {/* Cart / 购物袋 */}
            <button className="p-2 text-zl-text-muted hover:text-zl-gold transition-colors relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-zl-gold text-zl-dark text-xs rounded-full flex items-center justify-center font-semibold">3</span>
            </button>

            {/* VIP Access Button - Gold accent / VIP按钮 */}
            <Link
              href="/vip"
              className="elite-button px-6 py-3 text-sm font-semibold text-zl-dark uppercase tracking-[0.15em] rounded-lg"
            >
              {t('nav.vipAccess')}
            </Link>
          </div>

          {/* Mobile Menu Button / 移动端菜单按钮 */}
          <button
            className="lg:hidden text-zl-text p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Search Bar / 搜索栏 */}
        {isSearchOpen && (
          <div className="py-4 border-t border-zl-gold/10 animate-fade-in">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder={t('nav.searchPlaceholder')}
                className="w-full bg-zl-dark-2 border border-zl-gold/20 rounded-lg px-5 py-3 text-zl-text placeholder:text-zl-text-muted focus:border-zl-gold focus:outline-none transition-all"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-zl-gold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Mobile Menu / 移动端菜单 */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-zl-gold/10 animate-fade-in">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-zl-text hover:text-zl-gold transition-colors py-2 tracking-wider">{t('nav.home')}</Link>
              <Link href="/collections" className="text-zl-text-muted hover:text-zl-gold transition-colors py-2 tracking-wider">{t('nav.collections')}</Link>
              <Link href="/products" className="text-zl-text-muted hover:text-zl-gold transition-colors py-2 tracking-wider">{t('nav.products')}</Link>
              <Link href="/ai-assistant" className="text-zl-text-muted hover:text-zl-gold transition-colors py-2 tracking-wider">{t('nav.aiAssistant')}</Link>
              <Link href="/concierge" className="text-zl-text-muted hover:text-zl-gold transition-colors py-2 tracking-wider">{t('nav.concierge')}</Link>

              {/* Language switcher in mobile / 移动端语言切换 */}
              <div className="flex gap-3 pt-4 border-t border-zl-dark-3">
                {(Object.keys(languageNames) as LanguageCode[]).map((lang) => (
                  <button
                    key={lang}
                    className={`px-3 py-1 text-sm rounded ${currentLang === lang
                      ? 'bg-zl-gold text-zl-dark'
                      : 'text-zl-text-muted hover:text-zl-text'
                      }`}
                    onClick={() => handleLanguageChange(lang)}
                  >
                    {languageNames[lang]}
                  </button>
                ))}
              </div>

              {/* VIP button in mobile / 移动端VIP按钮 */}
              <Link
                href="/vip"
                className="elite-button px-6 py-3 text-sm font-semibold text-zl-dark uppercase tracking-wider rounded-lg text-center mt-4"
              >
                {t('nav.vipAccess')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}