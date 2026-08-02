/**
 * Client-side component for Category Page
 * Fetches and displays products by category
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Product, ProductRepository } from '@/data/products'
import { useTranslation } from '@/i18n/useTranslation'

// Brand-matched images for fallback
const BRAND_IMAGES: Record<string, string> = {
  'PROD-001': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Rolex Submariner luxury diver watch stainless steel gold product photography studio dramatic lighting")}&image_size=square_hd`,
  'PROD-002': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Patek Philippe Nautilus luxury watch blue dial steel gold elegant studio product photography")}&image_size=square_hd`,
  'PROD-003': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Omega Speedmaster professional chronograph luxury moonwatch dramatic studio product photography")}&image_size=square_hd`,
  'PROD-004': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Audemars Piguet Royal Oak luxury watch steel octagonal bezel elegant studio product")}&image_size=square_hd`,
  'PROD-005': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Hermes Birkin luxury handbag leather gold hardware exclusive product photography")}&image_size=square_hd`,
  'PROD-006': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Hermes Kelly luxury designer handbag leather gold clasp elegant studio product")}&image_size=square_hd`,
  'PROD-007': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Louis Vuitton Capucines luxury designer handbag leather monogram elegant product photography")}&image_size=square_hd`,
  'PROD-008': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Chanel Classic Flap luxury handbag quilted leather gold chain elegant product photography")}&image_size=square_hd`,
  'PROD-009': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Cartier Love bracelet luxury jewelry gold diamond elegant product photography")}&image_size=square_hd`,
  'PROD-010': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Van Cleef Arpels Alhambra luxury jewelry motif gold mother of pearl elegant studio")}&image_size=square_hd`,
  'PROD-011': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Tiffany T Wire luxury diamond jewelry gold elegant studio product photography")}&image_size=square_hd`,
  'PROD-012': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Bulgari Serpenti luxury jewelry snake motif gold diamond elegant product photography")}&image_size=square_hd`,
  'PROD-013': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Gucci GG belt luxury designer fashion accessory leather gold buckle product photography")}&image_size=square_hd`,
  'PROD-014': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Prada Nylon luxury designer fashion bag accessory elegant product photography")}&image_size=square_hd`,
  'PROD-015': `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Dior Saddle luxury designer handbag fashion elegant product photography studio")}&image_size=square_hd`
}

interface CategoryPageClientProps {
  categoryId: string
  categoryName: string
}

export default function CategoryPageClient({
  categoryId,
  categoryName
}: CategoryPageClientProps) {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [categoryId])

  const fetchProducts = () => {
    try {
      const categoryMap: Record<string, string> = {
        'watches': 'Watches',
        'jewelry': 'Jewelry',
        'fashion': 'Fashion',
        'bags': 'Bags',
        'art': 'Art',
        'cars': 'Cars',
        'real-estate': 'Real Estate',
        'yachts': 'Yachts'
      }

      const productCategory = categoryMap[categoryId] || categoryId

      const productsData = ProductRepository.getAll({ category: productCategory, limit: 20 })
      const mapped = productsData.map((p) => ({
        ...p,
        imageUrl: BRAND_IMAGES[p.id] || p.imageUrl
      }))
      setProducts(mapped)
    } catch (err) {
      console.error('Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="luxury-card rounded-xl overflow-hidden animate-pulse">
                <div className="h-64 bg-zl-dark-3"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-zl-dark-3 rounded w-1/3"></div>
                  <div className="h-5 bg-zl-dark-3 rounded w-3/4"></div>
                  <div className="h-4 bg-zl-dark-3 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-20">
        <div className="container text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold font-montserrat mb-4">{t('categoryPage.noProductsTitle')}</h2>
          <p className="text-zl-text-muted mb-8">
            {t('categoryPage.noProductsDesc')}
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zl-accent text-zl-dark rounded-lg font-semibold hover:bg-zl-accent-light transition"
          >
            {t('categoryPage.browseAll')}
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div className="container">
        {/* Results count */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-zl-text-muted">
            {t('categoryPage.showing')} <span className="text-zl-text font-semibold">{products.length}</span> {t('categoryPage.productsIn')} <span className="text-zl-accent">{categoryName}</span>
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link href={`/product/${product.id}`}>
                <div className="luxury-card rounded-xl overflow-hidden group cursor-pointer">
                  <div className="relative h-64 bg-gradient-to-br from-zl-dark-3 to-zl-dark overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={`${product.brand} ${product.name}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-zl-dark-3 to-zl-dark';
                          fallback.innerHTML = `
                            <div class="text-center p-6">
                              <div class="text-4xl mb-2">${product.category === 'Watches' ? '⌚' : product.category === 'Bags' ? '👜' : product.category === 'Jewelry' ? '💎' : '✨'}</div>
                              <h4 class="text-lg font-bold text-zl-gold font-montserrat">${product.brand}</h4>
                            </div>
                          `;
                          parent.appendChild(fallback);
                        }
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-zl-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="absolute top-4 left-4 flex gap-2">
                      {product.isNew && (
                        <span className="px-3 py-1 bg-zl-accent text-zl-dark text-xs font-semibold rounded-full uppercase">{t('categoryPage.newBadge')}</span>
                      )}
                      {product.isLimited && (
                        <span className="px-3 py-1 bg-zl-gold text-zl-dark text-xs font-semibold rounded-full uppercase">{t('categoryPage.limitedBadge')}</span>
                      )}
                    </div>

                    {(product.stock || 0) <= 5 && (
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 text-xs rounded bg-zl-error/20 text-zl-error">
                          {t('categoryPage.onlyLeft', { count: product.stock })}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <span className="text-xs text-zl-accent font-semibold uppercase tracking-wider">
                      {product.brand}
                    </span>

                    <h3 className="text-lg font-semibold font-montserrat mt-2 mb-2 group-hover:text-zl-accent transition">
                      {product.name}
                    </h3>

                    <p className="text-sm text-zl-text-muted mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold font-montserrat text-zl-text">
                        {formatPrice(product.priceCny || product.price * parseFloat(process.env.FALLBACK_EXCHANGE_RATE_USD_CNY || '7.24'))}
                      </div>

                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-zl-gold" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-zl-text-muted">{product.rating} ({product.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
