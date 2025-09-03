import { createSlice } from '@reduxjs/toolkit'

const generateDemoSystemLogs = () => [
  {
    id: 1,
    timestamp: '2024-07-27 14:30:25',
    level: 'INFO',
    service: 'API',
    message: 'User authentication successful',
    details: 'User john.doe@example.com logged in successfully',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 2,
    timestamp: '2024-07-27 14:28:15',
    level: 'WARNING',
    service: 'Database',
    message: 'Slow query detected',
    details: 'Query execution time: 2.5s - SELECT * FROM users WHERE status = active',
    ip: 'localhost',
    userAgent: 'Internal'
  },
  {
    id: 3,
    timestamp: '2024-07-27 14:25:10',
    level: 'ERROR',
    service: 'Payment',
    message: 'Payment processing failed',
    details: 'Credit card declined for user jane.smith@example.com',
    ip: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
  },
  {
    id: 4,
    timestamp: '2024-07-27 14:20:45',
    level: 'INFO',
    service: 'Email',
    message: 'Welcome email sent',
    details: 'Welcome email sent to new user mike.johnson@example.com',
    ip: 'localhost',
    userAgent: 'Internal'
  },
  {
    id: 5,
    timestamp: '2024-07-27 14:15:30',
    level: 'DEBUG',
    service: 'Cache',
    message: 'Cache cleared',
    details: 'User session cache cleared for maintenance',
    ip: 'localhost',
    userAgent: 'Admin'
  }
]

const generateDemoErrorLogs = () => [
  {
    id: 1,
    timestamp: '2024-07-27 14:25:10',
    level: 'ERROR',
    service: 'Payment',
    error: 'PaymentProcessingError',
    message: 'Credit card declined',
    stackTrace: `PaymentProcessingError: Credit card declined
    at PaymentService.processPayment (/app/services/payment.js:45)
    at UserController.upgradeSubscription (/app/controllers/user.js:123)
    at /app/routes/api.js:67`,
    userId: 2,
    userEmail: 'jane.smith@example.com',
    resolved: false,
    resolvedBy: null,
    resolvedAt: null,
    notes: ''
  },
  {
    id: 2,
    timestamp: '2024-07-27 13:45:22',
    level: 'ERROR',
    service: 'Database',
    error: 'ConnectionTimeoutError',
    message: 'Database connection timeout',
    stackTrace: `ConnectionTimeoutError: Connection timeout after 30000ms
    at Database.connect (/app/database/connection.js:78)
    at HabitService.getUserHabits (/app/services/habit.js:34)
    at UserController.getDashboard (/app/controllers/user.js:89)`,
    userId: null,
    userEmail: null,
    resolved: true,
    resolvedBy: 'admin@habitup.com',
    resolvedAt: '2024-07-27 14:00:00',
    notes: 'Database connection pool increased to handle load'
  },
  {
    id: 3,
    timestamp: '2024-07-27 12:30:15',
    level: 'ERROR',
    service: 'API',
    error: 'ValidationError',
    message: 'Invalid habit data provided',
    stackTrace: `ValidationError: Invalid habit data provided
    at HabitValidator.validate (/app/validators/habit.js:23)
    at HabitController.createHabit (/app/controllers/habit.js:56)
    at /app/routes/api.js:123`,
    userId: 4,
    userEmail: 'sarah.wilson@example.com',
    resolved: false,
    resolvedBy: null,
    resolvedAt: null,
    notes: 'User submitted invalid frequency value'
  }
]

const initialState = {
  systemLogs: generateDemoSystemLogs(),
  errorLogs: generateDemoErrorLogs(),
  loading: false,
  error: null,
  // System logs filters
  systemLogLevel: 'all',
  systemLogService: 'all',
  systemLogSearch: '',
  systemLogDateRange: 'today',
  // Error logs filters
  errorLogLevel: 'all',
  errorLogService: 'all',
  errorLogSearch: '',
  errorLogResolved: 'all',
  errorLogDateRange: 'today',
  // Pagination
  currentSystemLogPage: 1,
  currentErrorLogPage: 1,
  logsPerPage: 20,
  // Selected items
  selectedSystemLog: null,
  selectedErrorLog: null,
  // Modals
  isSystemLogModalOpen: false,
  isErrorLogModalOpen: false,
  isResolveErrorModalOpen: false
}

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    // System logs
    addSystemLog: (state, action) => {
      state.systemLogs.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        ...action.payload
      })
    },
    setSystemLogLevel: (state, action) => {
      state.systemLogLevel = action.payload
      state.currentSystemLogPage = 1
    },
    setSystemLogService: (state, action) => {
      state.systemLogService = action.payload
      state.currentSystemLogPage = 1
    },
    setSystemLogSearch: (state, action) => {
      state.systemLogSearch = action.payload
      state.currentSystemLogPage = 1
    },
    setSystemLogDateRange: (state, action) => {
      state.systemLogDateRange = action.payload
      state.currentSystemLogPage = 1
    },
    setCurrentSystemLogPage: (state, action) => {
      state.currentSystemLogPage = action.payload
    },
    setSelectedSystemLog: (state, action) => {
      state.selectedSystemLog = action.payload
    },
    setSystemLogModalOpen: (state, action) => {
      state.isSystemLogModalOpen = action.payload
    },
    // Error logs
    addErrorLog: (state, action) => {
      state.errorLogs.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        resolved: false,
        resolvedBy: null,
        resolvedAt: null,
        notes: '',
        ...action.payload
      })
    },
    resolveErrorLog: (state, action) => {
      const { id, resolvedBy, notes } = action.payload
      const errorLog = state.errorLogs.find(log => log.id === id)
      if (errorLog) {
        errorLog.resolved = true
        errorLog.resolvedBy = resolvedBy
        errorLog.resolvedAt = new Date().toISOString().replace('T', ' ').substring(0, 19)
        errorLog.notes = notes
      }
    },
    setErrorLogLevel: (state, action) => {
      state.errorLogLevel = action.payload
      state.currentErrorLogPage = 1
    },
    setErrorLogService: (state, action) => {
      state.errorLogService = action.payload
      state.currentErrorLogPage = 1
    },
    setErrorLogSearch: (state, action) => {
      state.errorLogSearch = action.payload
      state.currentErrorLogPage = 1
    },
    setErrorLogResolved: (state, action) => {
      state.errorLogResolved = action.payload
      state.currentErrorLogPage = 1
    },
    setErrorLogDateRange: (state, action) => {
      state.errorLogDateRange = action.payload
      state.currentErrorLogPage = 1
    },
    setCurrentErrorLogPage: (state, action) => {
      state.currentErrorLogPage = action.payload
    },
    setSelectedErrorLog: (state, action) => {
      state.selectedErrorLog = action.payload
    },
    setErrorLogModalOpen: (state, action) => {
      state.isErrorLogModalOpen = action.payload
    },
    setResolveErrorModalOpen: (state, action) => {
      state.isResolveErrorModalOpen = action.payload
    },
    // Bulk operations
    clearOldLogs: (state, action) => {
      const { type, daysOld } = action.payload
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)
      
      if (type === 'system' || type === 'all') {
        state.systemLogs = state.systemLogs.filter(log => 
          new Date(log.timestamp) > cutoffDate
        )
      }
      
      if (type === 'error' || type === 'all') {
        state.errorLogs = state.errorLogs.filter(log => 
          new Date(log.timestamp) > cutoffDate
        )
      }
    },
    exportLogs: (state, action) => {
      // This would trigger a download in the component
      // The actual export logic would be handled in the component
    }
  }
})

export const {
  setLoading,
  setError,
  addSystemLog,
  setSystemLogLevel,
  setSystemLogService,
  setSystemLogSearch,
  setSystemLogDateRange,
  setCurrentSystemLogPage,
  setSelectedSystemLog,
  setSystemLogModalOpen,
  addErrorLog,
  resolveErrorLog,
  setErrorLogLevel,
  setErrorLogService,
  setErrorLogSearch,
  setErrorLogResolved,
  setErrorLogDateRange,
  setCurrentErrorLogPage,
  setSelectedErrorLog,
  setErrorLogModalOpen,
  setResolveErrorModalOpen,
  clearOldLogs,
  exportLogs
} = logsSlice.actions

export default logsSlice.reducer