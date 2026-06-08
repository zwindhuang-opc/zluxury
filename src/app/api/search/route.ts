/**
 * ZLuxury API Route - Search
 * 
 * This module implements the search API endpoint.
 * Endpoints:
 * - GET /api/search - Search products by query
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

interface SearchResponse {
  success: boolean;
  data?: {
    products: any[];
    suggestions: string[];
  };
  error?: string;
  meta?: {
    total: number;
    query: string;
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function successResponse(products: any[], query: string): NextResponse<SearchResponse> {
  // Generate search suggestions based on results
  const suggestions = generateSuggestions(products);
  
  return NextResponse.json({
    success: true,
    data: {
      products,
      suggestions
    },
    meta: {
      total: products.length,
      query
    }
  }, { status: 200 });
}

function errorResponse(message: string, status: number = 400): NextResponse<SearchResponse> {
  return NextResponse.json({
    success: false,
    error: message
  }, { status });
}

/**
 * Generate search suggestions based on search results
 * @param products - Array of matching products
 * @returns Array of suggestion strings
 */
function generateSuggestions(products: any[]): string[] {
  const suggestions: Set<string> = new Set();
  
  // Add brand suggestions
  products.forEach(p => {
    suggestions.add(p.brand);
    suggestions.add(`${p.brand} ${p.category}`);
    suggestions.add(p.category);
  });
  
  // Return top 5 suggestions
  return Array.from(suggestions).slice(0, 5);
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * GET /api/search
 * Search products by query string
 * 
 * Query Parameters:
 * - q: Search query (required)
 * - limit: Maximum results (optional, default: 20)
 */
export async function GET(request: NextRequest): NextResponse<SearchResponse> {
  try {
    // Get search query from URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    
    // Validate query
    if (!query || query.trim().length < 2) {
      return errorResponse('Search query must be at least 2 characters', 400);
    }
    
    // Search products
    const results = ProductRepository.search(query.trim()).slice(0, limit);
    
    // Return success response
    return successResponse(results, query.trim());
    
  } catch (error) {
    console.error('[API] Search GET error:', error);
    return errorResponse('Search failed', 500);
  }
}