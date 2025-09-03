import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/authAPI'
import { api } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Mock user data for testing - userType will be calculated automatically based on age and role
const mockUsers = [
  {
    id: 1,
    email: 'adult@habitup.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'User', // Regular user, type determined by age
    subscriptionType: 'Free',
    isEmailVerified: true,
    phone: '+1234567890',
    dateOfBirth: '1990-01-01', // 34 years old - Adult
    gender: 'MALE',
    profilePicture: null,
    joinDate: '2024-01-01',
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'en'
    }
  },
  {
    id: 2,
    email: 'child@habitup.com',
    password: 'password123',
    firstName: 'Emma',
    lastName: 'Smith',
    role: 'User', // Regular user, type determined by age
    subscriptionType: 'Premium',
    isEmailVerified: true,
    phone: '+1987654321',
    dateOfBirth: '2015-05-15', // 8 years old - Child
    gender: 'FEMALE',
    profilePicture: null,
    joinDate: '2024-01-15',
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'en'
    }
  },
  {
    id: 3,
    email: 'elder@habitup.com',
    password: 'password123',
    firstName: 'Robert',
    lastName: 'Johnson',
    role: 'User', // Regular user, type determined by age
    subscriptionType: 'Premium',
    isEmailVerified: true,
    phone: '+1555666777',
    dateOfBirth: '1955-03-20', // 69 years old - Elder
    gender: 'MALE',
    profilePicture: null,
    joinDate: '2024-02-01',
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'en'
    }
  },
  {
    id: 4,
    email: 'doctor@habitup.com',
    password: 'password123',
    firstName: 'Dr. Sarah',
    lastName: 'Wilson',
    role: 'Doctor', // Doctor role overrides age-based determination
    subscriptionType: 'Professional',
    isEmailVerified: true,
    phone: '+1888999000',
    dateOfBirth: '1980-08-10', // 44 years old but role is Doctor
    gender: 'FEMALE',
    profilePicture: null,
    joinDate: '2024-01-10',
    preferences: {
      theme: 'dark',
      notifications: true,
      language: 'en'
    }
  },
  {
    id: 5,
    email: 'teen@habitup.com',
    password: 'password123',
    firstName: 'Alex',
    lastName: 'Taylor',
    role: 'User', // Regular user, type determined by age
    subscriptionType: 'Free',
    isEmailVerified: true,
    phone: '+1999888777',
    dateOfBirth: '2010-03-10', // 14 years old - Child
    gender: 'OTHER',
    profilePicture: null,
    joinDate: '2024-01-20',
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'en'
    }
  },
  {
    id: 6,
    email: 'senior@habitup.com',
    password: 'password123',
    firstName: 'Margaret',
    lastName: 'Williams',
    role: 'User', // Regular user, type determined by age
    subscriptionType: 'Premium',
    isEmailVerified: true,
    phone: '+1777666555',
    dateOfBirth: '1950-12-25', // 73 years old - Elder
    gender: 'FEMALE',
    profilePicture: null,
    joinDate: '2024-01-25',
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'en'
    }
  }
]

// Function to determine user type based on age and role
const determineUserType = (dateOfBirth, role) => {
  // If role is Doctor, return Doctor regardless of age
  if (role === 'Doctor') {
    return 'Doctor'
  }
  
  // Calculate age from dateOfBirth
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  // Determine user type based on age
  if (age < 18) {
    return 'Child'
  } else if (age >= 60) {
    return 'Elder'
  } else {
    return 'Adult'
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginProgress, setLoginProgress] = useState(0)

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const userData = localStorage.getItem('habitup_user')
      const token = localStorage.getItem('habitup_token')
      
      if (userData && token) {
        const parsedUser = JSON.parse(userData)
        
        // Recalculate user type in case age has changed
        const currentUserType = determineUserType(parsedUser.dateOfBirth, parsedUser.role)
        const userWithUpdatedType = {
          ...parsedUser,
          userType: currentUserType
        }
        
        // Update localStorage with recalculated user type
        localStorage.setItem('habitup_user', JSON.stringify(userWithUpdatedType))
        localStorage.setItem('userType', currentUserType)
        
        setUser(userWithUpdatedType)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('habitup_user')
      localStorage.removeItem('habitup_token')
    } finally {
      setIsLoading(false)
    }
  }

  // Check if we should use real API or mock data
  const USE_REAL_API = (import.meta.env.VITE_USE_REAL_API || import.meta.env.REACT_APP_USE_REAL_API) === 'true'

  const loginWithRealAPI = async (credentials) => {
    try {
      setLoginLoading(true)
      setLoginProgress(0)
      
      setLoginProgress(30)
      
      // Call real backend API
      const response = await authAPI.login(credentials)
      
      setLoginProgress(60)
      
      if (response.success) {
        const { user, token } = response.data
        
        setLoginProgress(80)
        
        // Determine user type
        const calculatedUserType = determineUserType(user.dateOfBirth, user.role)
        
        const userWithCalculatedType = {
          ...user,
          userType: calculatedUserType
        }
        
        setLoginProgress(90)
        
        // Store in localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('habitup_token', token)
        localStorage.setItem('habitup_user', JSON.stringify(userWithCalculatedType))
        
        // Store individual fields for HTML compatibility
        localStorage.setItem('name', `${user.firstName} ${user.lastName}`)
        localStorage.setItem('email', user.email)
        localStorage.setItem('userType', calculatedUserType)
        localStorage.setItem('subscriptionType', user.subscriptionType || 'Free')
        localStorage.setItem('phoneNo', user.phone || '')
        localStorage.setItem('dob', user.dateOfBirth)
        localStorage.setItem('gender', user.gender)
        localStorage.setItem('joinDate', user.joinDate || new Date().toISOString().split('T')[0])
        localStorage.setItem('userId', user.id.toString())
        
        setLoginProgress(100)
        
        // Update state
        setUser(userWithCalculatedType)
        setIsAuthenticated(true)
        
        console.log('Login successful, user authenticated:', user)
        
        return { success: true, user: userWithCalculatedType }
      } else {
        setLoginProgress(100)
        return { success: false, message: response.message || 'Login failed' }
      }
    } catch (error) {
      console.error('Login failed:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.'
      return { 
        success: false, 
        message: errorMessage
      }
    } finally {
      setLoginLoading(false)
      setLoginProgress(0)
    }
  }

  const loginWithMockData = async (credentials) => {
    try {
      setLoginLoading(true)
      setLoginProgress(0)
      
      // Enhanced loading simulation with progress
      setLoginProgress(20)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setLoginProgress(40)
      // Find user in mock data
      const foundUser = mockUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      )
      
      setLoginProgress(60)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      if (foundUser) {
        setLoginProgress(80)
        
        // Automatically determine user type based on age and role
        const calculatedUserType = determineUserType(foundUser.dateOfBirth, foundUser.role)
        
        // Update user object with calculated user type
        const userWithCalculatedType = {
          ...foundUser,
          userType: calculatedUserType
        }
        
        // Create mock token
        const token = `mock_token_${foundUser.id}_${Date.now()}`
        
        setLoginProgress(90)
        
        // Store in localStorage (matching HTML structure)
        localStorage.setItem('token', token)
        localStorage.setItem('habitup_token', token)
        localStorage.setItem('habitup_user', JSON.stringify(userWithCalculatedType))
        
        // Store individual fields for HTML compatibility
        localStorage.setItem('name', `${foundUser.firstName} ${foundUser.lastName}`)
        localStorage.setItem('email', foundUser.email)
        localStorage.setItem('userType', calculatedUserType)
        localStorage.setItem('subscriptionType', foundUser.subscriptionType)
        localStorage.setItem('phoneNo', foundUser.phone)
        localStorage.setItem('dob', foundUser.dateOfBirth)
        localStorage.setItem('gender', foundUser.gender)
        localStorage.setItem('joinDate', foundUser.joinDate)
        localStorage.setItem('userId', foundUser.id.toString())
        
        setLoginProgress(100)
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // Update state
        setUser(userWithCalculatedType)
        setIsAuthenticated(true)
        
        console.log('Login successful, user authenticated:', foundUser)
        
        return { success: true, user: userWithCalculatedType }
      } else {
        setLoginProgress(100)
        return { success: false, message: 'Invalid email or password' }
      }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        message: 'Login failed. Please try again.' 
      }
    } finally {
      setLoginLoading(false)
      setLoginProgress(0)
    }
  }

  const login = async (credentials) => {
    if (USE_REAL_API) {
      return await loginWithRealAPI(credentials)
    } else {
      return await loginWithMockData(credentials)
    }
  }

  const register = async (userData) => {
    try {
      setIsLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === userData.email)
      if (existingUser) {
        return { success: false, message: 'User with this email already exists' }
      }
      
      // Create new user (in real app, this would be saved to database)
      const newUser = {
        id: mockUsers.length + 1,
        ...userData,
        role: 'user',
        isEmailVerified: true, // Auto-verify for demo
        profilePicture: null,
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'en'
        }
      }
      
      // Add to mock users (this won't persist in real demo)
      mockUsers.push(newUser)
      
      return { success: true, message: 'Registration successful! You can now login.' }
    } catch (error) {
      console.error('Registration failed:', error)
      return { 
        success: false, 
        message: 'Registration failed. Please try again.' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      // Clear local state
      localStorage.clear()
      setUser(null)
      setIsAuthenticated(false)
      
      // Redirect to home page
      window.location.href = '/'
    }
  }

  const updateProfile = async (profileData) => {
    try {
      setIsLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update user data
      const updatedUser = { ...user, ...profileData }
      
      // Update localStorage
      localStorage.setItem('habitup_user', JSON.stringify(updatedUser))
      
      // Update state
      setUser(updatedUser)
      
      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Profile update failed:', error)
      return { 
        success: false, 
        message: 'Profile update failed.' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const changePassword = async (passwordData) => {
    try {
      setIsLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you'd verify the current password
      // For demo, just simulate success
      return { success: true, message: 'Password changed successfully!' }
    } catch (error) {
      console.error('Password change failed:', error)
      return { 
        success: false, 
        message: 'Password change failed.' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const forgotPassword = async (email) => {
    try {
      setIsLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return { success: true, message: 'Password reset email sent! (Demo mode)' }
    } catch (error) {
      console.error('Forgot password failed:', error)
      return { 
        success: false, 
        message: 'Failed to send reset email.' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      setIsLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return { success: true, message: 'Password reset successful! (Demo mode)' }
    } catch (error) {
      console.error('Password reset failed:', error)
      return { 
        success: false, 
        message: 'Password reset failed.' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const verifyEmail = async (token) => {
    try {
      setIsLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return { success: true, message: 'Email verified successfully! (Demo mode)' }
    } catch (error) {
      console.error('Email verification failed:', error)
      return { 
        success: false, 
        message: 'Email verification failed.' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = async () => {
    try {
      // In demo mode, just return true if user exists
      if (user) {
        return true
      } else {
        logout()
        return false
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
      return false
    }
  }

  // Admin login functionality
  const adminLogin = async (credentials) => {
    try {
      setLoginLoading(true)
      setLoginProgress(0)
      
      // Enhanced loading simulation with progress
      setLoginProgress(30)
      await new Promise(resolve => setTimeout(resolve, 400))
      
      // Check admin credentials
      if (credentials.email === 'superuser@habitup.com' && credentials.password === 'SuperUser@2024!') {
        setLoginProgress(70)
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Store admin data
        localStorage.setItem('adminToken', `admin_token_${Date.now()}`)
        localStorage.setItem('adminName', 'Super Admin')
        localStorage.setItem('adminEmail', 'superuser@habitup.com')
        localStorage.setItem('adminRole', 'superuser')
        localStorage.setItem('isDemoAdmin', 'false')
        
        setLoginProgress(100)
        await new Promise(resolve => setTimeout(resolve, 200))
        
        return { success: true, isAdmin: true }
      } else {
        setLoginProgress(100)
        return { success: false, message: 'Invalid admin credentials' }
      }
    } catch (error) {
      console.error('Admin login failed:', error)
      return { 
        success: false, 
        message: 'Admin login failed. Please try again.' 
      }
    } finally {
      setLoginLoading(false)
      setLoginProgress(0)
    }
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    loginLoading,
    loginProgress,
    login,
    adminLogin,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    refreshToken,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext