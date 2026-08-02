/**
 * Translation Hook - Client-side only i18n
 * 
 * Uses dynamic imports to avoid SSR issues with react-i18next
 * 
 * @module useTranslation
 * @version 1.4.0
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import enFallback from './locales/en.json';

/**
 * Translation type
 */
type TranslationFunction = (key: string, options?: Record<string, string | number>) => string;

/**
 * Deeply get a nested value from an object using dot-notation key.
 * Handles both nested objects and arrays (via numeric keys like ".0", ".1")
 */
function getDeepValue(obj: unknown, key: string): unknown {
  const parts = key.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null) return undefined;
    if (Array.isArray(current)) {
      const idx = parseInt(part, 10);
      if (isNaN(idx)) return undefined;
      current = current[idx];
    } else if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return current;
}

/**
 * Replace {{variable}} placeholders in a string with values from options
 */
function interpolate(str: string, options?: Record<string, string | number>): string {
  if (!options) return str;
  return str.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, varName) => {
    const val = options[varName];
    return val !== undefined ? String(val) : match;
  });
}

/**
 * Default translations for SSR fallback
 * Contains all keys used in components to prevent showing raw keys during SSR
 */
const defaultTranslations: Record<string, string> = {
  // Navigation
  'nav.home': 'Home',
  'nav.collections': 'Collections',
  'nav.products': 'Products',
  'nav.aiAssistant': 'AI Assistant',
  'nav.concierge': 'Concierge',
  'nav.about': 'About',
  'nav.signIn': 'Sign In',
  'nav.vipAccess': 'VIP Access',
  'nav.searchPlaceholder': 'Search luxury products, brands, collections...',

  // Hero Section
  'hero.badge': 'AI-Powered Luxury Platform',
  'hero.title': 'Experience',
  'hero.titleHighlight': 'Extraordinary',
  'hero.subtitle': 'The Future of Luxury Commerce',
  'hero.description': 'Fusing artificial intelligence with supreme luxury, we present a unique shopping experience. Enjoy exclusive concierge service, limited edition collections, and Unicorn AI intelligent recommendations powered by Hermes and OpenClaw technology.',
  'hero.explore': 'Explore Collections',
  'hero.tryAI': 'Try AI Assistant',
  'hero.stats.products': 'Premium Products',
  'hero.stats.brands': 'Luxury Brands',
  'hero.stats.satisfaction': 'Client Satisfaction',
  'hero.categories.watch': 'Luxury Watch',
  'hero.categories.diamond': 'Fine Diamond',
  'hero.categories.bag': 'Designer Bag',
  'hero.categories.jewelry': 'High Jewelry',
  'hero.exclusiveCollection': 'Exclusive Collection',
  'hero.curatedSelection': 'Curated selection from Rolex, Hermès, Cartier & more',
  'hero.imageAlt': 'Luxury curated collection - fine watches, diamond jewelry & designer handbags in elegant boutique display',

  // AI Section
  'ai.badge': 'AI Powered',
  'ai.vipBadge': 'VIP',
  'ai.poweredBy': 'Powered by Unicorn AI',
  'ai.features.recommendation': 'Smart Recommendation',
  'ai.features.priceAnalysis': 'Price Analysis',
  'ai.features.investment': 'Investment Rating',
  'ai.features.concierge': 'Personal Concierge',

  // Products
  'products.title': 'Curated Selection',
  'products.subtitle': 'Discover Your Exclusive Luxury',
  'products.featured': 'Featured Products',
  'products.featuredSubtitle': 'Curated selection with HK/Europe/Japan sourcing • Save up to 30% vs China retail',
  'products.viewDetails': 'View Details',
  'products.viewAll': 'Browse All Products',
  'products.viewAllProducts': 'View All Products',
  'products.addToCart': 'Add to Bag',
  'products.vipPrice': 'VIP Exclusive Price',
  'products.limited': 'Limited Edition',
  'products.newArrival': 'New Arrival',
  'products.investmentGrade': 'Investment Grade',
  'products.auction': 'Auction Piece',
  'products.loadingSelection': 'Loading premium selection...',
  'products.newBadge': 'New',
  'products.limitedBadge': 'Limited',
  'products.stockInStock': 'In Stock',
  'products.stockOnly': 'Only {{count}} left',
  'products.stockOnlyLeft': 'Only {{count}} left!',
  'products.bestSourcingChannel': 'Best Sourcing Channel',
  'products.sourcingChannels.hkDirect': 'Hong Kong Direct',
  'products.sourcingChannels.japanAuction': 'Japan Auction',
  'products.sourcingChannels.europeBoutique': 'Europe Boutique',
  'products.sourcingChannels.bondedWarehouse': 'Shanghai FTZ Bonded',
  'products.sourcingChannels.personalCarry': 'Personal Carry',
  'products.regularPrice': 'Regular Price',
  'products.vipPricing': 'VIP Pricing',
  'products.auctionData': 'Auction Data',
  'products.lastSold': 'Last Sold:',
  'products.auctionPrice': 'Auction Price:',
  'products.trend': 'Trend:',
  'products.trendUp': '↑ Rising',
  'products.trendDown': '↓ Falling',
  'products.trendStable': '→ Stable',
  'products.quantity': 'Quantity:',
  'products.quantityAvailable': '({{count}} available)',
  'products.outOfStock': 'Out of Stock',
  'products.wishlist': '♡ Wishlist',
  'products.share': 'Share',
  'products.guarantees.authenticity': 'Authenticity Guaranteed',
  'products.guarantees.securePayment': 'Secure Payment',
  'products.guarantees.insuredShipping': 'Insured Shipping',
  'products.tabs.description': 'Description',
  'products.tabs.specs': 'Specifications',
  'products.tabs.reviews': 'Reviews ({{count}})',
  'products.craftsmanship': 'Craftsmanship',
  'products.craftsmanshipDesc': 'Each piece is meticulously crafted by master artisans using traditional techniques passed down through generations. The attention to detail ensures exceptional quality and longevity.',
  'products.investmentValue': 'Investment Value',
  'products.investmentValueDesc': 'This piece represents not just a purchase, but an investment in timeless elegance. Luxury items from this collection have shown consistent appreciation over time.',
  'products.verifiedPurchase': 'Verified Purchase',
  'products.viewAllReviews': 'View all {{count}} reviews',
  'products.loadMoreReviews': 'Load More Reviews',
  'products.youMayAlsoLike': 'You May Also Like',
  'products.allTitle': 'All Products',
  'products.allSubtitle': 'Browse our complete collection of luxury pieces. From iconic timepieces to rare gemstones, each item is authenticated and sourced from reputable global channels.',
  'products.searchPlaceholder': 'Search by name, brand, or keyword...',
  'products.filters.allCategories': 'All Categories',
  'products.filters.allBrands': 'All Brands',
  'products.filters.sortByName': 'Sort by Name',
  'products.filters.sortByPriceAsc': 'Price: Low to High',
  'products.filters.sortByPriceDesc': 'Price: High to Low',
  'products.filters.sortByRating': 'Top Rated',
  'products.filters.sortByNewest': 'Newest First',
  'products.filters.priceRange': 'Price Range (USD):',
  'products.filters.priceMin': 'Min',
  'products.filters.priceMax': 'Max',
  'products.filters.clearFilters': 'Clear Filters',
  'products.filters.showing': 'Showing {{filtered}} of {{total}} products',
  'products.filters.noProducts': 'No products found matching your criteria.',
  'products.filters.noProductsHint': 'Try adjusting your filters or search terms.',
  'products.filters.loadingProducts': 'Loading products...',

  // Categories
  'categories.title': 'Luxury Collections',
  'categories.subtitle': 'Explore Premium Brand Collections',
  'categories.watches': 'Luxury Watches',
  'categories.jewelry': 'High Jewelry',
  'categories.handbags': 'Designer Handbags',
  'categories.diamonds': 'Fine Diamonds',
  'categories.fragrances': 'Luxury Fragrances',
  'categories.accessories': 'Fine Accessories',
  'categories.fashion': 'Designer Fashion',
  'categories.art': 'Fine Art',
  'categories.cars': 'Luxury Automobiles',
  'categories.realEstate': 'Exclusive Real Estate',
  'categories.yachts': 'Luxury Yachts',
  'categories.pageTitle': 'Product Categories',
  'categories.pageSubtitle': 'Explore our curated selection of luxury categories. From haute horlogerie to fine art, discover the finest pieces from the world\'s most prestigious houses.',
  'categories.searchPlaceholder': 'Search categories, brands, or styles...',
  'categories.showing': 'Showing {{filtered}} of {{total}} categories',
  'categories.itemsCount': '{{count}} items',
  'categories.explore': 'Explore',
  'categories.moreBrands': '+{{count}} more',
  'categories.noCategories': 'No categories found matching "{{query}}".',
  'categories.clearSearch': 'Clear Search',
  'categories.descriptions.watches': 'Timepieces from Rolex, Patek Philippe, Omega, and more',
  'categories.descriptions.jewelry': 'Diamonds, gemstones, and precious metals',
  'categories.descriptions.handbags': 'Handbags and accessories from top designers',
  'categories.descriptions.fashion': 'Haute couture and luxury apparel',
  'categories.descriptions.art': 'Original artworks and limited editions',
  'categories.descriptions.cars': 'Premium automobiles and exotic cars',
  'categories.descriptions.realEstate': 'Exclusive properties worldwide',
  'categories.descriptions.yachts': 'Superyachts and sailing vessels',
  'categories.imageAltSuffix': 'curated collection image',

  // Collections
  'collections.title': 'Luxury Collections',
  'collections.pageSubtitle': 'Explore our meticulously curated collections, each telling a unique story of luxury, craftsmanship, and timeless elegance.',
  'collections.searchPlaceholder': 'Search collections, brands, or styles...',
  'collections.sortByName': 'Sort by Name',
  'collections.sortByProducts': 'Sort by Products',
  'collections.sortByBrands': 'Sort by Brands',
  'collections.showing': 'Showing {{filtered}} of {{total}} collections',
  'collections.itemsCount': '{{count}} Items',
  'collections.moreBrands': '+{{count}} more',
  'collections.exploreCollection': 'Explore Collection →',
  'collections.noCollections': 'No collections found matching your criteria.',
  'collections.clearFilters': 'Clear Filters',
  'collections.productsInCollection': 'Products in Selected Collection',
  'collections.loadingProducts': 'Loading products...',
  'collections.ctaTitle': 'Can\'t Find What You\'re Looking For?',
  'collections.ctaSubtitle': 'Our AI-powered concierge service can help you source rare and exclusive pieces from our global network of partners.',
  'collections.askAI': 'Ask AI Assistant',
  'collections.contactConcierge': 'Contact Concierge',
  'collections.timelessElegance': 'Timeless Elegance',
  'collections.modernLuxe': 'Modern Luxury',
  'collections.hauteHorlogerie': 'Haute Horlogerie',
  'collections.rareGems': 'Rare Gems & Jewelry',
  'collections.leatherCraftsmanship': 'Leather Craftsmanship',
  'collections.limitedEditions': 'Limited Editions',
  'collections.descriptions.timelessElegance': 'Classic pieces that transcend seasons and trends. Enduring designs from heritage houses.',
  'collections.descriptions.modernLuxe': 'Contemporary designs pushing boundaries of luxury fashion and accessories.',
  'collections.descriptions.hauteHorlogerie': 'Exceptional timepieces showcasing the pinnacle of watchmaking artistry.',
  'collections.descriptions.rareGems': 'Extraordinary gemstones and jewelry pieces for discerning collectors.',
  'collections.descriptions.leatherCraftsmanship': 'Master leather goods showcasing exceptional artisanal skills.',
  'collections.descriptions.limitedEditions': 'Exclusive pieces available in limited quantities for true connoisseurs.',

  // VIP
  'vip.title': 'VIP Membership',
  'vip.subtitle': 'Begin Your Exclusive Luxury Journey',
  'vip.tiers.standard': 'Standard Member',
  'vip.tiers.silver': 'Silver Member',
  'vip.tiers.gold': 'Gold Member',
  'vip.tiers.black': 'Black Member',
  'vip.tiers.diamond': 'Diamond Member',
  'vip.tiers.platinum': 'Platinum Member',
  'vip.benefits.discount': 'Exclusive Discount',
  'vip.benefits.concierge': 'One-on-One Concierge',
  'vip.benefits.priority': 'Priority Purchase',
  'vip.benefits.events': 'Private Event Invitations',
  'vip.benefits.investment': 'Investment Advisory',
  'vip.benefits.earlyAccess': 'Early access',
  'vip.benefits.prioritySupport': 'Priority support',
  'vip.benefits.exclusiveEvents': 'Exclusive events',
  'vip.benefits.personalShopper': 'Personal shopper',
  'vip.benefits.whiteGlove': 'White-glove service',
  'vip.benefits.privateCollections': 'Private collections',
  'vip.join': 'Become a Member',
  'vip.upgrade': 'Upgrade Membership',

  // About
  'about.title': 'About ZLuxury',
  'about.subtitle': 'Redefining luxury commerce through the fusion of artificial intelligence and timeless elegance. We connect discerning collectors with the world\'s finest pieces, authenticated and delivered with unparalleled care.',
  'about.exploreCollection': 'Explore Collection',
  'about.viewCollections': 'View Collections',
  'about.mission.title': 'Our Mission',
  'about.mission.description': 'To democratize luxury by making authentic, high-end pieces accessible to collectors worldwide through transparent pricing, AI-driven personalization, and a seamless cross-border shopping experience. We believe luxury should be inclusive, intelligent, and deeply personal.',
  'about.vision.title': 'Our Vision',
  'about.vision.description': 'To become the world\'s leading AI-powered luxury marketplace by 2030, connecting collectors with rare and exclusive pieces from every corner of the globe. We envision a future where technology enhances the human experience of acquiring and cherishing beautiful objects.',
  'about.coreValues.title': 'Core Values',
  'about.coreValues.subtitle': 'The principles that guide everything we do — from sourcing to customer service.',
  'about.coreValues.authenticity': 'Authenticity',
  'about.coreValues.authenticityDesc': 'Every piece is meticulously authenticated through our network of trusted experts and auction house partnerships.',
  'about.coreValues.aiPersonalized': 'AI-Personalized',
  'about.coreValues.aiPersonalizedDesc': 'Our Unicorn AI engine learns your preferences to recommend pieces that match your unique taste and lifestyle.',
  'about.coreValues.globalSourcing': 'Global Sourcing',
  'about.coreValues.globalSourcingDesc': 'Direct channels from Hong Kong, Japan, Europe, and bonded warehouses ensure the best prices and fastest delivery.',
  'about.coreValues.vipConcierge': 'VIP Concierge',
  'about.coreValues.vipConciergeDesc': 'Dedicated personal shoppers for our premium members, providing white-glove service from selection to delivery.',
  'about.howItWorks.title': 'How It Works',
  'about.howItWorks.subtitle': 'Our unique business model combines global sourcing with AI-powered personalization to deliver unmatched value.',
  'about.howItWorks.steps.sourcing.title': 'Sourcing',
  'about.howItWorks.steps.sourcing.description': 'We procure luxury items through multiple channels: Hong Kong direct, Japan auctions, European boutiques, and Shanghai FTZ bonded warehouses.',
  'about.howItWorks.steps.authentication.title': 'Authentication',
  'about.howItWorks.steps.authentication.description': 'Every item undergoes rigorous authentication by certified appraisers. Serial numbers, condition grading, and provenance are all verified.',
  'about.howItWorks.steps.aiMatching.title': 'AI Matching',
  'about.howItWorks.steps.aiMatching.description': 'Our Unicorn AI engine analyzes your browsing, purchase history, and preferences to recommend pieces tailored to your taste and lifestyle.',
  'about.howItWorks.steps.delivery.title': 'Delivery',
  'about.howItWorks.steps.delivery.description': 'Choose from four shipping modes including personal carry (0-1 day), bonded warehouse (2-5 days), direct mail (7-14 days), and express courier (3-7 days).',
  'about.stats.authenticatedProducts': 'Authenticated Products',
  'about.stats.luxuryBrands': 'Luxury Brands',
  'about.stats.sourcingChannels': 'Sourcing Channels',
  'about.stats.averageSavings': 'Average Savings vs Retail',
  'about.cta.title': 'Ready to Experience Luxury Differently?',
  'about.cta.subtitle': 'Join ZLuxury today and discover a new paradigm in luxury shopping — where artificial intelligence meets timeless craftsmanship.',
  'about.cta.shopNow': 'Shop Now',
  'about.cta.browseCollections': 'Browse Collections',

  // AI Assistant
  'aiAssistant.title': 'AI Assistant',
  'aiAssistant.subtitle': 'Powered by Hermes Agent, OpenClaw, and Unicorn AI from Anna AI Platform',
  'aiAssistant.selectAgent': 'Select AI Agent',
  'aiAssistant.online': 'Online',
  'aiAssistant.placeholder': 'Ask about luxury products, recommendations, prices...',
  'aiAssistant.send': 'Send',
  'aiAssistant.agents.hermes.name': 'Hermes Agent',
  'aiAssistant.agents.hermes.nameCn': 'Hermes AI Concierge',
  'aiAssistant.agents.hermes.description': 'Luxury recommendation specialist',
  'aiAssistant.agents.hermes.capabilities.recommendations': 'Product recommendations',
  'aiAssistant.agents.hermes.capabilities.expertise': 'Brand expertise',
  'aiAssistant.agents.hermes.capabilities.matching': 'Style matching',
  'aiAssistant.agents.hermes.capabilities.trends': 'Trend analysis',
  'aiAssistant.agents.openclaw.name': 'OpenClaw Engine',
  'aiAssistant.agents.openclaw.nameCn': 'OpenClaw Automation',
  'aiAssistant.agents.openclaw.description': 'Skills and automation engine',
  'aiAssistant.agents.openclaw.capabilities.priceComparison': 'Price comparison',
  'aiAssistant.agents.openclaw.capabilities.availability': 'Availability check',
  'aiAssistant.agents.openclaw.capabilities.tracking': 'Order tracking',
  'aiAssistant.agents.openclaw.capabilities.automation': 'Automated tasks',
  'aiAssistant.agents.unicorn.name': 'Unicorn Agent',
  'aiAssistant.agents.unicorn.nameCn': 'Unicorn Dialogue',
  'aiAssistant.agents.unicorn.description': 'Enhanced AI conversation',
  'aiAssistant.agents.unicorn.capabilities.conversation': 'Natural conversation',
  'aiAssistant.agents.unicorn.capabilities.context': 'Context understanding',
  'aiAssistant.agents.unicorn.capabilities.dialogue': 'Multi-turn dialogue',
  'aiAssistant.agents.unicorn.capabilities.personalized': 'Personalized responses',
  'aiAssistant.welcomeMessage': 'Welcome to ZLuxury AI Assistant! 🎩\n\nI\'m your luxury concierge, powered by advanced AI agents:\n\n**Hermes** - Product recommendations & brand expertise\n**OpenClaw** - Price tracking & order management\n**Unicorn** - Creative conversation & styling advice\n\nHow may I assist you today?',
  'aiAssistant.errorMessage': 'I apologize, but I encountered an issue processing your request. Please try again or select a different agent.',

  // Business Strategy
  'businessStrategy.title': 'Business Strategy',
  'businessStrategy.subtitle': 'Comprehensive monetization plan and market positioning for sustainable growth',
  'businessStrategy.marketAnalysis': 'Market Analysis',
  'businessStrategy.stats.globalMarket': 'Global Luxury Market',
  'businessStrategy.stats.growthRate': 'Annual Growth Rate',
  'businessStrategy.stats.onlineSegment': 'Online Segment',
  'businessStrategy.stats.aiAdoption': 'AI Adoption Rate',
  'businessStrategy.keyRegions': 'Key Regions',
  'businessStrategy.targetDemographics': 'Target Demographics',
  'businessStrategy.strategies.subscription.title': 'VIP Membership Program',
  'businessStrategy.strategies.subscription.description': 'Tiered subscription model offering exclusive benefits',
  'businessStrategy.strategies.subscription.revenueModel': 'Monthly recurring revenue with tier upgrade incentives',
  'businessStrategy.strategies.subscription.target': 'High-net-worth individuals seeking premium service',
  'businessStrategy.strategies.commission.title': 'Transaction Commission',
  'businessStrategy.strategies.commission.description': 'Commission-based revenue from luxury transactions',
  'businessStrategy.strategies.commission.revenueModel': 'Per-transaction commission with volume bonuses',
  'businessStrategy.strategies.commission.target': 'Luxury brands and authorized dealers',
  'businessStrategy.strategies.aiServices.title': 'AI Agent Services',
  'businessStrategy.strategies.aiServices.description': 'Premium AI-powered services for businesses',
  'businessStrategy.strategies.aiServices.revenueModel': 'SaaS subscription + API usage fees',
  'businessStrategy.strategies.aiServices.target': 'Luxury retailers, brands, and marketplaces',
  'businessStrategy.strategies.concierge.title': 'Concierge Services',
  'businessStrategy.strategies.concierge.description': 'White-glove personal shopping and advisory',
  'businessStrategy.strategies.concierge.revenueModel': 'Service fees + success-based bonuses',
  'businessStrategy.strategies.concierge.target': 'Ultra-high-net-worth clients',
  'businessStrategy.revenueModel': 'Revenue Model',
  'businessStrategy.targetAudience': 'Target Audience',
  'businessStrategy.aiBenefits.title': 'AI Integration Benefits',
  'businessStrategy.aiBenefits.hermes.name': 'Hermes Agent',
  'businessStrategy.aiBenefits.openclaw.name': 'OpenClaw Skills',
  'businessStrategy.aiBenefits.unicorn.name': 'Unicorn Agent',
  'businessStrategy.categories.watchesJewelry': 'Watches & Jewelry',
  'businessStrategy.categories.fashionBags': 'Fashion & Bags',
  'businessStrategy.categories.artCollectibles': 'Art & Collectibles',
  'businessStrategy.categories.realEstateYachts': 'Real Estate & Yachts',
  'businessStrategy.services.hermesApi': 'Hermes Recommendation API',
  'businessStrategy.services.openClawSuite': 'OpenClaw Automation Suite',
  'businessStrategy.services.unicornChat': 'Unicorn Chat Integration',
  'businessStrategy.services.fullPlatform': 'Full AI Platform License',
  'businessStrategy.packages.personalShopping': 'Personal Shopping',
  'businessStrategy.packages.collectionAdvisory': 'Collection Advisory',
  'businessStrategy.packages.investmentGuidance': 'Investment Guidance',
  'businessStrategy.packages.fullYearConcierge': 'Full Year Concierge',
  'businessStrategy.perSession': 'per session',
  'businessStrategy.perConsultation': 'per consultation',
  'businessStrategy.perAnalysis': 'per analysis',
  'businessStrategy.annual': 'annual',
  'businessStrategy.customPricing': 'Custom pricing',
  'businessStrategy.demographics.hnwi': 'HNWI (High Net Worth Individuals) - {{threshold}} assets',
  'businessStrategy.demographics.uhnwi': 'UHNWI (Ultra High Net Worth) - {{threshold}} assets',
  'businessStrategy.demographics.aspiring': 'Aspiring luxury consumers - {{threshold}} income',
  'businessStrategy.regions.northAmerica': 'North America',
  'businessStrategy.regions.europe': 'Europe',
  'businessStrategy.regions.asiaPacific': 'Asia-Pacific',
  'businessStrategy.regions.middleEast': 'Middle East',

  // Testimonials
  'testimonials.title': 'Client Testimonials',
  'testimonials.subtitle': 'Real experiences from our discerning clients worldwide',
  'testimonials.trustStats.satisfaction': 'Client Satisfaction Rate',
  'testimonials.trustStats.brands': 'Verified Luxury Brands',
  'testimonials.trustStats.transactions': 'Transactions Processed',
  'testimonials.trustStats.members': 'Active Members',

  // Footer
  'footer.description': 'Fusing artificial intelligence with supreme luxury, providing unique shopping experiences for distinguished clients.',
  'footer.platform': 'Platform',
  'footer.browseProducts': 'Browse Products',
  'footer.aiInsights': 'AI Insights',
  'footer.priceAnalysis': 'Price Analysis',
  'footer.company': 'Company',
  'footer.aboutUs': 'About Us',
  'footer.careers': 'Careers',
  'footer.press': 'Press',
  'footer.blog': 'Luxury Blog',
  'footer.legal': 'Legal',
  'footer.privacy': 'Privacy Policy',
  'footer.terms': 'Terms of Service',
  'footer.cookies': 'Cookie Policy',
  'footer.tagline': 'Designed for extraordinary luxury experiences',
  'footer.copyright': 'All Rights Reserved',
  'footer.quickLinks': 'Quick Links',
  'footer.services': 'Services',
  'footer.contact': 'Contact',
  'footer.vipMembership': 'VIP Membership',
  'footer.auctions': 'Auctions',
  'footer.authentication': 'Authentication',
  'footer.valuation': 'Valuation',
  'footer.insurance': 'Insurance',
  'footer.globalShipping': 'Global Shipping',
  'footer.home': 'Home',
  'footer.contactInfo.hq': 'Global Headquarters: Geneva, Switzerland',
  'footer.contactInfo.email': 'contact@zluxury.com',
  'footer.contactInfo.phone': '+41 22 000 0000',
  'footer.newsletter': 'Newsletter',
  'footer.newsletterPlaceholder': 'Enter your email',

  // Language
  'language.switch': 'Language',
  'language.zhCN': '简体中文',
  'language.en': 'English',
  'language.zhTW': '繁體中文',

  // Common
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.retry': 'Retry',
  'common.confirm': 'Confirm',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.close': 'Close',
  'common.currency': '¥',
  'common.priceFrom': 'Starting from',
  'common.or': 'or',
  'common.and': 'and',
  'common.view': 'View',
  'common.readMore': 'Read More',
  'common.learnMore': 'Learn More',
  'common.back': 'Back',
  'common.next': 'Next',
  'common.previous': 'Previous',
  'common.submit': 'Submit',
  'common.apply': 'Apply',
  'common.select': 'Select',
  'common.search': 'Search',
  'common.filter': 'Filter',
  'common.sort': 'Sort',
  'common.all': 'All',
  'common.none': 'None',
  'common.yes': 'Yes',
  'common.no': 'No',
  'common.success': 'Success',
  'common.failed': 'Failed',
  'common.warning': 'Warning',
  'common.info': 'Info',
  'common.networkError': 'Network error. Please try again.',
  'common.image': 'Image',
  'common.collection': 'Collection',
  'common.luxuryProduct': 'Luxury Product',

  // Category Page
  'categoryPage.results': 'Showing <0>{{count}}</0> products in <1>{{name}}</1>',
  'categoryPage.noProductsTitle': 'No products found',
  'categoryPage.noProductsDesc': 'We don\'t have any products in this category yet.',
  'categoryPage.browseAll': 'Browse All Collections',
  'categoryPage.newBadge': 'New',
  'categoryPage.limitedBadge': 'Limited',
  'categoryPage.onlyLeft': 'Only {{count}} left',

  // VIP Page
  'vipPage.title': 'VIP Membership',
  'vipPage.subtitle': 'Unlock exclusive privileges and personalized services.',
  'vipPage.viewPlans': 'View Membership Plans',
  'vipPage.learnMore': 'Learn More',
  'vipPage.backHome': 'Back to Home',
  'vipPage.shopNow': 'Shop Now',
  'vipPage.joinNow': 'Join Now',
  'vipPage.whyTitle': 'Why Become a VIP?',
  'vipPage.tiersTitle': 'Choose Your Tier',
  'vipPage.compareTitle': 'Compare Plans',
  'vipPage.ctaTitle': 'Ready to Elevate Your Luxury Experience?',
  'vipPage.ctaSubtitle': 'Join ZLuxury VIP today.',

  // AI Assistant Page
  'aiAssistantPage.title': 'AI Assistant',
  'aiAssistantPage.subtitle': 'Experience the future of luxury shopping with AI.',
  'aiAssistantPage.tryNow': 'Try AI Now',
  'aiAssistantPage.backHome': 'Back to Home',
  'aiAssistantPage.browseProducts': 'Browse Products',
  'aiAssistantPage.agentsTitle': 'Meet Our AI Agents',
  'aiAssistantPage.howTitle': 'How It Works',
  'aiAssistantPage.ctaTitle': 'Ready to Experience AI-Powered Luxury?',

  // Concierge Page
  'conciergePage.title': 'Concierge Services',
  'conciergePage.subtitle': 'White-glove personal shopping at its finest.',
  'conciergePage.viewServices': 'View Services',
  'conciergePage.backHome': 'Back to Home',
  'conciergePage.requestService': 'Request Concierge',
  'conciergePage.servicesTitle': 'Our Services',
  'conciergePage.ctaTitle': 'Ready for a Personal Luxury Experience?',

  // Auctions Page
  'auctionsPage.title': 'Luxury Auctions',
  'auctionsPage.subtitle': 'Participate in curated luxury auctions.',
  'auctionsPage.viewUpcoming': 'View Upcoming Auctions',
  'auctionsPage.backHome': 'Back to Home',
  'auctionsPage.browseAuctions': 'Browse Auctions',
  'auctionsPage.upcomingTitle': 'Upcoming Auctions',
  'auctionsPage.ctaTitle': 'Ready to Bid?',

  // Authentication Page
  'authenticationPage.title': 'Product Authentication',
  'authenticationPage.subtitle': 'Every luxury piece deserves provenance.',
  'authenticationPage.startVerification': 'Start Verification',
  'authenticationPage.backHome': 'Back to Home',
  'authenticationPage.browseProducts': 'Browse Products',
  'authenticationPage.ctaTitle': 'Buy with Confidence',

  // Valuation Page
  'valuationPage.title': 'Luxury Valuation',
  'valuationPage.subtitle': 'Get accurate, certified valuations.',
  'valuationPage.getValuation': 'Get Valuation',
  'valuationPage.backHome': 'Back to Home',
  'valuationPage.startNow': 'Start Now',
  'valuationPage.servicesTitle': 'Valuation Services',
  'valuationPage.ctaTitle': 'Know the True Value of Your Luxury',

  // Insurance Page
  'insurancePage.title': 'Luxury Insurance',
  'insurancePage.subtitle': 'Protect your valuable luxury items.',
  'insurancePage.viewPlans': 'View Insurance Plans',
  'insurancePage.backHome': 'Back to Home',
  'insurancePage.shopInsured': 'Shop with Insurance',
  'insurancePage.plansTitle': 'Insurance Plans',
  'insurancePage.ctaTitle': 'Protect Your Luxury Investment',

  // Shipping Page
  'shippingPage.title': 'Global Luxury Shipping',
  'shippingPage.subtitle': 'World-class shipping for your luxury purchases.',
  'shippingPage.viewMethods': 'View Shipping Methods',
  'shippingPage.backHome': 'Back to Home',
  'shippingPage.startShopping': 'Start Shopping',
  'shippingPage.methodsTitle': 'Shipping Methods',
  'shippingPage.ctaTitle': 'Ready for Your Luxury Delivery?',

  // Cart Page
  'cartPage.title': 'Shopping Bag',
  'cartPage.subtitle': 'Review your luxury selections.',
  'cartPage.continueShopping': 'Continue Shopping',
  'cartPage.backHome': 'Back to Home',
  'cartPage.checkout': 'Proceed to Checkout',
  'cartPage.itemsTitle': 'Your Items',
  'cartPage.summaryTitle': 'Order Summary',
  'cartPage.ctaTitle': 'Complete Your Luxury Experience',
};

/**
 * Custom translation hook that works with SSR
 * Returns default translations during SSR, actual translations on client
 */
export function useTranslation(): { t: TranslationFunction; i18n: { language: string; changeLanguage: (lang: string) => void } } {
  const [translations, setTranslations] = useState<Record<string, string>>(defaultTranslations);
  const [currentLanguage, setCurrentLanguage] = useState<string>('zh-CN');
  const [i18nInstance, setI18nInstance] = useState<any>(null);

  /**
   * Load i18n on client side
   */
  useEffect(() => {
    // Dynamic import of i18n modules
    const loadI18n = async () => {
      try {
        const i18next = await import('i18next');
        const reactI18next = await import('react-i18next');
        const languageDetector = await import('i18next-browser-languagedetector');

        // Import translations
        const zhCN = await import('./locales/zh-CN.json');
        const en = await import('./locales/en.json');
        const zhTW = await import('./locales/zh-TW.json');

        const resources = {
          en: { translation: en.default },
          'zh-CN': { translation: zhCN.default },
          'zh-TW': { translation: zhTW.default }
        };

        const i18n = i18next.default;

        if (!i18n.isInitialized) {
          i18n
            .use(languageDetector.default)
            .use(reactI18next.initReactI18next)
            .init({
              resources,
              fallbackLng: 'zh-CN',
              debug: false,
              interpolation: {
                escapeValue: false
              },
              detection: {
                order: ['localStorage', 'navigator'],
                caches: ['localStorage']
              }
            });
        }

        setI18nInstance(i18n);
        setCurrentLanguage(i18n.language || 'zh-CN');

        // Update translations when language changes
        i18n.on('languageChanged', (lng: string) => {
          setCurrentLanguage(lng);
        });
      } catch (error) {
        console.error('Failed to load i18n:', error);
      }
    };

    loadI18n();
  }, []);

  /**
   * Translation function
   * - When i18next is ready: delegates to i18next.t() (full interpolation & deep key support)
   * - Fallback (SSR / before init): deep traversal of en.json with manual interpolation
   */
  const t = useCallback((key: string, options?: Record<string, string | number>): string => {
    if (i18nInstance) {
      const result = i18nInstance.t(key, options as any);
      // Double-check i18next didn't return literal key; fall back if needed
      if (result && result !== key && !result.includes('{{')) {
        return result;
      }
    }
    // Fallback: deep lookup in the bundled en.json + manual interpolation
    const deepVal = getDeepValue(enFallback, key);
    let fallback: string | undefined;
    if (typeof deepVal === 'string') {
      fallback = deepVal;
    }
    if (!fallback) {
      fallback = translations[key];
    }
    const raw = fallback ?? key;
    return interpolate(raw, options);
  }, [i18nInstance, translations]);

  /**
   * Change language function
   */
  const changeLanguage = useCallback((lang: string) => {
    if (i18nInstance && typeof window !== 'undefined') {
      i18nInstance.changeLanguage(lang);
      localStorage.setItem('i18nextLng', lang);
      setCurrentLanguage(lang);
    }
  }, [i18nInstance]);

  return {
    t,
    i18n: {
      language: currentLanguage,
      changeLanguage
    }
  };
}

/**
 * Language codes enum
 */
export enum LanguageCode {
  ZH_CN = 'zh-CN',
  EN = 'en',
  ZH_TW = 'zh-TW'
}

/**
 * Language display names
 */
export const languageNames: Record<LanguageCode, string> = {
  [LanguageCode.ZH_CN]: '简体中文',
  [LanguageCode.EN]: 'English',
  [LanguageCode.ZH_TW]: '繁體中文'
};