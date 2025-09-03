import { apiLogger as logger } from './logger';
import Performance from './performance';

const DEFAULT_OPTIONS = {
  retries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  shouldRetry: (error) => {
    // Retry on network errors and 5xx server errors
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  }
};

export class RetryError extends Error {
  constructor(originalError, attempts) {
    super(`Operation failed after ${attempts} attempts`);
    this.name = 'RetryError';
    this.originalError = originalError;
    this.attempts = attempts;
  }
}

export const withRetry = async (operation, options = {}) => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let lastError;
  let delay = config.initialDelay;

  Performance.start('retry_operation');

  for (let attempt = 1; attempt <= config.retries; attempt++) {
    try {
      const result = await operation();
      Performance.end('retry_operation');
      return result;
    } catch (error) {
      lastError = error;

      // Log the error
      logger.warn(`Attempt ${attempt} failed:`, error);

      // Check if we should retry
      if (attempt === config.retries || !config.shouldRetry(error)) {
        break;
      }

      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, config.maxDelay);
    }
  }

  Performance.end('retry_operation');
  throw new RetryError(lastError, config.retries);
};

// Helper to create a retryable API call
export const createRetryableOperation = (apiCall, options = {}) => {
  return (...args) => withRetry(() => apiCall(...args), options);
};
