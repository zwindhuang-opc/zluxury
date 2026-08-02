/**
 * CategoriesSection Component - Luxury category showcase with grid layout
 * 
 * Design inspired by:
 * - Cartier: Category-based product navigation
 * - Tiffany & Co.: Elegant product categorization
 * - Bulgari: Artistic category presentation
 * 
 * Features:
 * - 8 luxury product categories with real images
 * - Category emoji icons for quick recognition
 * - Brand listings per category
 * - Hover animations with framer-motion
 * - Multi-language support via translation keys
 * - Product count display for each category
 * 
 * @module CategoriesSection
 * @version 1.3.0
 */

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslation } from '@/i18n/useTranslation'

/**
 * Helper function to get emoji based on category ID
 * Returns a Unicode emoji matching the product category for visual enhancement
 * 
 * @param categoryId - The category identifier (e.g., 'watches', 'jewelry')
 * @returns Unicode emoji string for the category, or default sparkle emoji
 */
const getCategoryEmoji = (categoryId: string): string => {
  const emojis: Record<string, string> = {
    'watches': '⌚',
    'jewelry': '💎',
    'fashion': '👔',
    'bags': '👜',
    'art': '🎨',
    'cars': '🏎️',
    'real-estate': '🏰',
    'yachts': '⛵'
  }
  return emojis[categoryId] || '✨'
}

const categories = [
  {
    id: 'watches',
    nameKey: 'categories.watches',
    descriptionKey: 'categories.descriptions.watches',
    color: '#00B4D8',
    count: 2500,
    brands: ['Rolex', 'Patek Philippe', 'Omega', 'Cartier', 'IWC'],
    imageUrl: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Luxury Swiss watches collection gold platinum display pedestal dramatic studio lighting")}&image_size=landscape_4_3`
  },
  {
    id: 'jewelry',
    nameKey: 'categories.jewelry',
    descriptionKey: 'categories.descriptions.jewelry',
    color: '#D4AF37',
    count: 3200,
    brands: ['Tiffany', 'Cartier', 'Van Cleef', 'Bulgari', 'Harry Winston'],
    imageUrl: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Fine diamond jewelry collection precious gemstone display luxury showcase dramatic lighting")}&image_size=landscape_4_3`
  },
  {
    id: 'fashion',
    nameKey: 'categories.fashion',
    descriptionKey: 'categories.descriptions.fashion',
    color: '#00B4D8',
    count: 8000,
    brands: ['Louis Vuitton', 'Gucci', 'Chanel', 'Dior', 'Prada'],
    imageUrl: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Haute couture luxury fashion apparel elegant runway editorial premium fabric")}&image_size=landscape_4_3`
  },
  {
    id: 'bags',
    nameKey: 'categories.handbags',
    descriptionKey: 'categories.descriptions.handbags',
    color: '#D4AF37',
    count: 4500,
    brands: ['Hermès', 'Louis Vuitton', 'Chanel', 'Gucci', 'Bottega Veneta'],
    imageUrl: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Luxury designer handbag collection leather exotic skin display elegant boutique lighting")}&image_size=landscape_4_3`
  },
  {
    id: 'art',
    nameKey: 'categories.art',
    descriptionKey: 'categories.descriptions.art',
    color: '#00B4D8',
    count: 1200,
    brands: ["Sotheby's", "Christie's", 'Gallery Partners'],
    imageUrl: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Fine art masterpiece painting sculpture gallery exhibition museum quality display")}&image_size=landscape_4_3`
  },
  {
    id: 'cars',
    nameKey: 'categories.cars',
    descriptionKey: 'categories.descriptions.cars',
    color: '#D4AF37',
    count: 800,
    brands: ['Ferrari', 'Lamborghini', 'Porsche', 'Bentley', 'Rolls-Royce'],
    imageUrl: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Exotic luxury sports car collection supercar showroom dramatic studio lighting")}&image_size=landscape_4_3`
  },
  {
    id: 'real-estate',
    nameKey: 'categories.realEstate',
    descriptionKey: 'categories.descriptions.realEstate',
    color: '#00B4D8',
    count: 500,
    brands: ["Sotheby's Realty", "Christie's Realty"],
    imageUrl: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Luxury real estate mansion villa property elegant architecture interior design")}&image_size=landscape_4_3`
  },
  {
    id: 'yachts',
    nameKey: 'categories.yachts',
    descriptionKey: 'categories.descriptions.yachts',
    color: '#D4AF37',
    count: 150,
    brands: ['Azimut', 'Benetti', 'Sunseeker', 'Feadship'],
    imageUrl: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("Luxury superyacht sailing yacht collection Mediterranean ocean sunset elegant")}&image_size=landscape_4_3`
  }
]

const CategoryIcon = ({ categoryId }: { categoryId: string }): JSX.Element | null => {
  const icons: Record<string, JSX.Element> = {
    watches: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    fashion: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    bags: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    art: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    cars: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="15" width="22" height="8" rx="2" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
        <rect x="1" y="6" width="15" height="8" rx="2" />
        <circle cx="4" cy="12" r="1" />
        <path d="M21 12h-2" />
      </svg>
    ),
    'real-estate': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
        <path d="M7 21h10" />
        <path d="M7 3v4" />
        <path d="M17 3v4" />
        <path d="M3 10h18" />
      </svg>
    ),
    yachts: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
        <path d="M8 12h8" />
        <path d="M10 8l4 4-4 4" />
      </svg>
    )
  }

  return icons[categoryId] || icons.watches
}

export default function CategoriesSection() {
  const { t } = useTranslation()

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            {t('categories.title')} <span className="text-gradient">{t('categories.subtitle')}</span>
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            {t('categories.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={`/category/${category.id}`}>
                <div className="luxury-card rounded-xl p-6 h-full cursor-pointer group overflow-hidden">
                  {/* Category Image / 分类图片 */}
                  <div className="relative h-32 -mx-6 -mt-6 mb-4 overflow-hidden">
                    <img
                      src={category.imageUrl}
                      alt={`${t(category.nameKey)} - ${t('categories.imageAltSuffix')}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Fallback if image blocked by ORB / ORB阻止时的备用方案
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-zl-dark-3 to-zl-dark';
                          fallback.innerHTML = `
                            <div class="text-center">
                              <div class="text-3xl mb-1">${getCategoryEmoji(category.id)}</div>
                              <span class="text-xs text-zl-gold font-semibold">${t(category.nameKey)}</span>
                            </div>
                          `;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                    {/* Gradient overlay / 渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zl-dark via-zl-dark/50 to-transparent"></div>

                    {/* Category icon overlay / 分类图标叠加 */}
                    <div className="absolute bottom-3 left-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm"
                        style={{ background: `${category.color}90`, border: `1px solid ${category.color}40` }}
                      >
                        <span style={{ color: '#fff' }}>
                          <CategoryIcon categoryId={category.id} />
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold font-montserrat mb-2 group-hover:text-zl-accent transition">
                    {t(category.nameKey)}
                  </h3>

                  <p className="text-sm text-zl-text-muted mb-4 line-clamp-2">
                    {t((category as any).descriptionKey)}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zl-accent font-semibold">
                      {t('categories.itemsCount', { count: category.count.toLocaleString() })}
                    </span>
                    <svg className="w-4 h-4 text-zl-text-muted group-hover:text-zl-accent transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zl-gray">
                    <div className="flex flex-wrap gap-1">
                      {category.brands.slice(0, 3).map((brand) => (
                        <span key={brand} className="text-xs text-zl-text-muted bg-zl-dark-3 px-2 py-1 rounded">
                          {brand}
                        </span>
                      ))}
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