/**
 * ZLuxury API Route - AI Assistant
 * 
 * This module implements the RESTful API endpoints for AI assistant.
 * Endpoints:
 * - POST /api/ai/chat - Process chat message
 * - GET /api/ai/agents - Get agent configurations
 * - GET /api/ai/history - Get chat history
 * 
 * Architecture: API Layer (Controller Pattern)
 * Version: 1.0.0
 * Last Updated: 2024-06-07
 */

import { NextRequest, NextResponse } from 'next/server';
import { AIService, AgentType, AIRequest } from '@/data/ai';

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
// CHAT HISTORY STORAGE
// ============================================================================

/**
 * In-memory chat history storage
 * In production, use database
 */
const chatHistories: Map<string, any[]> = new Map();

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * GET /api/ai
 * Get agent configurations or chat history
 * 
 * Query Parameters:
 * - action: 'agents' or 'history'
 * - sessionId: Session ID (for history)
 */
export async function GET(request: NextRequest): NextResponse<ApiResponse<any>> {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'agents';
    
    if (action === 'agents') {
      // Return all agent configurations
      const agents = AIService.getAllAgents();
      return successResponse(agents);
      
    } else if (action === 'history') {
      // Return chat history for session
      const sessionId = searchParams.get('sessionId');
      
      if (!sessionId) {
        return errorResponse('sessionId is required for history', 400);
      }
      
      const history = chatHistories.get(sessionId) || [];
      return successResponse(history);
    }
    
    return errorResponse('Invalid action', 400);
    
  } catch (error) {
    console.error('[API] AI GET error:', error);
    return errorResponse('AI service error', 500);
  }
}

/**
 * POST /api/ai
 * Process chat message
 * 
 * Request Body:
 * - query: User message
 * - agent: Agent type (hermes, openclaw, unicorn)
 * - sessionId: Session ID
 * - userContext: Optional user context
 */
export async function POST(request: NextRequest): NextResponse<ApiResponse<any>> {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.query || !body.agent) {
      return errorResponse('query and agent are required', 400);
    }
    
    // Validate agent type
    const validAgents: AgentType[] = ['hermes', 'openclaw', 'unicorn'];
    if (!validAgents.includes(body.agent)) {
      return errorResponse('Invalid agent type', 400);
    }
    
    // Create AI request
    const aiRequest: AIRequest = {
      query: body.query,
      agent: body.agent,
      sessionId: body.sessionId,
      userContext: body.userContext
    };
    
    // Process query
    const response = AIService.processQuery(aiRequest);
    
    // Store in chat history
    if (body.sessionId) {
      const history = chatHistories.get(body.sessionId) || [];
      
      // Add user message
      history.push({
        id: `MSG-${Date.now()}`,
        type: 'user',
        content: body.query,
        timestamp: new Date().toISOString()
      });
      
      // Add agent response
      history.push(response.message);
      
      chatHistories.set(body.sessionId, history);
    }
    
    return successResponse({
      message: response.message,
      suggestions: response.suggestions,
      products: response.products
    });
    
  } catch (error) {
    console.error('[API] AI POST error:', error);
    return errorResponse('AI processing failed', 500);
  }
}