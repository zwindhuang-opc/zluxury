/**
 * ZLuxury Global State Management
 * 
 * This module implements the global state management using Zustand.
 * Features:
 * - User authentication state
 * - Shopping cart state
 * - Product catalog state
 * - UI state (theme, notifications)
 * 
 * Architecture: State Management Layer (Zustand Pattern)
 * Version: 1.0.0
 * Last Updated: 2024-06-07
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, Category, ProductSearchParams } from '@/data/products';
import { User, AuthSession } from '@/data/auth';
import { CartItem, CartSummary } from '@/data/cart';
import { AgentType, ChatMessage } from '@/data/ai';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Application state interface
 */
interface AppState {
  // Authentication state
  auth: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  };
  
  // Cart state
  cart: {
    cartId: string | null;
    items: CartItem[];
    summary: CartSummary | null;
    isLoading: boolean;
  };
  
  // Products state
  products: {
    items: Product[];
    categories: Category[];
    featured: Product[];
    searchResults: Product[];
    isLoading: boolean;
    filters: ProductSearchParams;
  };
  
  // AI Assistant state
  ai: {
    selectedAgent: AgentType;
    messages: ChatMessage[];
    sessionId: string | null;
    isLoading: boolean;
  };
  
  // UI state
  ui: {
    theme: 'dark' | 'light';
    sidebarOpen: boolean;
    searchOpen: boolean;
    notifications: Notification[];
    modalOpen: string | null;
  };
}

/**
 * Notification interface
 */
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
}

/**
 * Store actions interface
 */
interface StoreActions {
  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  
  // Cart actions
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCart: (items: CartItem[], summary: CartSummary) => void;
  
  // Product actions
  fetchProducts: (params?: ProductSearchParams) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchFeatured: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  setFilters: (filters: ProductSearchParams) => void;
  
  // AI actions
  setAgent: (agent: AgentType) => void;
  sendMessage: (query: string) => Promise<void>;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  
  // UI actions
  toggleTheme: () => void;
  toggleSidebar: () => void;
  toggleSearch: () => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  setModal: (modal: string | null) => void;
  
  // Reset actions
  reset: () => void;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: AppState = {
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false
  },
  cart: {
    cartId: null,
    items: [],
    summary: null,
    isLoading: false
  },
  products: {
    items: [],
    categories: [],
    featured: [],
    searchResults: [],
    isLoading: false,
    filters: {}
  },
  ai: {
    selectedAgent: 'hermes',
    messages: [],
    sessionId: null,
    isLoading: false
  },
  ui: {
    theme: 'dark',
    sidebarOpen: false,
    searchOpen: false,
    notifications: [],
    modalOpen: null
  }
};

// ============================================================================
// ZUSTAND STORE
// ============================================================================

/**
 * Create the global store with persistence
 */
export const useStore = create<AppState & StoreActions>()(
  persist(
    (set, get) => ({
      // Initial state
      ...initialState,
      
      // ========================================================================
      // AUTH ACTIONS
      // ========================================================================
      
      /**
       * Login user with credentials
       * @param email - User email
       * @param password - User password
       * @returns Success boolean
       */
      login: async (email: string, password: string) => {
        set((state) => ({ auth: { ...state.auth, isLoading: true } }));
        
        try {
          const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          
          const data = await response.json();
          
          if (data.success) {
            set((state) => ({
              auth: {
                ...state.auth,
                user: data.data.user,
                token: data.data.token,
                isAuthenticated: true,
                isLoading: false
              }
            }));
            return true;
          } else {
            set((state) => ({ auth: { ...state.auth, isLoading: false } }));
            return false;
          }
        } catch (error) {
          set((state) => ({ auth: { ...state.auth, isLoading: false } }));
          return false;
        }
      },
      
      /**
       * Logout user and clear session
       */
      logout: () => {
        const token = get().auth.token;
        
        if (token) {
          fetch('/api/auth?action=logout', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
          }).catch(console.error);
        }
        
        set((state) => ({
          auth: {
            ...state.auth,
            user: null,
            token: null,
            isAuthenticated: false
          },
          cart: {
            ...state.cart,
            cartId: null,
            items: [],
            summary: null
          }
        }));
      },
      
      /**
       * Set user directly
       * @param user - User object or null
       */
      setUser: (user: User | null) => {
        set((state) => ({ auth: { ...state.auth, user } }));
      },
      
      /**
       * Set authentication token
       * @param token - Token string or null
       */
      setToken: (token: string | null) => {
        set((state) => ({ auth: { ...state.auth, token } }));
      },
      
      // ========================================================================
      // CART ACTIONS
      // ========================================================================
      
      /**
       * Add product to cart
       * @param productId - Product ID
       * @param quantity - Quantity to add
       * @returns Success boolean
       */
      addToCart: async (productId: string, quantity: number = 1) => {
        set((state) => ({ cart: { ...state.cart, isLoading: true } }));
        
        try {
          const cartId = get().cart.cartId || 'new';
          
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartId, productId, quantity })
          });
          
          const data = await response.json();
          
          if (data.success) {
            set((state) => ({
              cart: {
                ...state.cart,
                cartId: data.data.cart.cartId,
                items: data.data.cart.items,
                summary: data.data.summary,
                isLoading: false
              }
            }));
            return true;
          } else {
            set((state) => ({ cart: { ...state.cart, isLoading: false } }));
            return false;
          }
        } catch (error) {
          set((state) => ({ cart: { ...state.cart, isLoading: false } }));
          return false;
        }
      },
      
      /**
       * Remove product from cart
       * @param productId - Product ID to remove
       */
      removeFromCart: (productId: string) => {
        const cartId = get().cart.cartId;
        
        if (!cartId) return;
        
        fetch(`/api/cart?cartId=${cartId}&productId=${productId}`, {
          method: 'DELETE'
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              set((state) => ({
                cart: {
                  ...state.cart,
                  items: data.data.cart.items,
                  summary: data.data.summary
                }
              }));
            }
          })
          .catch(console.error);
      },
      
      /**
       * Update product quantity in cart
       * @param productId - Product ID
       * @param quantity - New quantity
       */
      updateQuantity: (productId: string, quantity: number) => {
        const cartId = get().cart.cartId;
        
        if (!cartId) return;
        
        fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartId, productId, quantity })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              set((state) => ({
                cart: {
                  ...state.cart,
                  items: data.data.cart.items,
                  summary: data.data.summary
                }
              }));
            }
          })
          .catch(console.error);
      },
      
      /**
       * Clear entire cart
       */
      clearCart: () => {
        const cartId = get().cart.cartId;
        
        if (!cartId) return;
        
        fetch(`/api/cart?cartId=${cartId}&clear=true`, {
          method: 'DELETE'
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              set((state) => ({
                cart: {
                  ...state.cart,
                  items: [],
                  summary: data.data.summary
                }
              }));
            }
          })
          .catch(console.error);
      },
      
      /**
       * Set cart state directly
       * @param items - Cart items
       * @param summary - Cart summary
       */
      setCart: (items: CartItem[], summary: CartSummary) => {
        set((state) => ({
          cart: { ...state.cart, items, summary }
        }));
      },
      
      // ========================================================================
      // PRODUCT ACTIONS
      // ========================================================================
      
      /**
       * Fetch products from API
       * @param params - Search parameters
       */
      fetchProducts: async (params?: ProductSearchParams) => {
        set((state) => ({ products: { ...state.products, isLoading: true } }));
        
        try {
          const queryParams = new URLSearchParams();
          
          if (params) {
            Object.entries(params).forEach(([key, value]) => {
              if (value !== undefined) {
                queryParams.set(key, String(value));
              }
            });
          }
          
          const response = await fetch(`/api/products?${queryParams}`);
          const data = await response.json();
          
          if (data.success) {
            set((state) => ({
              products: {
                ...state.products,
                items: data.data,
                isLoading: false
              }
            }));
          } else {
            set((state) => ({ products: { ...state.products, isLoading: false } }));
          }
        } catch (error) {
          set((state) => ({ products: { ...state.products, isLoading: false } }));
        }
      },
      
      /**
       * Fetch categories from API
       */
      fetchCategories: async () => {
        try {
          const response = await fetch('/api/categories');
          const data = await response.json();
          
          if (data.success) {
            set((state) => ({
              products: {
                ...state.products,
                categories: data.data
              }
            }));
          }
        } catch (error) {
          console.error('Failed to fetch categories:', error);
        }
      },
      
      /**
       * Fetch featured products
       */
      fetchFeatured: async () => {
        try {
          const response = await fetch('/api/products?limit=6');
          const data = await response.json();
          
          if (data.success) {
            set((state) => ({
              products: {
                ...state.products,
                featured: data.data
              }
            }));
          }
        } catch (error) {
          console.error('Failed to fetch featured products:', error);
        }
      },
      
      /**
       * Search products by query
       * @param query - Search query
       */
      searchProducts: async (query: string) => {
        set((state) => ({ products: { ...state.products, isLoading: true } }));
        
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await response.json();
          
          if (data.success) {
            set((state) => ({
              products: {
                ...state.products,
                searchResults: data.data.products,
                isLoading: false
              }
            }));
          } else {
            set((state) => ({ products: { ...state.products, isLoading: false } }));
          }
        } catch (error) {
          set((state) => ({ products: { ...state.products, isLoading: false } }));
        }
      },
      
      /**
       * Set products directly
       * @param products - Product array
       */
      setProducts: (products: Product[]) => {
        set((state) => ({ products: { ...state.products, items: products } }));
      },
      
      /**
       * Set categories directly
       * @param categories - Category array
       */
      setCategories: (categories: Category[]) => {
        set((state) => ({ products: { ...state.products, categories } }));
      },
      
      /**
       * Set product filters
       * @param filters - Filter parameters
       */
      setFilters: (filters: ProductSearchParams) => {
        set((state) => ({ products: { ...state.products, filters } }));
      },
      
      // ========================================================================
      // AI ACTIONS
      // ========================================================================
      
      /**
       * Set selected AI agent
       * @param agent - Agent type
       */
      setAgent: (agent: AgentType) => {
        set((state) => ({ ai: { ...state.ai, selectedAgent: agent } }));
      },
      
      /**
       * Send message to AI assistant
       * @param query - User query
       */
      sendMessage: async (query: string) => {
        set((state) => ({ ai: { ...state.ai, isLoading: true } }));
        
        const sessionId = get().ai.sessionId || `SESSION-${Date.now()}`;
        const selectedAgent = get().ai.selectedAgent;
        
        try {
          const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query,
              agent: selectedAgent,
              sessionId
            })
          });
          
          const data = await response.json();
          
          if (data.success) {
            // Add user message
            const userMessage: ChatMessage = {
              id: `MSG-${Date.now()}`,
              type: 'user',
              content: query,
              timestamp: new Date().toISOString()
            };
            
            set((state) => ({
              ai: {
                ...state.ai,
                sessionId,
                messages: [...state.ai.messages, userMessage, data.data.message],
                isLoading: false
              }
            }));
          } else {
            set((state) => ({ ai: { ...state.ai, isLoading: false } }));
          }
        } catch (error) {
          set((state) => ({ ai: { ...state.ai, isLoading: false } }));
        }
      },
      
      /**
       * Add message to chat history
       * @param message - Chat message
       */
      addMessage: (message: ChatMessage) => {
        set((state) => ({
          ai: {
            ...state.ai,
            messages: [...state.ai.messages, message]
          }
        }));
      },
      
      /**
       * Clear chat messages
       */
      clearMessages: () => {
        set((state) => ({
          ai: {
            ...state.ai,
            messages: [],
            sessionId: null
          }
        }));
      },
      
      // ========================================================================
      // UI ACTIONS
      // ========================================================================
      
      /**
       * Toggle theme between dark and light
       */
      toggleTheme: () => {
        set((state) => ({
          ui: {
            ...state.ui,
            theme: state.ui.theme === 'dark' ? 'light' : 'dark'
          }
        }));
      },
      
      /**
       * Toggle sidebar visibility
       */
      toggleSidebar: () => {
        set((state) => ({
          ui: {
            ...state.ui,
            sidebarOpen: !state.ui.sidebarOpen
          }
        }));
      },
      
      /**
       * Toggle search bar visibility
       */
      toggleSearch: () => {
        set((state) => ({
          ui: {
            ...state.ui,
            searchOpen: !state.ui.searchOpen
          }
        }));
      },
      
      /**
       * Add notification
       * @param notification - Notification object
       */
      addNotification: (notification: Notification) => {
        set((state) => ({
          ui: {
            ...state.ui,
            notifications: [...state.ui.notifications, notification]
          }
        }));
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
          get().removeNotification(notification.id);
        }, 5000);
      },
      
      /**
       * Remove notification by ID
       * @param id - Notification ID
       */
      removeNotification: (id: string) => {
        set((state) => ({
          ui: {
            ...state.ui,
            notifications: state.ui.notifications.filter(n => n.id !== id)
          }
        }));
      },
      
      /**
       * Set modal state
       * @param modal - Modal name or null
       */
      setModal: (modal: string | null) => {
        set((state) => ({
          ui: {
            ...state.ui,
            modalOpen: modal
          }
        }));
      },
      
      // ========================================================================
      // RESET ACTIONS
      // ========================================================================
      
      /**
       * Reset entire store to initial state
       */
      reset: () => {
        set(initialState);
      }
    }),
    {
      name: 'zluxury-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        auth: {
          user: state.auth.user,
          token: state.auth.token,
          isAuthenticated: state.auth.isAuthenticated
        },
        cart: {
          cartId: state.cart.cartId,
          items: state.cart.items
        },
        ui: {
          theme: state.ui.theme
        }
      })
    }
  )
);

// ============================================================================
// EXPORT SELECTORS
// ============================================================================

/**
 * Authentication state selector
 */
export const useAuth = () => useStore((state) => state.auth);

/**
 * Cart state selector
 */
export const useCart = () => useStore((state) => state.cart);

/**
 * Products state selector
 */
export const useProducts = () => useStore((state) => state.products);

/**
 * AI state selector
 */
export const useAI = () => useStore((state) => state.ai);

/**
 * UI state selector
 */
export const useUI = () => useStore((state) => state.ui);

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default useStore;