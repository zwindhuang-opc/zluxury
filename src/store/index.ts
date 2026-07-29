/**
 * ZLuxury Store - Zustand State Management
 * 
 * Centralized application state management using Zustand.
 * Manages:
 * - Shopping cart functionality
 * - User authentication state
 * - VIP membership status
 * - Wishlist management
 * - UI preferences
 * 
 * Architecture: State Management Layer
 * Version: 1.0.0
 * Last Updated: 2024-06-11
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Logger } from '@/utils/logger'
import { VIP_TIERS } from '@/config/constants'

// ============================================================================
// TYPE DEFINITIONS / 类型定义
// ============================================================================

/**
 * Cart item interface representing a product in shopping cart
 */
export interface CartItem {
  /** Unique identifier / 唯一标识符 */
  id: string;
  
  /** Product ID / 产品ID */
  productId: string;
  
  /** Product name / 产品名称 */
  name: string;
  
  /** Brand name / 品牌名称 */
  brand: string;
  
  /** Unit price in USD / 美元单价 */
  price: number;
  
  /** Unit price in CNY / 人民币单价 */
  priceCny?: number;
  
  /** Quantity of this item / 此项目数量 */
  quantity: number;
  
  /** Product image URL / 产品图片URL */
  image?: string;
  
  /** Category of product / 产品类别 */
  category: string;
  
  /** Timestamp when added to cart / 添加到购物车的时间戳 */
  addedAt: string;
}

/**
 * Wishlist item interface for saved products
 */
export interface WishlistItem {
  /** Product ID / 产品ID */
  productId: string;
  
  /** Product name / 产品名称 */
  name: string;
  
  /** Brand name / 品牌名称 */
  brand: string;
  
  /** Price / 价格 */
  price: number;
  
  /** Image URL / 图片URL */
  image?: string;
  
  /** Date added to wishlist / 添加到愿望清单的日期 */
  dateAdded: string;
}

/**
 * User interface for authentication state
 */
export interface User {
  /** Unique user ID / 用户唯一ID */
  id: string;
  
  /** Email address / 电子邮件地址 */
  email: string;
  
  /** Display name / 显示名称 */
  name: string;
  
  /** Avatar URL / 头像URL */
  avatar?: string;
  
  /** Phone number / 电话号码 */
  phone?: string;
  
  /** VIP tier level / VIP等级级别 */
  vipTier: keyof typeof VIP_TIERS;
  
  /** Total spending amount / 总消费金额 */
  totalSpent: number;
  
  /** Account creation date / 账户创建日期 */
  createdAt: string;
  
  /** Last login timestamp / 最后登录时间戳 */
  lastLogin: string;
}

/**
 * Notification interface for toast messages
 */
export interface Notification {
  /** Unique notification ID / 通知唯一ID */
  id: string;
  
  /** Notification type / 通知类型 */
  type: 'success' | 'error' | 'warning' | 'info';
  
  /** Notification message / 通知消息 */
  message: string;
  
  /** Duration in milliseconds (0 = persistent) / 持续时间（毫秒，0=持久） */
  duration?: number;
  
  /** Creation timestamp / 创建时间戳 */
  createdAt: string;
}

// ============================================================================
// STORE INTERFACE / 存储接口
// ============================================================================

/**
 * Main store interface defining all state and actions
 */
interface ZLuxuryStore {
  // ========================================
  // Cart State / 购物车状态
  // ========================================
  
  /** Array of items currently in cart / 当前购物车中的商品数组 */
  cartItems: CartItem[];
  
  /**
   * Add item to shopping cart
   * @param item - Cart item to add
   * @returns void
   */
  addToCart: (item: Omit<CartItem, 'id' | 'addedAt'>) => void;
  
  /**
   * Remove item from cart by ID
   * @param itemId - Cart item ID to remove
   * @returns void
   */
  removeFromCart: (itemId: string) => void;
  
  /**
   * Update item quantity in cart
   * @param itemId - Cart item ID to update
   * @param quantity - New quantity value
   * @returns void
   */
  updateCartQuantity: (itemId: string, quantity: number) => void;
  
  /**
   * Clear entire shopping cart
   * @returns void
   */
  clearCart: () => void;
  
  /** Calculate total items count in cart / 计算购物车中商品总数 */
  getCartItemCount: () => number;
  
  /** Calculate total cart value / 计算购物车总价值 */
  getCartTotal: () => { usd: number; cny: number };
  
  // ========================================
  // Wishlist State / 愿望清单状态
  // ========================================
  
  /** Array of wishlist items / 愿望清单商品数组 */
  wishlistItems: WishlistItem[];
  
  /**
   * Add item to wishlist
   * @param item - Item to add to wishlist
   * @returns void
   */
  addToWishlist: (item: Omit<WishlistItem, 'dateAdded'>) => void;
  
  /**
   * Remove item from wishlist by product ID
   * @param productId - Product ID to remove
   * @returns void
   */
  removeFromWishlist: (productId: string) => void;
  
  /** Check if item is in wishlist / 检查商品是否在愿望清单中 */
  isInWishlist: (productId: string) => boolean;
  
  // ========================================
  // User State / 用户状态
  // ========================================
  
  /** Current authenticated user or null / 当前认证用户或null */
  user: User | null;
  
  /** Authentication loading state / 认证加载状态 */
  isLoadingAuth: boolean;
  
  /**
   * Log in user with credentials
   * @param email - User email
   * @param password - User password
   * @returns Promise resolving to success boolean
   */
  login: (email: string, password: string) => Promise<boolean>;
  
  /**
   * Register new user account
   * @param userData - User registration data
   * @returns Promise resolving to success boolean
   */
  register: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin' | 'vipTier' | 'totalSpent'> & { password: string }) => Promise<boolean>;
  
  /**
   * Log out current user
   * @returns void
   */
  logout: () => void;
  
  /**
   * Update user profile information
   * @param updates - Fields to update
   * @returns void
   */
  updateProfile: (updates: Partial<User>) => void;
  
  // ========================================
  // VIP State / VIP状态
  // ========================================
  
  /** Current VIP benefits based on tier / 基于等级的当前VIP权益 */
  getCurrentVipBenefits: () => typeof VIP_TIERS[keyof typeof VIP_TIERS];
  
  /** Check if user can access exclusive content / 检查用户是否可以访问独家内容 */
  hasVipAccess: (requiredTier: keyof typeof VIP_TIERS) => boolean;
  
  // ========================================
  // Notification State / 通知状态
  // ========================================
  
  /** Array of active notifications / 活动通知数组 */
  notifications: Notification[];
  
  /**
   * Show a new notification toast
   * @param type - Notification type
   * @param message - Notification message
   * @param duration - Auto-dismiss time in ms (default 3000)
   * @returns void
   */
  showNotification: (type: Notification['type'], message: string, duration?: number) => void;
  
  /**
   * Dismiss notification by ID
   * @param notificationId - Notification to dismiss
   * @returns void
   */
  dismissNotification: (notificationId: string) => void;
  
  /** Clear all notifications / 清除所有通知 */
  clearNotifications: () => void;
  
  // ========================================
  // UI Preferences / UI偏好设置
  // ========================================
  
  /** Current language code / 当前语言代码 */
  language: string;
  
  /** Set active language / 设置活动语言 */
  setLanguage: (lang: string) => void;
  
  /** Sidebar open state / 侧边栏打开状态 */
  sidebarOpen: boolean;
  
  /** Toggle sidebar visibility / 切换侧边栏可见性 */
  toggleSidebar: () => void;
  
  /** Search query state / 搜索查询状态 */
  searchQuery: string;
  
  /** Update search query / 更新搜索查询 */
  setSearchQuery: (query: string) => void;
}

// ============================================================================
// STORE IMPLEMENTATION / 存储实现
// ============================================================================

const logger = Logger.getLogger('Store')

/**
 * Create the main Zustand store with persistence
 * Uses localStorage to persist cart, wishlist, and user preferences
 */
export const useZLuxuryStore = create<ZLuxuryStore>()(
  persist(
    (set, get) => ({
      // ========================================
      // Initial State / 初始状态
      // ========================================
      
      cartItems: [],
      wishlistItems: [],
      user: null,
      isLoadingAuth: false,
      notifications: [],
      language: 'zh-CN',
      sidebarOpen: false,
      searchQuery: '',

      // ========================================
      // Cart Actions / 购物车操作
      // ========================================

      addToCart: (item) => {
        logger.info('Adding item to cart', { productId: item.productId, name: item.name })
        
        set((state) => {
          // Check if item already exists in cart / 检查商品是否已在购物车中
          const existingIndex = state.cartItems.findIndex(
            (cartItem) => cartItem.productId === item.productId
          )

          if (existingIndex >= 0) {
            // Update quantity if exists / 如果存在则更新数量
            const updatedItems = [...state.cartItems]
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + item.quantity
            }
            
            logger.debug('Updated existing cart item quantity', { 
              productId: item.productId, 
              newQuantity: updatedItems[existingIndex].quantity 
            })
            
            return { cartItems: updatedItems }
          }

          // Add new item if doesn't exist / 如果不存在则添加新商品
          const newItem: CartItem = {
            ...item,
            id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            addedAt: new Date().toISOString()
          }
          
          return { cartItems: [...state.cartItems, newItem] }
        })

        // Show success notification / 显示成功通知
        get().showNotification('success', `${item.name} ${item.quantity > 1 ? `(x${item.quantity})` : ''} added to cart`)
      },

      removeFromCart: (itemId) => {
        logger.info('Removing item from cart', { itemId })
        
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== itemId)
        }))
        
        get().showNotification('info', 'Item removed from cart')
      },

      updateCartQuantity: (itemId, quantity) => {
        logger.debug('Updating cart item quantity', { itemId, quantity })
        
        if (quantity <= 0) {
          get().removeFromCart(itemId)
          return
        }

        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          )
        }))
      },

      clearCart: () => {
        logger.info('Clearing shopping cart')
        set({ cartItems: [] })
        get().showNotification('info', 'Shopping cart cleared')
      },

      getCartItemCount: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0)
      },

      getCartTotal: () => {
        const totals = get().cartItems.reduce(
          (acc, item) => ({
            usd: acc.usd + item.price * item.quantity,
            cny: acc.cny + (item.priceCny || item.price * 7.24) * item.quantity
          }),
          { usd: 0, cny: 0 }
        )
        return totals
      },

      // ========================================
      // Wishlist Actions / 愿望清单操作
      // ========================================

      addToWishlist: (item) => {
        logger.info('Adding item to wishlist', { productId: item.productId })
        
        set((state) => {
          // Prevent duplicates / 防止重复
          if (state.wishlistItems.some((w) => w.productId === item.productId)) {
            get().showNotification('warning', 'Item already in wishlist')
            return state
          }

          const newItem: WishlistItem = {
            ...item,
            dateAdded: new Date().toISOString()
          }

          get().showNotification('success', `${item.name} added to wishlist`)
          
          return { wishlistItems: [...state.wishlistItems, newItem] }
        })
      },

      removeFromWishlist: (productId) => {
        logger.info('Removing item from wishlist', { productId })
        
        set((state) => ({
          wishlistItems: state.wishlistItems.filter((item) => item.productId !== productId)
        }))
        
        get().showNotification('info', 'Item removed from wishlist')
      },

      isInWishlist: (productId) => {
        return get().wishlistItems.some((item) => item.productId === productId)
      },

      // ========================================
      // Auth Actions / 认证操作
      // ========================================

      login: async (email, password) => {
        logger.info('Attempting user login', { email })
        set({ isLoadingAuth: true })

        try {
          // Simulate API call / 模拟API调用
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Mock successful login / 模拟成功登录
          const mockUser: User = {
            id: `user-${Date.now()}`,
            email,
            name: email.split('@')[0],
            avatar: undefined,
            vipTier: 'standard',
            totalSpent: 0,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          }

          set({ user: mockUser, isLoadingAuth: false })
          logger.info('User logged in successfully', { userId: mockUser.id })
          get().showNotification('success', `Welcome back, ${mockUser.name}!`)
          
          return true
        } catch (error) {
          logger.error('Login failed', { error }, error as Error)
          set({ isLoadingAuth: false })
          get().showNotification('error', 'Login failed. Please check your credentials.')
          return false
        }
      },

      register: async (userData) => {
        logger.info('Registering new user', { email: userData.email })
        set({ isLoadingAuth: true })

        try {
          // Simulate API call / 模拟API调用
          await new Promise((resolve) => setTimeout(resolve, 1500))

          const newUser: User = {
            id: `user-${Date.now()}`,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            avatar: undefined,
            vipTier: 'standard',
            totalSpent: 0,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          }

          set({ user: newUser, isLoadingAuth: false })
          logger.info('User registered successfully', { userId: newUser.id })
          get().showNotification('success', 'Account created successfully!')
          
          return true
        } catch (error) {
          logger.error('Registration failed', { error }, error as Error)
          set({ isLoadingAuth: false })
          get().showNotification('error', 'Registration failed. Please try again.')
          return false
        }
      },

      logout: () => {
        logger.info('User logging out')
        set({ user: null })
        get().showNotification('info', 'You have been logged out')
      },

      updateProfile: (updates) => {
        const currentUser = get().user
        if (!currentUser) {
          logger.warn('Cannot update profile: No user logged in')
          return
        }

        logger.info('Updating user profile', Object.keys(updates))
        set({
          user: { ...currentUser, ...updates }
        })
        get().showNotification('success', 'Profile updated successfully')
      },

      // ========================================
      // VIP Actions / VIP操作
      // ========================================

      getCurrentVipBenefits: () => {
        const user = get().user
        const tier = user?.vipTier || 'standard'
        return VIP_TIERS[tier]
      },

      hasVipAccess: (requiredTier) => {
        const user = get().user
        if (!user) return false
        
        const userLevel = VIP_TIERS[user.vipTier].level
        const requiredLevel = VIP_TIERS[requiredTier].level
        
        return userLevel >= requiredLevel
      },

      // ========================================
      // Notification Actions / 通知操作
      // ========================================

      showNotification: (type, message, duration = 3000) => {
        const notification: Notification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          type,
          message,
          duration,
          createdAt: new Date().toISOString()
        }

        logger.debug('Showing notification', { type, message })

        set((state) => ({
          notifications: [...state.notifications, notification]
        }))

        // Auto-dismiss after duration / 在持续时间后自动关闭
        if (duration > 0) {
          setTimeout(() => {
            get().dismissNotification(notification.id)
          }, duration)
        }
      },

      dismissNotification: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== notificationId)
        }))
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },

      // ========================================
      // UI Preference Actions / UI偏好设置操作
      // ========================================

      setLanguage: (lang) => {
        logger.info('Changing language', { lang })
        set({ language: lang })
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query })
      }
    }),
    {
      /** Keys to persist in localStorage / 在localStorage中持久化的键 */
      partialize: (state) => ({
        cartItems: state.cartItems,
        wishlistItems: state.wishlistItems,
        language: state.language,
        user: state.user
      }),
      
      /** Storage key prefix / 存储键前缀 */
      name: 'zluxury-store'
    }
  )
)

// ============================================================================
// EXPORTS / 导出
// ============================================================================

export default useZLuxuryStore