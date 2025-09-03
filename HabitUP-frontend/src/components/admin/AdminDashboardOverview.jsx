import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { getAdminDashboardStats, getRecentActivity } from '../../services/adminService'
import { getSocialMediaLinks, getQuickActions } from '../../services/systemSettingsService'

const AdminDashboardOverview = ({ isDemoMode }) => {
  const navigate = useNavigate()
  const [stats, setStats] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [socialLinks, setSocialLinks] = useState([])
  const [quickActions, setQuickActions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all dashboard data in parallel
      const [statsData, activityData, socialData, actionsData] = await Promise.all([
        getAdminDashboardStats(),
        getRecentActivity(),
        getSocialMediaLinks(),
        getQuickActions()
      ])

      setStats(statsData)
      setRecentActivity(activityData)
      setSocialLinks(socialData)
      setQuickActions(actionsData)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data')
      console.error('Dashboard data loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAction = (action) => {
    navigate(action.path)
  }

  const getColorClasses = (color) => {
    const colors = {
      primary: 'border-l-purple-500',
      success: 'border-l-green-500',
      warning: 'border-l-yellow-500',
      info: 'border-l-blue-500'
    }
    return colors[color] || 'border-l-gray-500'
  }

  const getStatusClasses = (statusType) => {
    const statuses = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-red-100 text-red-800'
    }
    return statuses[statusType] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-4">{error}</div>
          <button
            onClick={loadDashboardData}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <i className="fas fa-tachometer-alt text-purple-600 mr-4"></i>
          Dashboard Overview
        </h1>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`text-2xl text-${stat.color}-500`}>
                <i className={stat.icon}></i>
              </div>
              <div className={`text-sm px-2 py-1 rounded-full ${
                stat.changeType === 'positive' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {stat.change}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm">{stat.title}</h3>
            <div className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="text-gray-600">
                  <i className="fas fa-user-circle text-xl"></i>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">{activity.user}</div>
                  <div className="text-sm text-gray-600">{activity.action}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">{activity.time}</div>
                <div className={`text-sm ${
                  activity.statusType === 'active' 
                    ? 'text-green-600' 
                    : 'text-yellow-600'
                }`}>
                  {activity.status}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions - Now using data from backend */}
      <motion.div
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              onClick={() => navigate(action.path)}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                <i className={`${action.icon} text-xl ${action.color}`}></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">{action.title}</h4>
              <p className="text-sm text-gray-600">{action.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Social Media Links - Now using data from backend */}
      <motion.div
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect & Support</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {socialLinks.map((link, index) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center p-3 ${link.bgClass} rounded-lg hover:${link.hoverClass} transition-colors`}
            >
              <i className={`${link.icon} ${link.iconColor} mr-3`}></i>
              <span className={`text-sm font-medium ${link.textColor}`}>{link.platform}</span>
            </a>
          ))}
        </div>
      </motion.div>

      {isDemoMode && (
        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex items-center">
            <i className="fas fa-info-circle text-blue-600 mr-3"></i>
            <div>
              <h3 className="font-semibold text-blue-800">Demo Mode Active</h3>
              <p className="text-blue-700 text-sm">
                You are viewing the dashboard in demo mode. Some features may be limited.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminDashboardOverview