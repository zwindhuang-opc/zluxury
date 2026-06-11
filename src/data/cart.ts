/**
 * ZLuxury Shopping Cart System
 * 
 * This module implements the shopping cart functionality.
 * Features:
 * - Cart item management (add, remove, update)
 * - Cart state persistence
 * - Price calculations
 * - Stock validation
 * - VIP discount calculations
 * 
 * Architecture: Business Logic Layer
 * Version: 1.0.0
 * Last Updated: 2024-06-07
 */

import { Product, ProductRepository } from '@/data/products';
import { User, VipTier } from '@/data/auth';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Cart item interface
 */
export interface CartItem {
  // Product ID
  productId: string;
  
  // Product details (cached for performance)
  product: Product;
  
  // Quantity in cart
  quantity: number;
  
  // Unit price at time of adding
  unitPrice: number;
  
  // Item added timestamp
  addedAt: string;
  
  // Item notes (special requests)
  notes?: string;
}

/**
 * Shopping cart interface
 */
export interface ShoppingCart {
  // Cart ID
  cartId: string;
  
  // User ID (null for guest carts)
  userId: string | null;
  
  // Cart items
  items: CartItem[];
  
  // Cart creation timestamp
  createdAt: string;
  
  // Last update timestamp
  updatedAt: string;
  
  // Cart status (active, abandoned, completed)
  status: 'active' | 'abandoned' | 'completed';
  
  // Applied discount code
  discountCode?: string;
  
  // VIP tier for discount calculation
  vipTier?: VipTier;
}

/**
 * Cart summary interface for display
 */
export interface CartSummary {
  // Total items count
  itemCount: number;
  
  // Total unique products
  uniqueProducts: number;
  
  // Subtotal (before discounts)
  subtotal: number;
  
  // Discount amount
  discount: number;
  
  // Total after discount
  total: number;
  
  // Currency
  currency: string;
  
  // Estimated tax
  tax?: number;
  
  // Shipping cost
  shipping?: number;
}

/**
 * Cart operation result interface
 */
export interface CartResult {
  success: boolean;
  cart?: ShoppingCart;
  summary?: CartSummary;
  error?: string;
  message?: string;
}

// ============================================================================
// VIP DISCOUNT CONFIGURATION
// ============================================================================

/**
 * VIP tier discount rates
 */
const VIP_DISCOUNTS: Record<VipTier, number> = {
  silver: 0.05,   // 5% discount
  gold: 0.10,     // 10% discount
  platinum: 0.15  // 15% discount
};

/**
 * Shipping cost configuration
 */
const SHIPPING_CONFIG = {
  // Free shipping threshold
  freeShippingThreshold: 5000,
  
  // Standard shipping cost
  standardShipping: 50,
  
  // Express shipping cost
  expressShipping: 150,
  
  // VIP free shipping (always free)
  vipFreeShipping: true
};

// ============================================================================
// CART STORAGE (Mock for demonstration)
// ============================================================================

/**
 * In-memory cart storage
 * In production, use Redis or database
 */
const carts: Map<string, ShoppingCart> = new Map();

// ============================================================================
// CART SERVICE CLASS
// ============================================================================

/**
 * CartService class implementing cart business logic
 */
export class CartService {
  
  /**
   * Generate a unique cart ID
   * @returns Cart ID string
   */
  private static generateCartId(): string {
    return `CART-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
  }
  
  /**
   * Create a new cart
   * @param userId - User ID (null for guest)
   * @param vipTier - VIP tier for discount
   * @returns New shopping cart
   */
  static createCart(userId: string | null = null, vipTier?: VipTier): ShoppingCart {
    const cartId = this.generateCartId();
    
    const cart: ShoppingCart = {
      cartId,
      userId,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      vipTier
    };
    
    carts.set(cartId, cart);
    
    return cart;
  }
  
  /**
   * Get cart by ID
   * @param cartId - Cart ID
   * @returns Shopping cart or null
   */
  static getCart(cartId: string): ShoppingCart | null {
    return carts.get(cartId) || null;
  }
  
  /**
   * Get cart by user ID
   * @param userId - User ID
   * @returns Shopping cart or null
   */
  static getCartByUser(userId: string): ShoppingCart | null {
    for (const cart of Array.from(carts.values())) {
      if (cart.userId === userId && cart.status === 'active') {
        return cart;
      }
    }
    return null;
  }
  
  /**
   * Add item to cart
   * @param cartId - Cart ID
   * @param productId - Product ID
   * @param quantity - Quantity to add
   * @param notes - Optional notes
   * @returns Cart result
   */
  static addItem(
    cartId: string,
    productId: string,
    quantity: number = 1,
    notes?: string
  ): CartResult {
    // Get cart
    let cart = this.getCart(cartId);
    
    // Create cart if not exists
    if (!cart) {
      cart = this.createCart();
    }
    
    // Get product
    const product = ProductRepository.getById(productId);
    
    if (!product) {
      return {
        success: false,
        error: 'Product not found'
      };
    }
    
    // Check stock availability
    if (product.stock < quantity) {
      return {
        success: false,
        error: `Insufficient stock. Only ${product.stock} available.`
      };
    }
    
    // Check if item already in cart
    const existingItem = cart.items.find(item => item.productId === productId);
    
    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      
      // Check stock for new quantity
      if (product.stock < newQuantity) {
        return {
          success: false,
          error: `Insufficient stock. Only ${product.stock} available.`
        };
      }
      
      existingItem.quantity = newQuantity;
      existingItem.notes = notes;
    } else {
      // Add new item
      cart.items.push({
        productId,
        product,
        quantity,
        unitPrice: product.price,
        addedAt: new Date().toISOString(),
        notes
      });
    }
    
    // Update cart timestamp
    cart.updatedAt = new Date().toISOString();
    
    // Calculate summary
    const summary = this.calculateSummary(cart);
    
    return {
      success: true,
      cart,
      summary,
      message: 'Item added to cart'
    };
  }
  
  /**
   * Remove item from cart
   * @param cartId - Cart ID
   * @param productId - Product ID
   * @returns Cart result
   */
  static removeItem(cartId: string, productId: string): CartResult {
    const cart = this.getCart(cartId);
    
    if (!cart) {
      return {
        success: false,
        error: 'Cart not found'
      };
    }
    
    // Find and remove item
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
      return {
        success: false,
        error: 'Item not found in cart'
      };
    }
    
    cart.items.splice(itemIndex, 1);
    cart.updatedAt = new Date().toISOString();
    
    const summary = this.calculateSummary(cart);
    
    return {
      success: true,
      cart,
      summary,
      message: 'Item removed from cart'
    };
  }
  
  /**
   * Update item quantity
   * @param cartId - Cart ID
   * @param productId - Product ID
   * @param quantity - New quantity
   * @returns Cart result
   */
  static updateQuantity(cartId: string, productId: string, quantity: number): CartResult {
    const cart = this.getCart(cartId);
    
    if (!cart) {
      return {
        success: false,
        error: 'Cart not found'
      };
    }
    
    // Find item
    const item = cart.items.find(item => item.productId === productId);
    
    if (!item) {
      return {
        success: false,
        error: 'Item not found in cart'
      };
    }
    
    // Validate quantity
    if (quantity < 1) {
      return this.removeItem(cartId, productId);
    }
    
    // Check stock
    if (item.product.stock < quantity) {
      return {
        success: false,
        error: `Insufficient stock. Only ${item.product.stock} available.`
      };
    }
    
    // Update quantity
    item.quantity = quantity;
    cart.updatedAt = new Date().toISOString();
    
    const summary = this.calculateSummary(cart);
    
    return {
      success: true,
      cart,
      summary,
      message: 'Quantity updated'
    };
  }
  
  /**
   * Clear cart
   * @param cartId - Cart ID
   * @returns Cart result
   */
  static clearCart(cartId: string): CartResult {
    const cart = this.getCart(cartId);
    
    if (!cart) {
      return {
        success: false,
        error: 'Cart not found'
      };
    }
    
    cart.items = [];
    cart.updatedAt = new Date().toISOString();
    
    const summary = this.calculateSummary(cart);
    
    return {
      success: true,
      cart,
      summary,
      message: 'Cart cleared'
    };
  }
  
  /**
   * Calculate cart summary
   * @param cart - Shopping cart
   * @returns Cart summary
   */
  static calculateSummary(cart: ShoppingCart): CartSummary {
    // Calculate subtotal
    const subtotal = cart.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    
    // Calculate VIP discount
    let discount = 0;
    if (cart.vipTier) {
      discount = subtotal * VIP_DISCOUNTS[cart.vipTier];
    }
    
    // Calculate shipping
    let shipping = 0;
    if (cart.vipTier && SHIPPING_CONFIG.vipFreeShipping) {
      shipping = 0;
    } else if (subtotal >= SHIPPING_CONFIG.freeShippingThreshold) {
      shipping = 0;
    } else {
      shipping = SHIPPING_CONFIG.standardShipping;
    }
    
    // Calculate total
    const total = subtotal - discount + shipping;
    
    return {
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      uniqueProducts: cart.items.length,
      subtotal,
      discount,
      total,
      currency: 'USD',
      shipping
    };
  }
  
  /**
   * Apply discount code
   * @param cartId - Cart ID
   * @param code - Discount code
   * @returns Cart result
   */
  static applyDiscount(cartId: string, code: string): CartResult {
    const cart = this.getCart(cartId);
    
    if (!cart) {
      return {
        success: false,
        error: 'Cart not found'
      };
    }
    
    // Validate discount code (mock validation)
    const validCodes = ['LUXURY10', 'VIP20', 'FIRST5'];
    
    if (!validCodes.includes(code.toUpperCase())) {
      return {
        success: false,
        error: 'Invalid discount code'
      };
    }
    
    // Apply discount code
    cart.discountCode = code.toUpperCase();
    cart.updatedAt = new Date().toISOString();
    
    const summary = this.calculateSummary(cart);
    
    return {
      success: true,
      cart,
      summary,
      message: 'Discount code applied'
    };
  }
  
  /**
   * Validate cart for checkout
   * @param cartId - Cart ID
   * @returns Validation result
   */
  static validateForCheckout(cartId: string): { valid: boolean; errors: string[] } {
    const cart = this.getCart(cartId);
    const errors: string[] = [];
    
    if (!cart) {
      return { valid: false, errors: ['Cart not found'] };
    }
    
    if (cart.items.length === 0) {
      errors.push('Cart is empty');
    }
    
    // Check stock for all items
    for (const item of cart.items) {
      const product = ProductRepository.getById(item.productId);
      if (!product) {
        errors.push(`Product ${item.productId} no longer available`);
      } else if (product.stock < item.quantity) {
        errors.push(`Insufficient stock for ${product.name}`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Get all active carts count
   * @returns Number of active carts
   */
  static getActiveCartsCount(): number {
    return Array.from(carts.values()).filter(c => c.status === 'active').length;
  }
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
  CartService,
  VIP_DISCOUNTS,
  SHIPPING_CONFIG
};