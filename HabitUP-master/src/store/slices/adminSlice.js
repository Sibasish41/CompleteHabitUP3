import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: false,
  adminData: null,
  isDemoMode: false,
  activeSection: 'dashboard',
  notifications: [
    { id: 1, message: 'New user registration', time: '5 mins ago', type: 'info', read: false },
    { id: 2, message: 'System backup completed', time: '1 hour ago', type: 'success', read: false },
    { id: 3, message: 'Payment failed for user', time: '2 hours ago', type: 'warning', read: false }
  ],
  systemHealth: {
    status: 'operational',
    uptime: '99.9%',
    services: {
      database: 'online',
      api: 'online',
      storage: 'online',
      email: 'online'
    }
  }
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    loginAdmin: (state, action) => {
      state.isAuthenticated = true
      state.adminData = action.payload.adminData
      state.isDemoMode = action.payload.isDemoMode
    },
    logoutAdmin: (state) => {
      state.isAuthenticated = false
      state.adminData = null
      state.isDemoMode = false
      state.activeSection = 'dashboard'
    },
    setActiveSection: (state, action) => {
      state.activeSection = action.payload
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now(),
        ...action.payload,
        read: false
      })
    },
    updateSystemHealth: (state, action) => {
      state.systemHealth = { ...state.systemHealth, ...action.payload }
    }
  }
})

export const {
  loginAdmin,
  logoutAdmin,
  setActiveSection,
  markNotificationRead,
  addNotification,
  updateSystemHealth
} = adminSlice.actions

export default adminSlice.reducer