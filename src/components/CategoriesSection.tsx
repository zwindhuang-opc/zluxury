'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const categories = [
  {
    id: 'watches',
    name: 'Luxury Watches',
    description: 'Timepieces from Rolex, Patek Philippe, Omega, and more',
    color: '#00B4D8',
    count: 2500,
    brands: ['Rolex', 'Patek Philippe', 'Omega', 'Cartier', 'IWC']
  },
  {
    id: 'jewelry',
    name: 'Fine Jewelry',
    description: 'Diamonds, gemstones, and precious metals',
    color: '#D4AF37',
    count: 3200,
    brands: ['Tiffany', 'Cartier', 'Van Cleef', 'Bulgari', 'Harry Winston']
  },
  {
    id: 'fashion',
    name: 'Designer Fashion',
    description: 'Haute couture and luxury apparel',
    color: '#00B4D8',
    count: 8000,
    brands: ['Louis Vuitton', 'Gucci', 'Chanel', 'Dior', 'Prada']
  },
  {
    id: 'bags',
    name: 'Luxury Bags',
    description: 'Handbags and accessories from top designers',
    color: '#D4AF37',
    count: 4500,
    brands: ['Hermès', 'Louis Vuitton', 'Chanel', 'Gucci', 'Bottega Veneta']
  },
  {
    id: 'art',
    name: 'Fine Art',
    description: 'Original artworks and limited editions',
    color: '#00B4D8',
    count: 1200,
    brands: ["Sotheby's", "Christie's", 'Gallery Partners']
  },
  {
    id: 'cars',
    name: 'Luxury Vehicles',
    description: 'Premium automobiles and exotic cars',
    color: '#D4AF37',
    count: 800,
    brands: ['Ferrari', 'Lamborghini', 'Porsche', 'Bentley', 'Rolls-Royce']
  },
  {
    id: 'real-estate',
    name: 'Premium Real Estate',
    description: 'Exclusive properties worldwide',
    color: '#00B4D8',
    count: 500,
    brands: ["Sotheby's Realty", "Christie's Realty"]
  },
  {
    id: 'yachts',
    name: 'Luxury Yachts',
    description: 'Superyachts and sailing vessels',
    color: '#D4AF37',
    count: 150,
    brands: ['Azimut', 'Benetti', 'Sunseeker', 'Feadship']
  }
]

const CategoryIcon = ({ categoryId }: { categoryId: string }) => {
  const icons: Record<string, React.ReactNode> = {
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
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            Explore <span className="text-gradient">Categories</span>
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            Discover our curated collections across the world's most prestigious luxury categories
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
                <div className="luxury-card rounded-xl p-6 h-full cursor-pointer group">
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: `${category.color}20`, border: `1px solid ${category.color}40` }}
                  >
                    <span style={{ color: category.color }}>
                      <CategoryIcon categoryId={category.id} />
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold font-montserrat mb-2 group-hover:text-zl-accent transition">
                    {category.name}
                  </h3>

                  <p className="text-sm text-zl-text-muted mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zl-accent font-semibold">
                      {category.count.toLocaleString()} items
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