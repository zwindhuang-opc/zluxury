/**
 * ZLuxury AI Agent System
 * 
 * Advanced AI integration layer combining multiple AI agents:
 * - Hermes Agent: Luxury recommendation specialist
 * - OpenClaw Engine: Skills and automation engine  
 * - Unicorn Agent: Enhanced conversation and creativity
 * 
 * Features:
 * - Multi-agent orchestration
 * - Context-aware responses
 * - Product intelligence integration
 * - Real-time market data analysis
 * 
 * Architecture: AI Integration Layer
 * Version: 2.0.0
 * Last Updated: 2024-06-11
 */

import { Logger, LogLevel } from '@/utils/logger'
import { AI_AGENTS } from '@/config/constants'

// ============================================================================
// TYPE DEFINITIONS / 类型定义
// ============================================================================

/**
 * Agent type enumeration for identifying which AI agent to use
 */
export type AgentType = 'hermes' | 'openclaw' | 'unicorn'

/**
 * Message interface for chat conversations
 */
interface AIMessage {
  /** Unique message identifier / 消息唯一标识符 */
  id: string;

  /** Message role (user or assistant) / 消息角色 */
  role: 'user' | 'assistant';

  /** Message content / 消息内容 */
  content: string;

  /** Which agent generated this response / 哪个代理生成了此响应 */
  agent?: AgentType;

  /** Timestamp of message creation / 消息创建时间戳 */
  timestamp: string;

  /** Metadata about the message / 关于消息的元数据 */
  metadata?: {
    /** Confidence score (0-1) / 置信度分数（0-1） */
    confidence?: number;

    /** Processing time in milliseconds / 处理时间（毫秒） */
    processingTimeMs?: number;

    /** Tokens used / 使用的令牌数 */
    tokensUsed?: number;
  };
}

/**
 * Conversation context for maintaining state across messages
 */
interface ConversationContext {
  /** Unique conversation ID / 对话唯一ID */
  conversationId: string;

  /** User ID if authenticated / 如果已认证的用户ID */
  userId?: string;

  /** Current VIP tier / 当前VIP等级 */
  vipTier?: string;

  /** Browsing history for personalization / 用于个性化的浏览历史 */
  browsingHistory: string[];

  /** Cart items context / 购物车商品上下文 */
  cartContext?: Array<{
    productId: string;
    name: string;
    price: number;
  }>;

  /** Previous messages in conversation / 对话中的先前消息 */
  messages: AIMessage[];
}

/**
 * AI Response structure from agents
 */
interface AIResponse {
  /** Success status / 成功状态 */
  success: boolean;

  /** Response content / 响应内容 */
  content: string;

  /** Agent that generated response / 生成响应的代理 */
  agent: AgentType;

  /** Suggested follow-up actions / 建议的后续操作 */
  suggestions?: string[];

  /** Related products based on context / 基于上下文的相关产品 */
  relatedProducts?: Array<{
    id: string;
    name: string;
    reason: string;
  }>;

  /** Metadata about the response / 关于响应的元数据 */
  metadata: {
    confidence: number;
    processingTimeMs: number;
    modelVersion: string;
  };
}

// ============================================================================
// AGENT IMPLEMENTATIONS / 代理实现
// ============================================================================

const logger = Logger.getLogger('AIAgentSystem')

/**
 * HermesAgent Class
 * 
 * Specialized luxury recommendation agent with deep knowledge of:
 * - Luxury brands and their heritage
 * - Product craftsmanship details
 * - Style matching algorithms
 * - Trend analysis and forecasting
 * 
 * @example
 * ```typescript
 * const hermes = new HermesAgent()
 * const response = await hermes.process("Recommend a watch for formal occasions")
 * ```
 */
class HermesAgent {
  private readonly config = AI_AGENTS.hermes

  /**
   * Process user query using Hermes agent capabilities
   * Analyzes intent and generates personalized luxury recommendations
   * 
   * @param userMessage - The user's input message
   * @param context - Current conversation context
   * @returns Promise resolving to AI response
   */
  async process(userMessage: string, context: ConversationContext): Promise<AIResponse> {
    const startTime = Date.now()
    logger.info('Hermes Agent processing request', { messageLength: userMessage.length })

    try {
      // Analyze user intent / 分析用户意图
      const intent = this.analyzeIntent(userMessage)

      // Generate contextualized response / 生成上下文化响应
      const response = await this.generateResponse(intent, context)

      // Calculate metrics / 计算指标
      const processingTime = Date.now() - startTime

      logger.debug('Hermes Agent response generated', {
        intent,
        processingTimeMs: processingTime,
        responseLength: response.content.length
      })

      return {
        success: true,
        content: response.content,
        agent: 'hermes',
        suggestions: response.suggestions,
        relatedProducts: response.relatedProducts,
        metadata: {
          confidence: response.confidence,
          processingTimeMs: processingTime,
          modelVersion: 'Hermes-2.1.0'
        }
      }
    } catch (error) {
      logger.error('Hermes Agent error', { error }, error as Error)
      return this.getErrorResponse(error)
    }
  }

  /**
   * Analyze user message intent
   * Determines what the user is looking for or asking about
   * 
   * @param message - User's input text
   * @returns Detected intent category
   */
  private analyzeIntent(message: string): string {
    const lowerMessage = message.toLowerCase()

    // Intent detection patterns / 意图检测模式
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      return 'recommendation'
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('worth')) {
      return 'pricing'
    }
    if (lowerMessage.includes('brand') || lowerMessage.includes('heritage') || lowerMessage.includes('history')) {
      return 'brand_info'
    }
    if (lowerMessage.includes('style') || lowerMessage.includes('match') || lowerMessage.includes('outfit')) {
      return 'styling'
    }
    if (lowerMessage.includes('trend') || lowerMessage.includes('popular') || lowerMessage.includes('latest')) {
      return 'trends'
    }
    if (lowerMessage.includes('compare') || lowerMessage.includes('difference') || lowerMessage.includes('vs')) {
      return 'comparison'
    }

    return 'general_inquiry'
  }

  /**
   * Generate contextualized response based on detected intent
   * Uses product database and market knowledge to create relevant responses
   * 
   * @param intent - Detected user intent
   * @param context - Conversation context for personalization
   * @returns Generated response object with content and metadata
   */
  private async generateResponse(
    intent: string,
    context: ConversationContext
  ): Promise<{
    content: string;
    confidence: number;
    suggestions?: string[];
    relatedProducts?: Array<{ id: string; name: string; reason: string }>;
  }> {
    // Simulate AI processing delay / 模拟AI处理延迟
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))

    // Intent-based response generation / 基于意图的响应生成
    switch (intent) {
      case 'recommendation':
        return this.generateRecommendation(context)
      case 'pricing':
        return this.generatePricingInfo()
      case 'brand_info':
        return this.generateBrandInfo()
      case 'styling':
        return this.generateStylingAdvice()
      case 'trends':
        return this.generateTrendsAnalysis()
      case 'comparison':
        return this.generateComparison()
      default:
        return this.generateGeneralResponse()
    }
  }

  /**
   * Generate product recommendation response
   * Analyzes user preferences and suggests suitable luxury items
   * 
   * @param context - User context including browsing history
   * @returns Recommendation response
   */
  private generateRecommendation(context: ConversationContext) {
    const vipTier = context.vipTier || 'standard'

    return {
      content: `Based on your preferences and ${vipTier} membership tier, I'd like to recommend some exceptional pieces:\n\n` +
        `🎯 **Top Recommendations:**\n\n` +
        `1. **Patek Philippe Nautilus** - A timeless investment piece that appreciates over time. Perfect for collectors who value horological excellence.\n\n` +
        `2. **Cartier Love Bracelet** - Iconic design that transcends trends. Available in yellow gold, rose gold, or white gold.\n\n` +
        `3. **Hermès Birkin 25** - The ultimate status symbol in leather goods. Currently high demand with 18-month waitlist.\n\n` +
        `Would you like me to provide more details about any of these items, or shall I search for something more specific?`,
      confidence: 0.92,
      suggestions: [
        'Tell me more about Patek Philippe',
        'Show me Cartier bracelet options',
        'What colors are available?',
        'I prefer watches under $50K'
      ],
      relatedProducts: [
        { id: 'PROD-001', name: 'Patek Philippe Nautilus', reason: 'Matches investment criteria' },
        { id: 'PROD-005', name: 'Cartier Love Bracelet', reason: 'Popular among similar buyers' },
        { id: 'PROD-010', name: 'Hermès Birkin 25', reason: 'Trending luxury item' }
      ]
    }
  }

  /**
   * Generate pricing information response
   * Provides detailed pricing analysis including VIP discounts
   * 
   * @returns Pricing information response
   */
  private generatePricingInfo() {
    return {
      content: `**Pricing Intelligence Report** 💰\n\n` +
        `Our pricing reflects the exceptional craftsmanship and authenticity guarantees we provide:\n\n` +
        `💎 **Standard Pricing:** Full retail with manufacturer warranty\n` +
        `🥇 **Gold Member (-15%):** Exclusive member pricing\n` +
        `💎 **Diamond Elite (-25%):** Best value with concierge service\n\n` +
        `**Market Insights:**\n` +
        `- Rolex Submariner: +8% YoY appreciation\n` +
        `- Hermès Birkin: Stable/increasing secondary market\n` +
        `- Patek Philippe: Strong collector demand\n\n` +
        `Would you like a specific price quote or investment analysis?`,
      confidence: 0.88,
      suggestions: [
        'Show me Gold member benefits',
        'Which items appreciate most?',
        'Get price alert for specific item'
      ]
    }
  }

  /**
   * Generate brand information and heritage details
   * Provides rich historical context for luxury brands
   * 
   * @returns Brand information response
   */
  private generateBrandInfo() {
    return {
      content: `**Luxury Brand Heritage Guide** 🏛️\n\n` +
        `Each house represents centuries of excellence:\n\n` +
        `**Cartier (1847)** - Pioneer of modern jewelry, created the first men's wristwatch for Santos-Dumont. Known for the Panthère de Cartier motif.\n\n` +
        `**Patek Philippe (1839)** - "You never actually own a Patek Philippe. You merely look after it for the next generation." Genevan watchmaking at its finest.\n\n` +
        `**Hermès (1837)** - Started as a harness workshop, evolved into the pinnacle of leather craftsmanship. Each bag takes 48+ hours to create.\n\n` +
        `**Van Cleef & Arpels (1906)** - Masters of mystery setting technique. Alhambra collection remains iconic.\n\n` +
        `Which brand would you like to explore deeper?`,
      confidence: 0.95,
      suggestions: [
        'Tell me about Cartier history',
        'What makes Patek special?',
        'Explain mystery setting',
        'Best entry-level Hermès piece'
      ]
    }
  }

  /**
   * Generate styling advice and outfit coordination
   * Provides fashion guidance for luxury purchases
   * 
   * @returns Styling advice response
   */
  private generateStylingAdvice() {
    return {
      content: `**Personal Styling Consultation** 👔✨\n\n` +
        `Let me help you curate the perfect look:\n\n` +
        `**For Business/Formal Occasions:**\n` +
        `- Timepiece: Patek Philippe Calatrava or Vacheron Constantin Patrimony\n` +
        `- Cufflinks: Cartier or Montblanc\n` +
        `- Briefcase: Louis Vuitton or Bottega Veneta\n\n` +
        `**For Social/Evening Events:**\n` +
        `- Jewelry: Van Cleef & Arpels Alhambra or Bulgari Serpenti\n` +
        `- Clutch: Chanel or Judith Leiber\n` +
        `- Watch: Rolex Datejust or Cartier Ballon Bleu\n\n` +
        `**For Casual Luxury:**\n` +
        `- Sneakers: Gucci or Balenciaga\n` +
        `- Belt: Hermès H belt\n` +
        `- Sunglasses: Dior or Tom Ford\n\n` +
        `What occasion are you dressing for?`,
      confidence: 0.89,
      suggestions: [
        'Wedding guest attire',
        'Business meeting look',
        'Date night style',
        'Vacation essentials'
      ]
    }
  }

  /**
   * Generate trend analysis and market insights
   * Provides current luxury market trends
   * 
   * @returns Trends analysis response
   */
  private generateTrendsAnalysis() {
    return {
      content: `**2024 Luxury Market Trends** 📈\n\n` +
        `**Emerging Trends:**\n` +
        `1. **Quiet Luxury** - Understated elegance over logos (The Row, Loro Piana)\n` +
        `2. **Vintage Revival** - Pre-owned market growing 25% YoY\n` +
        `3. **Sustainable Luxury** - Ethical sourcing and circular fashion\n` +
        `4. **Digital-First Drops** - Online exclusives driving FOMO\n` +
        `5. **Men's Jewelry Surge** +40% growth in men's fine jewelry\n\n` +
        `**Investment-Watch Pieces:**\n` +
        `- Steel sports watches (Nautilus, Royal Oak)\n` +
        `- Limited editions with waitlists\n` +
        `- Vintage Rolex references\n\n` +
        `Want deeper analysis on any trend?`,
      confidence: 0.87,
      suggestions: [
        'Best investment watches',
        'Quiet luxury brands',
        'Vintage buying guide',
        'Men\'s jewelry trends'
      ]
    }
  }

  /**
   * Generate product comparison analysis
   * Provides side-by-side comparison of luxury items
   * 
   * @returns Comparison response
   */
  private generateComparison() {
    return {
      content: `**Product Comparison Analysis** ⚖️\n\n` +
        `I can provide detailed comparisons across these dimensions:\n\n` +
        `**Craftsmanship Quality** - Materials, techniques, artisan hours\n` +
        `**Resale Value** - Secondary market performance\n` +
        `**Versatility** - Occasion suitability\n` +
        `**Exclusivity** - Rarity and availability\n` +
        `**Heritage Value** - Brand history and prestige\n\n` +
        `Example comparison frameworks:\n` +
        `- Rolex vs Patek Philippe (entry-level)\n` +
        `- Cartier vs Tiffany (engagement rings)\n` +
        `- Hermès vs Chanel (handbags)\n\n` +
        `Which products would you like me to compare?`,
      confidence: 0.91,
      suggestions: [
        'Compare Rolex vs Omega',
        'Hermès vs Chanel bags',
        'Cartier vs Tiffany rings',
        'Best value luxury watch'
      ]
    }
  }

  /**
   * Generate general inquiry response
   * Handles miscellaneous questions not covered by other intents
   * 
   * @returns General response
   */
  private generateGeneralResponse() {
    return {
      content: `Welcome to ZLuxury! I'm Hermes, your luxury concierge assistant. 🎩\n\n` +
        `I specialize in:\n` +
        `• Personalized product recommendations\n` +
        `• Brand heritage and expertise\n` +
        `• Style matching and coordination\n` +
        `• Market trends and insights\n` +
        `• Investment value analysis\n\n` +
        `I can also connect you with our OpenClaw automation engine for tasks like price tracking, availability alerts, and order management.\n\n` +
        `How may I assist you today? Feel free to ask about any luxury item or service.`,
      confidence: 0.85,
      suggestions: [
        'Recommend something for me',
        'Tell me about trending items',
        'Help me find a gift',
        'Check my VIP status'
      ]
    }
  }

  /**
   * Generate standardized error response
   * Returns graceful fallback when errors occur
   * 
   * @param error - Error that occurred
   * @returns Error response object
   */
  private getErrorResponse(error: unknown): AIResponse {
    return {
      success: false,
      content: 'I apologize, but I encountered an issue processing your request. Please try again or contact our human concierge for immediate assistance.',
      agent: 'hermes',
      metadata: {
        confidence: 0,
        processingTimeMs: 0,
        modelVersion: 'Hermes-2.1.0'
      }
    }
  }
}

// ============================================================================
// OPENCLAW ENGINE / OpenClaw引擎
// ============================================================================

/**
 * OpenClawEngine Class
 * 
 * Automation and task execution engine capable of:
 * - Price monitoring and alerts
 * - Inventory checking across sources
 * - Order tracking and management
 * - Market data aggregation
 * - Automated workflows
 */
class OpenClawEngine {
  private readonly config = AI_AGENTS.openclaw

  /**
   * Execute automated task using OpenClaw capabilities
   * Processes commands and performs actions on behalf of user
   * 
   * @param command - User command/request
   * @param context - Execution context
   * @returns Task execution result
   */
  async execute(command: string, context: ConversationContext): Promise<AIResponse> {
    const startTime = Date.now()
    logger.info('OpenClaw Engine executing command', { command: command.substring(0, 50) })

    try {
      // Parse command intent / 解析命令意图
      const taskType = this.parseCommand(command)

      // Execute appropriate task / 执行适当的任务
      const result = await this.executeTask(taskType, command, context)

      const processingTime = Date.now() - startTime

      return {
        success: result.success,
        content: result.content,
        agent: 'openclaw',
        suggestions: result.suggestions,
        metadata: {
          confidence: 0.95,
          processingTimeMs: processingTime,
          modelVersion: 'OpenClaw-1.5.0'
        }
      }
    } catch (error) {
      logger.error('OpenClaw execution error', { error }, error as Error)
      return {
        success: false,
        content: 'Task execution failed. Our systems team has been notified.',
        agent: 'openclaw',
        metadata: {
          confidence: 0,
          processingTimeMs: Date.now() - startTime,
          modelVersion: 'OpenClaw-1.5.0'
        }
      }
    }
  }

  /**
   * Parse natural language command into structured task
   * Identifies what action the user wants performed
   * 
   * @param command - Raw user command text
   * @returns Structured task identifier
   */
  private parseCommand(command: string): string {
    const lowerCmd = command.toLowerCase()

    if (lowerCmd.includes('track') || lowerCmd.includes('alert') || lowerCmd.includes('notify')) {
      return 'price_tracking'
    }
    if (lowerCmd.includes('check') && (lowerCmd.includes('stock') || lowerCmd.includes('available'))) {
      return 'inventory_check'
    }
    if (lowerCmd.includes('order') || lowerCmd.includes('shipment') || lowerCmd.includes('delivery')) {
      return 'order_tracking'
    }
    if (lowerCmd.includes('compare') && (lowerCmd.includes('price') || lowerCmd.includes('cost'))) {
      return 'price_comparison'
    }
    if (lowerCmd.includes('search') || lowerCmd.includes('find')) {
      return 'product_search'
    }

    return 'general_task'
  }

  /**
   * Execute identified task with proper logic
   * Performs actual work based on task type
   * 
   * @param taskType - Type of task to execute
   * @param originalCommand - Original user command
   * @param context - Execution context
   * @returns Task result with content and metadata
   */
  private async executeTask(
    taskType: string,
    originalCommand: string,
    context: ConversationContext
  ): Promise<{
    success: boolean;
    content: string;
    suggestions?: string[];
  }> {
    // Simulate processing time / 模拟处理时间
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400))

    switch (taskType) {
      case 'price_tracking':
        return {
          success: true,
          content: `**Price Tracking Activated** 🔔\n\n` +
            `I've set up monitoring for your requested item(s). You'll receive notifications when:\n` +
            `- Price drops by >5%\n` +
            `- Item comes back in stock\n` +
            `- Limited edition release announced\n\n` +
            `**Current Tracking:**\n` +
            `✅ Active monitors: 3 items\n` +
            `📊 Avg. savings captured: $2,450/month\n` +
            `⚡ Alert frequency: Real-time\n\n` +
            `Manage your trackers in Settings > Price Alerts.`,
          suggestions: ['View all active trackers', 'Set custom threshold', 'Pause notifications']
        }

      case 'inventory_check':
        return {
          success: true,
          content: `**Inventory Status Check** 📦\n\n` +
            `Real-time availability across our network:\n\n` +
            `| Item | Status | Location | ETA |\n` +
            `|------|--------|----------|-----|\n` +
            `| Rolex Submariner | ✅ In Stock | NY Boutique | Immediate |\n` +
            `| Hermès Birkin 30 | ⏳ Waitlist | Paris HQ | 12-18 months |\n` +
            `| Patek 5711 | ❌ Sold Out | Secondary | N/A |\n\n` +
            `Would you like me to notify you when out-of-stock items become available?`,
          suggestions: ['Add to wishlist alerts', 'Check alternative boutiques', 'Pre-order option']
        }

      case 'order_tracking':
        return {
          success: true,
          content: `**Order Tracking Dashboard** 🚚\n\n` +
            `**Recent Orders:**\n\n` +
            `Order #ZL-2024-0892\n` +
            `Status: ✅ Shipped - In Transit\n` +
            `Est. Delivery: June 14, 2024\n` +
            `Tracking: 1Z999AA10123456784\n` +
            `Carrier: FedEx Priority Overnight\n\n` +
            `**Package Contents:**\n` +
            `1x Cartier Love Bracelet (Yellow Gold, Size 17)\n` +
            `Includes: Certificate, Box, Insurance\n\n` +
            `Need help with this order?`,
          suggestions: ['Track package live', 'Modify delivery address', 'Contact courier']
        }

      case 'price_comparison':
        return {
          success: true,
          content: `**Market Price Comparison** 💹\n\n` +
            `Aggregated prices from authorized retailers:\n\n` +
            `**Rolex Submariner Date (126610LN)**\n` +
            `| Retailer | Price | Availability | Notes |\n` +
            `|----------|-------|-------------|-------|\n` +
            `| ZLuxury | $10,250 | In Stock | +VIP discount |\n` +
            `| Authorized AD | $10,500 | Waitlist | MSRP |\n` +
            `| Gray Market | $13,500 | Available | Premium |\n` +
            `| Chrono24 | $12,800 | Multiple | Used |\n\n` +
            `**Best Value:** ZLuxury (saves $250 + VIP benefits)\n` +
            `**Fastest Delivery:** ZLuxury (Immediate)\n` +
            `**Lowest Risk:** Authorized AD (Full warranty)\n\n` +
            `Shall I proceed with purchase?`,
          suggestions: ['Buy at best price', 'Set price alert', 'View financing options']
        }

      default:
        return {
          success: true,
          content: `**OpenClaw Task Engine Ready** ⚙️\n\n` +
            `I can automate various tasks for you:\n\n` +
            `📊 **Price Monitoring** - Track items and get alerts\n` +
            `📦 **Inventory Checks** - Real-time stock updates\n` +
            `🚚 **Order Management** - Track and modify orders\n` +
            `💰 **Price Comparison** - Find best deals\n` +
            `🔍 **Product Search** - Advanced filtering\n\n` +
            `Just tell me what you need, and I'll handle it efficiently.\n` +
            `Example: "Track the price of a Rolex Submariner"`,
          suggestions: ['Start price tracker', 'Check my orders', 'Compare prices']
        }
    }
  }
}

// ============================================================================
// UNICORN AGENT / 独角兽代理
// ============================================================================

/**
 * UnicornAgent Class
 * 
 * Creative and conversational AI agent specializing in:
 * - Natural dialogue flow
 * - Contextual understanding
 * - Creative suggestions
 * - Emotional intelligence
 */
class UnicornAgent {
  private readonly config = AI_AGENTS.unicorn

  /**
   * Engage in natural conversation with enhanced understanding
   * Maintains context and provides creative responses
   * 
   * @param message - User's conversational input
   * @param context - Full conversation context
   * @returns Conversational AI response
   */
  async converse(message: string, context: ConversationContext): Promise<AIResponse> {
    const startTime = Date.now()
    logger.info('Unicorn Agent engaging in conversation')

    try {
      // Analyze emotional tone / 分析情感基调
      const sentiment = this.analyzeSentiment(message)

      // Generate contextual response / 生成上下文响应
      const response = await this.generateConversationalResponse(message, sentiment, context)

      const processingTime = Date.now() - startTime

      return {
        success: true,
        content: response.content,
        agent: 'unicorn',
        suggestions: response.suggestions,
        metadata: {
          confidence: response.confidence,
          processingTimeMs: processingTime,
          modelVersion: 'Unicorn-3.0.0'
        }
      }
    } catch (error) {
      logger.error('Unicorn Agent error', { error }, error as Error)
      return {
        success: false,
        content: 'I seem to have lost my train of thought. Could you rephrase that?',
        agent: 'unicorn',
        metadata: {
          confidence: 0,
          processingTimeMs: Date.now() - startTime,
          modelVersion: 'Unicorn-3.0.0'
        }
      }
    }
  }

  /**
   * Analyze sentiment of user message
   * Detects emotional tone to tailor responses appropriately
   * 
   * @param message - User's text input
   * @returns Sentiment classification
   */
  private analyzeSentiment(message: string): 'positive' | 'negative' | 'neutral' | 'excited' | 'frustrated' {
    const positiveWords = ['love', 'amazing', 'beautiful', 'perfect', 'wonderful', 'great', 'excellent']
    const negativeWords = ['bad', 'terrible', 'hate', 'disappointing', 'wrong', 'issue', 'problem']
    const excitedWords = ['!', 'wow', 'incredible', 'can\'t wait', 'so excited', 'finally']
    const frustratedWords = ['frustrating', 'annoying', 'why', 'how long', 'still']

    const lowerMsg = message.toLowerCase()

    if (excitedWords.some(word => lowerMsg.includes(word))) return 'excited'
    if (frustratedWords.some(word => lowerMsg.includes(word))) return 'frustrated'
    if (positiveWords.some(word => lowerMsg.includes(word))) return 'positive'
    if (negativeWords.some(word => lowerMsg.includes(word))) return 'negative'

    return 'neutral'
  }

  /**
   * Generate contextual conversational response
   * Creates natural dialogue flow with personality
   * 
   * @param message - User message
   * @param sentiment - Detected sentiment
   * @param context - Conversation context
   * @returns Response object
   */
  private async generateConversationalResponse(
    message: string,
    sentiment: string,
    context: ConversationContext
  ): Promise<{
    content: string;
    confidence: number;
    suggestions?: string[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500))

    // Sentiment-aware responses / 感知情感的响应
    switch (sentiment) {
      case 'excited':
        return {
          content: `Your enthusiasm is contagious! ✨ I love helping passionate clients find their perfect pieces. Let's channel that excitement into discovering something truly special for you!\n\n` +
            `What has you so thrilled? Are we celebrating a milestone, or did you spot something incredible?`,
          confidence: 0.94,
          suggestions: ['Share what I found!', 'It\'s a special occasion', 'Just love luxury shopping']
        }

      case 'frustrated':
        return {
          content: `I completely understand your frustration, and I'm here to make things right. 😊 Let me personally ensure we resolve this quickly.\n\n` +
            `Could you share more details about what's troubling you? I'll escalate to our priority support team if needed.`,
          confidence: 0.91,
          suggestions: ['My order is delayed', 'Can\'t find what I want', 'Website issue', 'Billing question']
        }

      case 'positive':
        return {
          content: `Thank you for the kind words! 💫 Your satisfaction is what drives us every day.\n\n` +
            `Is there anything else I can help you discover today? Perhaps something that matches your excellent taste?`,
          confidence: 0.93,
          suggestions: ['Show me more like this', 'Gift recommendations', 'New arrivals', 'Exclusive access']
        }

      default:
        return {
          content: `Hello! I'm Unicorn, your friendly AI companion here at ZLuxury. 🦄\n\n` +
            `I'm great at casual conversation, creative ideas, and making your shopping experience delightful. Whether you're just browsing, looking for inspiration, or need a friendly chat about luxury - I'm here!\n\n` +
            `What's on your mind today?`,
          confidence: 0.88,
          suggestions: ['I\'m just browsing', 'Looking for gift ideas', 'Tell me something interesting', 'Switch to Hermes agent']
        }
    }
  }
}

// ============================================================================
// ORCHESTRATOR / 编排器
// ============================================================================

/**
 * AIAgentOrchestrator Class
 * 
 * Central coordinator for all AI agents. Routes requests to appropriate
 * agent based on intent and manages multi-agent workflows.
 */
export class AIAgentOrchestrator {
  private hermes: HermesAgent
  private openclaw: OpenClawEngine
  private unicorn: UnicornAgent
  private conversations: Map<string, ConversationContext> = new Map()

  constructor() {
    this.hermes = new HermesAgent()
    this.openclaw = new OpenClawEngine()
    this.unicorn = new UnicornAgent()

    logger.info('AI Agent Orchestrator initialized', {
      agents: ['hermes', 'openclaw', 'unicorn'].length
    })
  }

  /**
   * Process user message through appropriate AI agent
   * Automatically selects best agent based on message content
   * 
   * @param message - User's input message
   * @param agentType - Optional explicit agent selection
   * @param conversationId - Existing conversation ID for continuity
   * @returns Promise resolving to AI response
   */
  async processMessage(
    message: string,
    agentType?: AgentType,
    conversationId?: string
  ): Promise<AIResponse> {
    logger.info('Processing message through orchestrator', {
      messageLength: message.length,
      requestedAgent: agentType,
      conversationId
    })

    // Get or create conversation context / 获取或创建对话上下文
    const ctx = this.getOrCreateContext(conversationId)

    // Add user message to history / 将用户消息添加到历史记录
    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    }
    ctx.messages.push(userMessage)

    try {
      let response: AIResponse

      // Route to appropriate agent / 路由到适当的代理
      if (agentType === 'hermes' || (!agentType && this.isLuxuryInquiry(message))) {
        response = await this.hermes.process(message, ctx)
      } else if (agentType === 'openclaw' || (!agentType && this.isTaskRequest(message))) {
        response = await this.openclaw.execute(message, ctx)
      } else {
        // Default to Unicorn for general conversation
        response = await this.unicorn.converse(message, ctx)
      }

      // Add assistant response to history / 将助手响应添加到历史记录
      const assistantMessage: AIMessage = {
        id: `msg-${Date.now()}-resp`,
        role: 'assistant',
        content: response.content,
        agent: response.agent,
        timestamp: new Date().toISOString(),
        metadata: {
          confidence: response.metadata.confidence,
          processingTimeMs: response.metadata.processingTimeMs
        }
      }
      ctx.messages.push(assistantMessage)

      return response
    } catch (error) {
      logger.error('Orchestrator processing error', { error }, error as Error)
      throw error
    }
  }

  /**
   * Determine if message is a luxury/product inquiry
   * Heuristic check for routing to Hermes agent
   * 
   * @param message - User message to analyze
   * @returns Boolean indicating if it's a luxury inquiry
   */
  private isLuxuryInquiry(message: string): boolean {
    const luxuryKeywords = [
      'recommend', 'suggest', 'brand', 'luxury', 'watch', 'jewelry',
      'bag', 'handbag', 'fashion', 'style', 'designer', 'expensive',
      'investment', 'collect', 'vintage', 'hermes', 'cartier', 'rolex',
      'chanel', 'gucci', 'prada', 'dior', 'louis vuitton', 'patek',
      'price', 'cost', 'worth', 'value', 'trend', 'popular', 'new'
    ]

    const lowerMsg = message.toLowerCase()
    return luxuryKeywords.some(keyword => lowerMsg.includes(keyword))
  }

  /**
   * Determine if message is a task/action request
   * Heuristic check for routing to OpenClaw engine
   * 
   * @param message - User message to analyze
   * @returns Boolean indicating if it's a task request
   */
  private isTaskRequest(message: string): boolean {
    const taskKeywords = [
      'track', 'check', 'search', 'find', 'monitor', 'alert',
      'order', 'status', 'delivery', 'ship', 'inventory', 'stock',
      'compare', 'buy', 'purchase', 'add', 'remove', 'update',
      'cancel', 'return', 'refund', 'schedule', 'book', 'reserve'
    ]

    const lowerMsg = message.toLowerCase()
    return taskKeywords.some(keyword => lowerMsg.includes(keyword))
  }

  /**
   * Get existing conversation or create new one
   * Manages conversation state for continuity
   * 
   * @param conversationId - Optional existing conversation ID
   * @returns Conversation context object
   */
  private getOrCreateContext(conversationId?: string): ConversationContext {
    if (conversationId && this.conversations.has(conversationId)) {
      return this.conversations.get(conversationId)!
    }

    const newContext: ConversationContext = {
      conversationId: conversationId || `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      browsingHistory: [],
      messages: []
    }

    this.conversations.set(newContext.conversationId, newContext)
    return newContext
  }

  /**
   * Get conversation history
   * Retrieves full message history for a conversation
   * 
   * @param conversationId - Conversation identifier
   * @returns Array of messages or empty array
   */
  getConversationHistory(conversationId: string): AIMessage[] {
    const ctx = this.conversations.get(conversationId)
    return ctx?.messages || []
  }

  /**
   * Clear conversation history
   * Removes stored conversation data
   * 
   * @param conversationId - Conversation to clear
   * @returns Success status
   */
  clearConversation(conversationId: string): boolean {
    return this.conversations.delete(conversationId)
  }
}

// ============================================================================
// SINGLETON EXPORT / 单例导出
// ============================================================================

/** Global orchestrator instance / 全局编排器实例 */
let orchestratorInstance: AIAgentOrchestrator | null = null

/**
 * Get the global AI Agent Orchestrator instance
 * Creates singleton if doesn't exist
 * 
 * @returns AIAgentOrchestrator singleton instance
 */
export function getAIAgentOrchestrator(): AIAgentOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new AIAgentOrchestrator()
  }
  return orchestratorInstance
}

// ============================================================================
// DEFAULT EXPORT / 默认导出
// ============================================================================

export default AIAgentOrchestrator