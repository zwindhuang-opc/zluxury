'use client'

import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-zl-accent/5 via-transparent to-transparent"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-zl-accent/10 to-transparent blur-3xl"></div>
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-zl-dark-3 border border-zl-accent/30 rounded-full">
                <span className="w-2 h-2 rounded-full bg-zl-accent animate-pulse"></span>
                <span className="text-xs tracking-widest uppercase text-zl-accent">AI-Powered Luxury Platform</span>
              </div>
              
              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-montserrat leading-tight tracking-tight">
                The Future of
                <span className="text-gradient"> Premium</span>
                <br />
                Luxury Commerce
              </h1>
              
              {/* Description */}
              <p className="text-lg text-zl-text-muted max-w-xl leading-relaxed">
                Experience unparalleled luxury shopping with AI-powered recommendations, exclusive collections, and personalized concierge service. Powered by Hermes Agent, OpenClaw, and Unicorn AI.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 items-center">
              <motion.button 
                className="premium-button px-8 py-4 text-sm font-semibold uppercase tracking-widest text-zl-text rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Collections
              </motion.button>
              <motion.button 
                className="px-8 py-4 border border-zl-accent text-sm font-semibold uppercase tracking-widest hover:bg-zl-accent/10 transition rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Try AI Assistant
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-6 border-t border-zl-dark-3">
              <div className="space-y-1">
                <div className="text-3xl font-montserrat font-bold text-zl-text">50,000+</div>
                <div className="text-xs text-zl-text-muted uppercase tracking-wider">Premium Products</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-montserrat font-bold text-zl-text">200+</div>
                <div className="text-xs text-zl-text-muted uppercase tracking-wider">Luxury Brands</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-montserrat font-bold text-zl-text">99.9%</div>
                <div className="text-xs text-zl-text-muted uppercase tracking-wider">Client Satisfaction</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute -inset-10 md:-inset-20 bg-gradient-to-r from-zl-accent/10 via-transparent to-transparent rounded-full blur-3xl"></div>
            
            {/* Main Visual Card */}
            <div className="relative glass-card p-8 rounded-2xl border-l-4 border-zl-accent">
              {/* Luxury Items SVG */}
              <svg width="100%" height="320" viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Watch */}
                <circle cx="120" cy="160" r="60" fill="#1a1a1a" stroke="#00B4D8" strokeWidth="2" />
                <circle cx="120" cy="160" r="50" fill="#0f0f0f" stroke="#D4AF37" strokeWidth="1" />
                <circle cx="120" cy="160" r="5" fill="#D4AF37" />
                <line x1="120" y1="160" x2="120" y2="125" stroke="#D4AF37" strokeWidth="2" />
                <line x1="120" y1="160" x2="145" y2="160" stroke="#00B4D8" strokeWidth="1.5" />
                
                {/* Diamond */}
                <path d="M280 100 L320 140 L280 180 L240 140 Z" fill="#1a1a1a" stroke="#D4AF37" strokeWidth="2" />
                <path d="M280 100 L280 180" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />
                <path d="M240 140 L320 140" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />
                
                {/* Handbag */}
                <rect x="260" y="200" width="80" height="60" rx="5" fill="#1a1a1a" stroke="#00B4D8" strokeWidth="2" />
                <path d="M280 200 Q280 180 300 180 Q320 180 320 200" stroke="#D4AF37" strokeWidth="2" fill="none" />
                
                {/* AI Badge */}
                <rect x="50" y="240" width="100" height="40" rx="8" fill="#00B4D8" opacity="0.2" />
                <text x="100" y="265" textAnchor="middle" fill="#00B4D8" fontSize="14" fontFamily="Montserrat" fontWeight="bold">AI POWERED</text>
                
                {/* Brand Labels */}
                <text x="120" y="250" textAnchor="middle" fill="#8a8a8a" fontSize="10" fontFamily="Montserrat">LUXURY WATCH</text>
                <text x="280" y="200" textAnchor="middle" fill="#8a8a8a" fontSize="10" fontFamily="Montserrat">FINE DIAMOND</text>
                <text x="300" y="280" textAnchor="middle" fill="#8a8a8a" fontSize="10" fontFamily="Montserrat">DESIGNER BAG</text>
              </svg>
              
              {/* Floating Elements */}
              <motion.div 
                className="absolute -top-4 -right-4 w-16 h-16 bg-zl-accent rounded-full flex items-center justify-center animate-pulse-glow"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-zl-dark font-bold text-xs">AI</span>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-zl-gold rounded-full flex items-center justify-center"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                <span className="text-zl-dark font-bold text-xs">VIP</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}