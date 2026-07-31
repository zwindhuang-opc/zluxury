/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'zl-dark': '#050505',
        'zl-dark-2': '#0f0f0f',
        'zl-dark-3': '#1a1a1a',
        'zl-gray': '#2a2a2a',
        'zl-accent': '#00B4D8',
        'zl-accent-light': '#00D4F4',
        'zl-accent-dark': '#0096C7',
        'zl-gold': '#D4AF37',
        'zl-gold-light': '#E5C158',
        'zl-text': '#f5f5f5',
        'zl-text-muted': '#8a8a8a',
        'zl-success': '#00D26A',
        'zl-warning': '#F57C00',
        'zl-error': '#C62828',
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        cormorant: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        notoSans: ['var(--font-noto-sans-sc)', 'Noto Sans SC', 'sans-serif'],
        notoSansSC: ['var(--font-noto-sans-sc)', 'Noto Sans SC', 'sans-serif'],
        notoSerif: ['var(--font-noto-serif-sc)', 'Noto Serif SC', 'serif'],
        notoSansSerif: ['var(--font-noto-serif-sc)', 'Noto Serif SC', 'serif'],
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #00B4D8 0%, #0096C7 50%, #006D8F 100%)',
        'gradient-premium': 'linear-gradient(135deg, #D4AF37 0%, #B8962E 50%, #9A7D27 100%)',
        'gradient-dark': 'linear-gradient(180deg, #050505 0%, #0f0f0f 100%)',
      },
    },
  },
  plugins: [],
}