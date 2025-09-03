import axios from 'axios';
import getConfig from './config.js';
import { Environment } from './environment.js';

// Get configuration
const config = getConfig();

// Create axios instance with base configuration
const createApiClient = () => {
  const client = axios.create({
    baseURL: config.apiUrl,
    timeout: config.apiTimeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  client.interceptors.request.use(
    (requestConfig) => {
      const token = localStorage.getItem('habitup_token');
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log requests in development
      if (config.enableDebug) {
        Environment.log('API Request:', {
          method: requestConfig.method?.toUpperCase(),
          url: `${requestConfig.baseURL}${requestConfig.url}`,
          data: requestConfig.data,
        });
      }
      
      return requestConfig;
    },
    (error) => {
      Environment.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token expiration and errors
  client.interceptors.response.use(
    (response) => {
      // Log successful responses in development
      if (config.enableDebug) {
        Environment.log('API Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
      }
      
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Log errors in development
      if (config.enableDebug) {
        Environment.error('API Error:', {
          status: error.response?.status,
          url: originalRequest?.url,
          message: error.message,
          data: error.response?.data,
        });
      }

      // Handle token expiration and refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh token
          const refreshResponse = await client.post('/auth/refresh');
          const { token } = refreshResponse.data.data;
          
          // Update stored token
          localStorage.setItem('habitup_token', token);
          
          // Update the failed request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          // Retry the original request
          return client(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear auth data and redirect
          localStorage.removeItem('habitup_token');
          localStorage.removeItem('habitup_user');
          
          // Redirect to login page
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
          
          return Promise.reject(refreshError);
        }
      }

      // Handle different error types
      const enhancedError = enhanceError(error);
      return Promise.reject(enhancedError);
    }
  );

  return client;
};

// Error enhancement utility
const enhanceError = (error) => {
  if (!error.response) {
    // Network error or no response
    error.userMessage = 'Network error. Please check your connection and try again.';
    error.type = 'NETWORK_ERROR';
  } else {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        error.userMessage = data?.message || 'Invalid request. Please check your input.';
        error.type = 'VALIDATION_ERROR';
        break;
      case 401:
        error.userMessage = 'Authentication required. Please log in again.';
        error.type = 'AUTH_ERROR';
        break;
      case 403:
        error.userMessage = 'You do not have permission to perform this action.';
        error.type = 'PERMISSION_ERROR';
        break;
      case 404:
        error.userMessage = 'The requested resource was not found.';
        error.type = 'NOT_FOUND_ERROR';
        break;
      case 429:
        error.userMessage = 'Too many requests. Please wait a moment and try again.';
        error.type = 'RATE_LIMIT_ERROR';
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        error.userMessage = 'Server error. Please try again later.';
        error.type = 'SERVER_ERROR';
        break;
      default:
        error.userMessage = data?.message || 'An unexpected error occurred.';
        error.type = 'UNKNOWN_ERROR';
    }
  }

  return error;
};

// Create and export the API client instance
const apiClient = createApiClient();

// Helper function for handling API responses consistently
export const handleApiResponse = async (apiCall) => {
  try {
    const response = await apiCall();
    return {
      success: true,
      data: response.data,
      error: null,
    };
  } catch (error) {
    Environment.error('API call failed:', error);
    return {
      success: false,
      data: null,
      error: {
        message: error.userMessage || error.message,
        type: error.type || 'UNKNOWN_ERROR',
        status: error.response?.status,
        details: config.enableDebug ? error : undefined,
      },
    };
  }
};

// Helper function for creating consistent error responses
export const createErrorResponse = (message, type = 'UNKNOWN_ERROR', status = null) => ({
  success: false,
  data: null,
  error: {
    message,
    type,
    status,
  },
});

export default apiClient;
