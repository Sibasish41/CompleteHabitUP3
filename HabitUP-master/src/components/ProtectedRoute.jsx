import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

const ProtectedRoute = ({ children, requireAuth = true, redirectTo = '/' }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />
  }

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // If route requires no authentication (like login page) and user is authenticated
  if (!requireAuth && isAuthenticated) {
    // Redirect to dashboard or intended page
    const from = location.state?.from?.pathname || '/user-home'
    return <Navigate to={from} replace />
  }

  // Render the protected component
  return children
}

export default ProtectedRoute