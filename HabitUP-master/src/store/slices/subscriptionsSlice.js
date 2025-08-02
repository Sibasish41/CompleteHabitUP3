import { createSlice } from '@reduxjs/toolkit'

const generateDemoPlans = () => [
  {
    id: 1,
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Up to 3 habits',
      'Basic tracking',
      'Mobile app access',
      'Email support'
    ],
    limits: {
      habits: 3,
      reminders: 1,
      analytics: false,
      export: false
    },
    status: 'active',
    users: 456,
    revenue: 0,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 2,
    name: 'Basic',
    price: 9.99,
    interval: 'month',
    features: [
      'Up to 10 habits',
      'Advanced tracking',
      'Custom reminders',
      'Basic analytics',
      'Priority support'
    ],
    limits: {
      habits: 10,
      reminders: 5,
      analytics: true,
      export: true
    },
    status: 'active',
    users: 324,
    revenue: 3236.76,
    createdAt: '2024-01-01',
    updatedAt: '2024-06-15'
  },
  {
    id: 3,
    name: 'Premium',
    price: 19.99,
    interval: 'month',
    features: [
      'Unlimited habits',
      'Advanced analytics',
      'Custom categories',
      'Data export',
      'Priority support',
      'Team collaboration'
    ],
    limits: {
      habits: -1, // unlimited
      reminders: -1,
      analytics: true,
      export: true
    },
    status: 'active',
    users: 468,
    revenue: 9355.32,
    createdAt: '2024-01-01',
    updatedAt: '2024-07-01'
  }
]

const generateDemoSubscriptions = () => [
  {
    id: 1,
    userId: 1,
    planId: 3,
    planName: 'Premium',
    status: 'active',
    startDate: '2024-06-01',
    endDate: '2024-07-01',
    nextBilling: '2024-08-01',
    amount: 19.99,
    currency: 'USD',
    paymentMethod: 'Credit Card',
    autoRenew: true
  },
  {
    id: 2,
    userId: 2,
    planId: 2,
    planName: 'Basic',
    status: 'active',
    startDate: '2024-07-01',
    endDate: '2024-08-01',
    nextBilling: '2024-08-01',
    amount: 9.99,
    currency: 'USD',
    paymentMethod: 'PayPal',
    autoRenew: true
  },
  {
    id: 3,
    userId: 4,
    planId: 3,
    planName: 'Premium',
    status: 'cancelled',
    startDate: '2024-05-01',
    endDate: '2024-07-15',
    nextBilling: null,
    amount: 19.99,
    currency: 'USD',
    paymentMethod: 'Credit Card',
    autoRenew: false
  }
]

const initialState = {
  plans: generateDemoPlans(),
  subscriptions: generateDemoSubscriptions(),
  loading: false,
  error: null,
  selectedPlan: null,
  selectedSubscription: null,
  isEditPlanModalOpen: false,
  isDeletePlanModalOpen: false,
  isEditSubscriptionModalOpen: false,
  revenue: {
    total: 12592.08,
    monthly: 1248.32,
    growth: 15.3
  },
  analytics: {
    conversionRate: 12.5,
    churnRate: 3.2,
    averageRevenue: 14.67
  }
}

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    // Plan management
    addPlan: (state, action) => {
      const newPlan = {
        id: Date.now(),
        ...action.payload,
        users: 0,
        revenue: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }
      state.plans.push(newPlan)
    },
    updatePlan: (state, action) => {
      const index = state.plans.findIndex(plan => plan.id === action.payload.id)
      if (index !== -1) {
        state.plans[index] = {
          ...state.plans[index],
          ...action.payload,
          updatedAt: new Date().toISOString().split('T')[0]
        }
      }
    },
    deletePlan: (state, action) => {
      state.plans = state.plans.filter(plan => plan.id !== action.payload)
    },
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload
    },
    setEditPlanModalOpen: (state, action) => {
      state.isEditPlanModalOpen = action.payload
    },
    setDeletePlanModalOpen: (state, action) => {
      state.isDeletePlanModalOpen = action.payload
    },
    // Subscription management
    updateSubscription: (state, action) => {
      const index = state.subscriptions.findIndex(sub => sub.id === action.payload.id)
      if (index !== -1) {
        state.subscriptions[index] = { ...state.subscriptions[index], ...action.payload }
      }
    },
    cancelSubscription: (state, action) => {
      const subscription = state.subscriptions.find(sub => sub.id === action.payload)
      if (subscription) {
        subscription.status = 'cancelled'
        subscription.autoRenew = false
        subscription.endDate = new Date().toISOString().split('T')[0]
      }
    },
    setSelectedSubscription: (state, action) => {
      state.selectedSubscription = action.payload
    },
    setEditSubscriptionModalOpen: (state, action) => {
      state.isEditSubscriptionModalOpen = action.payload
    },
    // Analytics
    updateRevenue: (state, action) => {
      state.revenue = { ...state.revenue, ...action.payload }
    },
    updateAnalytics: (state, action) => {
      state.analytics = { ...state.analytics, ...action.payload }
    }
  }
})

export const {
  setLoading,
  setError,
  addPlan,
  updatePlan,
  deletePlan,
  setSelectedPlan,
  setEditPlanModalOpen,
  setDeletePlanModalOpen,
  updateSubscription,
  cancelSubscription,
  setSelectedSubscription,
  setEditSubscriptionModalOpen,
  updateRevenue,
  updateAnalytics
} = subscriptionsSlice.actions

export default subscriptionsSlice.reducer