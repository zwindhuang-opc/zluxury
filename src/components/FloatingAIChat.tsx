'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// AI Agent Types
type AgentType = 'hermes' | 'openclaw' | 'unicorn';
type MessageRole = 'user' | 'assistant' | 'system';
type UserLevel = 'standard' | 'silver' | 'gold' | 'black' | 'diamond';

// Message Interface
interface Message {
  id: string;
  role: MessageRole;
  content: string;
  agent?: AgentType;
  timestamp: Date;
  attachments?: { type: 'image' | 'product' | 'link'; url: string; title?: string }[];
  rating?: 'positive' | 'negative';
  translations?: { zh: string; en: string };
}

// Quick Action Types
interface QuickAction {
  id: string;
  label: string;
  labelZh: string;
  icon: string;
  query: string;
}

// Agent Configuration
const agentConfig = {
  hermes: {
    name: '爱马仕顾问',
    nameEn: 'Hermes Advisor',
    description: '奢品推荐专家 | Luxury Expert',
    color: '#D4AF37',
    avatar: 'H',
    capabilities: [
      '品牌知识 Brand Knowledge',
      '搭配建议 Style Advice', 
      '趋势分析 Trend Analysis',
      'VIP专属服务 VIP Service'
    ],
    greeting: '您好！我是爱马仕奢品顾问，请问有什么可以帮您？\n\nHello! I am your luxury advisor. How may I assist you?'
  },
  openclaw: {
    name: '智能助理',
    nameEn: 'OpenClaw Assistant',
    description: '自动化引擎 | Automation Engine',
    color: '#00B4D8',
    avatar: 'O',
    capabilities: [
      '价格对比 Price Comparison',
      '库存查询 Stock Check',
      '订单跟踪 Order Tracking',
      '自动任务 Auto Tasks'
    ],
    greeting: '您好！我是智能助理，随时为您服务！\n\nHello! I am your smart assistant, ready to help!'
  },
  unicorn: {
    name: '智慧对话',
    nameEn: 'Unicorn AI',
    description: '情感智能 | Emotional Intelligence',
    color: '#9B59B6',
    avatar: 'U',
    capabilities: [
      '自然对话 Natural Chat',
      '情感理解 Emotion Understanding',
      '上下文记忆 Context Memory',
      '个性化响应 Personalized Response'
    ],
    greeting: '您好！很高兴为您服务，让我们开始愉快的对话吧！\n\nHello! Glad to assist you. Let\'s have a pleasant conversation!'
  }
};

// Quick Actions
const quickActions: QuickAction[] = [
  { id: '1', label: 'Browse Products', labelZh: '浏览商品', icon: '🛍️', query: 'Show me luxury products' },
  { id: '2', label: 'Track Order', labelZh: '订单查询', icon: '📦', query: 'Track my order' },
  { id: '3', label: 'VIP Benefits', labelZh: '会员权益', icon: '👑', query: 'What are VIP benefits?' },
  { id: '4', label: 'Price Inquiry', labelZh: '价格咨询', icon: '💰', query: 'What is the price of' },
  { id: '5', label: 'New Arrivals', labelZh: '新品上架', icon: '✨', query: 'Show me new arrivals' },
  { id: '6', label: 'Authentication', labelZh: '鉴定服务', icon: '🔍', query: 'How to verify authenticity?' }
];

// Language Context
const translations = {
  welcome: { zh: '欢迎来到ZLuxury AI智能助手', en: 'Welcome to ZLuxury AI Assistant' },
  inputPlaceholder: { zh: '输入您的问题...', en: 'Type your message...' },
  send: { zh: '发送', en: 'Send' },
  typing: { zh: '正在输入...', en: 'Typing...' },
  selectAgent: { zh: '选择AI智能体', en: 'Select AI Agent' },
  online: { zh: '在线', en: 'Online' },
  today: { zh: '今天', en: 'Today' },
  yesterday: { zh: '昨天', en: 'Yesterday' },
  rateResponse: { zh: '评价回复', en: 'Rate Response' },
  helpful: { zh: '有帮助', en: 'Helpful' },
  notHelpful: { zh: '待改进', en: 'Not Helpful' },
  viewProducts: { zh: '查看商品', en: 'View Products' },
  addToCart: { zh: '加入购物车', en: 'Add to Cart' },
  quickActions: { zh: '快捷操作', en: 'Quick Actions' },
  chatHistory: { zh: '聊天记录', en: 'Chat History' },
  clearChat: { zh: '清空对话', en: 'Clear Chat' },
  weChatLogin: { zh: '微信登录', en: 'WeChat Login' },
  phoneLogin: { zh: '手机登录', en: 'Phone Login' },
  language: { zh: '语言', en: 'Language' }
};

// Agent Response Templates
const agentResponses = {
  hermes: {
    greetings: [
      '您好！我是您的专属奢品顾问，请问有什么可以帮助您的？\n\nHello! I am your exclusive luxury advisor. How may I assist you?',
      '欢迎回来！今天想看些什么呢？我可以为您推荐最新的奢品。\n\nWelcome back! What would you like to see today? I can recommend the latest luxury items.',
      '很高兴为您服务！让我为您介绍我们的精选奢品。\n\nGlad to serve you! Let me introduce our curated luxury selections.'
    ],
    products: [
      '根据您的偏好，我为您推荐这款经典设计：\n\nBased on your preferences, I recommend this classic design:',
      '这款产品非常适合您，兼具品质与品味：\n\nThis product is perfect for you, combining quality and taste:',
      '让我为您展示几款热销单品：\n\nLet me show you some of our bestsellers:'
    ],
    price: [
      '这款产品的价格是￥{price}，VIP会员可享受专属折扣。\n\nThe price is ￥{price}, with exclusive discounts for VIP members.',
      '目前活动期间，所有商品均有优惠。您的{level}会员可享受{discount}折优惠。\n\nDuring the current promotion, all items are discounted. Your {level} membership offers {discount}x off.'
    ],
    trending: [
      '目前最受欢迎的是{product}，已有{count}人关注。\n\nThe most popular now is {product}, with {count} people following.',
      '本周流行趋势：{trend}，深受时尚达人青睐。\n\nThis week\'s trend: {trend}, loved by fashion enthusiasts.'
    ]
  },
  openclaw: {
    greeting: [
      '您好！我是您的智能助理，可以帮您查询订单、比较价格等。\n\nHello! I am your smart assistant, ready to check orders and compare prices.',
      '随时为您服务！有什么需要帮忙的吗？\n\nAlways at your service! How can I help?'
    ],
    order: [
      '正在为您查询订单信息...\n\nChecking your order information...',
      '您的订单{orderId}已于{date}发货，预计{eta}送达。\n\nYour order {orderId} was shipped on {date}, expected delivery {eta}.',
      '订单详情：\n\nOrder Details:\n- 订单号/Order: {orderId}\n- 状态/Status: {status}\n- 物流/Tracking: {tracking}'
    ],
    price: [
      '价格比较完成：\n\nPrice comparison complete:\n- 官网价格: ￥{official}\n- 活动价格: ￥{sale}\n- 节省: ￥{savings}',
      '建议：现在购买可节省{savings}元，使用优惠码可再减{extra}元。\n\nSuggestion: Save {savings} Yuan now, plus an extra {extra} Yuan off with code.'
    ],
    availability: [
      '{product}目前有货，共{stock}件。\n\n{product} is in stock with {stock} units available.',
      '很抱歉，{product}目前缺货，但您可以预约到货提醒。\n\nSorry, {product} is currently out of stock, but you can set up restock notification.'
    ]
  },
  unicorn: {
    greeting: [
      '您好！很高兴认识您，让我们开始愉快的聊天吧！\n\nHello! Nice to meet you. Let\'s start a pleasant conversation!',
      '欢迎！有什么我可以帮您的吗？\n\nWelcome! How may I help you today?'
    ],
    casual: [
      '您今天看起来很有品味！\n\nYou look very stylish today!',
      '很高兴能帮助您！\n\nGlad to help you!',
      '让我为您查一下...\n\nLet me check for you...'
    ],
    emotion: [
      '我理解您的心情，让我们找到最好的解决方案。\n\nI understand how you feel. Let\'s find the best solution together.',
      '完全理解！让我为您推荐最适合的选择。\n\nAbsolutely! Let me recommend the most suitable choice for you.',
      '我感受到了您对品质的追求，这就是品味生活！\n\nI sense your pursuit of quality. This is what refined living is about!'
    ],
    personalization: [
      '根据您之前的浏览记录，我为您推荐：\n\nBased on your browsing history, I recommend:',
      '您似乎喜欢{style}风格，这里有几款精选：\n\nYou seem to like {style} style. Here are some handpicked selections:'
    ]
  }
};

// Format timestamp
const formatTime = (date: Date, language: 'zh' | 'en'): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return date.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (days === 1) {
    return language === 'zh' ? '昨天' : 'Yesterday';
  } else {
    return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' });
  }
};

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Simulate AI thinking
const simulateThinking = (query: string, agent: AgentType, userLevel: UserLevel): string => {
  const lowerQuery = query.toLowerCase();
  const responses = agentResponses[agent];
  
  // Intent detection
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('你好') || lowerQuery.includes('您好')) {
    return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
  }
  
  if (lowerQuery.includes('product') || lowerQuery.includes('商品') || lowerQuery.includes('看看')) {
    return responses.products[Math.floor(Math.random() * responses.products.length)];
  }
  
  if (lowerQuery.includes('price') || lowerQuery.includes('价格') || lowerQuery.includes('多少钱')) {
    const price = (Math.random() * 50000 + 5000).toFixed(0);
    const discount = userLevel === 'diamond' ? 0.85 : userLevel === 'black' ? 0.90 : userLevel === 'gold' ? 0.95 : 1;
    return `这款精品价格是￥${price}。\n\nThis exquisite piece is priced at ￥${price}.\n\n作为${userLevel}会员，您可以享受${(discount * 10).toFixed(1)}折优惠！\n\nAs a ${userLevel} member, you enjoy ${(discount * 10).toFixed(1)}x discount!`;
  }
  
  if (lowerQuery.includes('order') || lowerQuery.includes('订单') || lowerQuery.includes('物流')) {
    return `正在为您查询订单...\n\nChecking your order...\n\n📦 订单号: ZL20240608001\n🚚 状态: 已发货，预计3天后送达\n📍 物流: 顺丰快递 SF1234567890\n\nOrder ID: ZL20240608001\nStatus: Shipped, arriving in 3 days\nTracking: SF1234567890`;
  }
  
  if (lowerQuery.includes('vip') || lowerQuery.includes('会员') || lowerQuery.includes('权益')) {
    return `🎁 VIP会员专属权益 / VIP Benefits:\n\n银卡会员 (Silver): 9.5折 + 专属客服\nGold Member: 9.5x off + Priority Support\n\n金卡会员 (Gold): 9折 + 优先发货 + 新品预览\nGold Member: 9x off + Priority Shipping + Preview\n\n黑卡会员 (Black): 8.5折 + 专属顾问 + 定制服务\nBlack Member: 8.5x off + Personal Advisor + Custom Service\n\n钻石会员 (Diamond): 全面定制 + 全球联保\nDiamond Member: Full Customization + Global Warranty`;
  }
  
  if (lowerQuery.includes('help') || lowerQuery.includes('帮助') || lowerQuery.includes('怎么')) {
    return `我可以帮您：\n\nI can help you with:\n\n🛍️ 商品推荐 - Product Recommendations\n💰 价格查询 - Price Inquiries\n📦 订单跟踪 - Order Tracking\n👑 VIP服务 - VIP Services\n🔍 鉴定咨询 - Authentication\n\n请告诉我您的需求！\n\nPlease tell me what you need!`;
  }
  
  // Default response with context awareness
  return `${responses.greeting || responses.greetings[0]}\n\n针对您的问题：${query}\n\nFor your question: ${query}\n\n我能为您推荐最适合的奢品，或者帮您查询订单信息。\n\nI can recommend the perfect luxury item for you, or help you check order information.`;
};

// Floating Chat Widget Component
export default function FloatingAIChat() {
  // State Management
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('hermes');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [userLevel] = useState<UserLevel>('gold');
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  // Initialize chat with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: Message = {
        id: generateId(),
        role: 'assistant',
        content: agentConfig[selectedAgent].greeting,
        agent: selectedAgent,
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  }, [isOpen, messages.length, selectedAgent]);
  
  // Send message handler
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const query = input.trim();
    setInput('');
    setIsTyping(true);
    
    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    
    const response = simulateThinking(query, selectedAgent, userLevel);
    
    const agentMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: response,
      agent: selectedAgent,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, agentMessage]);
    setIsTyping(false);
  };
  
  // Handle quick action
  const handleQuickAction = (action: QuickAction) => {
    setInput(action.query);
    setTimeout(() => handleSend(), 100);
  };
  
  // Switch agent
  const handleAgentSwitch = (agent: AgentType) => {
    setSelectedAgent(agent);
    setShowAgentSelector(false);
    
    const systemMessage: Message = {
      id: generateId(),
      role: 'system',
      content: `${translations.selectAgent[language]}: ${agentConfig[agent].name}`,
      agent: agent,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
    
    // Add new agent greeting
    setTimeout(() => {
      const greeting: Message = {
        id: generateId(),
        role: 'assistant',
        content: agentConfig[agent].greeting,
        agent: agent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, greeting]);
    }, 500);
  };
  
  // Clear chat
  const handleClearChat = () => {
    setMessages([]);
    setTimeout(() => {
      const greeting: Message = {
        id: generateId(),
        role: 'assistant',
        content: agentConfig[selectedAgent].greeting,
        agent: selectedAgent,
        timestamp: new Date()
      };
      setMessages([greeting]);
    }, 100);
  };
  
  // Language toggle
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };
  
  const t = (key: keyof typeof translations) => translations[key][language];
  const agent = agentConfig[selectedAgent];
  
  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl"
        style={{ 
          background: `linear-gradient(135deg, ${agent.color} 0%, ${agent.color}99 100%)`,
          boxShadow: `0 8px 32px ${agent.color}40`
        }}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <span className="text-white">✕</span>
        ) : (
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white"
          >
            💬
          </motion.span>
        )}
      </motion.button>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-12rem)] rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(180deg, #0f0f0f 0%, #050505 100%)',
              border: `1px solid ${agent.color}30`
            }}
          >
            {/* Header */}
            <div 
              className="px-6 py-4 flex items-center justify-between"
              style={{ background: `${agent.color}15` }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: agent.color }}
                  animate={{ boxShadow: [`0 0 0 0 ${agent.color}40`, `0 0 0 8px ${agent.color}00`] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {agent.avatar}
                </motion.div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{agent.name}</h3>
                  <p className="text-xs" style={{ color: agent.color }}>
                    {t('online')} • {userLevel} VIP
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Language Toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleLanguage}
                  className="px-2 py-1 rounded text-xs bg-zl-dark-3 text-zl-text-muted hover:text-white transition-colors"
                >
                  {language === 'zh' ? 'EN' : '中'}
                </motion.button>
                
                {/* Agent Selector */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAgentSelector(!showAgentSelector)}
                  className="w-8 h-8 rounded-full bg-zl-dark-3 flex items-center justify-center text-white text-sm"
                >
                  ⚙️
                </motion.button>
              </div>
            </div>
            
            {/* Agent Selector Dropdown */}
            <AnimatePresence>
              {showAgentSelector && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-16 right-6 w-64 rounded-xl shadow-xl z-10 overflow-hidden"
                  style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                >
                  {(Object.keys(agentConfig) as AgentType[]).map((agentKey) => {
                    const config = agentConfig[agentKey];
                    return (
                      <motion.button
                        key={agentKey}
                        whileHover={{ backgroundColor: '#2a2a2a' }}
                        onClick={() => handleAgentSwitch(agentKey)}
                        className="w-full px-4 py-3 flex items-center gap-3 text-left"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ background: config.color }}
                        >
                          {config.avatar}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{config.name}</p>
                          <p className="text-zl-text-muted text-xs">{config.description}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'system' ? (
                    <div className="w-full text-center py-2">
                      <span className="text-xs text-zl-text-muted bg-zl-dark-3 px-3 py-1 rounded-full">
                        {msg.content}
                      </span>
                    </div>
                  ) : (
                    <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ background: agentConfig[msg.agent!].color }}
                          >
                            {agentConfig[msg.agent!].avatar}
                          </div>
                          <span className="text-xs" style={{ color: agentConfig[msg.agent!].color }}>
                            {agentConfig[msg.agent!].name}
                          </span>
                        </div>
                      )}
                      
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-br-md'
                            : 'bg-zl-dark-3 text-zl-text border border-zl-gray rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </p>
                        <p className={`text-xs mt-1 ${
                          msg.role === 'user' ? 'text-cyan-200' : 'text-zl-text-muted'
                        }`}>
                          {formatTime(msg.timestamp, language)}
                        </p>
                      </div>
                      
                      {msg.role === 'assistant' && (
                        <div className="flex gap-2 mt-1">
                          <button className="text-xs text-zl-text-muted hover:text-green-500 transition-colors">
                            👍 {t('helpful')}
                          </button>
                          <button className="text-xs text-zl-text-muted hover:text-red-500 transition-colors">
                            👎 {t('notHelpful')}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-zl-dark-3 border border-zl-gray px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 rounded-full"
                        style={{ background: agent.color }}
                      />
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 rounded-full"
                        style={{ background: agent.color }}
                      />
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 rounded-full"
                        style={{ background: agent.color }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Quick Actions */}
            <div className="px-6 py-3 border-t border-zl-gray">
              <p className="text-xs text-zl-text-muted mb-2">{t('quickActions')}</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.slice(0, 4).map((action) => (
                  <motion.button
                    key={action.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAction(action)}
                    className="px-3 py-1.5 rounded-full text-xs bg-zl-dark-3 text-zl-text-muted hover:text-white border border-zl-gray hover:border-zl-accent transition-colors"
                  >
                    {action.icon} {language === 'zh' ? action.labelZh : action.label}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Input Area */}
            <div className="px-6 py-4 border-t border-zl-gray">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('inputPlaceholder')}
                  className="flex-1 px-4 py-3 rounded-xl bg-zl-dark-3 text-white text-sm border border-zl-gray focus:border-zl-accent focus:outline-none transition-colors placeholder-zl-text-muted"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="px-6 py-3 rounded-xl text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: `linear-gradient(135deg, ${agent.color} 0%, ${agent.color}cc 100%)` }}
                >
                  {t('send')}
                </motion.button>
              </div>
              
              {/* Clear Chat */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-zl-gray/50">
                <button
                  onClick={handleClearChat}
                  className="text-xs text-zl-text-muted hover:text-red-500 transition-colors"
                >
                  {t('clearChat')}
                </button>
                <p className="text-xs text-zl-text-muted">
                  {messages.length} {language === 'zh' ? '条消息' : 'messages'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}