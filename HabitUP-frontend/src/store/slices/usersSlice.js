import { createSlice } from '@reduxjs/toolkit'

const generateDemoUsers = () => [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    status: 'active',
    subscription: 'Premium',
    joinDate: '2024-01-15',
    lastActive: '2024-07-27',
    habits: 12,
    streak: 45,
    avatar: '/img/user.png'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'active',
    subscription: 'Basic',
    joinDate: '2024-02-20',
    lastActive: '2024-07-26',
    habits: 8,
    streak: 23,
    avatar: '/img/user.png'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    status: 'inactive',
    subscription: 'Free',
    joinDate: '2024-03-10',
    lastActive: '2024-07-20',
    habits: 3,
    streak: 0,
    avatar: '/img/user.png'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    status: 'suspended',
    subscription: 'Premium',
    joinDate: '2024-01-05',
    lastActive: '2024-07-15',
    habits: 15,
    streak: 0,
    avatar: '/img/user.png'
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@example.com',
    status: 'active',
    subscription: 'Basic',
    joinDate: '2024-04-12',
    lastActive: '2024-07-27',
    habits: 6,
    streak: 12,
    avatar: '/img/user.png'
  }
]

const initialState = {
  users: generateDemoUsers(),
  loading: false,
  error: null,
  searchQuery: '',
  filterStatus: 'all',
  filterSubscription: 'all',
  currentPage: 1,
  usersPerPage: 10,
  totalUsers: 1248,
  selectedUser: null,
  isEditModalOpen: false,
  isDeleteModalOpen: false
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setUsers: (state, action) => {
      state.users = action.payload
    },
    addUser: (state, action) => {
      state.users.unshift({
        id: Date.now(),
        ...action.payload,
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        habits: 0,
        streak: 0,
        avatar: '/img/user.png'
      })
      state.totalUsers += 1
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id)
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload }
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload)
      state.totalUsers -= 1
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
      state.currentPage = 1
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload
      state.currentPage = 1
    },
    setFilterSubscription: (state, action) => {
      state.filterSubscription = action.payload
      state.currentPage = 1
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload
    },
    setEditModalOpen: (state, action) => {
      state.isEditModalOpen = action.payload
    },
    setDeleteModalOpen: (state, action) => {
      state.isDeleteModalOpen = action.payload
    },
    bulkUpdateUsers: (state, action) => {
      const { userIds, updates } = action.payload
      state.users = state.users.map(user => 
        userIds.includes(user.id) ? { ...user, ...updates } : user
      )
    }
  }
})

export const {
  setLoading,
  setError,
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setSearchQuery,
  setFilterStatus,
  setFilterSubscription,
  setCurrentPage,
  setSelectedUser,
  setEditModalOpen,
  setDeleteModalOpen,
  bulkUpdateUsers
} = usersSlice.actions

export default usersSlice.reducer