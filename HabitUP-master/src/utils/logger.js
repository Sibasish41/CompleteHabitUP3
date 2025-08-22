const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

class Logger {
  constructor(options = {}) {
    this.minLevel = options.minLevel || (process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG);
    this.namespace = options.namespace || 'App';
    this.enabled = options.enabled !== false;
    this.errorCallback = options.onError;
  }

  debug(...args) {
    if (!this.enabled || this.minLevel > LOG_LEVELS.DEBUG) return;
    console.debug(`[${this.namespace}]`, ...args);
  }

  info(...args) {
    if (!this.enabled || this.minLevel > LOG_LEVELS.INFO) return;
    console.info(`[${this.namespace}]`, ...args);
  }

  warn(...args) {
    if (!this.enabled || this.minLevel > LOG_LEVELS.WARN) return;
    console.warn(`[${this.namespace}]`, ...args);
  }

  error(error, context = {}) {
    if (!this.enabled || this.minLevel > LOG_LEVELS.ERROR) return;

    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      namespace: this.namespace
    };

    console.error(`[${this.namespace}] Error:`, errorInfo);

    // Send to error tracking service if callback provided
    if (this.errorCallback) {
      try {
        this.errorCallback(errorInfo);
      } catch (e) {
        console.error('Error in error callback:', e);
      }
    }

    return errorInfo;
  }

  // Create a child logger with a new namespace
  child(namespace) {
    return new Logger({
      ...this,
      namespace: `${this.namespace}:${namespace}`
    });
  }

  // Time an operation
  time(label, operation) {
    const start = performance.now();
    const result = operation();
    const duration = performance.now() - start;

    this.debug(`${label} took ${duration.toFixed(2)}ms`);
    return result;
  }

  // Time an async operation
  async timeAsync(label, operation) {
    const start = performance.now();
    const result = await operation();
    const duration = performance.now() - start;

    this.debug(`${label} took ${duration.toFixed(2)}ms`);
    return result;
  }
}

// Create default logger
const logger = new Logger();

// Create namespaced loggers
export const createLogger = (namespace, options = {}) => {
  return new Logger({ ...options, namespace });
};

// Pre-configured loggers for different areas
export const apiLogger = createLogger('API');
export const authLogger = createLogger('Auth');
export const routerLogger = createLogger('Router');
export const storeLogger = createLogger('Store');

export default logger;
