import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const AdminHealthCheck = ({ isDemoMode }) => {
  const navigate = useNavigate()
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const systemServices = [
    {
      name: 'Web Server',
      status: 'healthy',
      responseTime: '45ms',
      uptime: '99.9%',
      lastCheck: '30 seconds ago',
      details: 'Nginx server running normally',
      icon: 'fas fa-server'
    },
    {
      name: 'Database',
      status: 'healthy',
      responseTime: '12ms',
      uptime: '99.8%',
      lastCheck: '30 seconds ago',
      details: 'PostgreSQL connections: 45/100',
      icon: 'fas fa-database'
    },
    {
      name: 'Redis Cache',
      status: 'healthy',
      responseTime: '3ms',
      uptime: '99.9%',
      lastCheck: '30 seconds ago',
      details: 'Memory usage: 2.1GB/4GB',
      icon: 'fas fa-memory'
    },
    {
      name: 'Email Service',
      status: 'warning',
      responseTime: '1.2s',
      uptime: '98.5%',
      lastCheck: '1 minute ago',
      details: 'High response time detected',
      icon: 'fas fa-envelope'
    },
    {
      name: 'Payment Gateway',
      status: 'healthy',
      responseTime: '234ms',
      uptime: '99.7%',
      lastCheck: '30 seconds ago',
      details: 'Razorpay API responding normally',
      icon: 'fas fa-credit-card'
    },
    {
      name: 'File Storage',
      status: 'critical',
      responseTime: 'Timeout',
      uptime: '95.2%',
      lastCheck: '5 minutes ago',
      details: 'Storage service unreachable',
      icon: 'fas fa-cloud'
    },
    {
      name: 'Background Jobs',
      status: 'healthy',
      responseTime: 'N/A',
      uptime: '99.6%',
      lastCheck: '1 minute ago',
      details: 'Queue: 12 pending jobs',
      icon: 'fas fa-tasks'
    },
    {
      name: 'API Gateway',
      status: 'healthy',
      responseTime: '67ms',
      uptime: '99.9%',
      lastCheck: '30 seconds ago',
      details: 'Rate limiting active',
      icon: 'fas fa-code'
    }
  ]

  const systemMetrics = [
    {
      name: 'CPU Usage',
      value: '45%',
      status: 'healthy',
      trend: 'stable',
      icon: 'fas fa-microchip'
    },
    {
      name: 'Memory Usage',
      value: '67%',
      status: 'warning',
      trend: 'increasing',
      icon: 'fas fa-memory'
    },
    {
      name: 'Disk Usage',
      value: '23%',
      status: 'healthy',
      trend: 'stable',
      icon: 'fas fa-hdd'
    },
    {
      name: 'Network I/O',
      value: '1.2 GB/s',
      status: 'healthy',
      trend: 'stable',
      icon: 'fas fa-network-wired'
    }
  ]

  const recentIncidents = [
    {
      id: 1,
      title: 'Database Connection Pool Exhausted',
      severity: 'critical',
      status: 'resolved',
      startTime: '2024-01-27 14:30:00',
      endTime: '2024-01-27 14:45:00',
      duration: '15 minutes',
      affectedServices: ['Database', 'API Gateway']
    },
    {
      id: 2,
      title: 'Email Service High Latency',
      severity: 'warning',
      status: 'investigating',
      startTime: '2024-01-27 13:15:00',
      endTime: null,
      duration: '1 hour 20 minutes',
      affectedServices: ['Email Service']
    },
    {
      id: 3,
      title: 'Scheduled Maintenance',
      severity: 'info',
      status: 'completed',
      startTime: '2024-01-27 02:00:00',
      endTime: '2024-01-27 02:30:00',
      duration: '30 minutes',
      affectedServices: ['Web Server', 'Database']
    }
  ]

  const getStatusColor = (status) => {
    const colors = {
      healthy: 'text-green-600 bg-green-100',
      warning: 'text-yellow-600 bg-yellow-100',
      critical: 'text-red-600 bg-red-100',
      unknown: 'text-gray-600 bg-gray-100'
    }
    return colors[status] || colors.unknown
  }

  const getStatusIcon = (status) => {
    const icons = {
      healthy: 'fas fa-check-circle text-green-500',
      warning: 'fas fa-exclamation-triangle text-yellow-500',
      critical: 'fas fa-times-circle text-red-500',
      unknown: 'fas fa-question-circle text-gray-500'
    }
    return icons[status] || icons.unknown
  }

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      info: 'bg-blue-100 text-blue-800'
    }
    return colors[severity] || 'bg-gray-100 text-gray-800'
  }

  const getIncidentStatusColor = (status) => {
    const colors = {
      resolved: 'bg-green-100 text-green-800',
      investigating: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLastUpdated(new Date())
    setRefreshing(false)
  }

  const overallHealth = () => {
    const criticalCount = systemServices.filter(s => s.status === 'critical').length
    const warningCount = systemServices.filter(s => s.status === 'warning').length
    
    if (criticalCount > 0) return 'critical'
    if (warningCount > 0) return 'warning'
    return 'healthy'
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
            <i className="fas fa-heartbeat text-purple-600 mr-4"></i>
            System Health Check
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <motion.button
              onClick={() => navigate('/admin/logs')}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-clipboard-list mr-2"></i>
              View Logs
            </motion.button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50"
            >
              <i className={`fas fa-sync-alt mr-2 ${refreshing ? 'animate-spin' : ''}`}></i>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Overall Health Status */}
      <motion.div
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getStatusColor(overallHealth())}`}>
              <i className={getStatusIcon(overallHealth()).replace('text-', 'text-').split(' ')[0] + ' text-2xl'}></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">System Status</h2>
              <p className="text-gray-600 capitalize">{overallHealth()} - All critical systems operational</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">99.2%</div>
            <div className="text-sm text-gray-600">Overall Uptime</div>
          </div>
        </div>
      </motion.div>

      {/* System Metrics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {systemMetrics.map((metric, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <i className={`${metric.icon} text-2xl text-purple-600`}></i>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                {metric.status}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</div>
            <div className="text-sm text-gray-600">{metric.name}</div>
            <div className="flex items-center mt-2">
              <i className={`fas fa-arrow-${metric.trend === 'increasing' ? 'up text-red-500' : metric.trend === 'decreasing' ? 'down text-green-500' : 'right text-gray-500'} mr-1 text-xs`}></i>
              <span className="text-xs text-gray-600 capitalize">{metric.trend}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Services Status */}
      <motion.div
        className="bg-white rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Service Status</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {systemServices.map((service, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <i className={`${service.icon} text-lg text-purple-600`}></i>
                    <h4 className="font-medium text-gray-800">{service.name}</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Response Time:</span>
                    <span className="ml-2 font-medium">{service.responseTime}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Uptime:</span>
                    <span className="ml-2 font-medium">{service.uptime}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  {service.details} • Last check: {service.lastCheck}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Incidents */}
      <motion.div
        className="bg-white rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Incidents</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentIncidents.map((incident, index) => (
              <motion.div
                key={incident.id}
                className="border border-gray-200 rounded-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-2">{incident.title}</h4>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                        {incident.severity.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIncidentStatusColor(incident.status)}`}>
                        {incident.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Started: {incident.startTime}</div>
                      {incident.endTime && <div>Ended: {incident.endTime}</div>}
                      <div>Duration: {incident.duration}</div>
                      <div>Affected: {incident.affectedServices.join(', ')}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
              <h3 className="font-semibold text-blue-800">Demo Health Check</h3>
              <p className="text-blue-700 text-sm">
                This health check shows simulated system status. In production, this would connect to real monitoring systems.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminHealthCheck