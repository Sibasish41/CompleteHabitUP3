import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminTopNav from '../components/admin/AdminTopNav'
import AdminDashboardOverview from '../components/admin/AdminDashboardOverview'
import AdminUserManagement from '../components/admin/AdminUserManagement'
import AdminSystemLogs from '../components/admin/AdminSystemLogs'
import AdminSubscriptions from '../components/admin/AdminSubscriptions'
import AdminHabitTracking from '../components/admin/AdminHabitTracking'
import AdminErrorLogs from '../components/admin/AdminErrorLogs'
import AdminSystemSettings from '../components/admin/AdminSystemSettings'
import AdminHealthCheck from '../components/admin/AdminHealthCheck'
import AdminAnalytics from '../components/admin/AdminAnalytics'
import AdminReports from '../components/admin/AdminReports'
import AdminBreadcrumb from '../components/admin/AdminBreadcrumb'

const AdminDashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [adminData, setAdminData] = useState(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Map URL paths to sections
  const pathToSection = {
    '/admin-dashboard': 'dashboard',
    '/admin/dashboard': 'dashboard',
    '/admin/users': 'users',
    '/admin/subscriptions': 'subscriptions',
    '/admin/habits': 'habits',
    '/admin/logs': 'logs',
    '/admin/error-logs': 'error-logs',
    '/admin/settings': 'settings',
    '/admin/health': 'health',
    '/admin/analytics': 'analytics',
    '/admin/reports': 'reports'
  }

  useEffect(() => {
    // Set active section based on URL
    const section = pathToSection[location.pathname] || 'dashboard'
    setActiveSection(section)
  }, [location.pathname])

  // Handle window resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      setSidebarOpen(!mobile)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Enhanced loading with progress simulation
    const loadAdmin = async () => {
      setLoadingProgress(20)
      
      // Check if user is logged in as admin
      const adminToken = localStorage.getItem('adminToken')
      const adminName = localStorage.getItem('adminName')
      const adminEmail = localStorage.getItem('adminEmail')
      const isDemoAdmin = localStorage.getItem('isDemoAdmin') === 'true'

      setLoadingProgress(50)

      if (!adminToken) {
        // Redirect to home if not logged in
        navigate('/')
        return
      }

      setLoadingProgress(80)

      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 500))

      setAdminData({
        name: adminName || 'Admin',
        email: adminEmail || 'admin@habitup.com',
        token: adminToken
      })
      setIsDemoMode(isDemoAdmin)
      setLoadingProgress(100)
      
      // Small delay before hiding loading
      setTimeout(() => setIsLoading(false), 200)
    }

    loadAdmin()
  }, [navigate])

  // Handle URL-based routing
  useEffect(() => {
    const path = location.pathname
    if (path.includes('/admin/users')) {
      setActiveSection('users')
    } else if (path.includes('/admin/subscriptions')) {
      setActiveSection('subscriptions')
    } else if (path.includes('/admin/habits')) {
      setActiveSection('habits')
    } else if (path.includes('/admin/error-logs')) {
      setActiveSection('error-logs')
    } else if (path.includes('/admin/logs')) {
      setActiveSection('logs')
    } else if (path.includes('/admin/settings')) {
      setActiveSection('settings')
    } else if (path.includes('/admin/health')) {
      setActiveSection('health')
    } else if (path.includes('/admin/analytics')) {
      setActiveSection('analytics')
    } else if (path.includes('/admin/reports')) {
      setActiveSection('reports')
    } else {
      setActiveSection('dashboard')
    }
  }, [location.pathname])

  // Handle section changes with URL updates
  const handleSectionChange = (section) => {
    setActiveSection(section)
    const routeMap = {
      'dashboard': '/admin/dashboard',
      'users': '/admin/users',
      'subscriptions': '/admin/subscriptions',
      'habits': '/admin/habits',
      'logs': '/admin/logs',
      'error-logs': '/admin/error-logs',
      'settings': '/admin/settings',
      'health': '/admin/health',
      'analytics': '/admin/analytics',
      'reports': '/admin/reports'
    }
    navigate(routeMap[section] || '/admin/dashboard')
  }

  const handleLogout = () => {
    // Clear admin data
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminName')
    localStorage.removeItem('adminEmail')
    localStorage.removeItem('adminRole')
    localStorage.removeItem('isDemoAdmin')
    
    // Redirect to home
    navigate('/')
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboardOverview isDemoMode={isDemoMode} />
      case 'users':
        return <AdminUserManagement isDemoMode={isDemoMode} />
      case 'subscriptions':
        return <AdminSubscriptions isDemoMode={isDemoMode} />
      case 'habits':
        return <AdminHabitTracking isDemoMode={isDemoMode} />
      case 'logs':
        return <AdminSystemLogs isDemoMode={isDemoMode} />
      case 'error-logs':
        return <AdminErrorLogs isDemoMode={isDemoMode} />
      case 'settings':
        return <AdminSystemSettings isDemoMode={isDemoMode} />
      case 'health':
        return <AdminHealthCheck isDemoMode={isDemoMode} />
      case 'analytics':
        return <AdminAnalytics isDemoMode={isDemoMode} />
      case 'reports':
        return <AdminReports isDemoMode={isDemoMode} />
      default:
        return <AdminDashboardOverview isDemoMode={isDemoMode} />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center overflow-hidden">
        <div className="text-center p-8">
          {/* Enhanced Loading Animation */}
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-white/20 rounded-full mx-auto"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          {/* Loading Text */}
          <h2 className="text-2xl font-bold text-white mb-4">Loading Admin Dashboard</h2>
          <p className="text-white/80 mb-6">Preparing your administrative interface...</p>
          
          {/* Progress Bar */}
          <div className="w-64 bg-white/20 rounded-full h-2 mx-auto mb-4">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          
          {/* Progress Text */}
          <p className="text-white/60 text-sm">{loadingProgress}% Complete</p>
          
          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-4 h-4 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-6 h-6 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-20 w-3 h-3 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-10 right-10 w-5 h-5 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard min-h-screen bg-gray-100 flex" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isMobile 
          ? 'ml-0' 
          : sidebarOpen 
            ? 'ml-64' 
            : 'ml-16'
      }`}>
        {/* Top Navigation */}
        <AdminTopNav
          adminData={adminData}
          isDemoMode={isDemoMode}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
        />

        {/* Dashboard Content */}
        <main className={`${
          isMobile ? 'p-4' : 'p-6'
        }`} style={{ minHeight: 'calc(100vh - 64px)' }}>
          <AdminBreadcrumb />
          <div className="max-w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard