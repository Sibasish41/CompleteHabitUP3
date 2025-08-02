import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const AdminAnalytics = ({ isDemoMode }) => {
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState('7d')
  const [activeMetric, setActiveMetric] = useState('users')

  const analyticsData = {
    users: {
      total: 4193,
      growth: '+12.5%',
      newUsers: 247,
      activeUsers: 3156,
      retentionRate: '68.4%'
    },
    habits: {
      totalHabits: 12847,
      completedToday: 8934,
      averageStreak: 12,
      completionRate: '79.2%'
    },
    revenue: {
      totalRevenue: '₹2,45,680',
      monthlyGrowth: '+18.3%',
      subscriptions: 856,
      conversionRate: '4.2%'
    },
    engagement: {
      dailyActiveUsers: 2847,
      sessionDuration: '24m 35s',
      pageViews: 45678,
      bounceRate: '32.1%'
    }
  }

  const chartData = [
    { date: '2024-01-21', users: 3800, revenue: 18500, habits: 11200 },
    { date: '2024-01-22', users: 3950, revenue: 19200, habits: 11800 },
    { date: '2024-01-23', users: 4100, revenue: 20100, habits: 12100 },
    { date: '2024-01-24', users: 4050, revenue: 19800, habits: 12300 },
    { date: '2024-01-25', users: 4200, revenue: 21500, habits: 12600 },
    { date: '2024-01-26', users: 4150, revenue: 20800, habits: 12700 },
    { date: '2024-01-27', users: 4193, revenue: 21200, habits: 12847 }
  ]

  const topHabits = [
    { name: 'Morning Meditation', users: 1247, completion: '85%', growth: '+5.2%' },
    { name: 'Daily Exercise', users: 1156, completion: '72%', growth: '+8.1%' },
    { name: 'Reading Books', users: 987, completion: '91%', growth: '+3.4%' },
    { name: 'Drink Water', users: 1456, completion: '94%', growth: '+2.8%' },
    { name: 'Journaling', users: 634, completion: '78%', growth: '+12.5%' }
  ]

  const userSegments = [
    { segment: 'Free Users', count: 3337, percentage: '79.6%', color: 'bg-gray-500' },
    { segment: 'Premium Users', count: 856, percentage: '20.4%', color: 'bg-purple-500' }
  ]

  const deviceStats = [
    { device: 'Mobile', percentage: '68%', color: 'bg-blue-500' },
    { device: 'Desktop', percentage: '28%', color: 'bg-green-500' },
    { device: 'Tablet', percentage: '4%', color: 'bg-yellow-500' }
  ]

  const getMetricIcon = (metric) => {
    const icons = {
      users: 'fas fa-users',
      habits: 'fas fa-tasks',
      revenue: 'fas fa-rupee-sign',
      engagement: 'fas fa-chart-line'
    }
    return icons[metric] || 'fas fa-chart-bar'
  }

  const getMetricColor = (metric) => {
    const colors = {
      users: 'text-blue-600',
      habits: 'text-green-600',
      revenue: 'text-purple-600',
      engagement: 'text-orange-600'
    }
    return colors[metric] || 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <i className="fas fa-chart-line text-purple-600 mr-4"></i>
            Analytics Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => navigate('/admin/reports')}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-file-alt mr-2"></i>
              Reports
            </motion.button>
            <motion.button
              onClick={() => navigate('/admin/users')}
              className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-users mr-2"></i>
              Users
            </motion.button>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
              <i className="fas fa-download mr-2"></i>
              Export
            </button>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(analyticsData).map(([key, data], index) => (
          <motion.div
            key={key}
            className={`bg-white rounded-lg p-6 shadow-sm cursor-pointer transition-all duration-300 ${
              activeMetric === key ? 'ring-2 ring-purple-500 shadow-lg' : 'hover:shadow-md'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => setActiveMetric(key)}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <i className={`${getMetricIcon(key)} text-2xl ${getMetricColor(key)}`}></i>
              <span className="text-green-600 text-sm font-medium">
                {key === 'users' ? data.growth : 
                 key === 'revenue' ? data.monthlyGrowth : 
                 '+5.2%'}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {key === 'users' ? data.total.toLocaleString() :
               key === 'habits' ? data.totalHabits.toLocaleString() :
               key === 'revenue' ? data.totalRevenue :
               data.dailyActiveUsers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {key === 'users' ? 'Total Users' :
               key === 'habits' ? 'Total Habits' :
               key === 'revenue' ? 'Total Revenue' :
               'Daily Active Users'}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <motion.div
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 capitalize">
            {activeMetric} Trend
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Last 7 days</span>
          </div>
        </div>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-chart-area text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">Interactive chart would be displayed here</p>
            <p className="text-sm text-gray-400 mt-2">
              Showing {activeMetric} data for the selected time period
            </p>
          </div>
        </div>
      </motion.div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Habits */}
        <motion.div
          className="bg-white rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Performing Habits</h3>
          <div className="space-y-4">
            {topHabits.map((habit, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{habit.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{habit.users.toLocaleString()} users</span>
                    <span>{habit.completion} completion</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-green-600 text-sm font-medium">{habit.growth}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* User Segments */}
        <motion.div
          className="bg-white rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">User Segments</h3>
          <div className="space-y-6">
            {userSegments.map((segment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">{segment.segment}</span>
                  <span className="text-sm text-gray-600">{segment.count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${segment.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: segment.percentage }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-600 mt-1">{segment.percentage}</div>
              </motion.div>
            ))}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-800 mb-4">Device Usage</h4>
              <div className="space-y-3">
                {deviceStats.map((device, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{device.device}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`${device.color} h-2 rounded-full`}
                          style={{ width: device.percentage }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-800 w-8">{device.percentage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Real-time Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">247</div>
            <div className="text-sm text-gray-600">Users Online</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">1,456</div>
            <div className="text-sm text-gray-600">Habits Completed Today</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">₹3,240</div>
            <div className="text-sm text-gray-600">Revenue Today</div>
          </div>
        </div>
      </motion.div>

      {isDemoMode && (
        <motion.div
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div className="flex items-center">
            <i className="fas fa-info-circle text-yellow-600 mr-3"></i>
            <div>
              <h3 className="font-semibold text-yellow-800">Demo Analytics</h3>
              <p className="text-yellow-700 text-sm">
                This analytics dashboard shows sample data for demonstration. In production, this would connect to real analytics services.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminAnalytics