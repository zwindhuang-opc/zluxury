/**
 * ZLuxury Logging System (Log4j-style)
 * 
 * Enterprise-grade logging with structured JSON output
 * Multiple log levels: ERROR, WARN, INFO, DEBUG, TRACE
 * Multiple transports: File, Console, External services
 * 
 * Features:
 * - Structured logging with metadata
 * - Log rotation by size/date
 * - Request ID tracking for distributed tracing
 * - Performance timing utilities
 * - Error stack trace capture
 * 
 * Usage:
 *   import { logger } from '@/lib/logger'
 *   
 *   logger.info('User login', { userId: '123', ip: '192.168.1.1' })
 *   logger.error('Payment failed', { orderId: 'ORD-001', error: err })
 *   logger.warn('Low stock', { productId: 'PROD-001', stock: 2 })
 */

// ============================================================================
// LOG LEVELS / 日志级别
// ============================================================================

/**
 * Log level enumeration from most to least severe
 */
export enum LogLevel {
  /** System is unusable / 系统不可用 */
  ERROR = 0,
  /** Critical condition that needs attention / 需要关注的严重情况 */
  WARN = 1,
  /** Normal operational information / 正常运行信息 */
  INFO = 2,
  /** Debug-level messages for development / 调试信息 */
  DEBUG = 3,
  /** Very detailed tracing information / 详细追踪信息 */
  TRACE = 4
}

/**
 * Log level names mapping
 */
export const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.TRACE]: 'TRACE'
}

/**
 * Log level colors for console output
 */
const LOG_COLORS: Record<LogLevel, string> = {
  [LogLevel.ERROR]: '\x1b[31m', // Red
  [LogLevel.WARN]: '\x1b[33m',  // Yellow
  [LogLevel.INFO]: '\x1b[36m',  // Cyan
  [LogLevel.DEBUG]: '\x1b[35m', // Magenta
  [LogLevel.TRACE]: '\x1b[90m'  // Gray
}

const RESET_COLOR = '\x1b[0m'

// ============================================================================
// LOG ENTRY INTERFACE / 日志条目接口
// ============================================================================

/**
 * Structure of a single log entry
 */
export interface LogEntry {
  /** Timestamp in ISO format / ISO格式时间戳 */
  timestamp: string;

  /** Log severity level / 日志级别 */
  level: LogLevel;

  /** Level name string / 级别名称字符串 */
  levelName: string;

  /** Log message / 日志消息 */
  message: string;

  /** Additional context data / 额外上下文数据 */
  data?: Record<string, any>;

  /** Source file location / 源文件位置 */
  source?: string;

  /** Request ID for tracing / 用于追踪的请求ID */
  requestId?: string;

  /** User ID if authenticated / 认证用户ID */
  userId?: string;

  /** Execution time in ms / 执行时间（毫秒） */
  duration?: number;

  /** Error object if applicable / 错误对象（如有） */
  error?: Error;

  /** Stack trace / 堆栈跟踪 */
  stackTrace?: string;
}

// ============================================================================
// LOGGER CONFIGURATION / 日志器配置
// ============================================================================

interface LoggerConfig {
  /** Minimum level to log / 最低日志级别 */
  minLevel: LogLevel;

  /** Enable console output / 启用控制台输出 */
  enableConsole: boolean;

  /** Enable file output / 启用文件输出 */
  enableFile: boolean;

  /** Directory for log files / 日志文件目录 */
  logDirectory: string;

  /** Maximum log file size in bytes before rotation / 日志轮转最大大小 */
  maxFileSize: number;

  /** Number of backup files to keep / 保留备份文件数 */
  maxFiles: number;

  /** Application name for identification / 应用标识名 */
  appName: string;

  /** Environment (development/production) / 环境 */
  environment: string;
}

/**
 * Default configuration based on environment
 */
function getDefaultConfig(): LoggerConfig {
  const isDev = process.env.NODE_ENV === 'development';

  return {
    minLevel: isDev ? LogLevel.DEBUG : LogLevel.INFO,
    enableConsole: true,
    enableFile: true,
    logDirectory: process.env.LOG_DIR || './logs',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    appName: 'ZLuxury',
    environment: process.env.NODE_ENV || 'development'
  };
}

// ============================================================================
// MAIN LOGGER CLASS / 主日志类
// ============================================================================

/**
 * ZLuxury Logger - Enterprise logging system
 * 
 * Provides structured logging with multiple output targets
 * Supports request tracing and performance monitoring
 */
export class ZLuxuryLogger {
  private config: LoggerConfig;
  private requestId: string | null = null;
  private userId: string | null = null;

  constructor(config?: Partial<LoggerConfig>) {
    this.config = { ...getDefaultConfig(), ...config };
    this.ensureLogDirectory();
  }

  /**
   * Ensure log directory exists
   * @private
   */
  private ensureLogDirectory(): void {
    const fs = require('fs');
    const path = require('path');

    if (!fs.existsSync(this.config.logDirectory)) {
      fs.mkdirSync(this.config.logDirectory, { recursive: true });
      this._log(LogLevel.INFO, 'Logger initialized', {
        directory: this.config.logDirectory,
        environment: this.config.environment
      });
    }
  }

  /**
   * Core logging method - all other methods call this
   * @param level - Log severity level
   * @param message - Human-readable message
   * @param data - Additional structured data
   * @private
   */
  private _log(level: LogLevel, message: string, data?: Record<string, any>): void {
    // Check if we should log at this level
    if (level > this.config.minLevel) return;

    // Build log entry
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      levelName: LOG_LEVEL_NAMES[level],
      message,
      data,
      source: this.getCallerLocation(),
      requestId: this.requestId || undefined,
      userId: this.userId || undefined,
      error: data?.error,
      stackTrace: data?.error?.stack
    };

    // Output to console
    if (this.config.enableConsole) {
      this.writeToConsole(entry);
    }

    // Output to file
    if (this.config.enableFile) {
      this.writeToFile(entry);
    }

    // Send to external service (in production)
    if (this.config.environment === 'production' && level <= LogLevel.ERROR) {
      this.sendToAlertService(entry);
    }
  }

  /**
   * Write formatted log entry to console
   * @private
   */
  private writeToConsole(entry: LogEntry): void {
    const color = LOG_COLORS[entry.level];
    const prefix = `${color}[${entry.levelName}]${RESET_COLOR}`;
    const time = `\x1b[90m${entry.timestamp}\x1b[0m`;
    const msg = `${prefix} ${time} ${entry.message}`;

    // Additional metadata
    let meta = '';
    if (entry.data && Object.keys(entry.data).length > 0) {
      const cleanData = { ...entry.data };
      delete cleanData.error; // Already handled separately
      meta = ` \x1b[90m${JSON.stringify(cleanData)}\x1b[0m`;
    }

    // Error details
    let errorInfo = '';
    if (entry.error) {
      errorInfo = `\n\x1b[31mError: ${entry.error.message}\x1b[0m`;
      if (entry.stackTrace) {
        errorInfo += `\n\x1b[31m${entry.stackTrace.split('\n').slice(0, 5).join('\n')}\x1b[0m`;
      }
    }

    // Request/user info
    let context = '';
    if (entry.requestId) context += ` \x1b[36mreq:${entry.requestId}\x1b[0m`;
    if (entry.userId) context += ` \x1b[33muser:${entry.userId}\x1b[0m`;

    console.log(`${msg}${meta}${context}${errorInfo}`);
  }

  /**
   * Write log entry to file (JSON format)
   * @private
   */
  private writeToFile(entry: LogEntry): void {
    try {
      const fs = require('fs');
      const path = require('path');

      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const filename = entry.level === LogLevel.ERROR ? `error-${date}.log` : `combined-${date}.log`;
      const filepath = path.join(this.config.logDirectory, filename);

      const logLine = JSON.stringify(entry) + '\n';
      fs.appendFileSync(filepath, logLine);
    } catch (err) {
      // Silently fail if file writing fails to avoid infinite loops
      console.error('Failed to write log to file:', err);
    }
  }

  /**
   * Send critical errors to alerting service
   * @private
   */
  private sendToAlertService(entry: LogEntry): void {
    // TODO: Integrate with Sentry, DataDog, or similar
    // For now, just log that we would send it
    if (process.env.ALERT_SERVICE_URL) {
      fetch(process.env.ALERT_SERVICE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      }).catch(() => { }); // Fire and forget
    }
  }

  /**
   * Get caller file location for source tracking
   * @private
   */
  private getCallerLocation(): string {
    try {
      const stack = new Error().stack;
      if (!stack) return 'unknown';

      // Parse stack trace to find caller
      const lines = stack.split('\n');
      // Skip internal logger calls (this._log -> public method -> actual caller)
      for (let i = 4; i < Math.min(lines.length, 10); i++) {
        const match = lines[i].match(/\((.*):(\d+):(\d+)\)/);
        if (match) {
          const filePath = match[1].replace(process.cwd(), '');
          return `${filePath}:${match[2]}`;
        }
      }
      return 'unknown';
    } catch {
      return 'unknown';
    }
  }

  // ==========================================================================
  // PUBLIC API - LEVEL METHODS / 公共API - 级别方法
  // ==========================================================================

  /**
   * Log error-level message
   * Use for: Failed operations, exceptions, system failures
   * 
   * @example
   * logger.error('Database connection failed', { host: 'localhost:5432', error: err })
   */
  error(message: string, data?: Record<string, any>): void {
    this._log(LogLevel.ERROR, message, data);
  }

  /**
   * Log warning-level message
   * Use for: Deprecated features, potential issues, non-critical problems
   * 
   * @example
   * logger.warn('Rate limit approaching', { current: 95, limit: 100 })
   */
  warn(message: string, data?: Record<string, any>): void {
    this._log(LogLevel.WARN, message, data);
  }

  /**
   * Log info-level message
   * Use for: Normal operations, business events, state changes
   * 
   * @example
   * logger.info('Order created', { orderId: 'ORD-001', amount: 15000 })
   */
  info(message: string, data?: Record<string, any>): void {
    this._log(LogLevel.INFO, message, data);
  }

  /**
   * Log debug-level message
   * Use for: Development troubleshooting, variable inspection
   * 
   * @example
   * logger.debug('Processing product', { productId: 'PROD-001', step: 'calculate-pricing' })
   */
  debug(message: string, data?: Record<string, any>): void {
    this._log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log trace-level message
   * Use for: Very detailed execution flow, performance profiling
   * 
   * @example
   * logger.trace('Function entered', { function: 'calculateTax', params: { amount: 1000 } })
   */
  trace(message: string, data?: Record<string, any>): void {
    this._log(LogLevel.TRACE, message, data);
  }

  // ==========================================================================
  // PUBLIC API - CONTEXT METHODS / 公共API - 上下文方法
  // ==========================================================================

  /**
   * Set request ID for distributed tracing
   * Call at the start of each HTTP request
   * 
   * @param requestId - Unique request identifier (UUID format recommended)
   */
  setRequestId(requestId: string): void {
    this.requestId = requestId;
  }

  /**
   * Set user ID for audit trail
   * Call after authentication
   * 
   * @param userId - Authenticated user's ID
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Clear request context (call at end of request)
   */
  clearContext(): void {
    this.requestId = null;
    this.userId = null;
  }

  // ==========================================================================
  // PUBLIC API - UTILITY METHODS / 公共API - 工具方法
  // ==========================================================================

  /**
   * Time an operation and log duration
   * Useful for performance monitoring
   * 
   * @param operationName - Name of operation being timed
   * @returns Timer object with .stop() method
   * 
   * @example
   * const timer = logger.startTimer('database-query');
   * await db.query('SELECT * FROM products');
   * timer.stop(); // Automatically logs duration
   */
  startTimer(operationName: string): { stop: () => void } {
    const startTime = Date.now();

    return {
      stop: () => {
        const duration = Date.now() - startTime;
        this.info(`${operationName} completed`, {
          operation: operationName,
          duration,
          unit: 'ms'
        });
      }
    };
  }

  /**
   * Create child logger with preset context
   * Useful for module-specific logging
   * 
   * @param module - Module name for context
   * @returns New logger instance bound to module
   * 
   * @example
   * const productLogger = logger.forModule('ProductService');
   * productLogger.info('Product loaded'); // Automatically includes module='ProductService'
   */
  forModule(module: string): any {
    // Return a proxy that prepends module to all log calls
    const self = this;
    return {
      error(msg: string, data?: Record<string, any>) {
        self.error(`[${module}] ${msg}`, { ...data, module });
      },
      warn(msg: string, data?: Record<string, any>) {
        self.warn(`[${module}] ${msg}`, { ...data, module });
      },
      info(msg: string, data?: Record<string, any>) {
        self.info(`[${module}] ${msg}`, { ...data, module });
      },
      debug(msg: string, data?: Record<string, any>) {
        self.debug(`[${module}] ${msg}`, { ...data, module });
      },
      startTimer(op: string) { return self.startTimer(`${module}:${op}`); }
    };
  }
}

// ============================================================================
// SINGLETON INSTANCE / 单例实例
// ============================================================================

/** Global logger instance */
export const logger = new ZLuxuryLogger();

// Export convenience methods for quick access
export const log = {
  error: (msg: string, data?: Record<string, any>) => logger.error(msg, data),
  warn: (msg: string, data?: Record<string, any>) => logger.warn(msg, data),
  info: (msg: string, data?: Record<string, any>) => logger.info(msg, data),
  debug: (msg: string, data?: Record<string, any>) => logger.debug(msg, data),
  trace: (msg: string, data?: Record<string, any>) => logger.trace(msg, data),
};

// Default export
export default logger;
