/**
 * Footer Component - Professional luxury footer with navigation and contact
 * 
 * Design inspired by:
 * - Cartier: Brand storytelling in footer, heritage links
 * - Tiffany & Co.: Clean layout, elegant typography
 * - Bulgari: Social media integration, newsletter signup
 * 
 * Features:
 * - Multi-column layout: Brand, Quick Links, Services, Contact
 * - Social media links with hover effects
 * - Newsletter signup form
 * - Quick navigation to all major pages
 * - Contact information with icons
 * 
 * @module Footer
 * @version 1.3.0
 */

'use client'

import Link from 'next/link'
import { useTranslation } from '@/i18n/useTranslation'

/**
 * Footer Component
 * Professional luxury footer with brand information, navigation links,
 * social media integration, and newsletter signup functionality.
 * 
 * @returns {JSX.Element} Footer component
 */
export default function Footer() {
    const { t } = useTranslation()

    return (
        <footer className="bg-zl-dark-2 border-t border-zl-gray">
            <div className="container">
                <div className="py-16">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Brand */}
                        <div className="lg:col-span-1">
                            <Link href="/" className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 flex items-center justify-center">
                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="24" cy="24" r="22" stroke="#00B4D8" strokeWidth="2" />
                                        <path d="M16 24L22 18V30L16 24Z" fill="#00B4D8" />
                                        <path d="M32 24L26 30V18L32 24Z" fill="#00B4D8" />
                                        <rect x="21" y="18" width="6" height="12" rx="1" fill="#D4AF37" />
                                        <circle cx="24" cy="24" r="4" fill="#00B4D8" opacity="0.5" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-xl font-bold tracking-[0.15em] font-montserrat text-zl-text">ZLUXURY</div>
                                    <div className="text-[10px] text-zl-accent tracking-[0.2em] uppercase">{t('footer.tagline')}</div>
                                </div>
                            </Link>
                            <p className="text-sm text-zl-text-muted leading-relaxed mb-6">
                                {t('footer.description')}
                            </p>
                            <div className="flex gap-4">
                                <Link href="#" className="w-10 h-10 rounded-lg bg-zl-dark-3 flex items-center justify-center hover:bg-zl-accent/20 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                                    </svg>
                                </Link>
                                <Link href="#" className="w-10 h-10 rounded-lg bg-zl-dark-3 flex items-center justify-center hover:bg-zl-accent/20 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </Link>
                                <Link href="#" className="w-10 h-10 rounded-lg bg-zl-dark-3 flex items-center justify-center hover:bg-zl-accent/20 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                    </svg>
                                </Link>
                                <Link href="#" className="w-10 h-10 rounded-lg bg-zl-dark-3 flex items-center justify-center hover:bg-zl-accent/20 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-sm font-semibold text-zl-accent uppercase tracking-wider mb-6">Quick Links</h4>
                            <ul className="space-y-3">
                                <li><Link href="/" className="text-sm text-zl-text-muted hover:text-zl-accent transition">Home</Link></li>
                                <li><Link href="/collections" className="text-sm text-zl-text-muted hover:text-zl-accent transition">Collections</Link></li>
                                <li><Link href="/products" className="text-sm text-zl-text-muted hover:text-zl-accent transition">Products</Link></li>
                                <li><Link href="/ai-assistant" className="text-sm text-zl-text-muted hover:text-zl-accent transition">AI Assistant</Link></li>
                                <li><Link href="/concierge" className="text-sm text-zl-text-muted hover:text-zl-accent transition">Concierge</Link></li>
                                <li><Link href="/about" className="text-sm text-zl-text-muted hover:text-zl-accent transition">About Us</Link></li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h4 className="text-sm font-semibold text-zl-accent uppercase tracking-wider mb-6">Services</h4>
                            <ul className="space-y-3">
                                <li><Link href="/vip" className="text-sm text-zl-text-muted hover:text-zl-accent transition">VIP Membership</Link></li>
                                <li><Link href="/auctions" className="text-sm text-zl-text-muted hover:text-zl-accent transition">Auctions</Link></li>
                                <li><Link href="/authentication" className="text-sm text-zl-text-muted hover:text-zl-accent transition">Authentication</Link></li>
                                <li><Link href="/valuation" className="text-sm text-zl-text-muted hover:text-zl-accent transition">Valuation</Link></li>
                                <li><Link href="/insurance" className="text-sm text-zl-text-muted hover:text-zl-accent transition">Insurance</Link></li>
                                <li><Link href="/shipping" className="text-sm text-zl-text-muted hover:text-zl-accent transition">Global Shipping</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-sm font-semibold text-zl-accent uppercase tracking-wider mb-6">Contact</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-zl-accent mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-sm text-zl-text-muted">Global Headquarters: Geneva, Switzerland</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-zl-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm text-zl-text-muted">contact@zluxury.com</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-zl-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="text-sm text-zl-text-muted">+41 22 000 0000</span>
                                </li>
                            </ul>
                            <div className="mt-6">
                                <h5 className="text-xs font-semibold text-zl-text uppercase tracking-wider mb-3">Newsletter</h5>
                                <div className="flex">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="flex-1 input-luxury text-sm"
                                    />
                                    <button className="premium-button px-4 ml-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-zl-gray">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-zl-text-muted">
                            {t('footer.copyright')} 2024 ZLuxury.
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="text-xs text-zl-text-muted hover:text-zl-accent transition">{t('footer.privacy')}</Link>
                            <Link href="/terms" className="text-xs text-zl-text-muted hover:text-zl-accent transition">{t('footer.terms')}</Link>
                            <Link href="/cookies" className="text-xs text-zl-text-muted hover:text-zl-accent transition">{t('footer.cookies')}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}