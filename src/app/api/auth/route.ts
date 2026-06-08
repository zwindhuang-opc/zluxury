/**
 * ZLuxury API Route - Authentication
 * 
 * This module implements the RESTful API endpoints for authentication.
 * Endpoints:
 * - POST /api/auth/login - User login
 * - POST /api/auth/register - User registration
 * - POST /api/auth/logout - User logout
 * - GET /api/auth/session - Validate session
 * 
 * Architecture: API Layer (Controller Pattern)
 * Version: 1.0.0
 * Last Updated: 2024-06-07
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuthService, LoginCredentials, RegistrationData } from '@/data/auth';

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message
  }, { status: 200 });
}

function errorResponse(message: string, status: number = 400): NextResponse<ApiResponse<null>> {
  return NextResponse.json({
    success: false,
    error: message
  }, { status });
}

/**
 * Get authorization token from request headers
 * @param request - NextRequest object
 * @returns Token string or null
 */
function getTokenFromHeaders(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  
  // Extract token from "Bearer <token>" format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1];
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * POST /api/auth/login
 * Authenticate user and create session
 * 
 * Request Body:
 * - email: User email address
 * - password: User password
 */
export async function POST(request: NextRequest): NextResponse<ApiResponse<any>> {
  try {
    // Parse request body
    const body = await request.json();
    
    // Determine action based on endpoint path
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'login';
    
    if (action === 'register') {
      // Handle registration
      const data: RegistrationData = {
        email: body.email,
        password: body.password,
        name: body.name
      };
      
      // Validate required fields
      if (!data.email || !data.password || !data.name) {
        return errorResponse('Email, password, and name are required', 400);
      }
      
      // Register user
      const result = AuthService.register(data);
      
      if (!result.success) {
        return errorResponse(result.error || 'Registration failed', 400);
      }
      
      return successResponse({
        user: result.user,
        token: result.token
      }, 'Registration successful');
      
    } else if (action === 'logout') {
      // Handle logout
      const token = getTokenFromHeaders(request);
      
      if (!token) {
        return errorResponse('Authorization token required', 401);
      }
      
      AuthService.logout(token);
      
      return successResponse(null, 'Logged out successfully');
      
    } else {
      // Handle login
      const credentials: LoginCredentials = {
        email: body.email,
        password: body.password
      };
      
      // Validate required fields
      if (!credentials.email || !credentials.password) {
        return errorResponse('Email and password are required', 400);
      }
      
      // Login user
      const result = AuthService.login(credentials);
      
      if (!result.success) {
        return errorResponse(result.error || 'Login failed', 401);
      }
      
      return successResponse({
        user: result.user,
        token: result.token
      }, 'Login successful');
    }
    
  } catch (error) {
    console.error('[API] Auth POST error:', error);
    return errorResponse('Authentication failed', 500);
  }
}

/**
 * GET /api/auth/session
 * Validate current session and return user data
 * 
 * Headers:
 * - Authorization: Bearer <token>
 */
export async function GET(request: NextRequest): NextResponse<ApiResponse<any>> {
  try {
    // Get token from headers
    const token = getTokenFromHeaders(request);
    
    if (!token) {
      return errorResponse('Authorization token required', 401);
    }
    
    // Validate token
    const user = AuthService.validateToken(token);
    
    if (!user) {
      return errorResponse('Invalid or expired token', 401);
    }
    
    return successResponse({ user, token }, 'Session valid');
    
  } catch (error) {
    console.error('[API] Auth GET error:', error);
    return errorResponse('Session validation failed', 500);
  }
}