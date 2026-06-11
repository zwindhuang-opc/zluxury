'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

// Helper function to get emoji based on category / 根据分类获取表情符号的辅助函数
const getCategoryEmoji = (category: string): string => {
  const emojis: Record<string, string> = {
    'Watches': '⌚',
    'Bags': '👜',
    'Jewelry': '💎',
    'Fashion': '👔',
    'Art': '🎨',
    'Cars': '🏎️',
    'Real Estate': '🏰',
    'Yachts': '⛵'
  }
  return emojis[category] || '✨'
}

const featuredProducts = [
  {
    id: 'prod-001',
    name: 'Rolex Submariner Date',
    brand: 'Rolex',
    category: 'Watches',
    price: 14500,
    currency: 'USD',
    description: 'Iconic dive watch with Oystersteel case, black dial, and Cerachrom bezel. Reference 126610LN.',
    rating: 4.9,
    reviews: 128,
    isNew: false,
    isLimited: false,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
    specifications: {
      caseSize: '41mm',
      material: 'Oystersteel',
      waterResistance: '300m',
      movement: 'Calibre 3235'
    },
    auctionData: {
      lastSold: '2024-01-15',
      soldPrice: 15200,
      source: "Sotheby's"
    }
  },
  {
    id: 'prod-002',
    name: 'Hermès Birkin 25',
    brand: 'Hermès',
    category: 'Bags',
    price: 28000,
    currency: 'USD',
    description: 'Iconic Birkin bag in Togo leather with gold hardware. Noir color.',
    rating: 5.0,
    reviews: 45,
    isNew: false,
    isLimited: true,
    stock: 3,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    specifications: {
      size: '25cm',
      leather: 'Togo',
      hardware: 'Gold',
      color: 'Noir'
    },
    auctionData: {
      lastSold: '2024-02-20',
      soldPrice: 32500,
      source: "Christie's"
    }
  },
  {
    id: 'prod-003',
    name: 'Cartier Love Bracelet',
    brand: 'Cartier',
    category: 'Jewelry',
    price: 6900,
    currency: 'USD',
    description: 'Iconic Love bracelet in 18k yellow gold. Classic screw design.',
    rating: 4.8,
    reviews: 256,
    isNew: false,
    isLimited: false,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    specifications: {
      metal: '18k Yellow Gold',
      width: '6.3mm',
      style: 'Classic'
    },
    auctionData: {
      lastSold: '2024-03-10',
      soldPrice: 7200,
      source: "Sotheby's"
    }
  },
  {
    id: 'prod-004',
    name: 'Patek Philippe Nautilus',
    brand: 'Patek Philippe',
    category: 'Watches',
    price: 85000,
    currency: 'USD',
    description: 'Ref. 5711/1A-010 - Blue dial, stainless steel case. Discontinued model.',
    rating: 5.0,
    reviews: 32,
    isNew: false,
    isLimited: true,
    stock: 1,
    imageUrl: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80',
    specifications: {
      caseSize: '40mm',
      material: 'Stainless Steel',
      movement: 'Calibre 26-330 S C',
      waterResistance: '120m'
    },
    auctionData: {
      lastSold: '2024-01-25',
      soldPrice: 105000,
      source: "Christie's"
    }
  },
  {
    id: 'prod-005',
    name: 'Louis Vuitton Capucines BB',
    brand: 'Louis Vuitton',
    category: 'Bags',
    price: 5200,
    currency: 'USD',
    description: 'Sophisticated handbag in Taurillon leather. Black with gold hardware.',
    rating: 4.7,
    reviews: 89,
    isNew: true,
    isLimited: false,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    specifications: {
      size: 'BB',
      leather: 'Taurillon',
      color: 'Black',
      hardware: 'Gold'
    },
    auctionData: {
      lastSold: '2024-04-05',
      soldPrice: 5800,
      source: "Sotheby's"
    }
  },
  {
    id: 'prod-006',
    name: 'Van Cleef Alhambra Pendant',
    brand: 'Van Cleef & Arpels',
    category: 'Jewelry',
    price: 3200,
    currency: 'USD',
    description: 'Vintage Alhambra pendant in 18k yellow gold. Mother-of-pearl motif.',
    rating: 4.9,
    reviews: 167,
    isNew: false,
    isLimited: false,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    specifications: {
      metal: '18k Yellow Gold',
      motif: 'Alhambra',
      size: 'Vintage (20mm)'
    },
    auctionData: {
      lastSold: '2024-03-20',
      soldPrice: 3500,
      source: "Christie's"
    }
  }
]

const ProductIcon = ({ category }: { category: string }) => {
  const icons: Record<string, React.ReactNode> = {
    Watches: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="50" fill="#1a1a1a" stroke="#00B4D8" strokeWidth="2" />
        <circle cx="60" cy="60" r="40" fill="#0f0f0f" stroke="#D4AF37" strokeWidth="1" />
        <circle cx="60" cy="60" r="4" fill="#D4AF37" />
        <line x1="60" y1="60" x2="60" y2="30" stroke="#D4AF37" strokeWidth="2" />
        <line x1="60" y1="60" x2="85" y2="60" stroke="#00B4D8" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="30" fill="none" stroke="#2a2a2a" strokeWidth="0.5" />
        <circle cx="60" cy="60" r="35" fill="none" stroke="#2a2a2a" strokeWidth="0.5" />
      </svg>
    ),
    Bags: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <rect x="30" y="40" width="60" height="50" rx="5" fill="#1a1a1a" stroke="#00B4D8" strokeWidth="2" />
        <path d="M50 40 Q50 20 60 20 Q70 20 70 40" stroke="#D4AF37" strokeWidth="2" fill="none" />
        <rect x="45" y="55" width="30" height="20" rx="2" fill="#D4AF37" opacity="0.3" />
        <line x1="35" y1="45" x2="35" y2="85" stroke="#2a2a2a" strokeWidth="0.5" />
        <line x1="50" y1="45" x2="50" y2="85" stroke="#2a2a2a" strokeWidth="0.5" />
        <line x1="65" y1="45" x2="65" y2="85" stroke="#2a2a2a" strokeWidth="0.5" />
        <line x1="80" y1="45" x2="80" y2="85" stroke="#2a2a2a" strokeWidth="0.5" />
      </svg>
    ),
    Jewelry: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <path d="M60 30 L80 50 L60 90 L40 50 Z" fill="#1a1a1a" stroke="#D4AF37" strokeWidth="2" />
        <path d="M60 30 L60 90" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />
        <path d="M40 50 L80 50" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />
        <circle cx="60" cy="50" r="8" fill="#D4AF37" opacity="0.5" />
        <circle cx="60" cy="50" r="4" fill="#D4AF37" />
        <line x1="60" y1="90" x2="60" y2="110" stroke="#00B4D8" strokeWidth="1.5" />
        <circle cx="60" cy="112" r="3" fill="#00B4D8" />
      </svg>
    )
  }

  return icons[category] || icons.Watches
}

export default function FeaturedProducts() {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <section className="py-20 bg-zl-dark-2">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-2">
              Featured <span className="text-gradient">Products</span>
            </h2>
            <p className="text-zl-text-muted">
              Curated selection of the world's finest luxury items with verified auction data
            </p>
          </div>
          <Link href="/products" className="hidden md:flex items-center gap-2 text-zl-accent hover:text-zl-accent-light transition">
            <span className="text-sm font-semibold uppercase tracking-wide">View All</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={`/product/${product.id}`}>
                <div className="luxury-card rounded-xl overflow-hidden group cursor-pointer">
                  <div className="relative h-64 bg-gradient-to-br from-zl-dark-3 to-zl-dark overflow-hidden">
                    {/* Real luxury product image / 真实奢侈品产品图片 */}
                    <img
                      src={product.imageUrl}
                      alt={`${product.brand} ${product.name} - Luxury ${product.category} / ${product.brand} ${product.name} - 奢华${product.category}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback if image blocked by ORB / ORB阻止时的备用方案
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-zl-dark-3 to-zl-dark';
                          fallback.innerHTML = `
                            <div class="text-center p-6">
                              <div class="text-4xl mb-2">${getCategoryEmoji(product.category)}</div>
                              <h4 class="text-lg font-bold text-zl-gold font-montserrat">${product.brand}</h4>
                              <p class="text-sm text-zl-text-muted mt-1">${product.name}</p>
                            </div>
                          `;
                          parent.appendChild(fallback);
                        }
                      }}
                    />

                    {/* Image overlay on hover / 悬停遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zl-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

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

                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 text-xs rounded ${product.stock <= 5 ? 'bg-zl-error/20 text-zl-error' : 'bg-zl-success/20 text-zl-success'
                        }`}>
                        {product.stock <= 5 ? `Only ${product.stock} left` : 'In Stock'}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-zl-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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

                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
                        <span key={key} className="text-xs text-zl-text-muted bg-zl-dark-3 px-2 py-1 rounded">
                          {value}
                        </span>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-zl-gray mb-4">
                      <div className="text-xs text-zl-text-muted mb-1">Verified Auction Data</div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zl-accent">{product.auctionData.source}</span>
                        <span className="text-zl-text-muted">Last sold: {formatPrice(product.auctionData.soldPrice, 'USD')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold font-montserrat text-zl-text">
                        {formatPrice(product.price, product.currency)}
                      </span>
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

        <div className="mt-8 text-center md:hidden">
          <Link href="/products" className="inline-flex items-center gap-2 text-zl-accent">
            <span className="text-sm font-semibold uppercase tracking-wide">View All Products</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}