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
import './globals.css'

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
    <html lang="zh-CN" className="scroll-smooth">
      <head>
        {/* Preconnect to fonts for performance / 预连接字体服务 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Professional luxury fonts / 专业奢华字体 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&family=Noto+Serif+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-zl-dark text-zl-text antialiased font-sans">
        {/* Main content wrapper / 主内容包装器 */}
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}