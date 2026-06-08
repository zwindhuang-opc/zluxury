'use client'

import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import CategoriesSection from '@/components/CategoriesSection'
import FeaturedProducts from '@/components/FeaturedProducts'
import AIAssistantSection from '@/components/AIAssistantSection'
import BusinessStrategy from '@/components/BusinessStrategy'
import TestimonialsSection from '@/components/TestimonialsSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <div className="section-divider mx-auto max-w-7xl"></div>
      <CategoriesSection />
      <FeaturedProducts />
      <div className="section-divider mx-auto max-w-7xl"></div>
      <AIAssistantSection />
      <BusinessStrategy />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}