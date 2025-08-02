import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const AdminBreadcrumb = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const pathMap = {
    '/admin-dashboard': 'Dashboard',
    '/admin/dashboard': 'Dashboard',
    '/admin/users': 'User Management',
    '/admin/subscriptions': 'Subscriptions',
    '/admin/habits': 'Habit Tracking',
    '/admin/logs': 'System Logs',
    '/admin/error-logs': 'Error Logs',
    '/admin/settings': 'System Settings',
    '/admin/health': 'Health Check',
    '/admin/analytics': 'Analytics',
    '/admin/reports': 'Reports'
  }

  const currentPage = pathMap[location.pathname] || 'Dashboard'

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: currentPage, path: location.pathname, active: true }
  ]

  return (
    <motion.nav
      className="flex items-center space-x-2 text-sm text-gray-600 mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <i className="fas fa-chevron-right text-gray-400 mx-2 text-xs"></i>
          )}
          {item.active ? (
            <span className="text-purple-600 font-medium">{item.label}</span>
          ) : (
            <button
              onClick={() => navigate(item.path)}
              className="hover:text-purple-600 transition-colors"
            >
              {item.label}
            </button>
          )}
        </div>
      ))}
    </motion.nav>
  )
}

export default AdminBreadcrumb