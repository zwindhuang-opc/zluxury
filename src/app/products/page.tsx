/**
 * ZLuxury Products Listing Page
 *
 * Displays all luxury products in a responsive grid with images,
 * prices, brand info, and stock indicators. Supports filtering
 * by category, brand, and price range.
 *
 * Features:
 * - Full product catalog with filtering and sorting
 * - Brand-matched product images
 * - Price display in USD and CNY
 * - Stock availability indicators
 * - VIP discount badges
 *
 * Architecture: Next.js App Router Page Component
 * Version: 1.0.0
 * Last Updated: 2026-07-29
 */

'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Product, ProductRepository } from '@/data/products'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type SortOption = 'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest'

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// ============================================================================
// PRODUCTS PAGE COMPONENT
// ============================================================================

/**
 * ProductsPage Component
 *
 * Main products listing page that fetches and displays all luxury products
 * with comprehensive filtering, sorting, and search capabilities.
 */
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: '',
    max: '',
  })

  useEffect(() => {
    setLoading(true)
    try {
      const all = ProductRepository.getAll()
      setProducts(all)
    } catch (err) {
      console.error('[ProductsPage] Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category))
    return Array.from(cats).sort()
  }, [products])

  const brands = useMemo(() => {
    const br = new Set(products.map((p) => p.brand))
    return Array.from(br).sort()
  }, [products])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
    }

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory)
    }

    if (selectedBrand !== 'all') {
      result = result.filter((p) => p.brand === selectedBrand)
    }

    const minPrice = priceRange.min ? parseFloat(priceRange.min) : undefined
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) : undefined
    if (minPrice !== undefined) result = result.filter((p) => p.price >= minPrice)
    if (maxPrice !== undefined) result = result.filter((p) => p.price <= maxPrice)

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      default:
        result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [products, searchQuery, selectedCategory, selectedBrand, sortBy, priceRange])

  return (
    <main className="min-h-screen pt-24 pb-20">
      {/* Page Header */}
      <section className="container mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold font-montserrat mb-4">
            <span className="text-gradient">All Products</span>
          </h1>
          <p className="text-zl-text-muted text-lg max-w-2xl">
            Browse our complete collection of luxury pieces. From iconic timepieces
            to rare gemstones, each item is authenticated and sourced from
            reputable global channels.
          </p>
        </motion.div>
      </section>

      {/* Filter and Sort Bar */}
      <section className="container mb-8">
        <div className="glass-card rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, brand, or keyword..."
                className="input-luxury w-full pl-12"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zl-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-zl-dark-3 border border-zl-gray rounded-lg px-4 py-2 text-sm focus:border-zl-accent outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-zl-dark-3 border border-zl-gray rounded-lg px-4 py-2 text-sm focus:border-zl-accent outline-none"
              >
                <option value="all">All Brands</option>
                {brands.map((br) => (
                  <option key={br} value={br}>
                    {br}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-zl-dark-3 border border-zl-gray rounded-lg px-4 py-2 text-sm focus:border-zl-accent outline-none"
              >
                <option value="name">Sort by Name</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-4 flex items-center gap-3 text-sm text-zl-text-muted">
            <span>Price Range (USD):</span>
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange((p) => ({ ...p, min: e.target.value }))}
              placeholder="Min"
              className="w-24 bg-zl-dark-3 border border-zl-gray rounded-lg px-3 py-1 text-sm focus:border-zl-accent outline-none"
            />
            <span>—</span>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange((p) => ({ ...p, max: e.target.value }))}
              placeholder="Max"
              className="w-24 bg-zl-dark-3 border border-zl-gray rounded-lg px-3 py-1 text-sm focus:border-zl-accent outline-none"
            />
            {(searchQuery ||
              selectedCategory !== 'all' ||
              selectedBrand !== 'all' ||
              priceRange.min ||
              priceRange.max) && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setSelectedBrand('all')
                    setPriceRange({ min: '', max: '' })
                  }}
                  className="text-zl-accent hover:underline text-xs ml-2"
                >
                  Clear Filters
                </button>
              )}
          </div>

          <div className="mt-4 text-sm text-zl-text-muted">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="luxury-card rounded-xl overflow-hidden animate-pulse">
                <div className="h-64 bg-zl-dark-3" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-zl-dark-3 rounded w-1/3" />
                  <div className="h-4 bg-zl-dark-3 rounded w-3/4" />
                  <div className="h-4 bg-zl-dark-3 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={`/product/${product.id}`}>
                  <div className="luxury-card rounded-xl overflow-hidden group cursor-pointer h-full flex flex-col">
                    {/* Product Image */}
                    <div className="relative h-64 bg-zl-dark-3 overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={`${product.brand} ${product.name}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML += `
                              <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zl-dark-3 to-zl-dark">
                                <div class="text-center">
                                  <div class="text-4xl mb-2">${product.category === 'Watches' ? '⌚' :
                                product.category === 'Bags' ? '👜' :
                                  product.category === 'Jewelry' ? '💎' :
                                    product.category === 'Fashion' ? '👔' :
                                      product.category === 'Art' ? '🎨' : '✨'
                              }</div>
                                  <h4 class="text-lg font-bold text-zl-gold font-montserrat">${product.brand}</h4>
                                </div>
                              </div>
                            `
                          }
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-zl-dark/80 via-transparent to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {product.isNew && (
                          <span className="px-3 py-1 bg-zl-accent text-zl-dark text-xs font-semibold rounded-full uppercase">
                            New
                          </span>
                        )}
                        {product.isLimited && (
                          <span className="px-3 py-1 bg-zl-gold text-zl-dark text-xs font-semibold rounded-full uppercase">
                            Limited
                          </span>
                        )}
                      </div>

                      {/* Stock indicator */}
                      <div className="absolute top-4 right-4">
                        <span
                          className={`px-2 py-1 text-xs rounded ${product.stock <= 5
                              ? 'bg-zl-error/20 text-zl-error'
                              : 'bg-zl-success/20 text-zl-success'
                            }`}
                        >
                          {product.stock <= 5 ? `Only ${product.stock} left` : 'In Stock'}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5 flex-1 flex flex-col">
                      <span className="text-xs text-zl-accent font-semibold uppercase tracking-wider">
                        {product.brand}
                      </span>

                      <h3 className="text-base font-semibold font-montserrat mt-2 mb-2 group-hover:text-zl-accent transition line-clamp-2">
                        {product.name}
                      </h3>

                      <p className="text-sm text-zl-text-muted mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        <svg
                          className="w-4 h-4 text-zl-gold"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-zl-text-muted">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mt-auto flex items-end justify-between">
                        <div>
                          <div className="text-xl font-bold font-montserrat text-zl-text">
                            {formatPrice(product.price, product.currency)}
                          </div>
                          {product.priceCny && (
                            <div className="text-sm text-zl-text-muted">
                              ¥{product.priceCny.toLocaleString()} CNY
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-zl-accent uppercase tracking-wide group-hover:translate-x-1 transition-transform">
                          View →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zl-text-muted text-lg mb-4">
              No products found matching your criteria.
            </p>
            <p className="text-zl-text-muted mb-8">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}