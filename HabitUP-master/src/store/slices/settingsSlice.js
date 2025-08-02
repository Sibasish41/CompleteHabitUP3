import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // General settings
  general: {
    siteName: 'HabitUP',
    siteDescription: 'Build better habits, transform your life',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxUsersPerPlan: {
      free: 1000,
      basic: 5000,
      premium: -1 // unlimited
    }
  },
  // Email settings
  email: {
    provider: 'smtp',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpSecure: true,
    smtpUser: 'noreply@habitup.com',
    smtpPassword: '••••••••',
    fromName: 'HabitUP Team',
    fromEmail: 'noreply@habitup.com',
    templates: {
      welcome: {
        subject: 'Welcome to HabitUP!',
        enabled: true
      },
      passwordReset: {
        subject: 'Reset Your Password',
        enabled: true
      },
      subscriptionExpiry: {
        subject: 'Your Subscription is Expiring',
        enabled: true
      }
    }
  },
  // Security settings
  security: {
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: false,
    sessionTimeout: 24, // hours
    maxLoginAttempts: 5,
    lockoutDuration: 30, // minutes
    twoFactorEnabled: false,
    ipWhitelist: [],
    rateLimiting: {
      enabled: true,
      requestsPerMinute: 100,
      requestsPerHour: 1000
    }
  },
  // Payment settings
  payment: {
    currency: 'USD',
    taxRate: 0.08,
    stripePublicKey: 'pk_test_••••••••',
    stripeSecretKey: 'sk_test_••••••••',
    paypalClientId: '••••••••',
    paypalClientSecret: '••••••••',
    webhookSecret: '••••••••',
    trialPeriod: 14, // days
    gracePeriod: 3 // days after subscription expires
  },
  // Notification settings
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    adminAlerts: {
      newUser: true,
      paymentFailed: true,
      systemError: true,
      highUsage: true
    },
    userNotifications: {
      habitReminder: true,
      streakMilestone: true,
      weeklyReport: true,
      subscriptionExpiry: true
    }
  },
  // API settings
  api: {
    version: 'v1',
    baseUrl: 'https://api.habitup.com',
    rateLimiting: true,
    cors: {
      enabled: true,
      origins: ['https://habitup.com', 'https://www.habitup.com']
    },
    authentication: {
      jwtSecret: '••••••••',
      jwtExpiration: '24h',
      refreshTokenExpiration: '7d'
    }
  },
  // Analytics settings
  analytics: {
    googleAnalyticsId: 'GA-••••••••',
    facebookPixelId: '••••••••',
    hotjarId: '••••••••',
    dataRetention: 365, // days
    anonymizeIp: true,
    trackingEnabled: true
  },
  // Backup settings
  backup: {
    enabled: true,
    frequency: 'daily',
    retention: 30, // days
    location: 's3',
    s3Bucket: 'habitup-backups',
    s3Region: 'us-east-1',
    lastBackup: '2024-07-27 02:00:00',
    nextBackup: '2024-07-28 02:00:00'
  },
  loading: false,
  error: null,
  activeTab: 'general',
  hasUnsavedChanges: false
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
    },
    setHasUnsavedChanges: (state, action) => {
      state.hasUnsavedChanges = action.payload
    },
    // General settings
    updateGeneralSettings: (state, action) => {
      state.general = { ...state.general, ...action.payload }
      state.hasUnsavedChanges = true
    },
    // Email settings
    updateEmailSettings: (state, action) => {
      state.email = { ...state.email, ...action.payload }
      state.hasUnsavedChanges = true
    },
    updateEmailTemplate: (state, action) => {
      const { template, settings } = action.payload
      state.email.templates[template] = { ...state.email.templates[template], ...settings }
      state.hasUnsavedChanges = true
    },
    // Security settings
    updateSecuritySettings: (state, action) => {
      state.security = { ...state.security, ...action.payload }
      state.hasUnsavedChanges = true
    },
    addToIpWhitelist: (state, action) => {
      if (!state.security.ipWhitelist.includes(action.payload)) {
        state.security.ipWhitelist.push(action.payload)
        state.hasUnsavedChanges = true
      }
    },
    removeFromIpWhitelist: (state, action) => {
      state.security.ipWhitelist = state.security.ipWhitelist.filter(ip => ip !== action.payload)
      state.hasUnsavedChanges = true
    },
    // Payment settings
    updatePaymentSettings: (state, action) => {
      state.payment = { ...state.payment, ...action.payload }
      state.hasUnsavedChanges = true
    },
    // Notification settings
    updateNotificationSettings: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload }
      state.hasUnsavedChanges = true
    },
    updateAdminAlerts: (state, action) => {
      state.notifications.adminAlerts = { ...state.notifications.adminAlerts, ...action.payload }
      state.hasUnsavedChanges = true
    },
    updateUserNotifications: (state, action) => {
      state.notifications.userNotifications = { ...state.notifications.userNotifications, ...action.payload }
      state.hasUnsavedChanges = true
    },
    // API settings
    updateApiSettings: (state, action) => {
      state.api = { ...state.api, ...action.payload }
      state.hasUnsavedChanges = true
    },
    updateCorsSettings: (state, action) => {
      state.api.cors = { ...state.api.cors, ...action.payload }
      state.hasUnsavedChanges = true
    },
    addCorsOrigin: (state, action) => {
      if (!state.api.cors.origins.includes(action.payload)) {
        state.api.cors.origins.push(action.payload)
        state.hasUnsavedChanges = true
      }
    },
    removeCorsOrigin: (state, action) => {
      state.api.cors.origins = state.api.cors.origins.filter(origin => origin !== action.payload)
      state.hasUnsavedChanges = true
    },
    // Analytics settings
    updateAnalyticsSettings: (state, action) => {
      state.analytics = { ...state.analytics, ...action.payload }
      state.hasUnsavedChanges = true
    },
    // Backup settings
    updateBackupSettings: (state, action) => {
      state.backup = { ...state.backup, ...action.payload }
      state.hasUnsavedChanges = true
    },
    updateBackupStatus: (state, action) => {
      const { lastBackup, nextBackup } = action.payload
      state.backup.lastBackup = lastBackup
      state.backup.nextBackup = nextBackup
    },
    // Save all settings
    saveAllSettings: (state) => {
      state.hasUnsavedChanges = false
      // In a real app, this would trigger an API call
    },
    // Reset settings
    resetSettings: (state, action) => {
      const section = action.payload
      switch (section) {
        case 'general':
          state.general = initialState.general
          break
        case 'email':
          state.email = initialState.email
          break
        case 'security':
          state.security = initialState.security
          break
        case 'payment':
          state.payment = initialState.payment
          break
        case 'notifications':
          state.notifications = initialState.notifications
          break
        case 'api':
          state.api = initialState.api
          break
        case 'analytics':
          state.analytics = initialState.analytics
          break
        case 'backup':
          state.backup = initialState.backup
          break
        default:
          return initialState
      }
      state.hasUnsavedChanges = true
    }
  }
})

export const {
  setLoading,
  setError,
  setActiveTab,
  setHasUnsavedChanges,
  updateGeneralSettings,
  updateEmailSettings,
  updateEmailTemplate,
  updateSecuritySettings,
  addToIpWhitelist,
  removeFromIpWhitelist,
  updatePaymentSettings,
  updateNotificationSettings,
  updateAdminAlerts,
  updateUserNotifications,
  updateApiSettings,
  updateCorsSettings,
  addCorsOrigin,
  removeCorsOrigin,
  updateAnalyticsSettings,
  updateBackupSettings,
  updateBackupStatus,
  saveAllSettings,
  resetSettings
} = settingsSlice.actions

export default settingsSlice.reducer