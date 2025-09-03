import apiClient, { handleApiResponse } from '../utils/apiClient.js'

// API Services
export const api = {
  // ===== AUTH ENDPOINTS =====
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
    logout: () => apiClient.post('/auth/logout'),
    verifyToken: (token) => apiClient.get('/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    }),
    refreshToken: () => apiClient.post('/auth/refresh'),
    forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => apiClient.post('/auth/reset-password', { token, password }),
    verifyEmail: (token) => apiClient.post('/auth/verify-email', { token }),
    getProfile: () => apiClient.get('/auth/profile'),
    updateProfile: (profileData) => apiClient.put('/auth/profile', profileData),
    changePassword: (passwordData) => apiClient.put('/auth/change-password', passwordData),
    uploadAvatar: (formData) => apiClient.post('/auth/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteAccount: (password) => apiClient.delete('/auth/account', { data: { password } }),
    getUserStats: () => apiClient.get('/auth/stats'),
    updatePreferences: (preferences) => apiClient.put('/auth/preferences', preferences),
  },

  // ===== HABITS ENDPOINTS =====
  habits: {
    getAll: () => apiClient.get('/habits'),
    getById: (id) => apiClient.get(`/habits/${id}`),
    create: (habitData) => apiClient.post('/habits', habitData),
    update: (id, habitData) => apiClient.put(`/habits/${id}`, habitData),
    delete: (id) => apiClient.delete(`/habits/${id}`),
    markComplete: (id, date) => apiClient.post(`/habits/${id}/complete`, { date }),
    markIncomplete: (id, date) => apiClient.post(`/habits/${id}/incomplete`, { date }),
    getProgress: (id, startDate, endDate) => apiClient.get(`/habits/${id}/progress`, {
      params: { startDate, endDate }
    }),
    getStreaks: (id) => apiClient.get(`/habits/${id}/streaks`),
    bulkUpdate: (habits) => apiClient.put('/habits/bulk', { habits }),
  },

  // ===== USER MANAGEMENT ENDPOINTS =====
  users: {
    getAll: (params) => apiClient.get('/users', { params }),
    getById: (id) => apiClient.get(`/users/${id}`),
    create: (userData) => apiClient.post('/users', userData),
    update: (id, userData) => apiClient.put(`/users/${id}`, userData),
    delete: (id) => apiClient.delete(`/users/${id}`),
    bulkUpdate: (userIds, updates) => apiClient.put('/users/bulk', { userIds, updates }),
    suspend: (id) => apiClient.put(`/users/${id}/suspend`),
    activate: (id) => apiClient.put(`/users/${id}/activate`),
    search: (query) => apiClient.get('/users/search', { params: { q: query } }),
  },

  // ===== SUBSCRIPTION ENDPOINTS =====
  subscriptions: {
    getAll: () => apiClient.get('/subscriptions'),
    getById: (id) => apiClient.get(`/subscriptions/${id}`),
    getUserSubscription: (userId) => apiClient.get(`/subscriptions/user/${userId}`),
    create: (subscriptionData) => apiClient.post('/subscriptions', subscriptionData),
    update: (id, subscriptionData) => apiClient.put(`/subscriptions/${id}`, subscriptionData),
    cancel: (id) => apiClient.put(`/subscriptions/${id}/cancel`),
    renew: (id) => apiClient.put(`/subscriptions/${id}/renew`),
    upgrade: (id, newPlan) => apiClient.put(`/subscriptions/${id}/upgrade`, { plan: newPlan }),
    downgrade: (id, newPlan) => apiClient.put(`/subscriptions/${id}/downgrade`, { plan: newPlan }),
  },

  // ===== ADMIN ENDPOINTS =====
  admin: {
    login: (credentials) => apiClient.post('/admin/login', credentials),
    getDashboard: () => apiClient.get('/admin/dashboard'),
    getAnalytics: (period) => apiClient.get('/admin/analytics', { params: { period } }),
    getReports: (type, startDate, endDate) => apiClient.get('/admin/reports', {
      params: { type, startDate, endDate }
    }),
    getSystemHealth: () => apiClient.get('/admin/health'),
    getSystemLogs: (level, limit) => apiClient.get('/admin/logs', {
      params: { level, limit }
    }),
    getErrorLogs: (limit) => apiClient.get('/admin/error-logs', { params: { limit } }),
    getSettings: () => apiClient.get('/admin/settings'),
    updateSettings: (settings) => apiClient.put('/admin/settings', settings),
    sendNotification: (notificationData) => apiClient.post('/admin/notifications', notificationData),
    backupData: () => apiClient.post('/admin/backup'),
    restoreData: (backupId) => apiClient.post('/admin/restore', { backupId }),
  },

  // ===== MEETINGS/COACHING ENDPOINTS =====
  meetings: {
    getAll: () => apiClient.get('/meetings'),
    getById: (id) => apiClient.get(`/meetings/${id}`),
    create: (meetingData) => apiClient.post('/meetings', meetingData),
    update: (id, meetingData) => apiClient.put(`/meetings/${id}`, meetingData),
    delete: (id) => apiClient.delete(`/meetings/${id}`),
    join: (id) => apiClient.post(`/meetings/${id}/join`),
    leave: (id) => apiClient.post(`/meetings/${id}/leave`),
    schedule: (meetingData) => apiClient.post('/meetings/schedule', meetingData),
    reschedule: (id, newDateTime) => apiClient.put(`/meetings/${id}/reschedule`, { dateTime: newDateTime }),
    cancel: (id, reason) => apiClient.put(`/meetings/${id}/cancel`, { reason }),
  },

  // ===== COACH/INSTRUCTOR ENDPOINTS =====
  coaches: {
    getAll: () => apiClient.get('/coaches'),
    getById: (id) => apiClient.get(`/coaches/${id}`),
    apply: (applicationData) => apiClient.post('/coaches/apply', applicationData),
    updateApplication: (id, applicationData) => apiClient.put(`/coaches/applications/${id}`, applicationData),
    approveApplication: (id) => apiClient.put(`/coaches/applications/${id}/approve`),
    rejectApplication: (id, reason) => apiClient.put(`/coaches/applications/${id}/reject`, { reason }),
    getApplications: () => apiClient.get('/coaches/applications'),
    getAvailability: (coachId) => apiClient.get(`/coaches/${coachId}/availability`),
    setAvailability: (coachId, availability) => apiClient.put(`/coaches/${coachId}/availability`, availability),
  },

  // ===== CHAT/MESSAGING ENDPOINTS =====
  chat: {
    getConversations: () => apiClient.get('/chat/conversations'),
    getMessages: (conversationId, page, limit) => apiClient.get(`/chat/conversations/${conversationId}/messages`, {
      params: { page, limit }
    }),
    sendMessage: (conversationId, messageData) => apiClient.post(`/chat/conversations/${conversationId}/messages`, messageData),
    createConversation: (participantIds) => apiClient.post('/chat/conversations', { participants: participantIds }),
    markAsRead: (conversationId, messageId) => apiClient.put(`/chat/conversations/${conversationId}/messages/${messageId}/read`),
    uploadFile: (conversationId, formData) => apiClient.post(`/chat/conversations/${conversationId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  },

  // ===== DOCUMENT UPLOAD ENDPOINTS =====
  documents: {
    upload: (formData) => apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAll: () => apiClient.get('/documents'),
    getById: (id) => apiClient.get(`/documents/${id}`),
    delete: (id) => apiClient.delete(`/documents/${id}`),
    download: (id) => apiClient.get(`/documents/${id}/download`, { responseType: 'blob' }),
  },

  // ===== NOTIFICATIONS ENDPOINTS =====
  notifications: {
    getAll: () => apiClient.get('/notifications'),
    markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
    markAllAsRead: () => apiClient.put('/notifications/read-all'),
    delete: (id) => apiClient.delete(`/notifications/${id}`),
    getSettings: () => apiClient.get('/notifications/settings'),
    updateSettings: (settings) => apiClient.put('/notifications/settings', settings),
  },

  // ===== ANALYTICS ENDPOINTS =====
  analytics: {
    getUserStats: (userId, period) => apiClient.get(`/analytics/users/${userId}`, { params: { period } }),
    getHabitStats: (habitId, period) => apiClient.get(`/analytics/habits/${habitId}`, { params: { period } }),
    getOverallStats: (period) => apiClient.get('/analytics/overall', { params: { period } }),
    getEngagementStats: (period) => apiClient.get('/analytics/engagement', { params: { period } }),
    getRetentionStats: (period) => apiClient.get('/analytics/retention', { params: { period } }),
  }
}

export default apiClient
