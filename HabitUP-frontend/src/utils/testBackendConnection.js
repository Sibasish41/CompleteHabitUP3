import { api } from '../services/api'

/**
 * Test backend connection and basic endpoints
 */
export const testBackendConnection = async () => {
  const results = {
    baseConnection: false,
    authEndpoints: false,
    errors: []
  }

  try {
    console.log('🔍 Testing backend connection...')
    
    // Test 1: Basic connection test
    try {
      const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:3001/api'
      const response = await fetch(apiUrl.replace('/api', '/health') || 'http://localhost:3001/health')
      if (response.ok) {
        results.baseConnection = true
        console.log('✅ Backend server is accessible')
      } else {
        console.log('❌ Backend server responded but with error:', response.status)
        results.errors.push(`Server responded with status: ${response.status}`)
      }
    } catch (error) {
      console.log('❌ Cannot connect to backend server:', error.message)
      results.errors.push(`Connection failed: ${error.message}`)
    }

    // Test 2: Test auth endpoints (if basic connection works)
    if (results.baseConnection) {
      try {
        // Try to call auth/verify without token (should get 401 or proper error)
        await api.auth.verifyToken('invalid_token')
      } catch (error) {
        if (error.response && error.response.status === 401) {
          results.authEndpoints = true
          console.log('✅ Authentication endpoints are working')
        } else if (error.response) {
          console.log('⚠️ Auth endpoints accessible but returned:', error.response.status)
          results.errors.push(`Auth endpoint returned: ${error.response.status}`)
        } else {
          console.log('❌ Auth endpoints not accessible:', error.message)
          results.errors.push(`Auth endpoints error: ${error.message}`)
        }
      }
    }

    return results
  } catch (error) {
    console.error('❌ Test failed:', error)
    results.errors.push(`Test failed: ${error.message}`)
    return results
  }
}

/**
 * Test login functionality with your backend
 */
export const testLogin = async (credentials) => {
  try {
    console.log('🔐 Testing login with credentials:', credentials.email)
    
    const response = await api.auth.login(credentials)
    console.log('✅ Login test successful:', response.data)
    return { success: true, data: response.data }
  } catch (error) {
    console.error('❌ Login test failed:', error)
    
    if (error.response) {
      // Backend responded with an error
      console.error('Backend error response:', error.response.data)
      return { 
        success: false, 
        error: error.response.data.message || 'Backend error',
        status: error.response.status 
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.request)
      return { 
        success: false, 
        error: 'Cannot connect to backend server',
        status: 'NETWORK_ERROR'
      }
    } else {
      console.error('Unexpected error:', error.message)
      return { 
        success: false, 
        error: error.message,
        status: 'UNKNOWN_ERROR'
      }
    }
  }
}

/**
 * Display connection test results
 */
export const displayTestResults = (results) => {
  console.log('\n📊 Backend Connection Test Results:')
  console.log('=====================================')
  console.log(`Base Connection: ${results.baseConnection ? '✅ SUCCESS' : '❌ FAILED'}`)
  console.log(`Auth Endpoints: ${results.authEndpoints ? '✅ SUCCESS' : '❌ FAILED'}`)
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors:')
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`)
    })
  }
  
  if (results.baseConnection && results.authEndpoints) {
    console.log('\n🎉 Backend is ready for integration!')
  } else {
    console.log('\n⚠️ Backend needs attention before proceeding.')
  }
}

export default testBackendConnection
