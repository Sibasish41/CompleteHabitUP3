// Main API services entry point
// This file provides a unified interface to all API services

import { api } from './api.js';
import { authAPI } from './authAPI.js';
import apiClient, { handleApiResponse, createErrorResponse } from '../utils/apiClient.js';

// Export all API services
export {
  // Main API service with all endpoints
  api,
  
  // Dedicated auth API service (legacy support)
  authAPI,
  
  // Core API client and utilities
  apiClient,
  handleApiResponse,
  createErrorResponse,
};

// Re-export specific API sections for convenience
export const {
  auth,
  habits,
  users,
  subscriptions,
  admin,
  meetings,
  coaches,
  chat,
  documents,
  notifications,
  analytics,
} = api;

// Unified API interface (recommended for new code)
export const API = {
  // Auth endpoints (uses improved authAPI)
  auth: authAPI,
  
  // All other endpoints from main api service
  habits: api.habits,
  users: api.users,
  subscriptions: api.subscriptions,
  admin: api.admin,
  meetings: api.meetings,
  coaches: api.coaches,
  chat: api.chat,
  documents: api.documents,
  notifications: api.notifications,
  analytics: api.analytics,
  
  // Utility functions
  client: apiClient,
  handleResponse: handleApiResponse,
  createError: createErrorResponse,
};

// Default export is the unified API interface
export default API;
