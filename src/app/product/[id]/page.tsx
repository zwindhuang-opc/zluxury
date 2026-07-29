import { Metadata } from 'next'
import ProductDetailClient from './ProductDetailClient'
import { products } from '@/data/products'

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = products.find((p) => p.id === params.id)
  if (!product) {
    return { title: 'Product Not Found | ZLuxury' }
  }
  return {
    title: `${product.name} | ZLuxury`,
    description: product.description,
  }
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetailClient productId={params.id} />
}