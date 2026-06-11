/**
 * ================================================================================
 * HOME PAGE - 首页
 * ================================================================================
 * 
 * 文件说明：
 * - ZLUXURY平台首页
 * - 组装所有主要页面区块组件
 * - 展示品牌核心价值和服务
 * 
 * 架构：页面层
 * 版本：2.0.0
 * 更新日期：2025-06-10
 * 
 * 页面区块：
 * 1. Header - 页头导航
 * 2. HeroSection - 首屏展示
 * 3. CategoriesSection - 产品分类
 * 4. FeaturedProducts - 精选产品
 * 5. AIAssistantSection - AI智能助手
 * 6. BusinessStrategy - 商业策略
 * 7. TestimonialsSection - 客户评价
 * 8. Footer - 页脚
 * 
 * ================================================================================
 */

'use client'

// 导入页面区块组件 / Import page section components
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import CategoriesSection from '@/components/CategoriesSection'
import FeaturedProducts from '@/components/FeaturedProducts'
import AIAssistantSection from '@/components/AIAssistantSection'
import BusinessStrategy from '@/components/BusinessStrategy'
import TestimonialsSection from '@/components/TestimonialsSection'
import Footer from '@/components/Footer'

/**
 * 首页组件 / Home Page Component
 * 
 * 功能：
 * - 组装所有页面区块
 * - 提供整体页面结构
 */
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