/**
 * ZLuxury API Route - Cart
 * 
 * This module implements the RESTful API endpoints for shopping cart.
 * Endpoints:
 * - GET /api/cart - Get cart by ID or user
 * - POST /api/cart - Create cart or add item
 * - PUT /api/cart - Update item quantity
 * - DELETE /api/cart - Remove item or clear cart
 * 
 * Architecture: API Layer (Controller Pattern)
 * Version: 1.0.0
 * Last Updated: 2024-06-07
 */

import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/data/cart';

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

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * GET /api/cart
 * Get cart by ID or user ID
 * 
 * Query Parameters:
 * - cartId: Cart ID
 * - userId: User ID (for user-specific cart)
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get('cartId');
    const userId = searchParams.get('userId');

    let cart;

    if (cartId) {
      cart = CartService.getCart(cartId);
    } else if (userId) {
      cart = CartService.getCartByUser(userId);
    } else {
      return errorResponse('cartId or userId is required', 400);
    }

    if (!cart) {
      return errorResponse('Cart not found', 404);
    }

    const summary = CartService.calculateSummary(cart);

    return successResponse({ cart, summary });

  } catch (error) {
    console.error('[API] Cart GET error:', error);
    return errorResponse('Failed to retrieve cart', 500);
  }
}

/**
 * POST /api/cart
 * Create new cart or add item to cart
 * 
 * Query Parameters:
 * - action: 'create' or 'add'
 * 
 * Request Body (for add):
 * - cartId: Cart ID
 * - productId: Product ID
 * - quantity: Quantity to add
 * - notes: Optional notes
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'add';

    if (action === 'create') {
      // Create new cart
      const body = await request.json();
      const userId = body.userId || null;
      const vipTier = body.vipTier;

      const cart = CartService.createCart(userId, vipTier);
      const summary = CartService.calculateSummary(cart);

      return successResponse({ cart, summary }, 'Cart created');

    } else {
      // Add item to cart
      const body = await request.json();

      // Validate required fields
      if (!body.productId) {
        return errorResponse('productId is required', 400);
      }

      const result = CartService.addItem(
        body.cartId || 'new',
        body.productId,
        body.quantity || 1,
        body.notes
      );

      if (!result.success) {
        return errorResponse(result.error || 'Failed to add item', 400);
      }

      return successResponse({ cart: result.cart, summary: result.summary }, result.message);
    }

  } catch (error) {
    console.error('[API] Cart POST error:', error);
    return errorResponse('Cart operation failed', 500);
  }
}

/**
 * PUT /api/cart
 * Update item quantity in cart
 * 
 * Request Body:
 * - cartId: Cart ID
 * - productId: Product ID
 * - quantity: New quantity
 */
export async function PUT(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.cartId || !body.productId || !body.quantity) {
      return errorResponse('cartId, productId, and quantity are required', 400);
    }

    const result = CartService.updateQuantity(body.cartId, body.productId, body.quantity);

    if (!result.success) {
      return errorResponse(result.error || 'Failed to update quantity', 400);
    }

    return successResponse({ cart: result.cart, summary: result.summary }, result.message);

  } catch (error) {
    console.error('[API] Cart PUT error:', error);
    return errorResponse('Cart update failed', 500);
  }
}

/**
 * DELETE /api/cart
 * Remove item from cart or clear entire cart
 * 
 * Query Parameters:
 * - cartId: Cart ID
 * - productId: Product ID (optional, if not provided clears entire cart)
 * - clear: Boolean to clear entire cart
 */
export async function DELETE(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get('cartId');
    const productId = searchParams.get('productId');
    const clear = searchParams.get('clear') === 'true';

    if (!cartId) {
      return errorResponse('cartId is required', 400);
    }

    let result;

    if (clear || !productId) {
      result = CartService.clearCart(cartId);
    } else {
      result = CartService.removeItem(cartId, productId);
    }

    if (!result.success) {
      return errorResponse(result.error || 'Cart operation failed', 400);
    }

    return successResponse({ cart: result.cart, summary: result.summary }, result.message);

  } catch (error) {
    console.error('[API] Cart DELETE error:', error);
    return errorResponse('Cart operation failed', 500);
  }
}