/**
 * Root Layout - Main application layout
 * 
 * Features:
 * - Chinese (zh-CN) as default language
 * - SEO optimized metadata
 * - Professional luxury styling
 * 
 * Note: i18n is handled in client components only
 * 
 * @module layout
 * @version 1.3.0
 */

import type { Metadata } from 'next'
import {
  Cormorant_Garamond,
  Montserrat,
  Noto_Sans_SC,
  Noto_Serif_SC,
  Playfair_Display,
  Inter,
} from 'next/font/google'
import './globals.css'

/**
 * Self-hosted Google Fonts via next/font/google.
 * Eliminates external fonts.googleapis.com requests (no ERR_ABORTED / ORB issues).
 * Fonts are inlined and served from the same origin.
 */
const cormorantGaramond = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const montserrat = Montserrat({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansSC = Noto_Sans_SC({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
})

const notoSerifSC = Noto_Serif_SC({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-noto-serif-sc',
  display: 'swap',
})

/**
 * Application metadata for SEO optimization
 * Optimized for luxury commerce platform
 */
export const metadata: Metadata = {
  title: 'ZLuxury | 臻享奢华 · AI智能奢华购物平台',
  description: '融合人工智能与顶级奢华，为您呈现独一无二的购物体验。独享专属顾问服务、限量臻品收藏，Unicorn AI智能推荐。',
  keywords: '奢华, 奢侈品, AI, 购物, 珠宝, 腕表, 手袋, 香氛, Hermes, OpenClaw, Unicorn, 限量款, VIP会员',
  authors: [{ name: 'ZLuxury Team' }],
  openGraph: {
    title: 'ZLuxury | 臻享奢华 · AI智能奢华购物平台',
    description: '融合人工智能与顶级奢华，为您呈现独一无二的购物体验。',
    type: 'website',
    locale: 'zh_CN',
    siteName: 'ZLuxury',
  },
}

/**
 * Root Layout Component
 * Wraps all pages with consistent styling
 * 
 * Font CSS variables injected on root <html> element
 * so they're available to Tailwind and all descendant components.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Layout component
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="zh-CN"
      className={`scroll-smooth ${cormorantGaramond.variable} ${montserrat.variable} ${playfairDisplay.variable} ${inter.variable} ${notoSansSC.variable} ${notoSerifSC.variable}`}
    >
      <body className="bg-zl-dark text-zl-text antialiased font-sans">
        {/* Main content wrapper / 主内容包装器 */}
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}