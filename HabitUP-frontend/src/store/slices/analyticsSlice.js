import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Mock analytics data
const mockAnalyticsData = {
  overview: {
    totalUsers: 4193,
    activeUsers: 3337,
    totalHabits: 12456,
    completionRate: 78.5,
    revenue: 125000,
    engagement: 85.2
  },
  userGrowth: [
    { month: 'Jan', users: 2800, active: 2200 },
    { month: 'Feb', users: 3200, active: 2600 },
    { month: 'Mar', users: 3600, active: 2900 },
    { month: 'Apr', users: 3900, active: 3100 },
    { month: 'May', users: 4100, active: 3300 },
    { month: 'Jun', users: 4193, active: 3337 }
  ],
  habitStats: [
    { name: 'Daily Exercise', users: 1156, completion: '72%', growth: '+8.1%' },
    { name: 'Reading Books', users: 987, completion: '91%', growth: '+3.4%' },
    { name: 'Drink Water', users: 1456, completion: '94%', growth: '+2.8%' },
    { name: 'Journaling', users: 634, completion: '78%', growth: '+12.5%' },
    { name: 'Meditation', users: 892, completion: '85%', growth: '+5.7%' }
  ],
  userSegments: [
    { segment: 'Free Users', count: 3337, percentage: '79.6%', color: 'bg-gray-500' },
    { segment: 'Premium Users', count: 856, percentage: '20.4%', color: 'bg-purple-500' }
  ],
  deviceStats: [
    { device: 'Mobile', percentage: '68%', color: 'bg-blue-500' },
    { device: 'Desktop', percentage: '28%', color: 'bg-green-500' },
    { device: 'Tablet', percentage: '4%', color: 'bg-yellow-500' }
  ],
  revenueData: [
    { month: 'Jan', revenue: 85000, subscriptions: 650 },
    { month: 'Feb', revenue: 92000, subscriptions: 720 },
    { month: 'Mar', revenue: 105000, subscriptions: 780 },
    { month: 'Apr', revenue: 115000, subscriptions: 820 },
    { month: 'May', revenue: 120000, subscriptions: 850 },
    { month: 'Jun', revenue: 125000, subscriptions: 856 }
  ]
}

// Async thunks
export const fetchAnalyticsData = createAsyncThunk(
  'analytics/fetchAnalyticsData',
  async ({ dateRange = '30d' }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Return mock data (in real app, this would be filtered by dateRange)
      return mockAnalyticsData
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchUserGrowthData = createAsyncThunk(
  'analytics/fetchUserGrowthData',
  async ({ period = '6m' }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return mockAnalyticsData.userGrowth
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchHabitAnalytics = createAsyncThunk(
  'analytics/fetchHabitAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return mockAnalyticsData.habitStats
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchRevenueData = createAsyncThunk(
  'analytics/fetchRevenueData',
  async ({ period = '6m' }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return mockAnalyticsData.revenueData
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const exportAnalyticsReport = createAsyncThunk(
  'analytics/exportAnalyticsReport',
  async ({ format = 'csv', dateRange = '30d' }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState()
      if (auth.isDemoMode) {
        throw new Error('Demo Mode: Analytics export is not available in demo mode.')
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate report based on format
      if (format === 'csv') {
        const csvContent = "data:text/csv;charset=utf-8," + 
          "Metric,Value,Change\n" +
          `Total Users,${mockAnalyticsData.overview.totalUsers},+12.5%\n` +
          `Active Users,${mockAnalyticsData.overview.activeUsers},+8.3%\n` +
          `Total Habits,${mockAnalyticsData.overview.totalHabits},+15.2%\n` +
          `Completion Rate,${mockAnalyticsData.overview.completionRate}%,+2.1%\n` +
          `Revenue,₹${mockAnalyticsData.overview.revenue},+18.7%\n` +
          `Engagement,${mockAnalyticsData.overview.engagement}%,+5.4%`
        
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `analytics_report_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      
      return 'Analytics report exported successfully'
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  overview: {},
  userGrowth: [],
  habitStats: [],
  userSegments: [],
  deviceStats: [],
  revenueData: [],
  loading: false,
  error: null,
  dateRange: '30d',
  selectedMetric: 'users',
  refreshing: false,
  lastUpdated: null,
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload
    },
    setSelectedMetric: (state, action) => {
      state.selectedMetric = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setRefreshing: (state, action) => {
      state.refreshing = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Analytics Data
      .addCase(fetchAnalyticsData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
        state.loading = false
        state.overview = action.payload.overview
        state.userSegments = action.payload.userSegments
        state.deviceStats = action.payload.deviceStats
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch User Growth Data
      .addCase(fetchUserGrowthData.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserGrowthData.fulfilled, (state, action) => {
        state.loading = false
        state.userGrowth = action.payload
      })
      .addCase(fetchUserGrowthData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch Habit Analytics
      .addCase(fetchHabitAnalytics.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchHabitAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.habitStats = action.payload
      })
      .addCase(fetchHabitAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch Revenue Data
      .addCase(fetchRevenueData.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchRevenueData.fulfilled, (state, action) => {
        state.loading = false
        state.revenueData = action.payload
      })
      .addCase(fetchRevenueData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Export Analytics Report
      .addCase(exportAnalyticsReport.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(exportAnalyticsReport.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(exportAnalyticsReport.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  setDateRange,
  setSelectedMetric,
  clearError,
  setRefreshing
} = analyticsSlice.actions

export default analyticsSlice.reducer