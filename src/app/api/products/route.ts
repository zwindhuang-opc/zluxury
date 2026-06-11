/**
 * ZLuxury API Route - Products
 * 
 * This module implements the RESTful API endpoints for product management.
 * Endpoints:
 * - GET /api/products - Get all products with optional filtering
 * - GET /api/products/[id] - Get single product by ID
 * - GET /api/products/search - Search products by query
 * - GET /api/products/featured - Get featured products
 * - GET /api/products/category/[categoryId] - Get products by category
 * 
 * Architecture: API Layer (Controller Pattern)
 * Version: 1.0.0
 * Last Updated: 2024-06-07
 */

import { NextRequest, NextResponse } from 'next/server';
import { ProductRepository, ProductSearchParams } from '@/data/products';

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Standard API response wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total: number;
    page?: number;
    limit?: number;
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create a standardized success response
 * @param data - Response data
 * @param meta - Optional metadata
 * @returns NextResponse object
 */
function successResponse<T>(data: T, meta?: { total: number; page?: number; limit?: number }): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    meta
  }, { status: 200 });
}

/**
 * Create a standardized error response
 * @param message - Error message
 * @param status - HTTP status code
 * @returns NextResponse object
 */
function errorResponse(message: string, status: number = 400): NextResponse<ApiResponse<null>> {
  return NextResponse.json({
    success: false,
    error: message
  }, { status });
}

/**
 * Parse query parameters from request URL
 * @param request - NextRequest object
 * @returns ProductSearchParams object
 */
function parseQueryParams(request: NextRequest): ProductSearchParams {
  const { searchParams } = new URL(request.url);

  return {
    query: searchParams.get('query') || undefined,
    category: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    isLimited: searchParams.get('isLimited') ? searchParams.get('isLimited') === 'true' : undefined,
    isNew: searchParams.get('isNew') ? searchParams.get('isNew') === 'true' : undefined,
    sortBy: (searchParams.get('sortBy') as ProductSearchParams['sortBy']) || undefined,
    sortOrder: (searchParams.get('sortOrder') as ProductSearchParams['sortOrder']) || undefined,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined
  };
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * GET /api/products
 * Get all products with optional filtering and pagination
 * 
 * Query Parameters:
 * - query: Text search query
 * - category: Filter by category ID
 * - brand: Filter by brand name
 * - minPrice: Minimum price filter
 * - maxPrice: Maximum price filter
 * - isLimited: Filter limited edition products
 * - isNew: Filter new products
 * - sortBy: Sort field (price, rating, name, date)
 * - sortOrder: Sort direction (asc, desc)
 * - limit: Pagination limit
 * - offset: Pagination offset
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    // Parse query parameters
    const params = parseQueryParams(request);

    // Get products from repository
    const products = ProductRepository.getAll(params);

    // Get total count (without pagination)
    const totalParams = { ...params, limit: undefined, offset: undefined };
    const total = ProductRepository.getAll(totalParams).length;

    // Calculate pagination info
    const page = params.offset ? Math.floor(params.offset / (params.limit || 10)) + 1 : 1;

    // Return success response
    return successResponse(products, {
      total,
      page,
      limit: params.limit || products.length
    });

  } catch (error) {
    // Log error for debugging
    console.error('[API] Products GET error:', error);

    // Return error response
    return errorResponse('Failed to retrieve products', 500);
  }
}

/**
 * POST /api/products
 * Create a new product (Admin only - requires authentication)
 * 
 * Request Body:
 * - Product object with all required fields
 * 
 * Note: This endpoint requires admin authentication
 * Implementation pending with auth system
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    // Parse request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'brand', 'category', 'price', 'description'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return errorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400);
    }

    // Generate product ID
    const productId = `PROD-${Date.now().toString(36).toUpperCase()}`;

    // Create product object
    const newProduct = {
      id: productId,
      ...body,
      rating: body.rating || 0,
      reviews: body.reviews || 0,
      isNew: body.isNew || true,
      isLimited: body.isLimited || false,
      stock: body.stock || 0,
      specifications: body.specifications || {},
      auctionData: body.auctionData || null,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Note: In production, this would save to database
    // For now, return the created product
    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('[API] Products POST error:', error);
    return errorResponse('Failed to create product', 500);
  }
}