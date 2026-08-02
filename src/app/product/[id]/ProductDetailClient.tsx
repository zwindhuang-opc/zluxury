'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslation } from '@/i18n/useTranslation'
import { getProductById, getProducts } from '@/data/products'
import { CartService } from '@/data/cart'

interface ProductDetail {
    id: string;
    name: string;
    brand: string;
    brandCn?: string;
    category: string;
    price: number;
    priceCny?: number;
    currency: string;
    description: string;
    rating: number;
    reviews: number;
    isNew: boolean;
    isLimited: boolean;
    stock: number;
    specifications: Record<string, string>;
    auctionData?: {
        lastSold?: string;
        soldPrice?: number;
        soldPriceCny?: number;
        priceTrend?: 'up' | 'down' | 'stable';
        source?: string;
    };
    vipPrices?: {
        standard?: number;
        silver?: number;
        gold?: number;
        black?: number;
        diamond?: number;
    };
    images?: string[];
    status: string;
}

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

/**
 * RelatedProductsSection - Displays related products filtered by category
 * Falls back to top products if insufficient category matches
 *
 * @param props - Component props
 * @param props.currentProductId - ID of the current product to exclude
 * @param props.category - Product category for filtering
 * @param props.formatPrice - Price formatting function
 * @param props.t - Translation function from useTranslation
 */
function RelatedProductsSection({
    currentProductId,
    category,
    formatPrice,
    t
}: {
    currentProductId: string;
    category: string;
    formatPrice: (price: number, currency?: string) => string;
    t: (key: string, params?: Record<string, any>) => string;
}) {
    const allProducts = getProducts();

    /** Filter products in the same category, excluding current product */
    const sameCategoryProducts = allProducts.filter(
        (p) => p.id !== currentProductId && p.category === category
    );

    /** Fallback: top rated products if not enough category matches */
    const fallbackProducts = allProducts
        .filter((p) => p.id !== currentProductId)
        .sort((a, b) => b.rating - a.rating);

    const relatedProducts = (sameCategoryProducts.length >= 4
        ? sameCategoryProducts
        : sameCategoryProducts.length > 0
            ? [...sameCategoryProducts, ...fallbackProducts.filter(
                (p) => !sameCategoryProducts.find((sp) => sp.id === p.id)
            )]
            : fallbackProducts
    ).slice(0, 4);

    if (relatedProducts.length === 0) {
        return (
            <div className="text-center py-12 text-zl-text-muted">
                <p>{t('common.noData')}</p>
                <Link href="/products" className="premium-button inline-block mt-4 px-6 py-2 rounded-lg">
                    {t('products.viewAllProducts')}
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`} className="group">
                    <div className="luxury-card rounded-xl overflow-hidden">
                        <div className="aspect-square bg-zl-dark-3 flex items-center justify-center">
                            {p.imageUrl ? (
                                <img
                                    src={p.imageUrl}
                                    alt={p.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <svg width="80" height="80" viewBox="0 0 100 100" opacity="0.5">
                                    <circle cx="50" cy="50" r="45" stroke="#D4AF37" strokeWidth="2" fill="none" />
                                    <rect x="42" y="35" width="16" height="30" rx="2" fill="#D4AF37" />
                                </svg>
                            )}
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-zl-text-muted truncate">{p.brand}</p>
                            <p className="font-semibold truncate">{p.name}</p>
                            <p className="text-sm text-zl-accent mt-1">
                                {formatPrice(p.price, p.currency)}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default function ProductDetailClient({ productId }: { productId: string }) {
    const { t } = useTranslation()

    const [product, setProduct] = useState<ProductDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')
    const [cartMessage, setCartMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [cartId] = useState<string>(() => {
        const existing = typeof window !== 'undefined' ? localStorage.getItem('zluxury_cart_id') : null
        if (existing) return existing
        const newId = `CART-guest-${Date.now().toString(36)}`
        if (typeof window !== 'undefined') localStorage.setItem('zluxury_cart_id', newId)
        return newId
    })

    useEffect(() => {
        const fetchProduct = () => {
            try {
                setLoading(true)
                setError(null)

                if (!productId) {
                    throw new Error('Product ID is required')
                }

                const productData = getProductById(productId)

                if (!productData) {
                    throw new Error('Product not found')
                }

                setProduct(productData as ProductDetail)
            } catch (err) {
                console.error('[ProductPage] Error fetching product:', err)
                setError(err instanceof Error ? err.message : 'Failed to load product')
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [productId])

    const handleAddToCart = (productId: string) => {
        try {
            setCartMessage(null)

            const result = CartService.addItem(cartId, productId, quantity)

            if (result.success) {
                setCartMessage({
                    type: 'success',
                    text: t('products.addToCart') + ' ✓'
                })
            } else {
                setCartMessage({
                    type: 'error',
                    text: result.error || 'Failed to add to cart'
                })
            }

            setTimeout(() => setCartMessage(null), 3000)
        } catch (err) {
            console.error('[ProductPage] Add to cart error:', err)
            setCartMessage({
                type: 'error',
                text: 'Network error. Please try again.'
            })
        }
    }

    const formatPrice = (price: number, currency: string = 'USD'): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency === 'CNY' ? 'CNY' : currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price)
    }

    const renderStars = (rating: number): React.ReactNode[] => {
        const stars: React.ReactNode[] = []
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5

        for (let i = 0; i < 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`w-5 h-5 ${i < fullStars ? 'text-zl-gold fill-zl-gold' : hasHalfStar && i === fullStars ? 'text-zl-gold fill-zl-gold/50' : 'text-zl-gray fill-none'}`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            )
        }

        return stars
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-zl-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-zl-text-muted">{t('common.loading')}</p>
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <h1 className="text-6xl font-bold text-zl-accent mb-4">404</h1>
                    <h2 className="text-2xl font-semibold mb-4">{t('common.error')}</h2>
                    <p className="text-zl-text-muted mb-8">{error || 'Product not found'}</p>
                    <Link href="/products" className="premium-button inline-block px-8 py-3 rounded-lg">
                        {t('products.viewAll')}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen pt-24 pb-20">
            <div className="container mb-8">
                <nav className="flex items-center gap-2 text-sm text-zl-text-muted">
                    <Link href="/" className="hover:text-zl-accent transition">{t('nav.home')}</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-zl-accent transition">{t('nav.products')}</Link>
                    <span>/</span>
                    <Link href={`/category/${product.category.toLowerCase()}`} className="hover:text-zl-accent transition capitalize">
                        {product.category}
                    </Link>
                    <span>/</span>
                    <span className="text-zl-text">{product.name}</span>
                </nav>
            </div>

            <div className="container">
                <div className="grid lg:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="aspect-square bg-zl-dark-3 rounded-xl overflow-hidden mb-4 relative group">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[selectedImage] || product.images[0]}
                                    alt={`${product.brand} ${product.name}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                            const fallback = document.createElement('div');
                                            fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-zl-dark-3 to-zl-dark';
                                            fallback.innerHTML = `
                                                <div class="text-center p-12">
                                                    <div class="text-6xl mb-4">${getCategoryEmoji(product.category)}</div>
                                                    <h3 class="text-3xl font-bold text-zl-gold font-montserrat">${product.brand}</h3>
                                                    <p class="text-xl text-zl-text-muted mt-2">${product.name}</p>
                                                    <p class="text-sm text-zl-accent mt-4">$${product.price.toLocaleString()}</p>
                                                </div>
                                            `;
                                            parent.appendChild(fallback);
                                        }
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-12">
                                    <svg width="300" height="300" viewBox="0 0 200 200" className="opacity-80">
                                        <circle cx="100" cy="100" r="90" stroke="#D4AF37" strokeWidth="2" fill="none" />
                                        <path d="M60 100 L85 75 V125 L60 100Z" fill="#00B4D8" />
                                        <path d="M140 100 L115 125 V75 L140 100Z" fill="#00B4D8" />
                                        <rect x="88" y="78" width="24" height="44" rx="2" fill="#D4AF37" />
                                        <circle cx="100" cy="100" r="20" fill="#00B4D8" opacity="0.3" />
                                    </svg>
                                </div>
                            )}

                            <div className="absolute top-4 left-4 flex gap-2">
                                {product.isNew && (
                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                                        {t('products.newArrival')}
                                    </span>
                                )}
                                {product.isLimited && (
                                    <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full border border-red-500/30">
                                        {t('products.limited')}
                                    </span>
                                )}
                                {product.stock <= 5 && product.stock > 0 && (
                                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-semibold rounded-full border border-orange-500/30">
                                        {t('products.stockOnlyLeft', { count: product.stock })}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {product.images && product.images.length > 0 ? (
                                product.images.slice(0, 4).map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 rounded-lg border-2 transition-all overflow-hidden ${selectedImage === index ? 'border-zl-accent' : 'border-zl-gray hover:border-zl-accent/50'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} - ${t('common.image')} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    </button>
                                ))
                            ) : (
                                [0, 1, 2, 3].map((index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 rounded-lg border-2 transition-all ${selectedImage === index ? 'border-zl-accent' : 'border-zl-gray hover:border-zl-accent/50'
                                            }`}
                                    >
                                        <div className="w-full h-full bg-zl-dark-3 rounded-md flex items-center justify-center">
                                            <svg width="40" height="40" viewBox="0 0 50 50" opacity="0.6">
                                                <circle cx="25" cy="25" r="22" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
                                                <rect x="20" y="18" width="10" height="14" rx="1" fill="#D4AF37" />
                                            </svg>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="mb-6">
                            <p className="text-sm text-zl-accent font-semibold tracking-wider uppercase mb-2">
                                {product.brandCn || product.brand}
                            </p>
                            <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-zl-text mb-4">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-3">
                                <div className="flex gap-1">
                                    {renderStars(product.rating)}
                                </div>
                                <span className="text-zl-text-muted text-sm">
                                    {product.rating} ({product.reviews} {t('footer.copyright')})
                                </span>
                            </div>
                        </div>

                        <div className="bg-zl-dark-3 rounded-xl p-6 mb-6">
                            <div className="mb-4">
                                <span className="text-sm text-zl-text-muted">{t('products.regularPrice')}</span>
                                <div className="text-3xl font-bold text-zl-text">
                                    {formatPrice(product.price, product.currency)}
                                </div>
                                {product.priceCny && (
                                    <div className="text-lg text-zl-text-muted mt-1">
                                        ¥{product.priceCny.toLocaleString()} CNY
                                    </div>
                                )}
                            </div>

                            {product.vipPrices && (
                                <div className="border-t border-zl-gray pt-4">
                                    <h4 className="text-sm font-semibold text-zl-accent mb-3">{t('products.vipPricing')}</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {Object.entries(product.vipPrices).map(([tier, price]) => (
                                            <div key={tier} className="bg-zl-dark rounded-lg p-2 text-center">
                                                <div className="text-xs text-zl-text-muted capitalize">{tier}</div>
                                                <div className="text-sm font-semibold text-zl-text">¥{price?.toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.auctionData && (
                                <div className="border-t border-zl-gray mt-4 pt-4">
                                    <h4 className="text-sm font-semibold text-zl-accent mb-2">{t('products.auctionData')}</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {product.auctionData.lastSold && (
                                            <div>
                                                <span className="text-zl-text-muted">{t('products.lastSold')}:</span>
                                                <span className="ml-2">{new Date(product.auctionData.lastSold).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        {product.auctionData.soldPrice && (
                                            <div>
                                                <span className="text-zl-text-muted">{t('products.auctionPrice')}:</span>
                                                <span className="ml-2">${product.auctionData.soldPrice.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {product.auctionData.priceTrend && (
                                            <div className="col-span-2">
                                                <span className="text-zl-text-muted">{t('products.trend')}:</span>
                                                <span className={`ml-2 ${product.auctionData.priceTrend === 'up' ? 'text-green-400' :
                                                    product.auctionData.priceTrend === 'down' ? 'text-red-400' :
                                                        'text-yellow-400'
                                                    }`}>
                                                    {product.auctionData.priceTrend === 'up' ? `↑ ${t('products.trendUp')}` :
                                                        product.auctionData.priceTrend === 'down' ? `↓ ${t('products.trendDown')}` :
                                                            `→ ${t('products.trendStable')}`}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <label className="text-sm text-zl-text-muted">{t('products.quantity')}:</label>
                            <div className="flex items-center border border-zl-gray rounded-lg">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 hover:bg-zl-dark-3 transition rounded-l-lg"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    min="1"
                                    max={product.stock}
                                    className="w-16 text-center bg-transparent border-x border-zl-gray py-2 focus:outline-none"
                                />
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="px-4 py-2 hover:bg-zl-dark-3 transition rounded-r-lg"
                                >
                                    +
                                </button>
                            </div>
                            <span className="text-sm text-zl-text-muted">
                                {t('products.quantityAvailable', { count: product.stock })}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => handleAddToCart(product.id)}
                                disabled={product.stock === 0}
                                className={`w-full premium-button py-4 rounded-xl text-lg font-semibold ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {product.stock === 0 ? t('products.outOfStock') : t('products.addToCart')}
                            </button>

                            {cartMessage && (
                                <div className={`text-center py-2 px-4 rounded-lg ${cartMessage.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {cartMessage.text}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <button className="py-3 border border-zl-gray rounded-xl hover:bg-zl-dark-3 transition">
                                    {t('products.wishlist')}
                                </button>
                                <button className="py-3 border border-zl-gray rounded-xl hover:bg-zl-dark-3 transition">
                                    {t('products.share')}
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-zl-gray">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-zl-accent text-lg mb-1">✓</div>
                                    <div className="text-xs text-zl-text-muted">{t('products.guarantees.authenticity')}</div>
                                </div>
                                <div>
                                    <div className="text-zl-accent text-lg mb-1">🔒</div>
                                    <div className="text-xs text-zl-text-muted">{t('products.guarantees.securePayment')}</div>
                                </div>
                                <div>
                                    <div className="text-zl-accent text-lg mb-1">📦</div>
                                    <div className="text-xs text-zl-text-muted">{t('products.guarantees.insuredShipping')}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-16">
                    <div className="border-b border-zl-gray">
                        <div className="flex gap-8">
                            {(['description', 'specs', 'reviews'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 capitalize transition-colors ${activeTab === tab
                                        ? 'text-zl-accent border-b-2 border-zl-accent'
                                        : 'text-zl-text-muted hover:text-zl-text'
                                        }`}
                                >
                                    {tab === 'description' ? t('products.tabs.description') : tab === 'specs' ? t('products.tabs.specs') : t('products.tabs.reviews', { count: product.reviews })}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="py-8">
                        {activeTab === 'description' && (
                            <div className="prose prose-invert max-w-none">
                                <p className="text-zl-text-muted leading-relaxed text-lg">
                                    {product.description}
                                </p>

                                <div className="mt-8 grid md:grid-cols-2 gap-8">
                                    <div className="bg-zl-dark-3 rounded-xl p-6">
                                        <h4 className="font-semibold mb-4 text-zl-accent">{t('products.craftsmanship')}</h4>
                                        <p className="text-zl-text-muted text-sm leading-relaxed">
                                            {t('products.craftsmanshipDesc')}
                                        </p>
                                    </div>
                                    <div className="bg-zl-dark-3 rounded-xl p-6">
                                        <h4 className="font-semibold mb-4 text-zl-accent">{t('products.investmentValue')}</h4>
                                        <p className="text-zl-text-muted text-sm leading-relaxed">
                                            {t('products.investmentValueDesc')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'specs' && (
                            <div className="grid md:grid-cols-2 gap-4">
                                {Object.entries(product.specifications).map(([key, value]) => (
                                    <div key={key} className="flex justify-between py-3 border-b border-zl-gray">
                                        <span className="text-zl-text-muted capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className="text-zl-text font-medium">{value}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-6">
                                <div className="bg-zl-dark-3 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-zl-accent/20 flex items-center justify-center text-zl-accent font-bold">
                                            JD
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-semibold">James D.</span>
                                                <div className="flex gap-1">
                                                    {renderStars(5)}
                                                </div>
                                            </div>
                                            <p className="text-zl-text-muted text-sm">
                                                Exceptional quality and craftsmanship. This exceeded my expectations.
                                                The attention to detail is remarkable. Highly recommend for collectors.
                                            </p>
                                            <span className="text-xs text-zl-text-muted mt-2 block">{t('products.verifiedPurchase')} • 2024-05-15</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center py-8">
                                    <p className="text-zl-text-muted mb-4">{t('products.viewAllReviews', { count: product.reviews })}</p>
                                    <button className="premium-button px-6 py-2 rounded-lg">
                                        {t('products.loadMoreReviews')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <section className="mt-20">
                    <h2 className="text-2xl font-bold font-montserrat mb-8">{t('products.youMayAlsoLike')}</h2>
                    <RelatedProductsSection
                        currentProductId={product.id}
                        category={product.category}
                        formatPrice={formatPrice}
                        t={t}
                    />
                </section>
            </div>
        </main>
    )
}
