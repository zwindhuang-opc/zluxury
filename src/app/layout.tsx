import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ZLuxury - Premium AI-Powered Luxury Commerce Platform',
  description: 'Experience the future of luxury commerce. AI-powered recommendations, exclusive collections, and personalized service for discerning clients.',
  keywords: 'luxury, premium, AI, ecommerce, fashion, jewelry, watches, art, collectibles, Hermes, OpenClaw, Unicorn',
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
    <html lang="en">
      <body className="bg-zl-dark text-zl-text antialiased">
        {children}
      </body>
    </html>
  )
}