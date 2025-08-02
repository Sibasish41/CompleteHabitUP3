import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    status: 'Active',
    subscription: 'Premium',
    joinDate: '2024-01-15',
    lastActive: '2 hours ago',
    avatar: null
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'Active',
    subscription: 'Free',
    joinDate: '2024-01-14',
    lastActive: '1 day ago',
    avatar: null
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    status: 'Inactive',
    subscription: 'Premium',
    joinDate: '2024-01-13',
    lastActive: '1 week ago',
    avatar: null
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    status: 'Active',
    subscription: 'Premium',
    joinDate: '2024-01-12',
    lastActive: '5 mins ago',
    avatar: null
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@example.com',
    status: 'Pending',
    subscription: 'Free',
    joinDate: '2024-01-11',
    lastActive: 'Never',
    avatar: null
  }
]

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page = 1, limit = 10, search = '', status = 'all' }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let filteredUsers = [...mockUsers]
      
      // Apply status filter
      if (status !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.status.toLowerCase() === status)
      }
      
      // Apply search filter
      if (search) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      // Apply pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex)
      
      return {
        users: paginatedUsers,
        total: filteredUsers.length,
        page,
        limit,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue, getState }) => {
    try {
      // Super user has full CRUD access
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newUser = {
        id: Date.now(),
        ...userData,
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: 'Never',
        avatar: null
      }
      
      return newUser
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { rejectWithValue, getState }) => {
    try {
      // Super user has full CRUD access
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      return { id, userData }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue, getState }) => {
    try {
      // Super user has full CRUD access
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return userId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const bulkUpdateUsers = createAsyncThunk(
  'users/bulkUpdateUsers',
  async ({ userIds, action }, { rejectWithValue, getState }) => {
    try {
      // Super user has full CRUD access
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      return { userIds, action }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const exportUsers = createAsyncThunk(
  'users/exportUsers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { users } = getState()
      // Super user has full CRUD access including export functionality
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const csvContent = "data:text/csv;charset=utf-8," + 
        "Name,Email,Status,Subscription,Join Date,Last Active\n" +
        users.list.map(user => 
          `${user.name},${user.email},${user.status},${user.subscription},${user.joinDate},${user.lastActive}`
        ).join("\n")
      
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", "users_export.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      return 'Export completed successfully'
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  list: [],
  total: 0,
  currentPage: 1,
  totalPages: 0,
  limit: 10,
  loading: false,
  error: null,
  selectedUsers: [],
  searchQuery: '',
  statusFilter: 'all',
  sortBy: 'name',
  sortOrder: 'asc',
  // Modal states
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  selectedUser: null,
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
      state.currentPage = 1 // Reset to first page when searching
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload
      state.currentPage = 1 // Reset to first page when filtering
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setSorting: (state, action) => {
      const { field, order } = action.payload
      state.sortBy = field
      state.sortOrder = order
    },
    setSelectedUsers: (state, action) => {
      state.selectedUsers = action.payload
    },
    toggleUserSelection: (state, action) => {
      const userId = action.payload
      if (state.selectedUsers.includes(userId)) {
        state.selectedUsers = state.selectedUsers.filter(id => id !== userId)
      } else {
        state.selectedUsers.push(userId)
      }
    },
    selectAllUsers: (state) => {
      state.selectedUsers = state.list.map(user => user.id)
    },
    clearUserSelection: (state) => {
      state.selectedUsers = []
    },
    // Modal actions
    showAddUserModal: (state) => {
      state.showAddModal = true
    },
    hideAddUserModal: (state) => {
      state.showAddModal = false
    },
    showEditUserModal: (state, action) => {
      state.showEditModal = true
      state.selectedUser = action.payload
    },
    hideEditUserModal: (state) => {
      state.showEditModal = false
      state.selectedUser = null
    },
    showDeleteUserModal: (state, action) => {
      state.showDeleteModal = true
      state.selectedUser = action.payload
    },
    hideDeleteUserModal: (state) => {
      state.showDeleteModal = false
      state.selectedUser = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload.users
        state.total = action.payload.total
        state.currentPage = action.payload.page
        state.totalPages = action.payload.totalPages
        state.limit = action.payload.limit
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false
        state.list.unshift(action.payload)
        state.total += 1
        state.showAddModal = false
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        const { id, userData } = action.payload
        const index = state.list.findIndex(user => user.id === id)
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...userData }
        }
        state.showEditModal = false
        state.selectedUser = null
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
        state.list = state.list.filter(user => user.id !== action.payload)
        state.total -= 1
        state.showDeleteModal = false
        state.selectedUser = null
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Bulk Update Users
      .addCase(bulkUpdateUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(bulkUpdateUsers.fulfilled, (state, action) => {
        state.loading = false
        const { userIds, action: bulkAction } = action.payload
        
        // Update users based on bulk action
        state.list = state.list.map(user => {
          if (userIds.includes(user.id)) {
            switch (bulkAction) {
              case 'activate':
                return { ...user, status: 'Active' }
              case 'deactivate':
                return { ...user, status: 'Inactive' }
              case 'delete':
                return null // Will be filtered out
              default:
                return user
            }
          }
          return user
        }).filter(Boolean) // Remove null values (deleted users)
        
        if (bulkAction === 'delete') {
          state.total -= userIds.length
        }
        
        state.selectedUsers = []
      })
      .addCase(bulkUpdateUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Export Users
      .addCase(exportUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(exportUsers.fulfilled, (state, action) => {
        state.loading = false
        // Could show success message here
      })
      .addCase(exportUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  setSearchQuery,
  setStatusFilter,
  setCurrentPage,
  setSorting,
  setSelectedUsers,
  toggleUserSelection,
  selectAllUsers,
  clearUserSelection,
  showAddUserModal,
  hideAddUserModal,
  showEditUserModal,
  hideEditUserModal,
  showDeleteUserModal,
  hideDeleteUserModal,
  clearError
} = userSlice.actions

export default userSlice.reducer