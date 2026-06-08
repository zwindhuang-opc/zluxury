'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-zl-dark-3 bg-zl-dark/95 backdrop-blur-xl">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
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
              <div className="text-[10px] text-zl-accent tracking-[0.2em] uppercase">AI-Powered Excellence</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="nav-link active text-sm tracking-wide text-zl-text">HOME</Link>
            <Link href="/collections" className="nav-link text-sm tracking-wide text-zl-text-muted hover:text-zl-text">COLLECTIONS</Link>
            <Link href="/products" className="nav-link text-sm tracking-wide text-zl-text-muted hover:text-zl-text">PRODUCTS</Link>
            <Link href="/ai-assistant" className="nav-link text-sm tracking-wide text-zl-text-muted hover:text-zl-text">AI ASSISTANT</Link>
            <Link href="/concierge" className="nav-link text-sm tracking-wide text-zl-text-muted hover:text-zl-text">CONCIERGE</Link>
            <Link href="/about" className="nav-link text-sm tracking-wide text-zl-text-muted hover:text-zl-text">ABOUT</Link>
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search Button */}
            <button 
              className="p-2 text-zl-text-muted hover:text-zl-accent transition"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* User Menu */}
            <button className="p-2 text-zl-text-muted hover:text-zl-accent transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            
            {/* Cart */}
            <button className="p-2 text-zl-text-muted hover:text-zl-accent transition relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-zl-accent text-zl-dark text-xs rounded-full flex items-center justify-center font-semibold">3</span>
            </button>
            
            {/* CTA Button */}
            <Link href="/vip" className="elite-button px-5 py-2.5 text-sm font-semibold text-zl-dark uppercase tracking-wide rounded-lg">
              VIP ACCESS
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-zl-text"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-zl-dark-3">
            <div className="relative max-w-xl mx-auto">
              <input 
                type="text" 
                placeholder="Search luxury products, brands, collections..."
                className="w-full input-luxury pr-10"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-zl-accent">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-zl-dark-3">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-zl-text hover:text-zl-accent transition-colors py-2">HOME</Link>
              <Link href="/collections" className="text-zl-text-muted hover:text-zl-text transition-colors py-2">COLLECTIONS</Link>
              <Link href="/products" className="text-zl-text-muted hover:text-zl-text transition-colors py-2">PRODUCTS</Link>
              <Link href="/ai-assistant" className="text-zl-text-muted hover:text-zl-text transition-colors py-2">AI ASSISTANT</Link>
              <Link href="/concierge" className="text-zl-text-muted hover:text-zl-text transition-colors py-2">CONCIERGE</Link>
              <Link href="/about" className="text-zl-text-muted hover:text-zl-text transition-colors py-2">ABOUT</Link>
              <div className="flex flex-col gap-4 pt-4 border-t border-zl-dark-3">
                <button className="text-sm text-zl-text-muted hover:text-zl-text transition py-2">Sign In</button>
                <Link href="/vip" className="elite-button px-6 py-3 text-sm font-semibold text-zl-dark uppercase tracking-wide rounded-lg text-center">
                  VIP ACCESS
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}