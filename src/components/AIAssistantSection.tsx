'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAIAgentOrchestrator, AgentType } from '@/ai/agents'
import { Logger } from '@/utils/logger'

// ============================================================================
// TYPE DEFINITIONS / 类型定义
// ============================================================================

/**
 * Chat message interface for UI display
 */
interface Message {
  /** Unique message identifier / 消息唯一标识符 */
  id: string;

  /** Message sender type / 消息发送者类型 */
  type: 'user' | 'agent';

  /** Message content text / 消息内容文本 */
  content: string;

  /** Which AI agent generated this response / 哪个AI代理生成了此响应 */
  agent?: AgentType;

  /** Display timestamp (string to avoid hydration issues) / 显示时间戳（字符串以避免水合问题） */
  timestamp: string;

  /** Optional suggestions for follow-up actions / 可选的后续操作建议 */
  suggestions?: string[];
}

// ============================================================================
// AGENT CONFIGURATION / 代理配置
// ============================================================================

/**
 * Agent information configuration for UI display
 * Contains metadata about each available AI agent
 */
const agentInfo = {
  hermes: {
    name: 'Hermes Agent',
    nameCn: '赫尔墨斯智能助手',
    description: 'Luxury recommendation specialist',
    color: '#D4AF37',
    capabilities: ['Product recommendations', 'Brand expertise', 'Style matching', 'Trend analysis']
  },
  openclaw: {
    name: 'OpenClaw Engine',
    nameCn: 'OpenClaw引擎',
    description: 'Skills and automation engine',
    color: '#00B4D8',
    capabilities: ['Price comparison', 'Availability check', 'Order tracking', 'Automated tasks']
  },
  unicorn: {
    name: 'Unicorn Agent',
    nameCn: '独角兽AI助手',
    description: 'Enhanced AI conversation',
    color: '#9B59B6',
    capabilities: ['Natural conversation', 'Context understanding', 'Multi-turn dialogue', 'Personalized responses']
  }
}

const AgentIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
)

export default function AIAssistantSection() {
  // Logger instance for this component / 此组件的记录器实例
  const logger = Logger.getLogger('AIAssistantSection')

  // State management / 状态管理
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('hermes')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [conversationId, setConversationId] = useState<string>('')

  /**
   * Initialize component after mount
   * Sets up conversation context and welcome message
   * Avoids hydration mismatch by running only on client
   */
  useEffect(() => {
    setMounted(true)

    // Generate unique conversation ID / 生成唯一对话ID
    setConversationId(`conv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`)

    // Set initial welcome message / 设置初始欢迎消息
    setMessages([
      {
        id: '1',
        type: 'agent',
        content: 'Welcome to ZLuxury AI Assistant! 🎩\n\nI\'m your luxury concierge, powered by advanced AI agents:\n\n' +
          '**Hermes** - Product recommendations & brand expertise\n' +
          '**OpenClaw** - Price tracking & order management\n' +
          '**Unicorn** - Creative conversation & styling advice\n\n' +
          'How may I assist you today?',
        agent: 'hermes',
        timestamp: new Date().toLocaleTimeString()
      }
    ])

    logger.info('AI Assistant initialized', { selectedAgent: 'hermes' })
  }, [])

  /**
   * Handle sending user message to AI system
   * Routes message to appropriate agent based on selection
   * Updates UI with response from AI orchestrator
   */
  const handleSend = async () => {
    if (!input.trim()) return

    const userMessageText = input.trim()

    // Create user message object / 创建用户消息对象
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessageText,
      timestamp: new Date().toLocaleTimeString()
    }

    // Update UI with user message / 使用用户消息更新UI
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    logger.debug('Sending message to AI agent', {
      agent: selectedAgent,
      messageLength: userMessageText.length,
      conversationId
    })

    try {
      // Get AI orchestrator instance / 获取AI编排器实例
      const orchestrator = getAIAgentOrchestrator()

      // Process message through AI system / 通过AI系统处理消息
      const response = await orchestrator.processMessage(
        userMessageText,
        selectedAgent,
        conversationId
      )

      logger.info('Received AI response', {
        agent: response.agent,
        confidence: response.metadata.confidence,
        processingTimeMs: response.metadata.processingTimeMs
      })

      // Create agent response message / 创建代理响应消息
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: response.content,
        agent: response.agent,
        timestamp: new Date().toLocaleTimeString(),
        suggestions: response.suggestions
      }

      // Update UI with agent response / 使用代理响应更新UI
      setMessages(prev => [...prev, agentResponse])

    } catch (error) {
      logger.error('Failed to get AI response', { error }, error as Error)

      // Show error fallback message / 显示错误回退消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: 'I apologize, but I encountered an issue processing your request. Please try again or select a different agent.',
        agent: selectedAgent,
        timestamp: new Date().toLocaleTimeString()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  // Render component / 渲染组件
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            <span className="text-gradient">AI</span> Assistant
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            Powered by Hermes Agent, OpenClaw, and Unicorn AI from Anna AI Platform
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            className="glass-card rounded-xl p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold font-montserrat mb-6">Select AI Agent</h3>

            <div className="space-y-4">
              {(Object.keys(agentInfo) as AgentType[]).map((agent) => (
                <motion.button
                  key={agent}
                  className={`w-full p-4 rounded-lg border transition-all ${selectedAgent === agent
                    ? 'border-zl-accent bg-zl-accent/10'
                    : 'border-zl-gray bg-zl-dark-3 hover:border-zl-accent/50'
                    }`}
                  onClick={() => setSelectedAgent(agent)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ background: `${agentInfo[agent].color}20` }}
                    >
                      <AgentIcon color={agentInfo[agent].color} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-zl-text">{agentInfo[agent].name}</div>
                      <div className="text-sm text-zl-text-muted">{agentInfo[agent].description}</div>
                    </div>
                    {selectedAgent === agent && (
                      <svg className="w-5 h-5 text-zl-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {agentInfo[agent].capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="text-xs px-2 py-1 rounded bg-zl-dark text-zl-text-muted"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="glass-card rounded-xl p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${agentInfo[selectedAgent].color}20` }}
              >
                <AgentIcon color={agentInfo[selectedAgent].color} />
              </div>
              <div>
                <div className="font-semibold text-zl-text">{agentInfo[selectedAgent].name}</div>
                <div className="text-xs text-zl-accent">Online</div>
              </div>
            </div>

            <div className="h-64 overflow-y-auto space-y-4 mb-4 pr-2">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${msg.type === 'user'
                        ? 'bg-zl-accent text-zl-dark'
                        : 'bg-zl-dark-3 border border-zl-gray'
                        }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <div className={`text-xs mt-2 ${msg.type === 'user' ? 'text-zl-dark/70' : 'text-zl-text-muted'
                        }`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-zl-dark-3 border border-zl-gray p-4 rounded-lg">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-zl-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-zl-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-zl-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about luxury products, recommendations, prices..."
                className="flex-1 input-luxury"
              />
              <motion.button
                className="premium-button px-4 py-3 rounded-lg"
                onClick={handleSend}
                disabled={!input.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}