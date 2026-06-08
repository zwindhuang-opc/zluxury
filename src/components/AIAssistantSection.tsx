'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type AgentType = 'hermes' | 'openclaw' | 'unicorn'

interface Message {
  id: string
  type: 'user' | 'agent'
  content: string
  agent?: AgentType
  timestamp: Date
}

const agentInfo = {
  hermes: {
    name: 'Hermes Agent',
    description: 'Luxury recommendation specialist',
    color: '#D4AF37',
    capabilities: ['Product recommendations', 'Brand expertise', 'Style matching', 'Trend analysis']
  },
  openclaw: {
    name: 'OpenClaw',
    description: 'Skills and automation engine',
    color: '#00B4D8',
    capabilities: ['Price comparison', 'Availability check', 'Order tracking', 'Automated tasks']
  },
  unicorn: {
    name: 'Unicorn Agent',
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
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('hermes')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'agent',
      content: 'Welcome to ZLuxury AI Assistant. I can help you find the perfect luxury items, compare prices, track orders, and provide personalized recommendations. How may I assist you today?',
      agent: 'hermes',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: generateAgentResponse(input.trim(), selectedAgent),
        agent: selectedAgent,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, agentResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAgentResponse = (query: string, agent: AgentType): string => {
    const responses = {
      hermes: [
        'Based on your preferences, I recommend exploring our Hermès collection. The Birkin and Kelly bags are exceptional choices for discerning collectors.',
        'For luxury watches, I suggest considering the Rolex Submariner or Patek Philippe Nautilus. Both represent excellent investment pieces.',
        'I have analyzed current market trends. Luxury jewelry from Cartier and Van Cleef & Arpels shows strong appreciation potential.',
        'Would you like me to help you discover pieces that match your personal style and budget?'
      ],
      openclaw: [
        'I have checked availability across our partner network. The requested item is available at 3 authorized dealers.',
        'Price comparison complete: Best price found at authorized retailer with 2-year warranty included.',
        'Order tracking initiated. Your shipment is in transit with estimated delivery in 3-5 business days.',
        'Market analysis completed: Current prices show stability with slight upward trend expected.'
      ],
      unicorn: [
        'I understand you are looking for something special. Let me help you discover unique pieces that match your style and preferences.',
        'That is a wonderful choice! I can provide detailed information about craftsmanship, heritage, and care recommendations.',
        'I am here to make your luxury shopping experience seamless and enjoyable. Feel free to ask about any product or service.',
        'Would you like me to guide you through our exclusive collections or assist with a specific request?'
      ]
    }

    const agentResponses = responses[agent]
    return agentResponses[Math.floor(Math.random() * agentResponses.length)]
  }

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
                  className={`w-full p-4 rounded-lg border transition-all ${
                    selectedAgent === agent 
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
                      className={`max-w-[80%] p-4 rounded-lg ${
                        msg.type === 'user' 
                          ? 'bg-zl-accent text-zl-dark' 
                          : 'bg-zl-dark-3 border border-zl-gray'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <div className={`text-xs mt-2 ${
                        msg.type === 'user' ? 'text-zl-dark/70' : 'text-zl-text-muted'
                      }`}>
                        {msg.timestamp.toLocaleTimeString()}
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