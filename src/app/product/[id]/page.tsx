/**
 * ZLuxury Product Detail Page
 * 
 * Displays detailed information about a single luxury product.
 * Features:
 * - Full product specifications
 * - VIP pricing tiers
 * - Auction data (if available)
 * - Add to cart functionality
 * - Related products recommendations
 * 
 * Architecture: Next.js App Router Page Component
 * Version: 1.0.0
 * Last Updated: 2024-06-11
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslation } from '@/i18n/useTranslation'

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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Product interface for detail page display
 */
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

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ProductDetailPage Component
 * 
 * Main product detail page component that fetches and displays
 * complete product information with interactive features.
 */
export default function ProductDetailPage() {
    // Router hooks / 路由钩子
    const params = useParams()
    const router = useRouter()

    // Translation hook / 翻译钩子
    const { t } = useTranslation()

    // State management / 状态管理
    const [product, setProduct] = useState<ProductDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')
    const [cartMessage, setCartMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    /**
     * Fetch product data on mount and when ID changes
     * Retrieves product details from API endpoint
     */
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true)
                setError(null)

                // Get product ID from URL params
                const productId = params.id as string

                if (!productId) {
                    throw new Error('Product ID is required')
                }

                // Fetch product data from API
                const response = await fetch(`/api/products/${productId}`)

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Product not found')
                    }
                    throw new Error('Failed to load product')
                }

                const result = await response.json()

                if (result.success && result.data) {
                    setProduct(result.data)
                } else {
                    throw new Error(result.error || 'Invalid response format')
                }
            } catch (err) {
                console.error('[ProductPage] Error fetching product:', err)
                setError(err instanceof Error ? err.message : 'Failed to load product')
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchProduct()
        }
    }, [params.id])

    /**
     * Handle add to cart action
     * Sends request to cart API and shows feedback message
     * @param productId - The product ID to add to cart
     */
    const handleAddToCart = async (productId: string) => {
        try {
            setCartMessage(null)

            // Call cart API to add item
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    quantity,
                    userId: 'guest-user', // Would be replaced with actual auth
                }),
            })

            const result = await response.json()

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

            // Clear message after 3 seconds
            setTimeout(() => setCartMessage(null), 3000)
        } catch (err) {
            console.error('[ProductPage] Add to cart error:', err)
            setCartMessage({
                type: 'error',
                text: 'Network error. Please try again.'
            })
        }
    }

    /**
     * Format price with currency symbol
     * @param price - Price value to format
     * @param currency - Currency code
     * @returns Formatted price string
     */
    const formatPrice = (price: number, currency: string = 'USD'): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency === 'CNY' ? 'CNY' : currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price)
    }

    /**
     * Generate star rating display
     * @param rating - Rating value (1-5)
     * @returns Array of JSX elements representing stars
     */
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

    // Loading state / 加载状态
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

    // Error state / 错误状态
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

    // Render product detail / 渲染产品详情
    return (
        <main className="min-h-screen pt-24 pb-20">
            {/* Breadcrumb navigation / 面包屑导航 */}
            <div className="container mb-8">
                <nav className="flex items-center gap-2 text-sm text-zl-text-muted">
                    <Link href="/" className="hover:text-zl-accent transition">Home</Link>
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

            {/* Product main content / 产品主要内容 */}
            <div className="container">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Product Images / 产品图片 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Main image display / 主图显示 */}
                        <div className="aspect-square bg-zl-dark-3 rounded-xl overflow-hidden mb-4 relative group">
                            {/* Real luxury product image / 真实奢侈品产品图片 */}
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[selectedImage] || product.images[0]}
                                    alt={`${product.brand} ${product.name} - Luxury ${product.category} / ${product.brand} ${product.name} - 奢华${product.category}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                        // Fallback if image blocked by ORB / ORB阻止时的备用方案
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
                                    {/* Fallback SVG if no images available / 无图片时的备用SVG */}
                                    <svg width="300" height="300" viewBox="0 0 200 200" className="opacity-80">
                                        <circle cx="100" cy="100" r="90" stroke="#D4AF37" strokeWidth="2" fill="none" />
                                        <path d="M60 100 L85 75 V125 L60 100Z" fill="#00B4D8" />
                                        <path d="M140 100 L115 125 V75 L140 100Z" fill="#00B4D8" />
                                        <rect x="88" y="78" width="24" height="44" rx="2" fill="#D4AF37" />
                                        <circle cx="100" cy="100" r="20" fill="#00B4D8" opacity="0.3" />
                                    </svg>
                                </div>
                            )}

                            {/* Badges / 标签 */}
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
                                        Only {product.stock} left!
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail gallery / 缩略图画廊 */}
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
                                            alt={`${product.name} - Image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))
                            ) : (
                                /* Fallback thumbnails if no images available / 无图片时的备用缩略图 */
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

                    {/* Product Information / 产品信息 */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {/* Brand & Name / 品牌和名称 */}
                        <div className="mb-6">
                            <p className="text-sm text-zl-accent font-semibold tracking-wider uppercase mb-2">
                                {product.brandCn || product.brand}
                            </p>
                            <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-zl-text mb-4">
                                {product.name}
                            </h1>

                            {/* Star rating / 星级评分 */}
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1">
                                    {renderStars(product.rating)}
                                </div>
                                <span className="text-zl-text-muted text-sm">
                                    {product.rating} ({product.reviews} {t('footer.copyright')})
                                </span>
                            </div>
                        </div>

                        {/* Pricing Section / 价格区域 */}
                        <div className="bg-zl-dark-3 rounded-xl p-6 mb-6">
                            {/* Regular price / 常规价格 */}
                            <div className="mb-4">
                                <span className="text-sm text-zl-text-muted">Regular Price</span>
                                <div className="text-3xl font-bold text-zl-text">
                                    {formatPrice(product.price, product.currency)}
                                </div>
                                {product.priceCny && (
                                    <div className="text-lg text-zl-text-muted mt-1">
                                        ¥{product.priceCny.toLocaleString()} CNY
                                    </div>
                                )}
                            </div>

                            {/* VIP Pricing Tiers / VIP价格等级 */}
                            {product.vipPrices && (
                                <div className="border-t border-zl-gray pt-4">
                                    <h4 className="text-sm font-semibold text-zl-accent mb-3">{t('vip.title')} Pricing</h4>
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

                            {/* Auction Data / 拍卖数据 */}
                            {product.auctionData && (
                                <div className="border-t border-zl-gray mt-4 pt-4">
                                    <h4 className="text-sm font-semibold text-zl-accent mb-2">{t('products.auction')} Data</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {product.auctionData.lastSold && (
                                            <div>
                                                <span className="text-zl-text-muted">Last Sold:</span>
                                                <span className="ml-2">{new Date(product.auctionData.lastSold).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        {product.auctionData.soldPrice && (
                                            <div>
                                                <span className="text-zl-text-muted">Auction Price:</span>
                                                <span className="ml-2">${product.auctionData.soldPrice.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {product.auctionData.priceTrend && (
                                            <div className="col-span-2">
                                                <span className="text-zl-text-muted">Trend:</span>
                                                <span className={`ml-2 ${product.auctionData.priceTrend === 'up' ? 'text-green-400' :
                                                    product.auctionData.priceTrend === 'down' ? 'text-red-400' :
                                                        'text-yellow-400'
                                                    }`}>
                                                    {product.auctionData.priceTrend === 'up' ? '↑ Rising' :
                                                        product.auctionData.priceTrend === 'down' ? '↓ Falling' :
                                                            '→ Stable'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quantity Selector / 数量选择器 */}
                        <div className="flex items-center gap-4 mb-6">
                            <label className="text-sm text-zl-text-muted">Quantity:</label>
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
                                ({product.stock} available)
                            </span>
                        </div>

                        {/* Action Buttons / 操作按钮 */}
                        <div className="space-y-3">
                            {/* Add to Cart Button / 加入购物车按钮 */}
                            <button
                                onClick={() => handleAddToCart(product.id)}
                                disabled={product.stock === 0}
                                className={`w-full premium-button py-4 rounded-xl text-lg font-semibold ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {product.stock === 0 ? 'Out of Stock' : t('products.addToCart')}
                            </button>

                            {/* Cart Message / 购物车消息 */}
                            {cartMessage && (
                                <div className={`text-center py-2 px-4 rounded-lg ${cartMessage.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {cartMessage.text}
                                </div>
                            )}

                            {/* Secondary Actions / 次要操作 */}
                            <div className="grid grid-cols-2 gap-3">
                                <button className="py-3 border border-zl-gray rounded-xl hover:bg-zl-dark-3 transition">
                                    ♡ Wishlist
                                </button>
                                <button className="py-3 border border-zl-gray rounded-xl hover:bg-zl-dark-3 transition">
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges / 信任徽章 */}
                        <div className="mt-8 pt-6 border-t border-zl-gray">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-zl-accent text-lg mb-1">✓</div>
                                    <div className="text-xs text-zl-text-muted">Authenticity Guaranteed</div>
                                </div>
                                <div>
                                    <div className="text-zl-accent text-lg mb-1">🔒</div>
                                    <div className="text-xs text-zl-text-muted">Secure Payment</div>
                                </div>
                                <div>
                                    <div className="text-zl-accent text-lg mb-1">📦</div>
                                    <div className="text-xs text-zl-text-muted">Insured Shipping</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Product Details Tabs / 产品详情标签页 */}
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
                                    {tab === 'description' ? 'Description' : tab === 'specs' ? 'Specifications' : `Reviews (${product.reviews})`}
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

                                {/* Additional description content / 额外描述内容 */}
                                <div className="mt-8 grid md:grid-cols-2 gap-8">
                                    <div className="bg-zl-dark-3 rounded-xl p-6">
                                        <h4 className="font-semibold mb-4 text-zl-accent">Craftsmanship</h4>
                                        <p className="text-zl-text-muted text-sm leading-relaxed">
                                            Each piece is meticulously crafted by master artisans using traditional techniques passed down through generations.
                                            The attention to detail ensures exceptional quality and longevity.
                                        </p>
                                    </div>
                                    <div className="bg-zl-dark-3 rounded-xl p-6">
                                        <h4 className="font-semibold mb-4 text-zl-accent">Investment Value</h4>
                                        <p className="text-zl-text-muted text-sm leading-relaxed">
                                            This piece represents not just a purchase, but an investment in timeless elegance.
                                            Luxury items from this collection have shown consistent appreciation over time.
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
                                {/* Sample review / 示例评价 */}
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
                                            <span className="text-xs text-zl-text-muted mt-2 block">Verified Purchase • 2024-05-15</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center py-8">
                                    <p className="text-zl-text-muted mb-4">View all {product.reviews} reviews</p>
                                    <button className="premium-button px-6 py-2 rounded-lg">
                                        Load More Reviews
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products / 相关产品 */}
                <section className="mt-20">
                    <h2 className="text-2xl font-bold font-montserrat mb-8">You May Also Like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {/* Related product placeholders would be fetched dynamically */}
                        {[1, 2, 3, 4].map((i) => (
                            <Link key={i} href="#" className="group">
                                <div className="luxury-card rounded-xl overflow-hidden">
                                    <div className="aspect-square bg-zl-dark-3 flex items-center justify-center">
                                        <svg width="80" height="80" viewBox="0 0 100 100" opacity="0.5">
                                            <circle cx="50" cy="50" r="45" stroke="#D4AF37" strokeWidth="2" fill="none" />
                                            <rect x="42" y="35" width="16" height="30" rx="2" fill="#D4AF37" />
                                        </svg>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm text-zl-text-muted truncate">Related Product {i}</p>
                                        <p className="font-semibold">$XX,XXX</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}