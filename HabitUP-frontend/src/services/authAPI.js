import apiClient, { handleApiResponse } from '../utils/apiClient.js'

export const authAPI = {
  // Login user with improved error handling
  login: async (credentials) => {
    return handleApiResponse(() => apiClient.post('/auth/login', credentials))
  },

  // Register new user with improved error handling
  register: async (userData) => {
    return handleApiResponse(() => apiClient.post('/auth/register', userData))
  },

  // Logout user with improved error handling
  logout: async () => {
    return handleApiResponse(() => apiClient.post('/auth/logout'))
  },

  // Verify JWT token with improved error handling
  verifyToken: async (token) => {
    const result = await handleApiResponse(() => 
      apiClient.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
    )
    
    // For backwards compatibility, return user data directly on success
    if (result.success) {
      return result.data.data.user
    }
    
    throw new Error(result.error.message)
  },

  // Refresh JWT token with improved error handling
  refreshToken: async () => {
    return handleApiResponse(() => apiClient.post('/auth/refresh'))
  },

  // Update user profile with improved error handling
  updateProfile: async (profileData) => {
    return handleApiResponse(() => apiClient.put('/auth/profile', profileData))
  },

  // Change password with improved error handling
  changePassword: async (passwordData) => {
    return handleApiResponse(() => apiClient.put('/auth/change-password', passwordData))
  },

  // Forgot password with improved error handling
  forgotPassword: async (email) => {
    return handleApiResponse(() => apiClient.post('/auth/forgot-password', { email }))
  },

  // Reset password with improved error handling
  resetPassword: async (token, newPassword) => {
    return handleApiResponse(() => 
      apiClient.post('/auth/reset-password', {
        token,
        password: newPassword
      })
    )
  },

  // Verify email with improved error handling
  verifyEmail: async (token) => {
    return handleApiResponse(() => apiClient.post('/auth/verify-email', { token }))
  },

  // Get user profile with improved error handling
  getProfile: async () => {
    return handleApiResponse(() => apiClient.get('/auth/profile'))
  },

  // Upload profile picture with improved error handling
  uploadProfilePicture: async (formData) => {
    return handleApiResponse(() => 
      apiClient.post('/auth/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    )
  },

  // Delete account with improved error handling
  deleteAccount: async (password) => {
    return handleApiResponse(() => 
      apiClient.delete('/auth/account', {
        data: { password }
      })
    )
  },

  // Get user statistics with improved error handling
  getUserStats: async () => {
    return handleApiResponse(() => apiClient.get('/auth/stats'))
  },

  // Update user preferences with improved error handling
  updatePreferences: async (preferences) => {
    return handleApiResponse(() => apiClient.put('/auth/preferences', preferences))
  }
}

export default apiClient