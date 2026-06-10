import type { Metadata } from 'next'
import './globals.css'
import FloatingAIChat from '@/components/FloatingAIChat'

export const metadata: Metadata = {
  title: 'ZLuxury - Premium AI-Powered Luxury Commerce Platform | 智能奢品平台',
  description: 'Experience the future of luxury commerce. AI-powered recommendations, exclusive collections, and personalized service for discerning clients. 智能奢品推荐，专属VIP服务。',
  keywords: 'luxury, premium, AI, ecommerce, fashion, jewelry, watches, art, collectibles, Hermes, OpenClaw, Unicorn, 奢品, 奢侈品, AI智能',
  authors: [{ name: 'ZLuxury Team' }],
  openGraph: {
    title: 'ZLuxury - Premium AI-Powered Luxury Commerce Platform',
    description: 'Experience the future of luxury commerce with AI-powered intelligence.',
    type: 'website',
    locale: 'en_US',
    siteName: 'ZLuxury',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-zl-dark text-zl-text antialiased">
        {children}
        <FloatingAIChat />
      </body>
    </html>
  )
}