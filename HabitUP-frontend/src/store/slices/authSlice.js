import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunks for auth operations
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (email === 'superuser@habitup.com' && password === 'SuperUser@2024!') {
        const adminData = {
          id: 1,
          name: 'Super User',
          email: 'superuser@habitup.com',
          role: 'superuser',
          permissions: ['create', 'read', 'update', 'delete', 'manage_users', 'manage_system', 'view_analytics'],
          token: 'superuser_token_' + Date.now(),
          isDemoMode: false
        }
        
        // Store in localStorage
        localStorage.setItem('adminToken', adminData.token)
        localStorage.setItem('adminName', adminData.name)
        localStorage.setItem('adminEmail', adminData.email)
        localStorage.setItem('adminRole', adminData.role)
        localStorage.setItem('isDemoAdmin', 'false')
        
        return adminData
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const logoutAdmin = createAsyncThunk(
  'auth/logoutAdmin',
  async (_, { rejectWithValue }) => {
    try {
      // Clear localStorage
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminName')
      localStorage.removeItem('adminEmail')
      localStorage.removeItem('adminRole')
      localStorage.removeItem('isDemoAdmin')
      
      return null
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken')
      const name = localStorage.getItem('adminName')
      const email = localStorage.getItem('adminEmail')
      const role = localStorage.getItem('adminRole')
      const isDemoMode = localStorage.getItem('isDemoAdmin') === 'true'
      
      if (token && name && email) {
        return {
          id: 1,
          name,
          email,
          role: role || 'admin',
          token,
          isDemoMode
        }
      } else {
        throw new Error('No valid session found')
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  user: null,
  isAuthenticated: false,
  isDemoMode: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setDemoMode: (state, action) => {
      state.isDemoMode = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Login Admin
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.isDemoMode = action.payload.isDemoMode
        state.error = null
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.user = null
      })
      
      // Logout Admin
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
        state.isDemoMode = false
        state.error = null
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.isDemoMode = action.payload.isDemoMode
        state.error = null
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.user = null
      })
  },
})

export const { clearError, setDemoMode } = authSlice.actions
export default authSlice.reducer