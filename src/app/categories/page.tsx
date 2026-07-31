/**
 * ZLuxury Categories Page
 *
 * Displays all product categories with names, descriptions, and images.
 * Uses CategoryRepository for data access and a responsive grid layout.
 *
 * Features:
 * - All categories with brand showcase
 * - Category filtering and search
 * - Responsive grid with hover animations
 * - Integration with product detail routes
 *
 * Architecture: Next.js App Router Page Component
 * Version: 1.0.0
 * Last Updated: 2026-07-29
 */

'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CategoryRepository, Category } from '@/data/products'

// ============================================================================
// CATEGORY IMAGE MAPPING
// ============================================================================

const CATEGORY_IMAGES: Record<string, string> = {
  'watches': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Luxury Swiss watches collection gold platinum display pedestal dramatic studio lighting")}&image_size=landscape_4_3`,
  'jewelry': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Fine diamond jewelry collection precious gemstone display luxury showcase dramatic lighting")}&image_size=landscape_4_3`,
  'fashion': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Haute couture luxury fashion apparel elegant runway editorial premium fabric")}&image_size=landscape_4_3`,
  'bags': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Luxury designer handbag collection leather exotic skin display elegant boutique lighting")}&image_size=landscape_4_3`,
  'art': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Fine art masterpiece painting sculpture gallery exhibition museum quality display")}&image_size=landscape_4_3`,
  'cars': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Exotic luxury sports car collection supercar showroom dramatic studio lighting")}&image_size=landscape_4_3`,
  'real-estate': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Luxury real estate mansion villa property elegant architecture interior design")}&image_size=landscape_4_3`,
  'yachts': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Luxury superyacht sailing yacht collection Mediterranean ocean sunset elegant")}&image_size=landscape_4_3`,
}

// ============================================================================
// CATEGORY ICONS
// ============================================================================

const CategoryIcon = ({ categoryId }: { categoryId: string }): JSX.Element | null => {
  const icons: Record<string, JSX.Element> = {
    watches: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
        <line x1="12" y1="6" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="4" y1="12" x2="2" y2="12" />
        <line x1="22" y1="12" x2="20" y2="12" />
      </svg>
    ),
    jewelry: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    fashion: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    bags: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    art: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    cars: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="15" width="22" height="8" rx="2" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
        <rect x="1" y="6" width="15" height="8" rx="2" />
        <circle cx="4" cy="12" r="1" />
        <path d="M21 12h-2" />
      </svg>
    ),
    'real-estate': (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
        <path d="M7 21h10" />
        <path d="M7 3v4" />
        <path d="M17 3v4" />
        <path d="M3 10h18" />
      </svg>
    ),
    yachts: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
        <path d="M8 12h8" />
        <path d="M10 8l4 4-4 4" />
      </svg>
    ),
  }

  return icons[categoryId] || icons.watches
}

// ============================================================================
// CATEGORIES PAGE COMPONENT
// ============================================================================

/**
 * CategoriesPage Component
 *
 * Displays all ZLuxury product categories in a responsive grid layout.
 * Each category card includes an image, description, brand list, and
 * product count. Supports search filtering for quick category discovery.
 */
export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const categories: Category[] = useMemo(() => {
    return CategoryRepository.getAll()
  }, [])

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories
    const query = searchQuery.toLowerCase()
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        cat.description.toLowerCase().includes(query) ||
        cat.brands.some((b) => b.toLowerCase().includes(query))
    )
  }, [categories, searchQuery])

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
            <span className="text-gradient">Product Categories</span>
          </h1>
          <p className="text-zl-text-muted text-lg max-w-2xl">
            Explore our curated selection of luxury categories. From haute
            horlogerie to fine art, discover the finest pieces from the
            world&apos;s most prestigious houses.
          </p>
        </motion.div>
      </section>

      {/* Search Bar */}
      <section className="container mb-8">
        <div className="glass-card rounded-xl p-6">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories, brands, or styles..."
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
          <div className="mt-4 text-sm text-zl-text-muted">
            Showing {filteredCategories.length} of {categories.length} categories
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link href={`/category/${category.id}`}>
                <div className="luxury-card rounded-xl overflow-hidden cursor-pointer group h-full">
                  {/* Category Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={CATEGORY_IMAGES[category.id] || CATEGORY_IMAGES.watches}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.style.background = `linear-gradient(135deg, ${category.color}30, #0a0a0a)`
                          parent.innerHTML += `
                            <div class="absolute inset-0 flex items-center justify-center">
                              <div class="text-center">
                                <div class="text-4xl mb-2" style="color: ${category.color}">
                                  ${category.icon === 'watch' ? '⌚' :
                              category.icon === 'diamond' ? '💎' :
                                category.icon === 'bag' ? '👜' :
                                  category.icon === 'fashion' ? '👔' :
                                    category.icon === 'art' ? '🎨' :
                                      category.icon === 'car' ? '🏎️' :
                                        category.icon === 'building' ? '🏰' :
                                          category.icon === 'yacht' ? '⛵' : '✨'}
                                </div>
                              </div>
                            </div>
                          `
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zl-dark via-zl-dark/30 to-transparent" />

                    {/* Icon badge */}
                    <div className="absolute bottom-3 left-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm"
                        style={{
                          background: `${category.color}90`,
                          border: `1px solid ${category.color}40`,
                        }}
                      >
                        <span style={{ color: '#fff' }}>
                          <CategoryIcon categoryId={category.id} />
                        </span>
                      </div>
                    </div>

                    {/* Product count badge */}
                    <div className="absolute top-3 right-3 bg-zl-accent/90 text-zl-dark px-3 py-1 rounded-full text-xs font-semibold">
                      {category.count} items
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold font-montserrat mb-2 group-hover:text-zl-accent transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-zl-text-muted mb-4 line-clamp-2">
                      {category.description}
                    </p>

                    {/* Brand Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {category.brands.slice(0, 4).map((brand) => (
                        <span
                          key={brand}
                          className="text-xs px-2 py-1 bg-zl-dark-3 rounded-full text-zl-text-muted"
                        >
                          {brand}
                        </span>
                      ))}
                      {category.brands.length > 4 && (
                        <span className="text-xs px-2 py-1 text-zl-accent">
                          +{category.brands.length - 4} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-zl-gray">
                      <span className="text-xs text-zl-accent font-semibold uppercase tracking-wide">
                        Explore
                      </span>
                      <svg
                        className="w-4 h-4 text-zl-text-muted group-hover:text-zl-accent group-hover:translate-x-1 transition-all"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zl-text-muted text-lg mb-4">
              No categories found matching &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="premium-button px-6 py-2 rounded-lg"
            >
              Clear Search
            </button>
          </div>
        )}
      </section>
    </main>
  )
}