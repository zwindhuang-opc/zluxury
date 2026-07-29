/**
 * ZLuxury Logging System
 * 
 * Log4j-inspired logging utility for consistent application logging.
 * Features:
 * - Multiple log levels (DEBUG, INFO, WARN, ERROR, FATAL)
 * - Structured log format with timestamps
 * - Environment-aware output (verbose in dev, minimal in prod)
 * - Module-based filtering
 * - Console and optional remote logging
 * 
 * Architecture: Utility Layer
 * Version: 1.0.0
 * Last Updated: 2024-06-11
 */

// ============================================================================
// TYPE DEFINITIONS / 类型定义
// ============================================================================

/**
 * Log level enumeration from most verbose to least
 */
export enum LogLevel {
  /** Debug level - Detailed diagnostic information / 调试级别 */
  DEBUG = 0,
  /** Informational level - General application flow / 信息级别 */
  INFO = 1,
  /** Warning level - Potentially harmful situations / 警告级别 */
  WARN = 2,
  /** Error level - Error events that might still allow app to continue / 错误级别 */
  ERROR = 3,
  /** Fatal level - Very severe error events that will cause app to abort / 致命级别 */
  FATAL = 4
}

/**
 * Log entry structure for structured logging
 */
export interface LogEntry {
  /** Timestamp of when the log was created / 日志创建时间戳 */
  timestamp: string;
  
  /** Log severity level / 日志严重程度 */
  level: LogLevel;
  
  /** Module or component name that generated the log / 生成日志的模块或组件名称 */
  module: string;
  
  /** Log message content / 日志消息内容 */
  message: string;
  
  /** Additional data or context for the log / 日志的额外数据或上下文 */
  data?: any;
  
  /** Optional error object if applicable / 可选的错误对象 */
  error?: Error;
  
  /** Unique identifier for this log entry / 此日志条目的唯一标识符 */
  id: string;
}

/**
 * Logger configuration options
 */
export interface LoggerConfig {
  /** Minimum log level to display / 显示的最低日志级别 */
  minLevel?: LogLevel;
  
  /** Enable console output / 启用控制台输出 */
  enableConsole?: boolean;
  
  /** Enable colorized output / 启用彩色输出 */
  enableColors?: boolean;
  
  /** Enable timestamps in logs / 在日志中启用时间戳 */
  enableTimestamps?: boolean;
  
  /** Include stack traces for errors / 包含错误的堆栈跟踪 */
  includeStackTrace?: boolean;
  
  /** Custom log handler for external services / 外部服务的自定义日志处理程序 */
  onLog?: (entry: LogEntry) => void;
}

// ============================================================================
// CONSTANTS / 常量
// ============================================================================

/** Level names mapping / 级别名称映射 */
const LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO ',
  [LogLevel.WARN]: 'WARN ',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.FATAL]: 'FATAL'
}

/** ANSI color codes for terminal output / 终端输出的ANSI颜色代码 */
const LEVEL_COLORS: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: '\x1b[36m',   // Cyan / 青色
  [LogLevel.INFO]: '\x1b[32m',    // Green / 绿色
  [LogLevel.WARN]: '\x1b[33m',    // Yellow / 黄色
  [LogLevel.ERROR]: '\x1b[31m',   // Red / 红色
  [LogLevel.FATAL]: '\x1b[35m'    // Magenta / 洋红色
}

const RESET_COLOR = '\x1b[0m'

/** Default configuration / 默认配置 */
const DEFAULT_CONFIG: Required<LoggerConfig> = {
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableColors: process.env.NODE_ENV !== 'production',
  enableTimestamps: true,
  includeStackTrace: true,
  onLog: () => {}
}

// ============================================================================
// LOGGER CLASS / 记录器类
// ============================================================================

/**
 * ZLuxuryLogger Class
 * 
 * Main logging class providing static methods for different log levels.
 * Implements singleton pattern for global logger instance.
 * 
 * @example
 * ```typescript
 * import { Logger, LogLevel } from '@/utils/logger'
 * 
 * // Get a logger instance for your module
 * const logger = Logger.getLogger('MyComponent')
 * 
 * // Use different log levels
 * logger.debug('Variable value:', myVar)
 * logger.info('User logged in', { userId: user.id })
 * logger.warn('Rate limit approaching', { remaining: 5 })
 * logger.error('Failed to fetch data', { url }, error)
 * ```
 */
class ZLuxuryLogger {
  private config: Required<LoggerConfig>
  private static instance: ZLuxuryLogger | null = null
  
  /**
   * Private constructor to enforce singleton pattern
   * @param config - Optional configuration overrides
   */
  constructor(config?: LoggerConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    
    // Create singleton instance if not exists
    if (!ZLuxuryLogger.instance) {
      ZLuxuryLogger.instance = this
    }
  }

  /**
   * Get or create a module-specific logger instance
   * Returns a bound logger with pre-set module name
   * 
   * @param moduleName - Name of the module/component using the logger
   * @returns Logger object with bound module context
   * 
   * @example
   * ```typescript
   * const logger = Logger.getLogger('ProductService')
   * logger.info('Product loaded')
   * // Output: [2024-06-11T10:30:00Z] [INFO] [ProductService] Product loaded
   * ```
   */
  getLogger(moduleName: string): ZLuxuryModuleLogger {
    return new ZLuxuryModuleLogger(moduleName, this.config)
  }

  /**
   * Update logger configuration at runtime
   * Useful for changing log levels dynamically
   * 
   * @param newConfig - Configuration updates to apply
   */
  configure(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }
}

/**
 * ZLuxuryModuleLogger Class
 * 
 * Module-specific logger with pre-bound module name.
 * Provides convenience methods for each log level.
 */
class ZLuxuryModuleLogger {
  private moduleName: string
  private config: Required<LoggerConfig>

  /**
   * Create a new module logger instance
   * 
   * @param moduleName - Name of the module this logger belongs to
   * @param config - Logger configuration to use
   */
  constructor(moduleName: string, config: Required<LoggerConfig>) {
    this.moduleName = moduleName
    this.config = config
  }

  /**
   * Core logging method that handles all log levels
   * Creates structured log entries and outputs them based on configuration
   * 
   * @param level - Severity level of the log entry
   * @param message - Main log message
   * @param data - Optional additional data to log
   * @param error - Optional error object if logging an error
   */
  private log(
    level: LogLevel, 
    message: string, 
    data?: any, 
    error?: Error
  ): void {
    // Check if we should log at this level / 检查是否应在此级别记录
    if (level < this.config.minLevel) {
      return
    }

    // Generate unique ID for this log entry / 为此日志条目生成唯一ID
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Create timestamp / 创建时间戳
    const timestamp = new Date().toISOString()
    
    // Build log entry / 构建日志条目
    const entry: LogEntry = {
      id,
      timestamp,
      level,
      module: this.moduleName,
      message,
      data,
      error
    }

    // Format and output log / 格式化并输出日志
    if (this.config.enableConsole) {
      this.outputToConsole(entry)
    }

    // Call custom log handler if provided / 如果提供，调用自定义日志处理程序
    if (this.config.onLog) {
      try {
        this.config.onLog(entry)
      } catch (handlerError) {
        // Don't let custom handler errors break the app / 不要让自定义处理程序错误破坏应用程序
        console.error('[Logger] Custom log handler error:', handlerError)
      }
    }
  }

  /**
   * Format and output log entry to browser console
   * Applies colors and formatting based on configuration
   * 
   * @param entry - The log entry to output
   */
  private outputToConsole(entry: LogEntry): void {
    const levelName = LEVEL_NAMES[entry.level]
    const prefix = this.config.enableTimestamps
      ? `[${entry.timestamp}]`
      : ''
    
    const moduleTag = `[${entry.module}]`
    
    // Build formatted message / 构建格式化消息
    let formattedMessage = `${prefix} ${levelName} ${moduleTag} ${entry.message}`

    // Apply colors if enabled / 如果启用，应用颜色
    if (this.config.enableColors && typeof window !== 'undefined') {
      formattedMessage = `%c${formattedMessage}`
      
      switch (entry.level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage, `color: #00bcd4; font-weight: bold`)
          break
        case LogLevel.INFO:
          console.info(formattedMessage, `color: #4caf50; font-weight: bold`)
          break
        case LogLevel.WARN:
          console.warn(formattedMessage, `color: #ff9800; font-weight: bold`)
          break
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(formattedMessage, `color: #f44336; font-weight: bold`)
          break
      }
    } else {
      // No colors, plain text / 无颜色，纯文本
      switch (entry.level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage)
          break
        case LogLevel.INFO:
          console.info(formattedMessage)
          break
        case LogLevel.WARN:
          console.warn(formattedMessage)
          break
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(formattedMessage)
          break
      }
    }

    // Log additional data / 记录额外数据
    if (entry.data !== undefined) {
      console.log('  Data:', entry.data)
    }

    // Log error details / 记录错误详情
    if (entry.error && this.config.includeStackTrace) {
      console.error('  Error Stack:', entry.error.stack || entry.error.message)
    }
  }

  /**
   * Log debug-level message
   * Use for detailed diagnostic information during development
   * 
   * @param message - Debug message to log
   * @param data - Optional data to include
   */
  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data)
  }

  /**
   * Log info-level message
   * Use for general application flow and significant events
   * 
   * @param message - Info message to log
   * @param data - Optional data to include
   */
  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data)
  }

  /**
   * Log warning-level message
   * Use for potentially harmful situations that don't stop execution
   * 
   * @param message - Warning message to log
   * @param data - Optional data to include
   */
  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data)
  }

  /**
   * Log error-level message
   * Use for error events that should be investigated but allow continuation
   * 
   * @param message - Error message to log
   * @param data - Optional context data
   * @param error - Optional Error object for stack trace
   */
  error(message: string, data?: any, error?: Error): void {
    this.log(LogLevel.ERROR, message, data, error)
  }

  /**
   * Log fatal-level message
   * Use for critical errors that will cause application failure
   * 
   * @param message - Fatal error message to log
   * @param data - Optional context data
   * @param error - Optional Error object for stack trace
   */
  fatal(message: string, data?: any, error?: Error): void {
    this.log(LogLevel.FATAL, message, data, error)
  }

  /**
   * Create a child logger with additional context
   * Useful for sub-components within a module
   * 
   * @param context - Additional context to add to module name
   * @returns New logger instance with extended context
   */
  child(context: string): ZLuxuryModuleLogger {
    return new ZLuxuryModuleLogger(`${this.moduleName}:${context}`, this.config)
  }
}

// ============================================================================
// SINGLETON INSTANCE / 单例实例
// ============================================================================

/** Global logger instance / 全局记录器实例 */
let globalLoggerInstance: ZLuxuryLogger | null = null

/**
 * Get the global Logger instance
 * Creates one if it doesn't exist
 * 
 * @param config - Optional initial configuration
 * @returns The global Logger singleton instance
 */
function getGlobalLogger(config?: LoggerConfig): ZLuxuryLogger {
  if (!globalLoggerInstance) {
    globalLoggerInstance = new ZLuxuryLogger(config)
  } else if (config) {
    globalLoggerInstance.configure(config)
  }
  return globalLoggerInstance
}

// ============================================================================
// PUBLIC API / 公共API
// ============================================================================

/**
 * Logger - Main export for the logging system
 * 
 * Provides access to module-specific loggers through getLogger()
 * 
 * @example
 * ```typescript
 * import { Logger } from '@/utils/logger'
 * 
 * // Get logger for current module
 * const logger = Logger.getLogger('MyComponent')
 * 
 * // Use it!
 * logger.info('Component mounted')
 * logger.debug('State updated', { newState })
 * logger.error('API call failed', { url: '/api/test' }, new Error('Network error'))
 * ```
 */
export const Logger = {
  /**
   * Get a logger instance for a specific module
   * Each call returns a logger bound to that module's name
   * 
   * @param moduleName - The name of the module/component (e.g., 'ProductService', 'Header')
   * @returns A configured logger instance
   */
  getLogger: (moduleName: string): ZLuxuryModuleLogger => {
    return getGlobalLogger().getLogger(moduleName)
  },

  /**
   * Configure global logging settings
   * Can be called multiple times to update settings
   * 
   * @param config - Configuration options to update
   */
  configure: (config: LoggerConfig): void => {
    getGlobalLogger().configure(config)
  },

  /**
   * Export LogLevel enum for type checking
   */
  LogLevel,

  /**
   * Quick access methods for ad-hoc logging without getting a logger instance
   * These use a generic 'App' module name
   */
  debug: (message: string, data?: any) => getGlobalLogger().getLogger('App').debug(message, data),
  info: (message: string, data?: any) => getGlobalLogger().getLogger('App').info(message, data),
  warn: (message: string, data?: any) => getGlobalLogger().getLogger('App').warn(message, data),
  error: (message: string, data?: any, error?: Error) => getGlobalLogger().getLogger('App').error(message, data, error),
  fatal: (message: string, data?: any, error?: Error) => getGlobalLogger().getLogger('App').fatal(message, data, error)
}

// ============================================================================
// DEFAULT EXPORT / 默认导出
// ============================================================================

export default Logger