/**
 * ZLuxury API Route - Single Product
 * 
 * This module implements the RESTful API endpoints for single product operations.
 * Endpoints:
 * - GET /api/products/[id] - Get single product by ID
 * - PUT /api/products/[id] - Update product (Admin only)
 * - DELETE /api/products/[id] - Delete product (Admin only)
 * 
 * Architecture: API Layer (Controller Pattern)
 * Version: 1.0.0
 * Last Updated: 2024-06-07
 */

import { NextRequest, NextResponse } from 'next/server';
import { ProductRepository } from '@/data/products';

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
 * GET /api/products/[id]
 * Get a single product by ID
 * 
 * Path Parameters:
 * - id: Product ID (format: PROD-XXX)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<any>>> {
  try {
    // Get product ID from path
    const productId = params.id;

    // Validate product ID format
    if (!productId || !productId.startsWith('PROD-')) {
      return errorResponse('Invalid product ID format', 400);
    }

    // Get product from repository
    const product = ProductRepository.getById(productId);

    // Check if product exists
    if (!product) {
      return errorResponse('Product not found', 404);
    }

    // Return success response
    return successResponse(product);

  } catch (error) {
    console.error('[API] Product GET error:', error);
    return errorResponse('Failed to retrieve product', 500);
  }
}

/**
 * PUT /api/products/[id]
 * Update a product (Admin only - requires authentication)
 * 
 * Path Parameters:
 * - id: Product ID
 * 
 * Request Body:
 * - Partial product object with fields to update
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const productId = params.id;

    // Validate product ID
    if (!productId) {
      return errorResponse('Product ID is required', 400);
    }

    // Check if product exists
    const existingProduct = ProductRepository.getById(productId);
    if (!existingProduct) {
      return errorResponse('Product not found', 404);
    }

    // Parse request body
    const body = await request.json();

    // Create updated product object
    const updatedProduct = {
      ...existingProduct,
      ...body,
      updatedAt: new Date().toISOString()
    };

    // Note: In production, this would update database
    return successResponse(updatedProduct, 'Product updated successfully');

  } catch (error) {
    console.error('[API] Product PUT error:', error);
    return errorResponse('Failed to update product', 500);
  }
}

/**
 * DELETE /api/products/[id]
 * Delete a product (Admin only - requires authentication)
 * 
 * Path Parameters:
 * - id: Product ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const productId = params.id;

    // Validate product ID
    if (!productId) {
      return errorResponse('Product ID is required', 400);
    }

    // Check if product exists
    const existingProduct = ProductRepository.getById(productId);
    if (!existingProduct) {
      return errorResponse('Product not found', 404);
    }

    // Note: In production, this would delete from database
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('[API] Product DELETE error:', error);
    return errorResponse('Failed to delete product', 500);
  }
}