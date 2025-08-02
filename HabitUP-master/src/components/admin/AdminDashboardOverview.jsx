import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const AdminDashboardOverview = ({ isDemoMode }) => {
  const navigate = useNavigate()
  const stats = [
    {
      title: 'Total Users',
      value: '1,248',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'fas fa-users',
      color: 'primary'
    },
    {
      title: 'Active Subscriptions',
      value: '856',
      change: '+8.3%',
      changeType: 'positive',
      icon: 'fas fa-credit-card',
      color: 'success'
    },
    {
      title: 'Pending Actions',
      value: '24',
      change: '-2',
      changeType: 'negative',
      icon: 'fas fa-exclamation-circle',
      color: 'warning'
    },
    {
      title: 'System Health',
      value: '98.7%',
      change: 'All systems operational',
      changeType: 'positive',
      icon: 'fas fa-heartbeat',
      color: 'info'
    }
  ]

  const recentActivity = [
    {
      user: 'john.doe@example.com',
      action: 'Updated subscription plan',
      time: '10 mins ago',
      status: 'Completed',
      statusType: 'active'
    },
    {
      user: 'jane.smith@example.com',
      action: 'Password reset request',
      time: '25 mins ago',
      status: 'Pending',
      statusType: 'pending'
    },
    {
      user: 'mike.johnson@example.com',
      action: 'Account deactivated',
      time: '1 hour ago',
      status: 'Completed',
      statusType: 'inactive'
    },
    {
      user: 'sarah.williams@example.com',
      action: 'New subscription',
      time: '2 hours ago',
      status: 'Completed',
      statusType: 'active'
    },
    {
      user: 'admin@habitup.com',
      action: 'System settings updated',
      time: '3 hours ago',
      status: 'Completed',
      statusType: 'active'
    }
  ]

  const quickActions = [
    {
      title: 'Add New User',
      description: 'Create new user account',
      icon: 'fas fa-user-plus',
      color: 'text-purple-600',
      action: 'users',
      path: '/admin/users'
    },
    {
      title: 'Manage Subscriptions',
      description: 'View and edit subscriptions',
      icon: 'fas fa-credit-card',
      color: 'text-green-600',
      action: 'subscriptions',
      path: '/admin/subscriptions'
    },
    {
      title: 'View System Logs',
      description: 'Check system activity',
      icon: 'fas fa-clipboard-list',
      color: 'text-blue-600',
      action: 'logs',
      path: '/admin/logs'
    }
  ]

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
            key={index}
            className={`bg-white rounded-lg p-6 shadow-sm border-l-4 ${getColorClasses(stat.color)} hover:shadow-md transition-shadow duration-300 relative overflow-hidden`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.title}</h3>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className={`text-xs flex items-center ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <i className={`fas ${
                    stat.changeType === 'positive' ? 'fa-arrow-up' : 'fa-arrow-down'
                  } mr-1`}></i>
                  {stat.change}
                </div>
              </div>
              <i className={`${stat.icon} text-3xl text-gray-300`}></i>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        className="bg-white rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center">
              <i className="fas fa-sync-alt mr-2"></i>
              Refresh
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActivity.map((activity, index) => (
                <motion.tr
                  key={index}
                  className="hover:bg-purple-50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{activity.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(activity.statusType)}`}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors">
                        <i className="fas fa-eye text-xs"></i>
                      </button>
                      {activity.statusType === 'pending' && (
                        <button className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                          <i className="fas fa-edit text-xs"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
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
              key={index}
              className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              onClick={() => handleQuickAction(action)}
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

      {/* External Links & Social Media */}
      <motion.div
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect & Support</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="https://twitter.com/habitup"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <i className="fab fa-twitter text-blue-500 mr-3"></i>
            <span className="text-sm font-medium text-blue-700">Twitter</span>
          </a>
          <a
            href="https://facebook.com/habitup"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <i className="fab fa-facebook text-blue-600 mr-3"></i>
            <span className="text-sm font-medium text-blue-700">Facebook</span>
          </a>
          <a
            href="https://linkedin.com/company/habitup"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <i className="fab fa-linkedin text-blue-700 mr-3"></i>
            <span className="text-sm font-medium text-blue-700">LinkedIn</span>
          </a>
          <a
            href="https://instagram.com/habitup"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
          >
            <i className="fab fa-instagram text-pink-600 mr-3"></i>
            <span className="text-sm font-medium text-pink-700">Instagram</span>
          </a>
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
              <h3 className="font-semibold text-blue-800">Demo Dashboard</h3>
              <p className="text-blue-700 text-sm">
                This dashboard shows sample data for demonstration purposes. All statistics and activities are mock data.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminDashboardOverview