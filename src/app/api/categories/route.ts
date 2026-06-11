/**
 * ZLuxury API Route - Categories
 * 
 * This module implements the RESTful API endpoints for category management.
 * Endpoints:
 * - GET /api/categories - Get all categories
 * - GET /api/categories/[id] - Get single category by ID
 * 
 * Architecture: API Layer (Controller Pattern)
 * Version: 1.0.0
 * Last Updated: 2024-06-07
 */

import { NextRequest, NextResponse } from 'next/server';
import { CategoryRepository } from '@/data/products';

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function successResponse<T>(data: T, meta?: { total: number }): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    meta
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
 * GET /api/categories
 * Get all categories with product counts
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    // Get all categories from repository
    const categories = CategoryRepository.getAll();
    
    // Get total count
    const total = CategoryRepository.getCount();
    
    // Return success response
    return successResponse(categories, { total });
    
  } catch (error) {
    console.error('[API] Categories GET error:', error);
    return errorResponse('Failed to retrieve categories', 500);
  }
}