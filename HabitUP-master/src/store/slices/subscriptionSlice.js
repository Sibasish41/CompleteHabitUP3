import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Mock subscription data
const mockSubscriptions = [
  {
    id: 1,
    user: 'John Doe',
    email: 'john.doe@example.com',
    plan: 'Premium',
    status: 'Active',
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    amount: 999,
    paymentMethod: 'Credit Card'
  },
  {
    id: 2,
    user: 'Jane Smith',
    email: 'jane.smith@example.com',
    plan: 'Free',
    status: 'Active',
    startDate: '2024-01-14',
    endDate: null,
    amount: 0,
    paymentMethod: null
  },
  {
    id: 3,
    user: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    plan: 'Premium',
    status: 'Expired',
    startDate: '2023-12-01',
    endDate: '2024-01-01',
    amount: 999,
    paymentMethod: 'UPI'
  }
]

const mockPlans = [
  {
    id: 1,
    name: 'Free',
    price: 0,
    duration: 'Forever',
    features: ['Basic habit tracking', 'Limited analytics', 'Community support'],
    active: true
  },
  {
    id: 2,
    name: 'Premium',
    price: 999,
    duration: '6 months',
    features: ['Advanced analytics', 'Custom habits', 'Priority support', 'Export data'],
    active: true
  }
]

// Async thunks
export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchSubscriptions',
  async ({ page = 1, limit = 10, search = '', status = 'all' }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let filteredSubs = [...mockSubscriptions]
      
      if (status !== 'all') {
        filteredSubs = filteredSubs.filter(sub => sub.status.toLowerCase() === status)
      }
      
      if (search) {
        filteredSubs = filteredSubs.filter(sub => 
          sub.user.toLowerCase().includes(search.toLowerCase()) ||
          sub.email.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedSubs = filteredSubs.slice(startIndex, endIndex)
      
      return {
        subscriptions: paginatedSubs,
        total: filteredSubs.length,
        page,
        limit,
        totalPages: Math.ceil(filteredSubs.length / limit)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchSubscriptionPlans = createAsyncThunk(
  'subscriptions/fetchSubscriptionPlans',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockPlans
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateSubscription = createAsyncThunk(
  'subscriptions/updateSubscription',
  async ({ id, data }, { rejectWithValue, getState }) => {
    try {
      // Super user has full CRUD access
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      return { id, data }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const cancelSubscription = createAsyncThunk(
  'subscriptions/cancelSubscription',
  async (subscriptionId, { rejectWithValue, getState }) => {
    try {
      // Super user has full CRUD access
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      return subscriptionId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createSubscriptionPlan = createAsyncThunk(
  'subscriptions/createSubscriptionPlan',
  async (planData, { rejectWithValue, getState }) => {
    try {
      // Super user has full CRUD access
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newPlan = {
        id: Date.now(),
        ...planData,
        active: true
      }
      
      return newPlan
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  list: [],
  plans: [],
  total: 0,
  currentPage: 1,
  totalPages: 0,
  limit: 10,
  loading: false,
  error: null,
  searchQuery: '',
  statusFilter: 'all',
  selectedSubscription: null,
  showAddPlanModal: false,
}

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
      state.currentPage = 1
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload
      state.currentPage = 1
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setSelectedSubscription: (state, action) => {
      state.selectedSubscription = action.payload
    },
    showAddPlanModal: (state) => {
      state.showAddPlanModal = true
    },
    hideAddPlanModal: (state) => {
      state.showAddPlanModal = false
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Subscriptions
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload.subscriptions
        state.total = action.payload.total
        state.currentPage = action.payload.page
        state.totalPages = action.payload.totalPages
        state.limit = action.payload.limit
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch Subscription Plans
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false
        state.plans = action.payload
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Update Subscription
      .addCase(updateSubscription.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.loading = false
        const { id, data } = action.payload
        const index = state.list.findIndex(sub => sub.id === id)
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...data }
        }
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Cancel Subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.loading = false
        const index = state.list.findIndex(sub => sub.id === action.payload)
        if (index !== -1) {
          state.list[index].status = 'Cancelled'
        }
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Create Subscription Plan
      .addCase(createSubscriptionPlan.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false
        state.plans.push(action.payload)
        state.showAddPlanModal = false
      })
      .addCase(createSubscriptionPlan.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  setSearchQuery,
  setStatusFilter,
  setCurrentPage,
  setSelectedSubscription,
  showAddPlanModal,
  hideAddPlanModal,
  clearError
} = subscriptionSlice.actions

export default subscriptionSlice.reducer