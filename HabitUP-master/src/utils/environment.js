// Environment checker utility
export const Environment = {
  isDevelopment: () => import.meta.env.MODE === 'development',
  isProduction: () => import.meta.env.MODE === 'production',
  isTesting: () => import.meta.env.MODE === 'test',
  
  getEnv: () => import.meta.env.MODE || 'development',
  
  // Environment-specific logging
  log: (...args) => {
    if (Environment.isDevelopment()) {
      console.log('[DEV]', ...args);
    }
  },
  
  warn: (...args) => {
    if (Environment.isDevelopment()) {
      console.warn('[DEV]', ...args);
    }
  },
  
  error: (...args) => {
    if (Environment.isDevelopment()) {
      console.error('[DEV]', ...args);
    } else {
      // In production, you might want to send errors to a logging service
      console.error(...args);
    }
  },
  
  // Feature flags based on environment
  isFeatureEnabled: (featureName) => {
    const features = {
      development: {
        debugMode: true,
        mockData: true,
        detailedErrors: true,
      },
      production: {
        debugMode: false,
        mockData: false,
        detailedErrors: false,
      },
    };
    
    const env = Environment.getEnv();
    return features[env]?.[featureName] || false;
  },
};

export default Environment;
