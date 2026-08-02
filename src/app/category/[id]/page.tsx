/**
 * Dynamic Category Page
 * Displays products filtered by category
 * 
 * Route: /category/[id]
 */

import { Metadata } from 'next'
import CategoryPageClient from './CategoryPageClient'
import CategoryPageHeader from './CategoryPageHeader'

// Category key mapping for i18n lookup (maps URL slug to translation keys)
const CATEGORY_KEY_MAP: Record<string, { nameKey: string; descKey: string }> = {
  watches: { nameKey: 'categories.watches', descKey: 'categories.descriptions.watches' },
  jewelry: { nameKey: 'categories.jewelry', descKey: 'categories.descriptions.jewelry' },
  fashion: { nameKey: 'categories.fashion', descKey: 'categories.descriptions.fashion' },
  bags: { nameKey: 'categories.handbags', descKey: 'categories.descriptions.handbags' },
  art: { nameKey: 'categories.art', descKey: 'categories.descriptions.art' },
  cars: { nameKey: 'categories.cars', descKey: 'categories.descriptions.cars' },
  'real-estate': { nameKey: 'categories.realEstate', descKey: 'categories.descriptions.realEstate' },
  yachts: { nameKey: 'categories.yachts', descKey: 'categories.descriptions.yachts' }
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_KEY_MAP).map((id) => ({ id }))
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const defaultMeta = CATEGORY_KEY_MAP[params.id]
  const title = defaultMeta ? params.id.charAt(0).toUpperCase() + params.id.slice(1) : params.id
  return {
    title: `${title} | ZLuxury`,
    description: 'Luxury products from ZLuxury',
  }
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  const categoryId = params.id
  const keys = CATEGORY_KEY_MAP[categoryId]
  const defaultNameKey = keys?.nameKey || 'categories.watches'
  const defaultDescKey = keys?.descKey || 'categories.descriptions.watches'

  return (
    <main className="min-h-screen bg-zl-dark">
      {/* Header - rendered via client component for i18n */}
      <CategoryPageHeader
        categoryId={categoryId}
        nameKey={defaultNameKey}
        descKey={defaultDescKey}
      />

      {/* Products */}
      <CategoryPageClient categoryId={categoryId} categoryName="" />
    </main>
  )
}