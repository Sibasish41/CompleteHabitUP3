import { Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LoadingSpinner from './LoadingSpinner'

const AdminProtectedRoute = ({ children, redirectTo = '/' }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    // Check if admin is authenticated
    const adminToken = localStorage.getItem('adminToken')
    const adminEmail = localStorage.getItem('adminEmail')
    
    console.log('AdminProtectedRoute - Checking authentication:', {
      adminToken: adminToken ? 'exists' : 'missing',
      adminEmail: adminEmail ? 'exists' : 'missing',
      path: location.pathname
    })
    
    if (adminToken && adminEmail) {
      console.log('Admin authenticated, allowing access')
      setIsAdminAuthenticated(true)
    } else {
      console.log('Admin not authenticated, redirecting to home')
      setIsAdminAuthenticated(false)
    }
    
    setIsLoading(false)
  }, [])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />
  }

  // If admin is not authenticated, redirect to home
  if (!isAdminAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Render the admin component
  return children
}

export default AdminProtectedRoute