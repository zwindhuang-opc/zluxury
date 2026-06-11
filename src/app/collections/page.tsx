/**
 * ZLuxury Collections Page
 * 
 * Displays curated luxury product collections organized by brand, category, and theme.
 * Features:
 * - Collection filtering by category
 * - Brand showcase
 * - Featured collections
 * - Search functionality
 * 
 * Architecture: Next.js App Router Page Component
 * Version: 1.0.0
 * Last Updated: 2024-06-11
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslation } from '@/i18n/useTranslation'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Collection interface representing a curated group of products
 */
interface Collection {
  id: string;
  name: string;
  nameKey: string; // Translation key for i18n
  description: string;
  image: string;
  productCount: number;
  brands: string[];
  tags: string[];
}

/**
 * Product summary interface for collection display
 */
interface ProductSummary {
  id: string;
  name: string;
  brand: string;
  price: number;
  priceCny?: number;
  image?: string;
  category: string;
}

// ============================================================================
// DATA / 数据层
// ============================================================================

/**
 * Predefined luxury collections with curated themes
 * These represent real-world luxury brand collections
 */
const collectionsData: Collection[] = [
  {
    id: 'timeless-elegance',
    name: 'Timeless Elegance',
    nameKey: 'collections.timelessElegance',
    description: 'Classic pieces that transcend seasons and trends. Enduring designs from heritage houses.',
    image: '/images/collections/timeless.jpg',
    productCount: 156,
    brands: ['Cartier', 'Tiffany & Co.', 'Van Cleef & Arpels', 'Bulgari'],
    tags: ['classic', 'heritage', 'investment']
  },
  {
    id: 'modern-luxe',
    name: 'Modern Luxury',
    nameKey: 'collections.modernLuxe',
    description: 'Contemporary designs pushing boundaries of luxury fashion and accessories.',
    image: '/images/collections/modern.jpg',
    productCount: 234,
    brands: ['Louis Vuitton', 'Gucci', 'Dior', 'Prada'],
    tags: ['contemporary', 'trendy', 'fashion-forward']
  },
  {
    id: 'haute-horlogerie',
    name: 'Haute Horlogerie',
    nameKey: 'collections.hauteHorlogerie',
    description: 'Exceptional timepieces showcasing the pinnacle of watchmaking artistry.',
    image: '/images/collections/watches.jpg',
    productCount: 89,
    brands: ['Patek Philippe', 'Audemars Piguet', 'Vacheron Constantin', 'Breguet'],
    tags: ['watches', 'complications', 'craftsmanship']
  },
  {
    id: 'rare-gems',
    name: 'Rare Gems & Jewelry',
    nameKey: 'collections.rareGems',
    description: 'Extraordinary gemstones and jewelry pieces for discerning collectors.',
    image: '/images/collections/jewelry.jpg',
    productCount: 67,
    brands: ['Graff Diamonds', 'Harry Winston', 'Cartier High Jewelry'],
    tags: ['diamonds', 'gemstones', 'exclusive']
  },
  {
    id: 'leather-craftsmanship',
    name: 'Leather Craftsmanship',
    nameKey: 'collections.leatherCraftsmanship',
    description: 'Master leather goods showcasing exceptional artisanal skills.',
    image: '/images/collections/leather.jpg',
    productCount: 198,
    brands: ['Hermès', 'Bottega Veneta', 'Moynat'],
    tags: ['handbags', 'leather', 'artisanal']
  },
  {
    id: 'limited-editions',
    name: 'Limited Editions',
    nameKey: 'collections.limitedEditions',
    description: 'Exclusive pieces available in limited quantities for true connoisseurs.',
    image: '/images/collections/limited.jpg',
    productCount: 45,
    brands: ['Rolex', 'Chanel', 'Supreme collaborations'],
    tags: ['limited', 'exclusive', 'collectible']
  }
]

// ============================================================================
// COMPONENT / 组件
// ============================================================================

/**
 * CollectionsPage Component
 * 
 * Main collections page component that displays curated luxury collections
 * with filtering and search capabilities.
 */
export default function CollectionsPage() {
  // Translation hook / 翻译钩子
  const { t } = useTranslation()

  // State management / 状态管理
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'products' | 'brands'>('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [products, setProducts] = useState<ProductSummary[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  /**
   * Filter and sort collections based on user selections
   * Uses useMemo for performance optimization
   */
  const filteredCollections = useMemo(() => {
    let filtered = [...collectionsData]

    // Apply search filter / 应用搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(collection =>
        collection.name.toLowerCase().includes(query) ||
        collection.description.toLowerCase().includes(query) ||
        collection.brands.some(brand => brand.toLowerCase().includes(query)) ||
        collection.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply sorting / 应用排序
    switch (sortBy) {
      case 'products':
        filtered.sort((a, b) => b.productCount - a.productCount)
        break
      case 'brands':
        filtered.sort((a, b) => b.brands.length - a.brands.length)
        break
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered
  }, [searchQuery, sortBy])

  /**
   * Fetch products when a collection is selected
   * Retrieves products belonging to selected collection's brands/categories
   */
  useEffect(() => {
    const fetchCollectionProducts = async () => {
      if (selectedCategory === 'all') return
      
      setLoadingProducts(true)
      try {
        // Fetch products based on selected collection
        const response = await fetch(`/api/products?category=${selectedCategory}`)
        const result = await response.json()
        
        if (result.success && result.data?.products) {
          setProducts(result.data.products)
        }
      } catch (error) {
        console.error('[CollectionsPage] Error fetching products:', error)
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchCollectionProducts()
  }, [selectedCategory])

  /**
   * Handle collection selection
   * Updates selected category and scrolls to products section
   * @param collectionId - The ID of the selected collection
   */
  const handleCollectionSelect = (collectionId: string) => {
    setSelectedCategory(collectionId === selectedCategory ? 'all' : collectionId)
    
    // Scroll to products section after selection
    setTimeout(() => {
      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  /**
   * Generate collection icon SVG based on collection theme
   * @param collectionId - Collection identifier for icon selection
   * @returns SVG element for collection icon
   */
  const getCollectionIcon = (collectionId: string): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
      'timeless-elegance': (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M24 4L6 14v20l18 10 18-10V14L24 4z" stroke="#D4AF37" strokeWidth="2"/>
          <path d="M24 20v8m-4-4h8" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      'modern-luxe': (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="12" y="12" width="24" height="24" rx="4" stroke="#00B4D8" strokeWidth="2"/>
          <circle cx="24" cy="24" r="6" fill="#00B4D8" opacity="0.3"/>
        </svg>
      ),
      'haute-horlogerie': (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="16" stroke="#D4AF37" strokeWidth="2"/>
          <path d="M24 16v8l5 3" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/>
          <line x1="24" y1="6" x2="24" y2="10" stroke="#D4AF37" strokeWidth="2"/>
          <line x1="38" y1="24" x2="42" y2="24" stroke="#D4AF37" strokeWidth="2"/>
          <line x1="24" y1="38" x2="24" y2="42" stroke="#D4AF37" strokeWidth="2"/>
          <line x1="10" y1="24" x2="6" y2="24" stroke="#D4AF37" strokeWidth="2"/>
        </svg>
      ),
      'rare-gems': (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <polygon points="24,8 40,20 32,40 16,40 8,20" stroke="#9B59B6" strokeWidth="2" fill="#9B59B6" opacity="0.2"/>
          <line x1="24" y1="8" x2="24" y2="40" stroke="#9B59B6" strokeWidth="1"/>
          <line x1="8" y1="20" x2="40" y2="20" stroke="#9B59B6" strokeWidth="1"/>
        </svg>
      ),
      'leather-craftsmanship': (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="10" y="16" width="28" height="22" rx="2" stroke="#D4AF37" strokeWidth="2"/>
          <path d="M10 16l7-8h14l7 8" stroke="#D4AF37" strokeWidth="2"/>
          <line x1="10" y1="27" x2="38" y2="27" stroke="#D4AF37" strokeWidth="1"/>
        </svg>
      ),
      'limited-editions': (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="16" stroke="#e74c3c" strokeWidth="2"/>
          <text x="24" y="29" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#e74c3c">✦</text>
        </svg>
      )
    }
    
    return icons[collectionId] || icons['timeless-elegance']
  }

  // Render page / 渲染页面
  return (
    <main className="min-h-screen pt-24 pb-20">
      {/* Page Header / 页面头部 */}
      <section className="container mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold font-montserrat mb-4">
            <span className="text-gradient">{t('categories.title')}</span>
          </h1>
          <p className="text-zl-text-muted text-lg max-w-2xl">
            Explore our meticulously curated collections, each telling a unique story of luxury, craftsmanship, and timeless elegance.
          </p>
        </motion.div>
      </section>

      {/* Search and Filter Bar / 搜索和过滤栏 */}
      <section className="container mb-8">
        <div className="glass-card rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input / 搜索输入框 */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collections, brands, or styles..."
                className="input-luxury w-full pl-12"
              />
              <svg 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zl-text-muted" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Sort Options / 排序选项 */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-zl-dark-3 border border-zl-gray rounded-lg px-4 py-2 text-sm focus:border-zl-accent outline-none"
              >
                <option value="name">Sort by Name</option>
                <option value="products">Sort by Products</option>
                <option value="brands">Sort by Brands</option>
              </select>

              {/* View Mode Toggle / 视图模式切换 */}
              <div className="flex border border-zl-gray rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-zl-accent text-zl-dark' : 'hover:bg-zl-dark-3'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="1" y="1" width="6" height="6" rx="1"/>
                    <rect x="9" y="1" width="6" height="6" rx="1"/>
                    <rect x="1" y="9" width="6" height="6" rx="1"/>
                    <rect x="9" y="9" width="6" height="6" rx="1"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-zl-accent text-zl-dark' : 'hover:bg-zl-dark-3'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="1" y="2" width="14" height="3" rx="1"/>
                    <rect x="1" y="7" width="14" height="3" rx="1"/>
                    <rect x="1" y="12" width="14" height="3" rx="1"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Results count / 结果计数 */}
          <div className="mt-4 text-sm text-zl-text-muted">
            Showing {filteredCollections.length} of {collectionsData.length} collections
          </div>
        </div>
      </section>

      {/* Collections Grid / 收藏系列网格 */}
      <section className="container mb-16">
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            : 'space-y-6'
        }>
          {filteredCollections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {/* Collection Card / 收藏卡片 */}
              <div
                onClick={() => handleCollectionSelect(collection.id)}
                className={`luxury-card rounded-xl overflow-hidden cursor-pointer group ${
                  selectedCategory === collection.id ? 'ring-2 ring-zl-accent' : ''
                } ${viewMode === 'list' ? 'flex' : ''}`}
              >
                {/* Collection Image / 收藏图片 */}
                <div className={`bg-gradient-to-br from-zl-dark-3 to-zl-dark relative overflow-hidden ${
                  viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-[4/3]'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center p-8 group-hover:scale-110 transition-transform duration-500">
                    {getCollectionIcon(collection.id)}
                  </div>
                  
                  {/* Overlay gradient / 覆盖渐变 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zl-dark via-transparent to-transparent opacity-60" />
                  
                  {/* Product count badge / 产品数量徽章 */}
                  <div className="absolute top-4 right-4 bg-zl-accent/90 text-zl-dark px-3 py-1 rounded-full text-xs font-semibold">
                    {collection.productCount} Items
                  </div>
                </div>

                {/* Collection Info / 收藏信息 */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold font-montserrat mb-2 group-hover:text-zl-accent transition-colors">
                    {collection.name}
                  </h3>
                  
                  <p className="text-sm text-zl-text-muted mb-4 line-clamp-2">
                    {collection.description}
                  </p>

                  {/* Brand Tags / 品牌标签 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {collection.brands.slice(0, 3).map((brand) => (
                      <span key={brand} className="text-xs px-2 py-1 bg-zl-dark-3 rounded-full text-zl-text-muted">
                        {brand}
                      </span>
                    ))}
                    {collection.brands.length > 3 && (
                      <span className="text-xs px-2 py-1 text-zl-accent">
                        +{collection.brands.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Tags / 标签 */}
                  <div className="flex flex-wrap gap-1">
                    {collection.tags.map((tag) => (
                      <span key={tag} className="text-xs text-zl-accent/70 capitalize">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action button / 操作按钮 */}
                  <button className="mt-4 w-full py-2 border border-zl-accent text-zl-accent rounded-lg hover:bg-zl-accent hover:text-zl-dark transition-all text-sm font-medium">
                    Explore Collection →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state / 空状态 */}
        {filteredCollections.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zl-text-muted text-lg mb-4">No collections found matching your criteria.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="premium-button px-6 py-2 rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* Products Section (when collection is selected) / 产品区域 */}
      {selectedCategory !== 'all' && (
        <section id="products-section" className="container">
          <div className="border-t border-zl-gray pt-12">
            <h2 className="text-2xl font-bold font-montserrat mb-8">
              Products in Selected Collection
            </h2>
            
            {loadingProducts ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-zl-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.slice(0, 8).map((product) => (
                  <Link key={product.id} href={`/product/${product.id}`} className="group">
                    <div className="luxury-card rounded-xl overflow-hidden">
                      <div className="aspect-square bg-zl-dark-3 flex items-center justify-center">
                        <svg width="60" height="60" viewBox="0 0 80 80" opacity="0.5">
                          <circle cx="40" cy="40" r="35" stroke="#D4AF37" strokeWidth="2" fill="none" />
                          <rect x="33" y="28" width="14" height="24" rx="2" fill="#D4AF37" />
                        </svg>
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-zl-text-muted">{product.brand}</p>
                        <p className="font-semibold text-sm truncate group-hover:text-zl-accent transition">{product.name}</p>
                        <p className="text-zl-accent font-bold mt-1">${product.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-zl-text-muted py-8">
                Loading products...
              </p>
            )}
          </div>
        </section>
      )}

      {/* CTA Section / 行动号召区域 */}
      <section className="container mt-20">
        <div className="glass-card rounded-2xl p-12 text-center relative overflow-hidden">
          {/* Background decoration / 背景装饰 */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-zl-accent rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
              Can&apos;t Find What You&apos;re Looking For?
            </h2>
            <p className="text-zl-text-muted max-w-2xl mx-auto mb-8">
              Our AI-powered concierge service can help you source rare and exclusive pieces from our global network of partners.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/ai-assistant" className="premium-button px-8 py-3 rounded-xl text-lg">
                Ask AI Assistant
              </Link>
              <Link href="/concierge" className="px-8 py-3 border border-zl-accent text-zl-accent rounded-xl hover:bg-zl-accent/10 transition text-lg">
                Contact Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}