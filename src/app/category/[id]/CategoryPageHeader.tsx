/**
 * Client-side rendered header for Category Page
 * Uses i18n for translated single-language display (no mixed EN+CN)
 */

'use client'

import Link from 'next/link'
import { useTranslation } from '@/i18n/useTranslation'

interface CategoryPageHeaderProps {
  categoryId: string
  nameKey: string
  descKey: string
}

export default function CategoryPageHeader({ categoryId, nameKey, descKey }: CategoryPageHeaderProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-gradient-to-b from-zl-dark-2 to-zl-dark py-16">
      <div className="container">
        <nav className="flex items-center gap-2 text-sm text-zl-text-muted mb-6">
          <Link href="/" className="hover:text-zl-accent transition">{t('nav.home')}</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-zl-accent transition">{t('nav.collections')}</Link>
          <span>/</span>
          <span className="text-zl-text">{t(nameKey)}</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-bold font-montserrat mb-4">
          {t(nameKey)}
        </h1>
        <p className="text-zl-text-muted max-w-2xl text-lg">
          {t(descKey)}
        </p>
      </div>
    </div>
  )
}
