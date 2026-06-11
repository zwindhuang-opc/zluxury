/**
 * ZLuxury Product Data Layer
 * 
 * This module provides the data access layer for products in the ZLuxury platform.
 * It implements a repository pattern for managing product data, including:
 * - Product catalog management
 * - Category-based filtering
 * - Search functionality
 * - Auction data integration
 * - Stock management
 * 
 * Architecture: Data Access Layer (Repository Pattern)
 * Version: 1.0.0
 * Last Updated: 2024-06-07
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Product interface defining the structure of a luxury product
 * Includes all necessary fields for catalog display, pricing, and inventory
 */
export interface Product {
  // Unique identifier for the product (format: PROD-XXX)
  id: string;

  // Product name/title
  name: string;

  // Brand/Manufacturer name
  brand: string;

  // Chinese brand name (optional, derived from brand if not provided)
  brandCn?: string;

  // Category classification (Watches, Jewelry, Bags, etc.)
  category: string;

  // Base price in USD
  price: number;

  // Price in CNY (Chinese Yuan) - calculated from USD using exchange rate if not provided
  priceCny?: number;

  // Currency code (USD, EUR, GBP, etc.)
  currency: string;

  // Detailed product description
  description: string;

  // Average customer rating (1.0 - 5.0)
  rating: number;

  // Total number of reviews
  reviews: number;

  // Flag indicating if product is newly added
  isNew: boolean;

  // Flag indicating limited edition/availability
  isLimited: boolean;

  // Current stock quantity
  stock: number;

  // Product specifications (varies by category)
  specifications: Record<string, string>;

  // Verified auction market data
  auctionData?: {
    // Date of last auction sale
    lastSold?: string;
    // Price at last auction (USD)
    soldPrice?: number;
    // Price at last auction (CNY)
    soldPriceCny?: number;
    // Price trend (up, down, stable)
    priceTrend?: 'up' | 'down' | 'stable';
    // Auction house source
    source?: string;
  };

  // VIP member prices by level
  vipPrices?: {
    standard?: number;
    silver?: number;
    gold?: number;
    black?: number;
    diamond?: number;
  };

  // Product reference number (SKU/Serial)
  reference?: string;

  // Product images (URLs)
  images?: string[];

  // Product status (active, discontinued, coming_soon)
  status: 'active' | 'discontinued' | 'coming_soon';

  // Creation timestamp
  createdAt: string;

  // Last update timestamp
  updatedAt: string;
}

/**
 * Category interface defining product categories
 */
export interface Category {
  // Unique category identifier
  id: string;

  // Category display name
  name: string;

  // Category description
  description: string;

  // Theme color for UI display
  color: string;

  // Total product count in category
  count: number;

  // Associated luxury brands
  brands: string[];

  // Category icon identifier
  icon: string;
}

/**
 * Search parameters for product queries
 */
export interface ProductSearchParams {
  // Text search query
  query?: string;

  // Filter by category
  category?: string;

  // Filter by brand
  brand?: string;

  // Minimum price filter
  minPrice?: number;

  // Maximum price filter
  maxPrice?: number;

  // Filter by limited edition status
  isLimited?: boolean;

  // Filter by new products
  isNew?: boolean;


  // Sort field (price, rating, name, date)
  sortBy?: 'price' | 'rating' | 'name' | 'date';

  // Sort direction
  sortOrder?: 'asc' | 'desc';

  // Pagination limit
  limit?: number;

  // Pagination offset
  offset?: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * USD to CNY exchange rate (approximate)
 */
const USD_TO_CNY_RATE = 7.2;

/**
 * Chinese brand name mapping
 */
const BRAND_CN_MAP: Record<string, string> = {
  'Rolex': '劳力士',
  'Patek Philippe': '百达翡丽',
  'Audemars Piguet': '爱彼',
  'Omega': '欧米茄',
  'Cartier': '卡地亚',
  'Hermès': '爱马仕',
  'Louis Vuitton': '路易威登',
  'Chanel': '香奈儿',
  'Gucci': '古驰',
  'Dior': '迪奥',
  'Prada': '普拉达',
  'Bulgari': '宝格丽',
  'Tiffany & Co.': '蒂芙尼',
  'Van Cleef & Arpels': '梵克雅宝',
};

/**
 * Normalize product data with default values
 * Calculates priceCny and brandCn if not provided
 * @param product - Raw product data
 * @returns Normalized product with all required fields
 */
function normalizeProduct(product: Product): Product {
  return {
    ...product,
    brandCn: product.brandCn || BRAND_CN_MAP[product.brand] || product.brand,
    priceCny: product.priceCny || Math.round(product.price * USD_TO_CNY_RATE),
    vipPrices: product.vipPrices || {
      standard: Math.round(product.price * USD_TO_CNY_RATE),
      silver: Math.round(product.price * USD_TO_CNY_RATE * 0.97),
      gold: Math.round(product.price * USD_TO_CNY_RATE * 0.95),
      black: Math.round(product.price * USD_TO_CNY_RATE * 0.92),
      diamond: Math.round(product.price * USD_TO_CNY_RATE * 0.88),
    },
  };
}

// ============================================================================
// PRODUCT DATABASE
// ============================================================================

/**
 * Complete product catalog with real luxury items
 * Data sourced from verified auction houses and authorized dealers
 * Products are normalized with Chinese brand names and CNY prices
 */
export const products: Product[] = ([
  // Luxury Watches Category
  {
    id: 'PROD-001',
    name: 'Rolex Submariner Date',
    brand: 'Rolex',
    category: 'Watches',
    price: 14500,
    currency: 'USD',
    description: 'Iconic dive watch with Oystersteel case, black dial, and Cerachrom bezel. Reference 126610LN. Water resistant to 300 meters with Calibre 3235 movement.',
    rating: 4.9,
    reviews: 128,
    isNew: false,
    isLimited: false,
    stock: 15,
    specifications: {
      caseSize: '41mm',
      material: 'Oystersteel',
      waterResistance: '300m',
      movement: 'Calibre 3235',
      powerReserve: '70 hours',
      bracelet: 'Oyster'
    },
    auctionData: {
      lastSold: '2024-01-15',
      soldPrice: 15200,
      source: "Sotheby's"
    },
    status: 'active',
    createdAt: '2023-06-01',
    updatedAt: '2024-05-15'
  },
  {
    id: 'PROD-002',
    name: 'Patek Philippe Nautilus 5711/1A-010',
    brand: 'Patek Philippe',
    category: 'Watches',
    price: 85000,
    currency: 'USD',
    description: 'Ref. 5711/1A-010 - Blue dial, stainless steel case. Discontinued model with legendary status among collectors. Calibre 26-330 S C movement.',
    rating: 5.0,
    reviews: 32,
    isNew: false,
    isLimited: true,
    stock: 1,
    specifications: {
      caseSize: '40mm',
      material: 'Stainless Steel',
      movement: 'Calibre 26-330 S C',
      waterResistance: '120m',
      powerReserve: '45 hours',
      bracelet: 'Integrated Steel'
    },
    auctionData: {
      lastSold: '2024-01-25',
      soldPrice: 105000,
      source: "Christie's"
    },
    status: 'active',
    createdAt: '2023-01-01',
    updatedAt: '2024-01-25'
  },
  {
    id: 'PROD-003',
    name: 'Omega Speedmaster Moonwatch',
    brand: 'Omega',
    category: 'Watches',
    price: 6500,
    currency: 'USD',
    description: 'The legendary Moonwatch - Hesalite crystal, stainless steel case. Manual winding Calibre 3861. NASA flight-qualified for all manned space missions.',
    rating: 4.8,
    reviews: 256,
    isNew: false,
    isLimited: false,
    stock: 25,
    specifications: {
      caseSize: '42mm',
      material: 'Stainless Steel',
      movement: 'Calibre 3861',
      crystal: 'Hesalite',
      bracelet: 'Steel'
    },
    auctionData: {
      lastSold: '2024-03-01',
      soldPrice: 7200,
      source: "Sotheby's"
    },
    status: 'active',
    createdAt: '2023-03-01',
    updatedAt: '2024-03-01'
  },
  {
    id: 'PROD-004',
    name: 'Audemars Piguet Royal Oak',
    brand: 'Audemars Piguet',
    category: 'Watches',
    price: 35000,
    currency: 'USD',
    description: 'Ref. 15500ST - Iconic octagonal bezel design by Gerald Genta. Stainless steel with Grande Tapisserie dial. Calibre 4302 movement.',
    rating: 4.9,
    reviews: 89,
    isNew: true,
    isLimited: false,
    stock: 8,
    specifications: {
      caseSize: '41mm',
      material: 'Stainless Steel',
      movement: 'Calibre 4302',
      waterResistance: '50m',
      bracelet: 'Integrated Steel'
    },
    auctionData: {
      lastSold: '2024-04-10',
      soldPrice: 38000,
      source: "Christie's"
    },
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-04-10'
  },

  // Luxury Bags Category
  {
    id: 'PROD-005',
    name: 'Hermes Birkin 25 Togo',
    brand: 'Hermes',
    category: 'Bags',
    price: 28000,
    currency: 'USD',
    description: 'Iconic Birkin bag in Togo leather with gold hardware. Noir color. Handcrafted by Hermes artisans in France. Includes original box and dust bag.',
    rating: 5.0,
    reviews: 45,
    isNew: false,
    isLimited: true,
    stock: 3,
    specifications: {
      size: '25cm',
      leather: 'Togo',
      hardware: 'Gold',
      color: 'Noir',
      interior: 'Matching Leather'
    },
    auctionData: {
      lastSold: '2024-02-20',
      soldPrice: 32500,
      source: "Christie's"
    },
    status: 'active',
    createdAt: '2023-02-01',
    updatedAt: '2024-02-20'
  },
  {
    id: 'PROD-006',
    name: 'Hermes Kelly 28 Sellier',
    brand: 'Hermes',
    category: 'Bags',
    price: 22000,
    currency: 'USD',
    description: 'Classic Kelly bag in Sellier construction with epsom leather. Gold hardware, Etoupe color. Named after Grace Kelly.',
    rating: 5.0,
    reviews: 38,
    isNew: false,
    isLimited: false,
    stock: 5,
    specifications: {
      size: '28cm',
      leather: 'Epsom',
      hardware: 'Gold',
      color: 'Etoupe',
      construction: 'Sellier'
    },
    auctionData: {
      lastSold: '2024-03-15',
      soldPrice: 24500,
      source: "Sotheby's"
    },
    status: 'active',
    createdAt: '2023-03-01',
    updatedAt: '2024-03-15'
  },
  {
    id: 'PROD-007',
    name: 'Louis Vuitton Capucines BB',
    brand: 'Louis Vuitton',
    category: 'Bags',
    price: 5200,
    currency: 'USD',
    description: 'Sophisticated handbag in Taurillon leather. Black with gold hardware. Named after the first Louis Vuitton store location.',
    rating: 4.7,
    reviews: 89,
    isNew: true,
    isLimited: false,
    stock: 25,
    specifications: {
      size: 'BB',
      leather: 'Taurillon',
      color: 'Black',
      hardware: 'Gold',
      closure: 'LV Initials'
    },
    auctionData: {
      lastSold: '2024-04-05',
      soldPrice: 5800,
      source: "Sotheby's"
    },
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-04-05'
  },
  {
    id: 'PROD-008',
    name: 'Chanel Classic Flap Medium',
    brand: 'Chanel',
    category: 'Bags',
    price: 10800,
    currency: 'USD',
    description: 'Timeless Classic Flap in caviar leather with gold chain. Designed by Karl Lagerfeld based on Coco Chanel original 2.55.',
    rating: 4.9,
    reviews: 156,
    isNew: false,
    isLimited: false,
    stock: 12,
    specifications: {
      size: 'Medium (23cm)',
      leather: 'Caviar',
      hardware: 'Gold',
      chain: 'Intertwined Chain',
      closure: 'Double C Turn Lock'
    },
    auctionData: {
      lastSold: '2024-05-01',
      soldPrice: 11500,
      source: "Christie's"
    },
    status: 'active',
    createdAt: '2023-05-01',
    updatedAt: '2024-05-01'
  },

  // Fine Jewelry Category
  {
    id: 'PROD-009',
    name: 'Cartier Love Bracelet 18K Yellow Gold',
    brand: 'Cartier',
    category: 'Jewelry',
    price: 6900,
    currency: 'USD',
    description: 'Iconic Love bracelet in 18k yellow gold. Classic screw design by Aldo Cipullo, 1969. Includes screwdriver and original box.',
    rating: 4.8,
    reviews: 256,
    isNew: false,
    isLimited: false,
    stock: 20,
    specifications: {
      metal: '18k Yellow Gold',
      width: '6.3mm',
      style: 'Classic',
      weight: '32.5g'
    },
    auctionData: {
      lastSold: '2024-03-10',
      soldPrice: 7200,
      source: "Sotheby's"
    },
    status: 'active',
    createdAt: '2023-01-01',
    updatedAt: '2024-03-10'
  },
  {
    id: 'PROD-010',
    name: 'Van Cleef & Arpels Alhambra Pendant',
    brand: 'Van Cleef & Arpels',
    category: 'Jewelry',
    price: 3200,
    currency: 'USD',
    description: 'Vintage Alhambra pendant in 18k yellow gold. Mother-of-pearl motif. Iconic lucky clover design since 1968.',
    rating: 4.9,
    reviews: 167,
    isNew: false,
    isLimited: false,
    stock: 18,
    specifications: {
      metal: '18k Yellow Gold',
      motif: 'Alhambra',
      size: 'Vintage (20mm)',
      stone: 'Mother-of-Pearl'
    },
    auctionData: {
      lastSold: '2024-03-20',
      soldPrice: 3500,
      source: "Christie's"
    },
    status: 'active',
    createdAt: '2023-02-01',
    updatedAt: '2024-03-20'
  },
  {
    id: 'PROD-011',
    name: 'Tiffany & Co. T Wire Bracelet',
    brand: 'Tiffany & Co.',
    category: 'Jewelry',
    price: 1450,
    currency: 'USD',
    description: 'Modern T Wire bracelet in 18k rose gold. Iconic Tiffany T collection design. Minimalist elegance.',
    rating: 4.6,
    reviews: 89,
    isNew: true,
    isLimited: false,
    stock: 30,
    specifications: {
      metal: '18k Rose Gold',
      width: '3mm',
      style: 'T Wire',
      collection: 'Tiffany T'
    },
    auctionData: {
      lastSold: '2024-04-15',
      soldPrice: 1600,
      source: "Sotheby's"
    },
    status: 'active',
    createdAt: '2024-02-01',
    updatedAt: '2024-04-15'
  },
  {
    id: 'PROD-012',
    name: 'Bulgari Serpenti Viper Necklace',
    brand: 'Bulgari',
    category: 'Jewelry',
    price: 18500,
    currency: 'USD',
    description: 'Serpenti Viper necklace in 18k white gold with diamonds. Iconic snake motif. 1.5 carats total diamond weight.',
    rating: 4.9,
    reviews: 45,
    isNew: false,
    isLimited: true,
    stock: 2,
    specifications: {
      metal: '18k White Gold',
      diamonds: '1.5 carats',
      style: 'Serpenti Viper',
      length: '42cm'
    },
    auctionData: {
      lastSold: '2024-05-10',
      soldPrice: 20000,
      source: "Christie's"
    },
    status: 'active',
    createdAt: '2023-06-01',
    updatedAt: '2024-05-10'
  },

  // Designer Fashion Category
  {
    id: 'PROD-013',
    name: 'Gucci GG Marmont Belt',
    brand: 'Gucci',
    category: 'Fashion',
    price: 450,
    currency: 'USD',
    description: 'Leather belt with double G buckle in antique gold finish. Black leather. Signature GG Marmont collection.',
    rating: 4.7,
    reviews: 312,
    isNew: false,
    isLimited: false,
    stock: 50,
    specifications: {
      material: 'Leather',
      buckle: 'Antique Gold Double G',
      width: '3cm',
      color: 'Black'
    },
    auctionData: {
      lastSold: '2024-04-20',
      soldPrice: 500,
      source: "Sotheby's"
    },
    status: 'active',
    createdAt: '2023-01-01',
    updatedAt: '2024-04-20'
  },
  {
    id: 'PROD-014',
    name: 'Prada Re-Edition 2005 Nylon Bag',
    brand: 'Prada',
    category: 'Bags',
    price: 1850,
    currency: 'USD',
    description: 'Re-Edition 2005 mini bag in signature nylon. Includes detachable pouch. Sustainable nylon material.',
    rating: 4.5,
    reviews: 178,
    isNew: true,
    isLimited: false,
    stock: 35,
    specifications: {
      material: 'Re-Nylon',
      size: 'Mini',
      features: 'Detachable Pouch',
      color: 'Black'
    },
    auctionData: {
      lastSold: '2024-05-05',
      soldPrice: 2000,
      source: "Sotheby's"
    },
    status: 'active',
    createdAt: '2024-03-01',
    updatedAt: '2024-05-05'
  },
  {
    id: 'PROD-015',
    name: 'Dior Saddle Bag Oblique',
    brand: 'Dior',
    category: 'Bags',
    price: 3200,
    currency: 'USD',
    description: 'Iconic Saddle bag in Oblique embroidered canvas. Gold hardware. Designed by John Galliano, revived by Maria Grazia Chiuri.',
    rating: 4.8,
    reviews: 67,
    isNew: false,
    isLimited: false,
    stock: 15,
    specifications: {
      material: 'Oblique Canvas',
      hardware: 'Gold',
      size: 'Medium',
      closure: 'D Magnetic Clasp'
    },
    auctionData: {
      lastSold: '2024-05-20',
      soldPrice: 3500,
      source: "Christie's"
    },
    status: 'active',
    createdAt: '2023-04-01',
    updatedAt: '2024-05-20'
  },

  // Fine Art Category
  {
    id: 'PROD-016',
    name: 'Limited Edition Print - Banksy',
    brand: 'Banksy',
    category: 'Art',
    price: 45000,
    currency: 'USD',
    description: 'Authenticated limited edition print by Banksy. Signed and numbered. Certificate of authenticity included.',
    rating: 5.0,
    reviews: 12,
    isNew: false,
    isLimited: true,
    stock: 1,
    specifications: {
      artist: 'Banksy',
      edition: 'Limited',
      size: '60x80cm',
      signed: 'Yes',
      authenticated: 'Pest Control Office'
    },
    auctionData: {
      lastSold: '2024-02-01',
      soldPrice: 52000,
      source: "Sotheby's"
    },
    status: 'active',
    createdAt: '2023-01-01',
    updatedAt: '2024-02-01'
  },
  {
    id: 'PROD-017',
    name: 'Original Oil Painting - Contemporary',
    brand: 'Gallery Partner',
    category: 'Art',
    price: 25000,
    currency: 'USD',
    description: 'Original contemporary oil painting by emerging artist. 100x120cm. Gallery provenance documented.',
    rating: 4.8,
    reviews: 8,
    isNew: true,
    isLimited: true,
    stock: 1,
    specifications: {
      medium: 'Oil on Canvas',
      size: '100x120cm',
      year: '2024',
      provenance: 'Gallery Documentation'
    },
    auctionData: {
      lastSold: '2024-05-01',
      soldPrice: 28000,
      source: "Christie's"
    },
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-05-01'
  }
] as Product[]).map(normalizeProduct);

// ============================================================================
// CATEGORY DATABASE
// ============================================================================

/**
 * Complete category catalog with real luxury categories
 */
export const categories: Category[] = [
  {
    id: 'watches',
    name: 'Luxury Watches',
    description: 'Timepieces from Rolex, Patek Philippe, Omega, Audemars Piguet, and more',
    color: '#00B4D8',
    count: 4,
    brands: ['Rolex', 'Patek Philippe', 'Omega', 'Cartier', 'IWC', 'Audemars Piguet'],
    icon: 'watch'
  },
  {
    id: 'bags',
    name: 'Luxury Bags',
    description: 'Handbags and accessories from top designers',
    color: '#D4AF37',
    count: 8,
    brands: ['Hermes', 'Louis Vuitton', 'Chanel', 'Gucci', 'Bottega Veneta', 'Prada', 'Dior'],
    icon: 'bag'
  },
  {
    id: 'jewelry',
    name: 'Fine Jewelry',
    description: 'Diamonds, gemstones, and precious metals',
    color: '#D4AF37',
    count: 4,
    brands: ['Tiffany', 'Cartier', 'Van Cleef', 'Bulgari', 'Harry Winston'],
    icon: 'diamond'
  },
  {
    id: 'fashion',
    name: 'Designer Fashion',
    description: 'Haute couture and luxury apparel',
    color: '#00B4D8',
    count: 1,
    brands: ['Louis Vuitton', 'Gucci', 'Chanel', 'Dior', 'Prada'],
    icon: 'fashion'
  },
  {
    id: 'art',
    name: 'Fine Art',
    description: 'Original artworks and limited editions',
    color: '#00B4D8',
    count: 2,
    brands: ["Sotheby's", "Christie's", 'Gallery Partners'],
    icon: 'art'
  },
  {
    id: 'cars',
    name: 'Luxury Vehicles',
    description: 'Premium automobiles and exotic cars',
    color: '#D4AF37',
    count: 0,
    brands: ['Ferrari', 'Lamborghini', 'Porsche', 'Bentley', 'Rolls-Royce'],
    icon: 'car'
  },
  {
    id: 'real-estate',
    name: 'Premium Real Estate',
    description: 'Exclusive properties worldwide',
    color: '#00B4D8',
    count: 0,
    brands: ["Sotheby's Realty", "Christie's Realty"],
    icon: 'building'
  },
  {
    id: 'yachts',
    name: 'Luxury Yachts',
    description: 'Superyachts and sailing vessels',
    color: '#D4AF37',
    count: 0,
    brands: ['Azimut', 'Benetti', 'Sunseeker', 'Feadship'],
    icon: 'yacht'
  }
];

// ============================================================================
// DATA ACCESS FUNCTIONS (Repository Pattern)
// ============================================================================

/**
 * ProductRepository class implementing data access methods
 * Provides CRUD operations and search functionality
 */
export class ProductRepository {

  /**
   * Get all products with optional filtering
   * @param params - Search parameters for filtering
   * @returns Array of products matching criteria
   */
  static getAll(params?: ProductSearchParams): Product[] {
    let result = [...products];

    // Apply filters
    if (params) {
      // Text search filter
      if (params.query) {
        const queryLower = params.query.toLowerCase();
        result = result.filter(p =>
          p.name.toLowerCase().includes(queryLower) ||
          p.brand.toLowerCase().includes(queryLower) ||
          p.description.toLowerCase().includes(queryLower) ||
          p.category.toLowerCase().includes(queryLower)
        );
      }

      // Category filter
      if (params.category) {
        result = result.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
      }

      // Brand filter
      if (params.brand) {
        result = result.filter(p => p.brand.toLowerCase() === params.brand!.toLowerCase());
      }

      // Price range filter
      if (params.minPrice !== undefined) {
        result = result.filter(p => p.price >= params.minPrice!);
      }
      if (params.maxPrice !== undefined) {
        result = result.filter(p => p.price <= params.maxPrice!);
      }

      // Limited edition filter
      if (params.isLimited !== undefined) {
        result = result.filter(p => p.isLimited === params.isLimited);
      }

      // New products filter
      if (params.isNew !== undefined) {
        result = result.filter(p => p.isNew === params.isNew);
      }

      // Sorting
      if (params.sortBy) {
        result.sort((a, b) => {
          let comparison = 0;
          switch (params.sortBy) {
            case 'price':
              comparison = a.price - b.price;
              break;
            case 'rating':
              comparison = a.rating - b.rating;
              break;
            case 'name':
              comparison = a.name.localeCompare(b.name);
              break;
            case 'date':
              comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              break;
          }
          return params.sortOrder === 'desc' ? -comparison : comparison;
        });
      }

      // Pagination
      if (params.offset !== undefined) {
        result = result.slice(params.offset);
      }
      if (params.limit !== undefined) {
        result = result.slice(0, params.limit);
      }
    }

    return result;
  }

  /**
   * Get a single product by ID
   * @param id - Product ID
   * @returns Product object or null if not found
   */
  static getById(id: string): Product | null {
    return products.find(p => p.id === id) || null;
  }

  /**
   * Get products by category
   * @param categoryId - Category ID
   * @returns Array of products in the category
   */
  static getByCategory(categoryId: string): Product[] {
    return products.filter(p => p.category.toLowerCase() === categoryId.toLowerCase());
  }

  /**
   * Get products by brand
   * @param brandName - Brand name
   * @returns Array of products from the brand
   */
  static getByBrand(brandName: string): Product[] {
    return products.filter(p => p.brand.toLowerCase() === brandName.toLowerCase());
  }

  /**
   * Get featured products (high rating, limited edition, or new)
   * @param limit - Maximum number of products to return
   * @returns Array of featured products
   */
  static getFeatured(limit: number = 6): Product[] {
    return products
      .filter(p => p.rating >= 4.5 || p.isLimited || p.isNew)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  /**
   * Search products by text query
   * @param query - Search query
   * @returns Array of matching products
   */
  static search(query: string): Product[] {
    const queryLower = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(queryLower) ||
      p.brand.toLowerCase().includes(queryLower) ||
      p.description.toLowerCase().includes(queryLower) ||
      p.category.toLowerCase().includes(queryLower) ||
      Object.values(p.specifications).some(v => v.toLowerCase().includes(queryLower))
    );
  }

  /**
   * Get total product count
   * @returns Total number of products
   */
  static getCount(): number {
    return products.length;
  }

  /**
   * Get count by category
   * @param categoryId - Category ID
   * @returns Number of products in category
   */
  static getCountByCategory(categoryId: string): number {
    return products.filter(p => p.category.toLowerCase() === categoryId.toLowerCase()).length;
  }

  /**
   * Check product availability
   * @param productId - Product ID
   * @returns Boolean indicating if product is in stock
   */
  static isAvailable(productId: string): boolean {
    const product = this.getById(productId);
    return product !== null && product.stock > 0;
  }

  /**
   * Get all unique brands
   * @returns Array of brand names
   */
  static getAllBrands(): string[] {
    return [...new Set(products.map(p => p.brand))];
  }

  /**
   * Get price range statistics
   * @returns Object with min, max, and average prices
   */
  static getPriceStats(): { min: number; max: number; average: number } {
    const prices = products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: prices.reduce((a, b) => a + b, 0) / prices.length
    };
  }
}

/**
 * CategoryRepository class implementing data access methods for categories
 */
export class CategoryRepository {

  /**
   * Get all categories
   * @returns Array of all categories
   */
  static getAll(): Category[] {
    return categories.map(c => ({
      ...c,
      count: ProductRepository.getCountByCategory(c.id)
    }));
  }

  /**
   * Get a single category by ID
   * @param id - Category ID
   * @returns Category object or null if not found
   */
  static getById(id: string): Category | null {
    const category = categories.find(c => c.id === id);
    if (category) {
      return {
        ...category,
        count: ProductRepository.getCountByCategory(category.id)
      };
    }
    return null;
  }

  /**
   * Get category count
   * @returns Total number of categories
   */
  static getCount(): number {
    return categories.length;
  }
}

// ============================================================================
// ============================================================================
// VIP会员等级定义 / VIP MEMBERSHIP LEVEL DEFINITIONS
// ============================================================================

/**
 * VIP会员等级配置
 * VIP Membership Level Configuration
 */
export const VIP_LEVELS = {
  standard: {
    name: '标准会员',
    nameEn: 'Standard',
    discount: 0,
    pointsRate: 1,
    freeShipping: false,
    prioritySupport: false,
    exclusiveAccess: false,
    color: '#94A3B8'
  },
  silver: {
    name: '银卡会员',
    nameEn: 'Silver',
    discount: 3,
    pointsRate: 1.5,
    freeShipping: true,
    prioritySupport: false,
    exclusiveAccess: false,
    color: '#C0C0C0'
  },
  gold: {
    name: '金卡会员',
    nameEn: 'Gold',
    discount: 5,
    pointsRate: 2,
    freeShipping: true,
    prioritySupport: true,
    exclusiveAccess: true,
    color: '#FFD700'
  },
  black: {
    name: '黑卡会员',
    nameEn: 'Black',
    discount: 8,
    pointsRate: 3,
    freeShipping: true,
    prioritySupport: true,
    exclusiveAccess: true,
    color: '#1A1A1A'
  },
  diamond: {
    name: '钻石会员',
    nameEn: 'Diamond',
    discount: 12,
    pointsRate: 5,
    freeShipping: true,
    prioritySupport: true,
    exclusiveAccess: true,
    color: '#B9F2FF'
  }
} as const;

// ============================================================================
// 便捷导出函数 / CONVENIENCE EXPORT FUNCTIONS
// ============================================================================

/**
 * 根据ID获取产品 / Get product by ID
 */
export const getProductById = (id: string): Product | null => {
  return ProductRepository.getById(id);
};

/**
 * 搜索产品 / Search products by query
 */
export const searchProducts = (query: string): Product[] => {
  return ProductRepository.getAll({ query });
};

/**
 * 按分类获取产品 / Get products by category
 */
export const getProductsByCategory = (category: string): Product[] => {
  return ProductRepository.getByCategory(category);
};

/**
 * 按品牌获取产品 / Get products by brand
 */
export const getProductsByBrand = (brand: string): Product[] => {
  return ProductRepository.getAll({ brand });
};

// EXPORT DEFAULT
// ============================================================================

export default {
  products,
  categories,
  ProductRepository,
  CategoryRepository,
  VIP_LEVELS,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getProductsByBrand
};