/**
 * Dynamic Category Page
 * Displays products filtered by category
 * 
 * Route: /category/[id]
 */

import { Metadata } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { products } from '@/data/products'

const CategoryPageClient = dynamic(
  () => import('./CategoryPageClient').then(mod => mod.default),
  { ssr: false }
)

// Category metadata configuration
const CATEGORY_META: Record<string, { name: string; nameCn: string; description: string }> = {
  watches: {
    name: 'Luxury Watches',
    nameCn: '奢华腕表',
    description: 'Timepieces from Rolex, Patek Philippe, Omega, Cartier and more'
  },
  jewelry: {
    name: 'Fine Jewelry',
    nameCn: '珠宝首饰',
    description: 'Diamonds, gemstones, and precious metals from Tiffany, Cartier, Van Cleef & Arpels'
  },
  fashion: {
    name: 'Luxury Fashion',
    nameCn: '时尚服饰',
    description: 'Haute couture and luxury apparel from Louis Vuitton, Gucci, Chanel, Dior'
  },
  bags: {
    name: 'Designer Handbags',
    nameCn: '设计师手袋',
    description: 'Handbags and accessories from Hermès, Louis Vuitton, Chanel, Prada'
  },
  art: {
    name: 'Fine Art & Collectibles',
    nameCn: '艺术收藏',
    description: 'Original artworks and limited editions from Sotheby\'s, Christie\'s'
  },
  cars: {
    name: 'Exotic Cars',
    nameCn: '豪华汽车',
    description: 'Premium automobiles from Ferrari, Lamborghini, Porsche, Bentley'
  },
  'real-estate': {
    name: 'Luxury Real Estate',
    nameCn: '豪宅地产',
    description: 'Exclusive properties worldwide'
  },
  yachts: {
    name: 'Superyachts',
    nameCn: '超级游艇',
    description: 'Superyachts and sailing vessels from Azimut, Benetti, Sunseeker'
  }
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_META).map((id) => ({ id }))
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const categoryId = params.id
  const meta = CATEGORY_META[categoryId] || {
    name: categoryId,
    nameCn: categoryId,
    description: 'Luxury products from ZLuxury'
  }

  return {
    title: `${meta.name} | ZLuxury`,
    description: meta.description,
  }
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  const categoryId = params.id
  const meta = CATEGORY_META[categoryId] || {
    name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
    nameCn: categoryId,
    description: 'Explore our curated selection'
  }

  return (
    <main className="min-h-screen bg-zl-dark">
      {/* Header */}
      <div className="bg-gradient-to-b from-zl-dark-2 to-zl-dark py-16">
        <div className="container">
          <nav className="flex items-center gap-2 text-sm text-zl-text-muted mb-6">
            <Link href="/" className="hover:text-zl-accent transition">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-zl-accent transition">Collections</Link>
            <span>/</span>
            <span className="text-zl-text">{meta.name}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold font-montserrat mb-4">
            {meta.name} <span className="text-gradient">{meta.nameCn}</span>
          </h1>
          <p className="text-zl-text-muted max-w-2xl text-lg">
            {meta.description}
          </p>
        </div>
      </div>

      {/* Products */}
      <CategoryPageClient categoryId={categoryId} categoryName={meta.name} />
    </main>
  )
}
