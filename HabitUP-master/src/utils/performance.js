import logger from './logger';

// Performance metrics storage
const metrics = new Map();

// Performance marks storage
const marks = new Map();

class Performance {
  // Start tracking an operation
  static start(operationName) {
    marks.set(operationName, performance.now());
  }

  // End tracking an operation
  static end(operationName) {
    const startTime = marks.get(operationName);
    if (!startTime) {
      logger.warn(`No start time found for operation: ${operationName}`);
      return;
    }

    const duration = performance.now() - startTime;
    marks.delete(operationName);

    // Store metric
    const metric = metrics.get(operationName) || {
      count: 0,
      totalDuration: 0,
      min: Infinity,
      max: -Infinity
    };

    metric.count++;
    metric.totalDuration += duration;
    metric.min = Math.min(metric.min, duration);
    metric.max = Math.max(metric.max, duration);
    metrics.set(operationName, metric);

    // Log if duration is above threshold
    if (duration > 1000) { // 1 second threshold
      logger.warn(`Slow operation detected: ${operationName} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  // Get metrics for an operation
  static getMetrics(operationName) {
    const metric = metrics.get(operationName);
    if (!metric) return null;

    return {
      ...metric,
      average: metric.totalDuration / metric.count
    };
  }

  // Get all metrics
  static getAllMetrics() {
    const result = {};
    metrics.forEach((metric, name) => {
      result[name] = {
        ...metric,
        average: metric.totalDuration / metric.count
      };
    });
    return result;
  }

  // Clear metrics
  static clear() {
    metrics.clear();
    marks.clear();
  }

  // Track a function execution
  static track(fn, operationName) {
    return (...args) => {
      Performance.start(operationName);
      try {
        const result = fn(...args);
        Performance.end(operationName);
        return result;
      } catch (error) {
        Performance.end(operationName);
        throw error;
      }
    };
  }

  // Track an async function execution
  static async trackAsync(fn, operationName) {
    Performance.start(operationName);
    try {
      const result = await fn();
      Performance.end(operationName);
      return result;
    } catch (error) {
      Performance.end(operationName);
      throw error;
    }
  }

  // Monitor React component render performance
  static withTracking(WrappedComponent, operationName) {
    return function TrackedComponent(props) {
      Performance.start(`${operationName || WrappedComponent.name}_render`);
      const element = <WrappedComponent {...props} />;
      Performance.end(`${operationName || WrappedComponent.name}_render`);
      return element;
    };
  }
}

// Hook for tracking component render performance
export const useTrackRender = (componentName) => {
  Performance.start(`${componentName}_render`);
  useEffect(() => {
    Performance.end(`${componentName}_render`);
  });
};

export default Performance;
