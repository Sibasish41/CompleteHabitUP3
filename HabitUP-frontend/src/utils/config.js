const getConfig = () => {
  const ENV = import.meta.env.MODE || 'development';

  // In development mode, API URL is optional (for frontend-only mode)
  const useRealAPI = (import.meta.env.VITE_USE_REAL_API || import.meta.env.REACT_APP_USE_REAL_API) === 'true';
  
  // Validate that required environment variables are set only when using real API
  if (useRealAPI && !import.meta.env.VITE_API_URL && !import.meta.env.REACT_APP_API_URL) {
    throw new Error('VITE_API_URL or REACT_APP_API_URL environment variable is required when using real API');
  }

  const baseConfig = {
    appName: import.meta.env.VITE_APP_NAME || import.meta.env.REACT_APP_APP_NAME || 'HabitUP',
    version: import.meta.env.VITE_VERSION || import.meta.env.REACT_APP_VERSION || '1.0.0',
    apiUrl: import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL,
    websocketUrl: import.meta.env.VITE_WEBSOCKET_URL || import.meta.env.REACT_APP_WEBSOCKET_URL,
    useRealAPI: (import.meta.env.VITE_USE_REAL_API || import.meta.env.REACT_APP_USE_REAL_API) === 'true',
    // API configuration
    apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || import.meta.env.REACT_APP_API_TIMEOUT, 10) || 30000,
    enableDebug: (import.meta.env.VITE_ENABLE_DEBUG || import.meta.env.REACT_APP_ENABLE_DEBUG) === 'true',
  };

  // Environment-specific overrides (if needed)
  const envConfig = {
    development: {
      enableDebug: true,
    },
    production: {
      enableDebug: false,
    },
    test: {
      enableDebug: false,
    },
  };

  return { ...baseConfig, ...envConfig[ENV] };
};

export default getConfig;
