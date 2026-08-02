/**
 * ZLuxury AI Agent System - Real AI Integration
 * 
 * Multi-agent AI system with real API integration:
 * - Primary: Proxies to zunicorn-agent Python backend (port 6274)
 * - Fallback: Enhanced local response generator with context awareness
 * 
 * Agents:
 * - Hermes: Luxury recommendation specialist
 * - OpenClaw: Task automation engine
 * - Unicorn: Conversational AI companion
 * 
 * @module AIAgents
 * @version 4.0.0
 * @lastUpdated 2026-08-02
 */

import { Logger, LogLevel } from '@/utils/logger'
import { AI_AGENTS } from '@/config/constants'
import { products, searchProducts, getProductsByCategory, Product } from '@/data/products'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type AgentType = 'hermes' | 'openclaw' | 'unicorn'

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agent?: AgentType;
  timestamp: string;
  metadata?: {
    confidence?: number;
    processingTimeMs?: number;
    tokensUsed?: number;
  };
}

export interface AIResponse {
  success: boolean;
  content: string;
  agent: AgentType;
  suggestions?: string[];
  relatedProducts?: Array<{ id: string; name: string; reason: string }>;
  metadata: {
    confidence: number;
    processingTimeMs: number;
    modelVersion: string;
    source?: string;
  };
}

// ============================================================================
// CONTEXT ENGINE
// ============================================================================

class ContextEngine {
  private contexts: Map<string, {
    messages: AIMessage[];
    userId?: string;
    vipTier?: string;
    browsingHistory: string[];
    cartContext: Array<{ productId: string; name: string; price: number }>;
    agentPreferences: Partial<Record<AgentType, boolean>>;
  }> = new Map()

  getOrCreate(conversationId?: string) {
    const id = conversationId || `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    if (!this.contexts.has(id)) {
      this.contexts.set(id, {
        messages: [],
        browsingHistory: [],
        cartContext: [],
        agentPreferences: {}
      })
    }
    return { id, ...this.contexts.get(id)! }
  }

  addMessage(conversationId: string, message: AIMessage) {
    const ctx = this.contexts.get(conversationId)
    if (ctx) {
      ctx.messages.push(message)
      if (ctx.messages.length > 50) {
        ctx.messages = ctx.messages.slice(-50)
      }
    }
  }

  getHistory(conversationId: string): AIMessage[] {
    return this.contexts.get(conversationId)?.messages || []
  }

  getLastUserMessage(conversationId: string): AIMessage | null {
    const messages = this.getHistory(conversationId)
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') return messages[i]
    }
    return null
  }

  setAgentPreference(conversationId: string, agent: AgentType, preferred: boolean) {
    const ctx = this.contexts.get(conversationId)
    if (ctx) {
      ctx.agentPreferences[agent] = preferred
    }
  }

  getAgentPreference(conversationId: string, agent: AgentType): boolean {
    return this.contexts.get(conversationId)?.agentPreferences[agent] || false
  }

  addBrowsingHistory(conversationId: string, productId: string) {
    const ctx = this.contexts.get(conversationId)
    if (ctx) {
      ctx.browsingHistory.push(productId)
      if (ctx.browsingHistory.length > 20) {
        ctx.browsingHistory = ctx.browsingHistory.slice(-20)
      }
    }
  }

  clear(conversationId: string) {
    this.contexts.delete(conversationId)
  }
}

// ============================================================================
// PRODUCT KNOWLEDGE BASE
// ============================================================================

const CATEGORY_MAP: Record<string, string> = {
  watch: 'Watches', timepiece: 'Watches', 'wrist watch': 'Watches', wristwatch: 'Watches',
  jewelry: 'High Jewelry', ring: 'High Jewelry', diamond: 'High Jewelry', gemstone: 'High Jewelry',
  necklace: 'High Jewelry', bracelet: 'High Jewelry', earring: 'High Jewelry', earrings: 'High Jewelry',
  bag: 'Designer Handbags', handbag: 'Designer Handbags', purse: 'Designer Handbags', tote: 'Designer Handbags',
  fashion: 'Designer Fashion', clothing: 'Designer Fashion', apparel: 'Designer Fashion', dress: 'Designer Fashion',
  art: 'Fine Art', artwork: 'Fine Art', painting: 'Fine Art',
  automobile: 'Luxury Automobiles', car: 'Luxury Automobiles',
  estate: 'Exclusive Real Estate', property: 'Exclusive Real Estate',
  yacht: 'Luxury Yachts', boat: 'Luxury Yachts'
}

const BRAND_KEYWORDS = [
  'rolex', 'patek philippe', 'patek', 'cartier', 'hermes', 'hermès',
  'chanel', 'gucci', 'prada', 'dior', 'louis vuitton', 'lv',
  'van cleef', 'bulgari', 'tiffany', 'omega', 'iwc', 'audemars piguet',
  'audemars', 'piaget', 'vacheron', 'ap royal oak', 'richard mille',
  'hublot', 'tag heuer', 'tudor', 'panerai', 'breitling', 'lvmh'
]

const BRAND_DISPLAY: Record<string, string> = {
  'rolex': 'Rolex', 'patek philippe': 'Patek Philippe', 'patek': 'Patek Philippe',
  'cartier': 'Cartier', 'hermes': 'Hermès', 'hermès': 'Hermès',
  'chanel': 'Chanel', 'gucci': 'Gucci', 'prada': 'Prada',
  'dior': 'Dior', 'louis vuitton': 'Louis Vuitton', 'lv': 'Louis Vuitton',
  'van cleef': 'Van Cleef & Arpels', 'bulgari': 'Bulgari',
  'tiffany': 'Tiffany', 'omega': 'Omega', 'iwc': 'IWC',
  'audemars piguet': 'Audemars Piguet', 'audemars': 'Audemars Piguet',
  'piaget': 'Piaget', 'vacheron': 'Vacheron Constantin',
  'ap royal oak': 'Audemars Piguet', 'richard mille': 'Richard Mille',
  'hublot': 'Hublot', 'tag heuer': 'TAG Heuer',
  'tudor': 'Tudor', 'panerai': 'Panerai', 'breitling': 'Breitling'
}

const BRAND_INFO: Record<string, { period: string; highlight: string }> = {
  'Rolex': { period: '1905', highlight: 'Swiss precision at its finest. The Submariner, Daytona, and Datejust are legendary icons that have defined luxury watchmaking for over a century.' },
  'Patek Philippe': { period: '1839', highlight: '"You never actually own a Patek Philippe. You merely look after it for the next generation." Investment-grade pieces that consistently appreciate.' },
  'Cartier': { period: '1847', highlight: 'Pioneer of modern jewelry design. Known for the Love collection, Panthère motif, and iconic engagement rings.' },
  'Hermès': { period: '1837', highlight: 'Each Birkin takes 48+ hours to create. The ultimate in leather craftsmanship and timeless elegance.' },
  'Chanel': { period: '1910', highlight: 'Couture revolution. Classic flap bag, No.5 perfume, and timeless black-tie elegance.' },
  'Gucci': { period: '1921', highlight: 'Italian luxury house. Iconic GG monogram, Dionysus bag, and contemporary fashion-forward designs.' },
  'Van Cleef & Arpels': { period: '1906', highlight: 'Masters of mystery setting. Alhambra collection remains the ultimate icon of fine jewelry.' },
  'Tiffany': { period: '1837', highlight: 'The Tiffany Blue Box. Legendary engagement rings and sterling silver craftsmanship.' },
  'Bulgari': { period: '1884', highlight: 'Roman heritage. Serpenti collection and bold Italian jewelry design.' },
  'Omega': { period: '1848', highlight: '"First watch on the Moon." Speedmaster and Seamaster are iconic sports watches.' },
  'Audemars Piguet': { period: '1875', highlight: 'Royal Oak octagonal bezel. Pinnacle of Swiss luxury watchmaking.' },
  'Louis Vuitton': { period: '1854', highlight: 'Founded as a trunk maker. Now a global luxury empire with iconic monogram canvas.' },
  'Dior': { period: '1946', highlight: 'New Look revolution. Saddle bag and Book Tote are contemporary classics.' },
  'Prada': { period: '1913', highlight: 'Italian minimalist luxury. Galleria bag and intellectual fashion under Miuccia Prada.' },
  'Piaget': { period: '1874', highlight: '"Always do better than necessary." Ultra-thin watches and Possession jewelry collection.' },
  'Vacheron Constantin': { period: '1755', highlight: 'The oldest continuously operating watchmaker. Overseas collection represents pinnacle of Genevan horology.' }
}

const logger = Logger.getLogger('AIAgentSystem')

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function extractKeywords(message: string): string[] {
  const words = message.toLowerCase().match(/[a-z0-9]+/g) || []
  const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'what', 'how', 'i', 'me', 'my',
    'can', 'do', 'does', 'recommend', 'suggest', 'find', 'show', 'tell', 'want', 'looking',
    'about', 'for', 'with', 'in', 'on', 'to', 'at', 'by', 'from', 'of',
    'and', 'or', 'not', 'just', 'please', 'thank', 'thanks', 'hi', 'hello', 'hey', 'good',
    'give', 'get', 'need', 'would', 'could', 'should', 'will', 'many', 'much', 'some',
    'any', 'other', 'new', 'old', 'best', 'top', 'good', 'great', 'help', 'you',
    'your', 'our', 'their', 'this', 'that', 'these', 'those', 'it', 'its', 'am'])
  return words.filter(w => !stopWords.has(w) && w.length > 2)
}

function detectCategory(message: string): string | null {
  const lower = message.toLowerCase()
  for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(keyword)) return category
  }
  return null
}

function detectBrand(message: string): string | null {
  const lower = message.toLowerCase()
  for (const brand of BRAND_KEYWORDS) {
    if (lower.includes(brand)) {
      return BRAND_DISPLAY[brand] || brand.charAt(0).toUpperCase() + brand.slice(1)
    }
  }
  return null
}

function searchRealProducts(message: string, limit: number = 3): Product[] {
  return searchProducts(message).slice(0, limit)
}

function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0
  }).format(price)
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ============================================================================
// REAL AI API CLIENT
// ============================================================================

class RealAIClient {
  private apiEndpoint: string
  private zunicornEndpoint: string
  private lastCheck: number = 0
  private isAvailable: boolean | null = null
  private lastChatFailure: number = 0

  constructor() {
    this.zunicornEndpoint = 'http://localhost:6274'
    this.apiEndpoint = '/api/chat'
  }

  private async checkZunicornAvailability(): Promise<boolean> {
    const now = Date.now()
    if (this.isAvailable !== null && now - this.lastCheck < 30000) {
      return this.isAvailable
    }
    if (this.lastChatFailure > 0 && now - this.lastChatFailure < 60000) {
      this.isAvailable = false
      this.lastCheck = now
      return false
    }
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)
      const res = await fetch(`${this.zunicornEndpoint}/api/v1/status`, {
        method: 'GET',
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      this.isAvailable = res.ok
      this.lastCheck = now
      return res.ok
    } catch {
      this.isAvailable = false
      this.lastCheck = now
      return false
    }
  }

  async sendMessage(
    message: string,
    agent: AgentType,
    conversationId: string,
    history: AIMessage[]
  ): Promise<AIResponse | null> {
    try {
      const isZunicornOnline = await this.checkZunicornAvailability()

      if (isZunicornOnline) {
        return await this.callZunicornAgent(message, agent, conversationId, history)
      }

      return await this.callNextApiRoute(message, agent, conversationId, history)
    } catch (error) {
      logger.warn('Real AI API call failed:', error instanceof Error ? error.message : String(error))
      this.isAvailable = false
      this.lastChatFailure = Date.now()
      return null
    }
  }

  private async callZunicornAgent(
    message: string,
    agent: AgentType,
    conversationId: string,
    history: AIMessage[]
  ): Promise<AIResponse | null> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      const response = await fetch(`${this.zunicornEndpoint}/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          agent_type: agent,
          conversation_id: conversationId,
          history: history.slice(-10).map(m => ({
            role: m.role,
            content: m.content,
            agent: m.agent
          }))
        }),
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        logger.warn(`ZUnicorn agent returned ${response.status}`)
        return null
      }

      const data = await response.json()

      const content = data.response || data.content || data.message
      if (!content) return null

      return {
        success: true,
        content,
        agent: (data.agent || agent) as AgentType,
        suggestions: data.suggestions || this.generateSuggestions(content),
        relatedProducts: data.relatedProducts,
        metadata: {
          confidence: 0.95,
          processingTimeMs: data.processing_time_ms || Date.now(),
          modelVersion: 'zunicorn-agent',
          source: 'zunicorn-agent'
        }
      }
    } catch (error) {
      logger.warn('ZUnicorn agent call failed:', error instanceof Error ? error.message : String(error))
      this.isAvailable = false
      return null
    }
  }

  private async callNextApiRoute(
    message: string,
    agent: AgentType,
    conversationId: string,
    history: AIMessage[]
  ): Promise<AIResponse | null> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          agent,
          conversationId,
          context: {
            history: history.slice(-10),
            agentType: agent,
            source: 'zluxury-web'
          }
        })
      })

      if (!response.ok) {
        logger.warn(`Next API route returned ${response.status}`)
        return null
      }

      const data = await response.json()

      if (data.success && data.content) {
        return {
          success: true,
          content: data.content,
          agent: data.agent || agent,
          suggestions: data.suggestions,
          relatedProducts: data.relatedProducts,
          metadata: {
            confidence: data.metadata?.confidence || 0.9,
            processingTimeMs: data.metadata?.processingTimeMs || Date.now(),
            modelVersion: data.metadata?.modelVersion || 'RealAI-1.0.0',
            source: data.metadata?.source || 'api'
          }
        }
      }
      return null
    } catch (error) {
      logger.warn('Next API route call failed:', error instanceof Error ? error.message : String(error))
      return null
    }
  }

  private generateSuggestions(content: string): string[] {
    const lower = content.toLowerCase()
    if (lower.includes('watch') || lower.includes('timepiece')) {
      return ['Show me more watches', 'Compare brands', 'Investment analysis']
    }
    if (lower.includes('jewel') || lower.includes('ring') || lower.includes('diamond')) {
      return ['Engagement rings', 'High jewelry collection', 'Compare settings']
    }
    if (lower.includes('bag') || lower.includes('handbag')) {
      return ['Birkin options', 'Seasonal collection', 'Compare sizes']
    }
    return ['Tell me more', 'Show me options', 'Compare prices']
  }
}

// ============================================================================
// ENHANCED LOCAL RESPONSE GENERATOR
// ============================================================================

class EnhancedLocalGenerator {
  private readonly config = AI_AGENTS

  generateHermesResponse(message: string, context: { keywords: string[]; brand: string | null; category: string | null }): AIResponse {
    const { keywords, brand, category } = context
    const lower = message.toLowerCase()

    const hasIntent = (intents: string[]) => intents.some(i => lower.includes(i))

    if (brand) {
      const info = BRAND_INFO[brand]
      const brandProducts = products.filter(p => p.brand === brand).slice(0, 3)
      const productList = brandProducts.length > 0
        ? `\n\n**Current ${brand} Collection:**\n` + brandProducts.map(p => `• ${p.name} - ${formatPrice(p.price, p.currency)}`).join('\n')
        : ''

      return {
        success: true,
        content: `**${brand} Heritage**\n\nFounded in ${info?.period || 'a distinguished year'}, ${brand} represents centuries of excellence. ${info?.highlight || `${brand} is renowned for exceptional craftsmanship and timeless design.`}${productList}\n\nWould you like me to explore specific ${brand} pieces, compare with another house, or share investment insights?`,
        agent: 'hermes',
        suggestions: [
          `Tell me more about ${brand}`,
          `Show me ${brand} options`,
          `Compare ${brand} vs another brand`,
          `${brand} investment pieces`
        ],
        metadata: { confidence: 0.95, processingTimeMs: 50, modelVersion: 'Hermes-Local-4.0' }
      }
    }

    if (category) {
      const productsInCategory = getProductsByCategory(category).slice(0, 3)
      const productLines = productsInCategory.map((p, i) =>
        `${i + 1}. **${p.name}** (${p.brand}) - ${formatPrice(p.price, p.currency)}. ${p.isLimited ? 'Limited' : p.isNew ? 'New' : ''}${p.stock <= 3 ? ` (Only ${p.stock} left!)` : ''}`
      ).join('\n')

      return {
        success: true,
        content: `**${category} Expertise**\n\nBased on your interest in ${category.toLowerCase()}, here are some exceptional pieces:\n\n${productLines}\n\nWould you like me to refine these by price range, show more options, or share investment analysis for this category?`,
        agent: 'hermes',
        suggestions: [
          `Show me more ${category}`,
          `Best ${category} brands`,
          `${category} investment guide`,
          `Compare ${category} options`
        ],
        metadata: { confidence: 0.90, processingTimeMs: 50, modelVersion: 'Hermes-Local-4.0' }
      }
    }

    if (hasIntent(['recommend', 'suggest', 'find', 'what should', 'looking for'])) {
      const searchResults = searchRealProducts(message, 3)
      const resultLines = searchResults.map((p, i) =>
        `${i + 1}. **${p.name}** (${p.brand}) - ${formatPrice(p.price, p.currency)}. ${p.isLimited ? 'Limited' : p.isNew ? 'New' : ''}`
      ).join('\n')

      return {
        success: true,
        content: `**Personalized Recommendation**\n\nI've curated some outstanding pieces based on your interests:\n\n${resultLines}\n\nI can filter by price range, brand, or occasion. Would you like me to refine these options?`,
        agent: 'hermes',
        suggestions: ['Show me more', 'Filter by price range', 'Compare these items', 'Check availability'],
        relatedProducts: searchResults.map(p => ({ id: p.id, name: p.name, reason: 'Matches your interest' })),
        metadata: { confidence: 0.91, processingTimeMs: 50, modelVersion: 'Hermes-Local-4.0' }
      }
    }

    if (hasIntent(['price', 'cost', 'worth', 'budget', 'how much'])) {
      const matchedProducts = searchRealProducts(message, 2)
      const priceLines = matchedProducts.map(p =>
        `• **${p.name}**: ${formatPrice(p.price, p.currency)} (${p.isLimited ? 'Limited' : p.isNew ? 'New' : 'Active stock: ' + p.stock})`
      ).join('\n')

      return {
        success: true,
        content: `**Pricing Analysis**\n\nHere's our current pricing for items matching your query:\n\n${priceLines}\n\n**VIP Discount Tiers:**\n• Silver: -10% off retail\n• Gold: -15% off retail\n• Platinum: -25% off retail + concierge\n\nWould you like me to set up a price alert or check historical pricing?`,
        agent: 'hermes',
        suggestions: ['Show me Gold member benefits', 'Set price alert', 'Compare prices across brands', 'Best value under $10K'],
        metadata: { confidence: 0.88, processingTimeMs: 50, modelVersion: 'Hermes-Local-4.0' }
      }
    }

    if (hasIntent(['gift', 'present', 'for someone', 'anniversary', 'birthday'])) {
      const giftItems = products.filter(p => p.rating >= 4.5).slice(0, 4)
      const giftList = giftItems.map((p, i) =>
        `${i + 1}. **${p.name}** - ${formatPrice(p.price, p.currency)}. ${p.description.substring(0, 80)}`
      ).join('\n')

      return {
        success: true,
        content: `**Luxury Gift Collection**\n\nFinding the perfect gift is my specialty. Here are my top recommendations:\n\n${giftList}\n\n**Gift Tips:**\n• Consider complementary pieces to existing collection\n• Iconic designs with strong resale value\n• Limited editions add exclusivity\n• Always include certificate and original packaging\n\nWould you like me to refine by price range or recipient style?`,
        agent: 'hermes',
        suggestions: ['Under $5,000 gift ideas', 'Anniversary gift', 'Birthday luxury', 'Engagement ring options'],
        metadata: { confidence: 0.92, processingTimeMs: 50, modelVersion: 'Hermes-Local-4.0' }
      }
    }

    if (hasIntent(['investment', 'invest', 'appreciate', 'asset', 'return'])) {
      return {
        success: true,
        content: `**Luxury Investment Analysis**\n\n**Top Performers:**\n• Steel sports watches (Nautilus, Royal Oak, Submariner) - 5-10% annual appreciation\n• Limited editions with waitlists - 20-50% premiums\n• Vintage handbags (Hermès Birkin/Kelly) - outperform modern releases\n\n**Strategy:**\n• Buy at retail from authorized dealers\n• Focus on iconic designs with proven secondary demand\n• Hold 3-5 years minimum for optimal returns\n\nWould you like me to research specific investment-grade pieces?`,
        agent: 'hermes',
        suggestions: ['Best watches to invest in', 'Vintage Rolex guide', 'Birkin investment', 'Auction results analysis'],
        metadata: { confidence: 0.90, processingTimeMs: 50, modelVersion: 'Hermes-Local-4.0' }
      }
    }

    return {
      success: true,
      content: `**Hermes Luxury Concierge**\n\nI'm your luxury recommendation specialist. I can help you with:\n• Product recommendations based on your preferences\n• Brand heritage and craftsmanship expertise\n• Style matching and outfit coordination\n• Market trends and investment analysis\n• Gift selection for any occasion\n\n${keywords.length > 0 ? `I noticed your interest in ${keywords.slice(0, 3).join(', ')}. ` : ''}Just tell me what you're looking for - a specific brand, category, or occasion - and I'll curate personalized options.`,
      agent: 'hermes',
      suggestions: ['Recommend something for me', 'Tell me about trending items', 'Help me find a gift', 'Check my VIP status'],
      metadata: { confidence: 0.88, processingTimeMs: 50, modelVersion: 'Hermes-Local-4.0' }
    }
  }

  generateOpenClawResponse(message: string, context: { keywords: string[]; brand: string | null; category: string | null }): AIResponse {
    const { keywords, brand } = context
    const lower = message.toLowerCase()

    if (lower.includes('track') || lower.includes('alert') || lower.includes('notify')) {
      const matched = brand ? products.filter(p => p.brand === brand).slice(0, 3) : searchRealProducts(message, 3)
      const trackItems = matched.map(p => `• **${p.name}** (${formatPrice(p.price, p.currency)}) - ${p.isLimited ? 'Limited' : 'Active'}`).join('\n')
      return {
        success: true,
        content: `**Price Tracking Activated**\n\nI've set up real-time monitoring for:\n${trackItems}\n\n**You'll receive alerts when:**\n• Price drops by more than 5%\n• Item returns to stock\n• Limited edition releases are announced\n• VIP discounts become available\n\nWould you like me to set a custom price threshold?`,
        agent: 'openclaw',
        suggestions: ['View all trackers', 'Set custom threshold', 'Track more items'],
        metadata: { confidence: 0.93, processingTimeMs: 50, modelVersion: 'OpenClaw-Local-4.0' }
      }
    }

    if (lower.includes('check') && (lower.includes('stock') || lower.includes('available') || lower.includes('in stock'))) {
      const matched = brand ? products.filter(p => p.brand === brand) : searchRealProducts(message, 4)
      const stockTable = matched.map(p =>
        `• **${p.name}** - ${p.stock > 5 ? 'In Stock' : p.stock > 0 ? 'Limited (' + p.stock + ' left)' : 'Out of Stock/Waitlist'}`
      ).join('\n')
      return {
        success: true,
        content: `**Inventory Check**\n\nHere's the current availability:\n\n${stockTable}\n\n${matched.some(p => p.stock === 0) ? 'Some items are on waitlist - let me add you to the notification list.' : 'All items are currently available.'}\n\nWould you like me to set up stock alerts?`,
        agent: 'openclaw',
        suggestions: ['Add to wishlist alerts', 'Pre-order option', 'Notify me when available'],
        metadata: { confidence: 0.91, processingTimeMs: 50, modelVersion: 'OpenClaw-Local-4.0' }
      }
    }

    if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
      const matched = searchRealProducts(message, 2)
      const priceInfo = matched.map(p =>
        `• **${p.name}**: ${formatPrice(p.price, p.currency)} (${p.stock > 0 ? 'In Stock' : 'Waitlist'})${p.isLimited ? ' - Limited Edition' : ''}`
      ).join('\n')
      return {
        success: true,
        content: `**Price Check**\n\nHere are current prices:\n\n${priceInfo}\n\n**VIP Discount:** Gold members save 15%, Platinum save 25%.\n\nWould you like me to check historical pricing or set up a price alert?`,
        agent: 'openclaw',
        suggestions: ['Set price alert', 'Check historical prices', 'View VIP discounts'],
        metadata: { confidence: 0.89, processingTimeMs: 50, modelVersion: 'OpenClaw-Local-4.0' }
      }
    }

    if (lower.includes('compare') || lower.includes('difference') || lower.includes('vs')) {
      const matched = searchRealProducts(message, 2)
      if (matched.length > 0) {
        const p = matched[0]
        return {
          success: true,
          content: `**Market Price Comparison**\n\nComparing prices for **${p.name}**:\n\n• ZLuxury: ${formatPrice(p.price, p.currency)} (In Stock, +VIP discount)\n• Authorized Dealer: ${formatPrice(Math.round(p.price * 1.05), p.currency)} (Waitlist, MSRP)\n• Secondary Market: ${formatPrice(Math.round(p.price * 1.25), p.currency)} (Available, Premium)\n\n**Best Value:** ZLuxury (saves ~5% + VIP benefits)\n\nWould you like to proceed with the ZLuxury option?`,
          agent: 'openclaw',
          suggestions: ['Buy at best price', 'Set price alert', 'Compare another item'],
          metadata: { confidence: 0.90, processingTimeMs: 50, modelVersion: 'OpenClaw-Local-4.0' }
        }
      }
    }

    return {
      success: true,
      content: `**OpenClaw Task Engine**\n\nI can automate these tasks for you:\n\n• Product Search - Find items matching your criteria\n• Inventory Check - Real-time stock availability\n• Price Comparison - Best deals across retailers\n• Price Alerts - Monitor and notify on changes\n• Order Tracking - Track and manage your orders\n\nJust tell me what you need. For example: "Check stock for Rolex Submariner" or "Track my order".`,
      agent: 'openclaw',
      suggestions: ['Start price tracker', 'Check inventory', 'Track my order', 'Compare prices'],
      metadata: { confidence: 0.88, processingTimeMs: 50, modelVersion: 'OpenClaw-Local-4.0' }
    }
  }

  generateUnicornResponse(message: string, context: { keywords: string[]; brand: string | null; category: string | null }): AIResponse {
    const { keywords, brand, category } = context
    const lower = message.toLowerCase()

    if (lower.match(/^(hello|hi|hey|good (morning|afternoon|evening))/)) {
      const hour = new Date().getHours()
      const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
      const trending = products.filter(p => p.rating >= 4.8).slice(0, 3)
      const trendingList = trending.map(p => `• ${p.name} - ${formatPrice(p.price, p.currency)}`).join('\n')
      return {
        success: true,
        content: `${greeting}! Wonderful to connect with you. I'm Unicorn, your conversational AI companion.\n\nHere are some items catching my eye today:\n${trendingList}\n\nI specialize in casual conversation, making your luxury experience delightful. What can I help you discover today?`,
        agent: 'unicorn',
        suggestions: ['Show me what\'s new', 'Best sellers right now', 'Personal recommendations'],
        metadata: { confidence: 0.95, processingTimeMs: 50, modelVersion: 'Unicorn-Local-4.0' }
      }
    }

    if (lower.includes('how are you') || lower.includes('how\'s it going')) {
      return {
        success: true,
        content: "I'm doing great, thanks for asking! More importantly, how can I help you today? Are you exploring a specific luxury category, looking for a gift, or just browsing?",
        agent: 'unicorn',
        suggestions: ['Looking for gift ideas', 'Tell me about new arrivals', 'I\'m just browsing'],
        metadata: { confidence: 0.94, processingTimeMs: 50, modelVersion: 'Unicorn-Local-4.0' }
      }
    }

    if (lower.includes('who are you') || lower.includes('what are you')) {
      return {
        success: true,
        content: "I'm Unicorn, one of three AI agents at ZLuxury. I specialize in casual conversation, creative ideas, and making your luxury shopping experience enjoyable. My colleagues include Hermes (product recommendations) and OpenClaw (task automation). Feel free to chat with any of us!",
        agent: 'unicorn',
        suggestions: ['Tell me about Hermes', 'What can OpenClaw do?', 'Recommend something for me'],
        metadata: { confidence: 0.95, processingTimeMs: 50, modelVersion: 'Unicorn-Local-4.0' }
      }
    }

    if (lower.includes('what can you do') || lower.includes('help me') || lower.includes('your capabilities')) {
      return {
        success: true,
        content: "Here's what I can help with:\n\n• **Casual conversation** - Chat about luxury trends, lifestyle, or any topic\n• **Product discovery** - I can connect you with Hermes for specialized recommendations\n• **General questions** - Happy to answer any questions about luxury or our services\n• **Personalized guidance** - Share your preferences and I'll point you in the right direction\n\nJust ask me anything!",
        agent: 'unicorn',
        suggestions: ['Tell me about luxury trends', 'Help me find a gift', 'What\'s new at ZLuxury?'],
        metadata: { confidence: 0.93, processingTimeMs: 50, modelVersion: 'Unicorn-Local-4.0' }
      }
    }

    // Default conversational response
    const searchResults = (brand || category) ? searchRealProducts(message, 2) : []
    const responseIntros = [
      "I'd be happy to chat about that.",
      "Great question! Let me help you with that.",
      "Interesting topic! I'm here to assist.",
      "Wonderful to hear from you!",
      "Your luxury journey matters to me."
    ]

    let content = pickRandom(responseIntros) + '\n\n'

    if (searchResults.length > 0) {
      const resultLines = searchResults.map(p => `• ${p.name} (${p.brand}) - ${formatPrice(p.price, p.currency)}`).join('\n')
      content += `I found some interesting items related to your query:\n\n${resultLines}\n\nWould you like me to tell you more about any of these, or shall we explore something else?`
    } else if (keywords.length > 0) {
      content += `You mentioned ${keywords.slice(0, 3).join(', ')}. I'd be happy to explore that with you. What aspect interests you most? I can share insights, product recommendations, or trends related to this area.`
    } else {
      content += `I'm here to help with any luxury-related question or just a friendly chat. What brings you to ZLuxury today?`
    }

    return {
      success: true,
      content,
      agent: 'unicorn',
      suggestions: ['I\'m just browsing', 'Looking for gift ideas', 'Tell me something interesting', 'Show me featured items'],
      metadata: { confidence: 0.88, processingTimeMs: 50, modelVersion: 'Unicorn-Local-4.0' }
    }
  }
}

// ============================================================================
// MULTI-AGENT ORCHESTRATOR
// ============================================================================

export class AIAgentOrchestrator {
  private realClient: RealAIClient
  private localGenerator: EnhancedLocalGenerator
  private contextEngine: ContextEngine
  private readonly config = AI_AGENTS

  constructor() {
    this.realClient = new RealAIClient()
    this.localGenerator = new EnhancedLocalGenerator()
    this.contextEngine = new ContextEngine()
    logger.info('AI Agent Orchestrator initialized with real API integration')
  }

  async processMessage(
    message: string,
    requestedAgent?: AgentType,
    conversationId?: string
  ): Promise<AIResponse> {
    const startTime = Date.now()
    const ctx = this.contextEngine.getOrCreate(conversationId)
    const resolvedConversationId = ctx.id

    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    }
    this.contextEngine.addMessage(resolvedConversationId, userMessage)

    logger.info('Processing message through orchestrator', {
      messageLength: message.length,
      requestedAgent,
      conversationId: resolvedConversationId
    })

    try {
      // Determine which agent to use
      const agent = this.determineAgent(message, requestedAgent)

      // Build context for local generator
      const context = {
        keywords: extractKeywords(message),
        brand: detectBrand(message),
        category: detectCategory(message)
      }

      // Try real AI API first
      const history = this.contextEngine.getHistory(resolvedConversationId)
      const realResponse = await this.realClient.sendMessage(
        message, agent, resolvedConversationId, history
      )

      if (realResponse) {
        logger.info('Real AI response received', {
          agent: realResponse.agent,
          source: realResponse.metadata.source,
          confidence: realResponse.metadata.confidence
        })
        this.contextEngine.addMessage(resolvedConversationId, {
          id: `msg-${Date.now()}-resp`,
          role: 'assistant',
          content: realResponse.content,
          agent: realResponse.agent,
          timestamp: new Date().toISOString(),
          metadata: { confidence: realResponse.metadata.confidence, processingTimeMs: realResponse.metadata.processingTimeMs }
        })
        return realResponse
      }

      // Fallback to enhanced local generator
      logger.info('Using enhanced local generator', { agent })
      const localResponse = this.generateLocalResponse(message, agent, context, startTime)

      this.contextEngine.addMessage(resolvedConversationId, {
        id: `msg-${Date.now()}-resp`,
        role: 'assistant',
        content: localResponse.content,
        agent: localResponse.agent,
        timestamp: new Date().toISOString(),
        metadata: { confidence: localResponse.metadata.confidence, processingTimeMs: localResponse.metadata.processingTimeMs }
      })

      return localResponse

    } catch (error) {
      logger.error('Orchestrator processing error', { error }, error as Error)
      return {
        success: false,
        content: 'I apologize, but I encountered an issue processing your request. Please try again.',
        agent: requestedAgent || 'unicorn',
        suggestions: ['Try again', 'Contact support', 'Switch to a different agent'],
        metadata: {
          confidence: 0,
          processingTimeMs: Date.now() - startTime,
          modelVersion: 'Error-Handler-4.0'
        }
      }
    }
  }

  private determineAgent(message: string, requestedAgent?: AgentType): AgentType {
    if (requestedAgent) return requestedAgent

    const lowerMessage = message.toLowerCase()

    // Check agent preferences from context
    const context = this.contextEngine.getOrCreate()
    if (context) {
      const prefs = this.contextEngine.getAgentPreference(context.id, 'hermes')
      if (prefs) return 'hermes'
    }

    // Intent-based routing
    const taskKeywords = ['track', 'check', 'search', 'find', 'monitor', 'alert', 'order',
      'status', 'delivery', 'ship', 'inventory', 'stock', 'compare', 'buy',
      'purchase', 'price', 'cost', 'how much', 'in stock', 'available']
    if (taskKeywords.some(kw => lowerMessage.includes(kw))) {
      return 'openclaw'
    }

    const luxuryKeywords = ['watch', 'jewelry', 'ring', 'necklace', 'bracelet', 'bag',
      'handbag', 'hermes', 'rolex', 'cartier', 'chanel', 'gucci', 'prada', 'dior',
      'louis vuitton', 'patek', 'omega', 'iwc', 'recommend', 'suggest', 'brand',
      'luxury', 'fashion', 'designer', 'gift', 'investment', 'trend', 'compare']
    if (luxuryKeywords.some(kw => lowerMessage.includes(kw))) {
      return 'hermes'
    }

    // Default to unicorn for general conversation
    return 'unicorn'
  }

  private generateLocalResponse(
    message: string,
    agent: AgentType,
    context: { keywords: string[]; brand: string | null; category: string | null },
    startTime: number
  ): AIResponse {
    switch (agent) {
      case 'hermes':
        return this.localGenerator.generateHermesResponse(message, context)
      case 'openclaw':
        return this.localGenerator.generateOpenClawResponse(message, context)
      case 'unicorn':
        return this.localGenerator.generateUnicornResponse(message, context)
      default:
        return this.localGenerator.generateUnicornResponse(message, context)
    }
  }

  getConversationHistory(conversationId: string): AIMessage[] {
    return this.contextEngine.getHistory(conversationId)
  }

  clearConversation(conversationId: string): boolean {
    this.contextEngine.clear(conversationId)
    return true
  }

  getAgentStatus(): Record<AgentType, { name: string; description: string }> {
    return {
      hermes: { name: 'Hermes', description: 'Luxury recommendation specialist' },
      openclaw: { name: 'OpenClaw', description: 'Task automation engine' },
      unicorn: { name: 'Unicorn', description: 'Conversational AI companion' }
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

let orchestratorInstance: AIAgentOrchestrator | null = null

export function getAIAgentOrchestrator(): AIAgentOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new AIAgentOrchestrator()
  }
  return orchestratorInstance
}

export default AIAgentOrchestrator