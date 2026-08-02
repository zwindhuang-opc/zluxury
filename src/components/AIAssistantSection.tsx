/**
 * AIAssistantSection Component - Interactive AI assistant chat interface
 * 
 * Features:
 * - Multi-agent system (Hermes, Unicorn, OpenClaw)
 * - Real-time chat interface with typing animations
 * - Real AI integration via zunicorn-agent backend
 * - Enhanced local fallback with product knowledge
 * - Clickable suggestion chips for follow-up actions
 * - Response source indicator (Real AI / Local AI)
 * 
 * @module AIAssistantSection
 * @version 3.0.0
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAIAgentOrchestrator, AgentType } from '@/ai/agents'
import { Logger } from '@/utils/logger'
import { useTranslation } from '@/i18n/useTranslation'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  agent?: AgentType;
  timestamp: string;
  suggestions?: string[];
  source?: 'api' | 'local' | 'fallback';
  confidence?: number;
}

// ============================================================================
// AGENT CONFIGURATION
// ============================================================================

const agentCapabilityKeys: Record<AgentType, string[]> = {
  hermes: ['recommendations', 'expertise', 'matching', 'trends'],
  openclaw: ['priceComparison', 'availability', 'tracking', 'automation'],
  unicorn: ['conversation', 'context', 'dialogue', 'personalized']
}

const agentColors: Record<AgentType, string> = {
  hermes: '#D4AF37',
  openclaw: '#00B4D8',
  unicorn: '#9B59B6'
}

const AgentIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
)

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AIAssistantSection() {
  const { t } = useTranslation()
  const logger = Logger.getLogger('AIAssistantSection')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [selectedAgent, setSelectedAgent] = useState<AgentType>('hermes')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string>('')
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  const getAgentInfo = (agent: AgentType) => ({
    name: t(`aiAssistant.agents.${agent}.name`),
    description: t(`aiAssistant.agents.${agent}.description`),
    color: agentColors[agent],
    capabilities: agentCapabilityKeys[agent].map(key => t(`aiAssistant.agents.${agent}.capabilities.${key}`))
  })

  useEffect(() => {
    setConversationId(`conv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`)
    setMessages([{
      id: '1',
      type: 'agent',
      content: t('aiAssistant.welcomeMessage'),
      agent: 'hermes',
      timestamp: new Date().toLocaleTimeString()
    }])
    logger.info('AI Assistant initialized')
  }, [t])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText || input).trim()
    if (!text) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const orchestrator = getAIAgentOrchestrator()
      const response = await orchestrator.processMessage(text, selectedAgent, conversationId)

      const source = response.metadata?.source === 'zunicorn-agent' ? 'api' : 'local'

      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: response.content,
        agent: response.agent,
        timestamp: new Date().toLocaleTimeString(),
        suggestions: response.suggestions,
        source,
        confidence: response.metadata.confidence
      }

      setMessages(prev => [...prev, agentResponse])
      if (source === 'api') setApiStatus('online')

    } catch (error) {
      logger.error('AI response failed', { error })
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: t('aiAssistant.errorMessage'),
        agent: selectedAgent,
        timestamp: new Date().toLocaleTimeString(),
        source: 'fallback'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion)
  }

  const currentAgentInfo = getAgentInfo(selectedAgent)

  const statusDotColor = apiStatus === 'online' ? 'bg-green-500' : apiStatus === 'offline' ? 'bg-amber-500' : 'bg-zl-text-muted'
  const statusText = apiStatus === 'online' ? 'Real AI Connected' : apiStatus === 'offline' ? 'Using Enhanced Local AI' : 'Checking AI status...'
  const statusDesc = apiStatus === 'online'
    ? 'Powered by zunicorn-agent multi-agent system'
    : 'Advanced local response generator with product knowledge base'

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            <span className="text-gradient">{t('aiAssistant.title')}</span>
          </h2>
          <p className="text-zl-text-muted max-w-2xl mx-auto">
            {t('aiAssistant.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            className="glass-card rounded-xl p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold font-montserrat mb-6">{t('aiAssistant.selectAgent')}</h3>

            <div className="space-y-4">
              {(Object.keys(agentColors) as AgentType[]).map((agent) => {
                const info = getAgentInfo(agent)
                return (
                  <motion.button
                    key={agent}
                    className={`w-full p-4 rounded-lg border transition-all text-left ${selectedAgent === agent
                      ? 'border-zl-accent bg-zl-accent/10'
                      : 'border-zl-gray bg-zl-dark-3 hover:border-zl-accent/50'
                      }`}
                    onClick={() => setSelectedAgent(agent)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${info.color}20` }}
                      >
                        <AgentIcon color={info.color} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-zl-text">{info.name}</div>
                        <div className="text-sm text-zl-text-muted">{info.description}</div>
                      </div>
                      {selectedAgent === agent && (
                        <svg className="w-5 h-5 text-zl-accent shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {info.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="text-xs px-2 py-1 rounded bg-zl-dark text-zl-text-muted"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            <div className="mt-6 p-3 rounded-lg bg-zl-dark-3 border border-zl-gray">
              <div className="flex items-center gap-2 text-xs">
                <span className={`w-2 h-2 rounded-full ${statusDotColor} ${apiStatus === 'online' ? 'animate-pulse' : ''}`} />
                <span className="text-zl-text-muted">{statusText}</span>
              </div>
              <div className="text-xs text-zl-text-muted mt-1">{statusDesc}</div>
            </div>
          </motion.div>

          <motion.div
            className="glass-card rounded-xl p-8 flex flex-col"
            style={{ minHeight: '500px' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${currentAgentInfo.color}20` }}
              >
                <AgentIcon color={currentAgentInfo.color} />
              </div>
              <div>
                <div className="font-semibold text-zl-text">{currentAgentInfo.name}</div>
                <div className="text-xs text-zl-accent">{t('aiAssistant.online')}</div>
              </div>
              {messages.length > 1 && (
                <button
                  onClick={() => {
                    setMessages([{
                      id: Date.now().toString(),
                      type: 'agent',
                      content: 'Conversation cleared. How can I help you?',
                      agent: selectedAgent,
                      timestamp: new Date().toLocaleTimeString()
                    }])
                  }}
                  className="ml-auto text-xs text-zl-text-muted hover:text-zl-accent transition-colors"
                >
                  Clear Chat
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 min-h-[300px] max-h-[400px]">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-[85%] w-full">
                      <div
                        className={`p-4 rounded-lg ${msg.type === 'user'
                          ? 'bg-zl-accent text-zl-dark'
                          : 'bg-zl-dark-3 border border-zl-gray'
                          }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <div className={`text-xs mt-2 flex items-center gap-2 ${msg.type === 'user' ? 'text-zl-dark/70' : 'text-zl-text-muted'}`}>
                          <span>{msg.timestamp}</span>
                          {msg.source === 'api' && (
                            <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px]">
                              Real AI
                            </span>
                          )}
                          {msg.source === 'local' && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px]">
                              Local AI
                            </span>
                          )}
                        </div>
                      </div>

                      {msg.suggestions && msg.suggestions.length > 0 && msg.type === 'agent' && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {msg.suggestions.map((suggestion, idx) => (
                            <button
                              key={`${msg.id}-s-${idx}`}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs px-3 py-1.5 rounded-full bg-zl-dark-3 border border-zl-gray text-zl-text-muted hover:border-zl-accent hover:text-zl-accent transition-colors text-left"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
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

              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                placeholder={t('aiAssistant.placeholder')}
                className="flex-1 input-luxury"
                disabled={isTyping}
              />
              <motion.button
                className="premium-button px-4 py-3 rounded-lg"
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={t('aiAssistant.send')}
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