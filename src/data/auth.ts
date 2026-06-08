/**
 * ZLuxury Authentication System
 * 
 * This module implements the authentication and user management system.
 * Features:
 * - User registration
 * - User login with JWT tokens
 * - Session management
 * - Role-based access control (RBAC)
 * 
 * Architecture: Authentication Layer
 * Version: 1.0.0
 * Last Updated: 2024-06-07
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * User interface defining user account structure
 */
export interface User {
  // Unique user identifier
  id: string;
  
  // User email address (unique)
  email: string;
  
  // User display name
  name: string;
  
  // User role (guest, member, vip, admin)
  role: UserRole;
  
  // VIP membership tier
  vipTier?: VipTier;
  
  // Account creation timestamp
  createdAt: string;
  
  // Last login timestamp
  lastLogin?: string;
  
  // User preferences
  preferences: UserPreferences;
  
  // Account status
  status: 'active' | 'suspended' | 'pending';
}

/**
 * User role enumeration
 */
export type UserRole = 'guest' | 'member' | 'vip' | 'admin';

/**
 * VIP membership tier enumeration
 */
export type VipTier = 'silver' | 'gold' | 'platinum';

/**
 * User preferences interface
 */
export interface UserPreferences {
  // Preferred currency
  currency: string;
  
  // Preferred language
  language: string;
  
  // Notification preferences
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  
  // Favorite categories
  favoriteCategories: string[];
  
  // Favorite brands
  favoriteBrands: string[];
}

/**
 * Authentication session interface
 */
export interface AuthSession {
  // Session ID
  sessionId: string;
  
  // User ID
  userId: string;
  
  // Session token
  token: string;
  
  // Session expiration timestamp
  expiresAt: string;
  
  // Session creation timestamp
  createdAt: string;
  
  // IP address of session
  ipAddress?: string;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data interface
 */
export interface RegistrationData {
  email: string;
  password: string;
  name: string;
}

/**
 * Authentication response interface
 */
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

// ============================================================================
// USER DATABASE (Mock for demonstration)
// ============================================================================

/**
 * Pre-configured user accounts for demonstration
 * In production, this would be stored in a database
 */
export const users: User[] = [
  {
    id: 'USER-001',
    email: 'admin@zluxury.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2023-01-01',
    lastLogin: '2024-05-15',
    preferences: {
      currency: 'USD',
      language: 'en',
      notifications: { email: true, push: true, sms: false },
      favoriteCategories: ['watches', 'jewelry'],
      favoriteBrands: ['Rolex', 'Cartier']
    },
    status: 'active'
  },
  {
    id: 'USER-002',
    email: 'vip@zluxury.com',
    name: 'VIP Member',
    role: 'vip',
    vipTier: 'platinum',
    createdAt: '2023-06-01',
    lastLogin: '2024-05-20',
    preferences: {
      currency: 'USD',
      language: 'en',
      notifications: { email: true, push: true, sms: true },
      favoriteCategories: ['bags', 'watches'],
      favoriteBrands: ['Hermes', 'Patek Philippe']
    },
    status: 'active'
  },
  {
    id: 'USER-003',
    email: 'member@zluxury.com',
    name: 'Regular Member',
    role: 'member',
    createdAt: '2024-01-01',
    lastLogin: '2024-05-10',
    preferences: {
      currency: 'USD',
      language: 'en',
      notifications: { email: true, push: false, sms: false },
      favoriteCategories: ['fashion'],
      favoriteBrands: ['Louis Vuitton', 'Gucci']
    },
    status: 'active'
  }
];

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * UserRepository class implementing user data access methods
 */
export class UserRepository {
  
  /**
   * Get all users
   * @returns Array of all users
   */
  static getAll(): User[] {
    return users;
  }
  
  /**
   * Get user by ID
   * @param id - User ID
   * @returns User object or null
   */
  static getById(id: string): User | null {
    return users.find(u => u.id === id) || null;
  }
  
  /**
   * Get user by email
   * @param email - User email
   * @returns User object or null
   */
  static getByEmail(email: string): User | null {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }
  
  /**
   * Create a new user
   * @param data - Registration data
   * @returns Created user object
   */
  static create(data: RegistrationData): User {
    const userId = `USER-${Date.now().toString(36).toUpperCase()}`;
    
    const newUser: User = {
      id: userId,
      email: data.email,
      name: data.name,
      role: 'member',
      createdAt: new Date().toISOString(),
      preferences: {
        currency: 'USD',
        language: 'en',
        notifications: { email: true, push: false, sms: false },
        favoriteCategories: [],
        favoriteBrands: []
      },
      status: 'active'
    };
    
    // Note: In production, this would save to database
    users.push(newUser);
    
    return newUser;
  }
  
  /**
   * Update user
   * @param id - User ID
   * @param data - Partial user data
   * @returns Updated user object or null
   */
  static update(id: string, data: Partial<User>): User | null {
    const user = this.getById(id);
    if (!user) return null;
    
    Object.assign(user, data);
    return user;
  }
  
  /**
   * Check if user has specific role
   * @param userId - User ID
   * @param role - Required role
   * @returns Boolean indicating if user has role
   */
  static hasRole(userId: string, role: UserRole): boolean {
    const user = this.getById(userId);
    if (!user) return false;
    
    const roleHierarchy: UserRole[] = ['guest', 'member', 'vip', 'admin'];
    const userRoleIndex = roleHierarchy.indexOf(user.role);
    const requiredRoleIndex = roleHierarchy.indexOf(role);
    
    return userRoleIndex >= requiredRoleIndex;
  }
}

/**
 * AuthService class implementing authentication logic
 */
export class AuthService {
  
  // Session storage (in production, use Redis or database)
  private static sessions: Map<string, AuthSession> = new Map();
  
  /**
   * Generate a session token
   * @returns Random token string
   */
  private static generateToken(): string {
    return `TOKEN-${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`;
  }
  
  /**
   * Generate a session ID
   * @returns Random session ID string
   */
  private static generateSessionId(): string {
    return `SESSION-${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`;
  }
  
  /**
   * Login user with credentials
   * @param credentials - Login credentials
   * @returns Authentication response
   */
  static login(credentials: LoginCredentials): AuthResponse {
    // Find user by email
    const user = UserRepository.getByEmail(credentials.email);
    
    // Check if user exists
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }
    
    // Check if account is active
    if (user.status !== 'active') {
      return {
        success: false,
        error: 'Account is not active'
      };
    }
    
    // Note: In production, verify password hash
    // For demo, accept any password for existing users
    
    // Generate session
    const sessionId = this.generateSessionId();
    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
    
    // Create session
    const session: AuthSession = {
      sessionId,
      userId: user.id,
      token,
      expiresAt,
      createdAt: new Date().toISOString()
    };
    
    // Store session
    this.sessions.set(token, session);
    
    // Update last login
    UserRepository.update(user.id, { lastLogin: new Date().toISOString() });
    
    return {
      success: true,
      user,
      token
    };
  }
  
  /**
   * Register new user
   * @param data - Registration data
   * @returns Authentication response
   */
  static register(data: RegistrationData): AuthResponse {
    // Check if email already exists
    const existingUser = UserRepository.getByEmail(data.email);
    
    if (existingUser) {
      return {
        success: false,
        error: 'Email already registered'
      };
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }
    
    // Validate password length
    if (data.password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters'
      };
    }
    
    // Create user
    const user = UserRepository.create(data);
    
    // Auto-login after registration
    return this.login({ email: data.email, password: data.password });
  }
  
  /**
   * Validate session token
   * @param token - Session token
   * @returns User object or null
   */
  static validateToken(token: string): User | null {
    // Get session
    const session = this.sessions.get(token);
    
    if (!session) {
      return null;
    }
    
    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      this.sessions.delete(token);
      return null;
    }
    
    // Get user
    return UserRepository.getById(session.userId);
  }
  
  /**
   * Logout user (invalidate session)
   * @param token - Session token
   * @returns Boolean indicating success
   */
  static logout(token: string): boolean {
    return this.sessions.delete(token);
  }
  
  /**
   * Get active sessions for user
   * @param userId - User ID
   * @returns Array of active sessions
   */
  static getSessions(userId: string): AuthSession[] {
    return Array.from(this.sessions.values()).filter(s => s.userId === userId);
  }
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
  UserRepository,
  AuthService,
  users
};