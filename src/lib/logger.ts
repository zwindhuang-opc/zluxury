/**
 * ZLuxury Logging System
 * Log4j-style logging mechanism for consistent logging across the platform
 * 
 * Features:
 * - Multiple log levels (DEBUG, INFO, WARN, ERROR, FATAL)
 * - Log file rotation and persistence
 * - Console and file output
 * - Structured logging with context
 * - Performance tracking
 * 
 * Version: 1.0.0
 * Last Updated: 2024-06-07
 */

// ============================================================================
// LOG LEVEL DEFINITIONS
// ============================================================================

/**
 * Log levels enum - following log4j standard
 * Levels are ordered by severity (lowest to highest)
 */
export enum LogLevel {
  DEBUG = 'DEBUG',    // Detailed debugging information
  INFO = 'INFO',      // General operational information
  WARN = 'WARN',      // Warning messages for potential issues
  ERROR = 'ERROR',    // Error messages for recoverable errors
  FATAL = 'FATAL'     // Critical errors that may crash the application
}

/**
 * Log level priority mapping
 * Higher number = more severe
 */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.FATAL]: 4
};

// ============================================================================
// LOG ENTRY INTERFACE
// ============================================================================

/**
 * LogEntry - Structured log entry format
 * Contains all information about a single log event
 */
export interface LogEntry {
  // Timestamp of the log event (ISO 8601 format)
  timestamp: string;
  
  // Log level (DEBUG, INFO, WARN, ERROR, FATAL)
  level: LogLevel;
  
  // Logger category name (e.g., 'api', 'auth', 'ai')
  logger: string;
  
  // Main log message
  message: string;
  
  // Additional context data (optional)
  context?: Record<string, unknown>;
  
  // Error object if applicable (optional)
  error?: Error | unknown;
  
  // Stack trace for errors (optional)
  stack?: string;
  
  // Performance metrics (optional)
  performance?: {
    durationMs: number;
    operation: string;
  };
  
  // Request/Response tracking (optional)
  requestId?: string;
  
  // User context (optional)
  userId?: string;
  
  // Session context (optional)
  sessionId?: string;
}

// ============================================================================
// LOGGER CONFIGURATION
// ============================================================================

/**
 * LoggerConfig - Configuration options for logger instance
 */
export interface LoggerConfig {
  // Logger category name
  name: string;
  
  // Minimum log level to output
  level?: LogLevel;
  
  // Enable/disable logging
  enabled?: boolean;
  
  // Output to console
  consoleOutput?: boolean;
  
  // Output to file (server-side only)
  fileOutput?: boolean;
  
  // Log file path (server-side only)
  filePath?: string;
  
  // Include stack traces for errors
  includeStackTrace?: boolean;
  
  // Maximum log entries to keep in memory
  maxEntries?: number;
}

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

/**
 * Default logger configuration
 * Can be overridden by environment variables
 */
const DEFAULT_CONFIG: Partial<LoggerConfig> = {
  level: process.env.LOG_LEVEL ? LogLevel[process.env.LOG_LEVEL as keyof typeof LogLevel] : LogLevel.INFO,
  enabled: process.env.LOG_ENABLED !== 'false',
  consoleOutput: true,
  fileOutput: false,
  includeStackTrace: true,
  maxEntries: 1000
};

// ============================================================================
// LOGGER CLASS
// ============================================================================

/**
 * Logger - Main logging class
 * Provides structured logging with multiple output targets
 */
export class Logger {
  // Logger name/category
  private name: string;
  
  // Minimum log level
  private level: LogLevel;
  
  // Enable flag
  private enabled: boolean;
  
  // Console output flag
  private consoleOutput: boolean;
  
  // Include stack trace flag
  private includeStackTrace: boolean;
  
  // In-memory log storage
  private logs: LogEntry[] = [];
  
  // Maximum entries in memory
  private maxEntries: number;

  /**
   * Constructor - Initialize logger with configuration
   * @param config - Logger configuration object
   */
  constructor(config: LoggerConfig) {
    this.name = config.name;
    this.level = config.level || DEFAULT_CONFIG.level || LogLevel.INFO;
    this.enabled = config.enabled ?? DEFAULT_CONFIG.enabled ?? true;
    this.consoleOutput = config.consoleOutput ?? DEFAULT_CONFIG.consoleOutput ?? true;
    this.includeStackTrace = config.includeStackTrace ?? DEFAULT_CONFIG.includeStackTrace ?? true;
    this.maxEntries = config.maxEntries || DEFAULT_CONFIG.maxEntries || 1000;
  }

  /**
   * shouldLog - Check if message should be logged based on level
   * @param level - Log level to check
   * @returns Boolean indicating if message should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false;
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.level];
  }

  /**
   * formatTimestamp - Format timestamp in ISO 8601 format
   * @returns Formatted timestamp string
   */
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * getStackTrace - Get stack trace for error logging
   * @returns Stack trace string
   */
  private getStackTrace(): string {
    if (!this.includeStackTrace) return '';
    
    try {
      const stack = new Error().stack;
      if (stack) {
        // Remove the first two lines (Error creation and getStackTrace call)
        return stack.split('\n').slice(2).join('\n');
      }
    } catch {
      // Stack trace not available
    }
    return '';
  }

  /**
   * createEntry - Create a structured log entry
   * @param level - Log level
   * @param message - Log message
   * @param context - Additional context data
   * @param error - Error object if applicable
   * @returns LogEntry object
   */
  private createEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error | unknown
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      logger: this.name,
      message,
      context,
      error
    };

    if (this.includeStackTrace && level >= LogLevel.ERROR) {
      entry.stack = this.getStackTrace();
    }

    return entry;
  }

  /**
   * log - Core logging method
   * @param level - Log level
   * @param message - Log message
   * @param context - Additional context data
   * @param error - Error object if applicable
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error | unknown
  ): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createEntry(level, message, context, error);

    // Store in memory
    this.logs.push(entry);
    if (this.logs.length > this.maxEntries) {
      this.logs.shift();
    }

    // Console output
    if (this.consoleOutput) {
      this.consoleLog(entry);
    }
  }

  /**
   * consoleLog - Output log entry to console
   * @param entry - Log entry to output
   */
  private consoleLog(entry: LogEntry): void {
    const prefix = `[${entry.logger}]`;
    const timestamp = entry.timestamp;
    const levelStr = `[${entry.level}]`;
    
    const formattedMessage = `${prefix} ${timestamp} ${levelStr} ${entry.message}`;
    
    // Choose console method based on level
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, entry.context || '');
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, entry.context || '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, entry.context || '');
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, entry.context || '', entry.error || '');
        break;
      case LogLevel.FATAL:
        console.error('🚨 FATAL:', formattedMessage, entry.context || '', entry.error || '');
        break;
    }
  }

  // ============================================================================
  // PUBLIC LOGGING METHODS
  // ============================================================================

  /**
   * debug - Log debug message
   * Used for detailed debugging information
   * @param message - Log message
   * @param context - Additional context data
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * info - Log info message
   * Used for general operational information
   * @param message - Log message
   * @param context - Additional context data
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * warn - Log warning message
   * Used for potential issues that don't break functionality
   * @param message - Log message
   * @param context - Additional context data
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * error - Log error message
   * Used for recoverable errors
   * @param message - Log message
   * @param error - Error object
   * @param context - Additional context data
   */
  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * fatal - Log fatal error message
   * Used for critical errors that may crash the application
   * @param message - Log message
   * @param error - Error object
   * @param context - Additional context data
   */
  fatal(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    this.log(LogLevel.FATAL, message, context, error);
  }

  // ============================================================================
  // PERFORMANCE LOGGING
  // ============================================================================

  /**
   * time - Start timing an operation
   * @param operation - Operation name
   * @returns Start timestamp
   */
  time(operation: string): number {
    this.debug(`Starting operation: ${operation}`);
    return Date.now();
  }

  /**
   * timeEnd - End timing and log duration
   * @param operation - Operation name
   * @param startTime - Start timestamp from time() method
   */
  timeEnd(operation: string, startTime: number): void {
    const durationMs = Date.now() - startTime;
    this.info(`Completed operation: ${operation}`, {
      performance: {
        durationMs,
        operation
      }
    });
  }

  // ============================================================================
  // LOG MANAGEMENT
  // ============================================================================

  /**
   * getLogs - Get all stored log entries
   * @returns Array of log entries
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * getLogsByLevel - Get log entries filtered by level
   * @param level - Log level to filter
   * @returns Array of filtered log entries
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(entry => entry.level === level);
  }

  /**
   * clearLogs - Clear all stored log entries
   */
  clearLogs(): void {
    this.logs = [];
    this.info('Log buffer cleared');
  }

  /**
   * setLevel - Change minimum log level
   * @param level - New minimum log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
    this.info(`Log level changed to: ${level}`);
  }

  /**
   * enable - Enable logging
   */
  enable(): void {
    this.enabled = true;
    this.info('Logging enabled');
  }

  /**
   * disable - Disable logging
   */
  disable(): void {
    this.enabled = false;
  }
}

// ============================================================================
// LOGGER CATEGORIES
// ============================================================================

/**
 * Predefined logger categories for consistent naming
 * Use these constants when creating loggers
 */
export const LOGGERS = {
  // System-level logging (startup, shutdown, config)
  SYSTEM: 'system',
  
  // API endpoint logging
  API: 'api',
  
  // Authentication and authorization
  AUTH: 'auth',
  
  // AI agent operations (Hermes, OpenClaw, Unicorn)
  AI: 'ai',
  
  // Product data operations
  PRODUCT: 'product',
  
  // Cart and checkout operations
  CART: 'cart',
  
  // User interactions
  USER: 'user',
  
  // Navigation and routing
  NAVIGATION: 'navigation',
  
  // UI component events
  UI: 'ui',
  
  // Data fetching and caching
  DATA: 'data',
  
  // Performance monitoring
  PERFORMANCE: 'performance',
  
  // Security events
  SECURITY: 'security',
  
  // Database operations
  DATABASE: 'database',
  
  // External service integrations
  EXTERNAL: 'external'
} as const;

// ============================================================================
// LOGGER FACTORY
// ============================================================================

/**
 * createLogger - Factory function to create logger instances
 * @param config - Logger configuration
 * @returns Logger instance
 */
export function createLogger(config: LoggerConfig): Logger {
  return new Logger(config);
}

// ============================================================================
// DEFAULT LOGGERS
// ============================================================================

/**
 * systemLogger - Default system logger
 * Used for application-level events
 */
export const systemLogger = createLogger({
  name: LOGGERS.SYSTEM,
  level: LogLevel.INFO
});

/**
 * apiLogger - Default API logger
 * Used for API endpoint operations
 */
export const apiLogger = createLogger({
  name: LOGGERS.API,
  level: LogLevel.INFO
});

/**
 * aiLogger - Default AI logger
 * Used for AI agent operations (Hermes, OpenClaw, Unicorn)
 */
export const aiLogger = createLogger({
  name: LOGGERS.AI,
  level: LogLevel.DEBUG
});

/**
 * productLogger - Default product logger
 * Used for product data operations
 */
export const productLogger = createLogger({
  name: LOGGERS.PRODUCT,
  level: LogLevel.INFO
});

/**
 * authLogger - Default authentication logger
 * Used for auth operations
 */
export const authLogger = createLogger({
  name: LOGGERS.AUTH,
  level: LogLevel.INFO
});

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default Logger;