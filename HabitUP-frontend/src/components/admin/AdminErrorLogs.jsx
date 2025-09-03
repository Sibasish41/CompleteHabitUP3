import { useState } from 'react'
import { motion } from 'framer-motion'

const AdminErrorLogs = ({ isDemoMode }) => {
  const [activeTab, setActiveTab] = useState('all')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [selectedSeverity, setSelectedSeverity] = useState('all')

  const errorLogs = [
    {
      id: 1,
      timestamp: '2024-01-27 14:35:42',
      severity: 'critical',
      message: 'Database connection pool exhausted',
      source: 'database-service',
      stack: 'ConnectionPoolException: Unable to acquire connection from pool\n  at DatabasePool.getConnection(DatabasePool.java:45)\n  at UserService.getUserById(UserService.java:23)',
      count: 1,
      resolved: false
    },
    {
      id: 2,
      timestamp: '2024-01-27 14:32:15',
      severity: 'error',
      message: 'Payment processing failed: Invalid card number',
      source: 'payment-service',
      stack: 'PaymentException: Card validation failed\n  at PaymentProcessor.processPayment(PaymentProcessor.java:67)\n  at SubscriptionService.createSubscription(SubscriptionService.java:89)',
      count: 3,
      resolved: false
    },
    {
      id: 3,
      timestamp: '2024-01-27 14:28:33',
      severity: 'warning',
      message: 'API rate limit exceeded for user: user123',
      source: 'api-gateway',
      stack: 'RateLimitException: Too many requests\n  at RateLimiter.checkLimit(RateLimiter.java:34)\n  at ApiGateway.handleRequest(ApiGateway.java:56)',
      count: 15,
      resolved: true
    },
    {
      id: 4,
      timestamp: '2024-01-27 14:25:18',
      severity: 'error',
      message: 'Email service timeout',
      source: 'notification-service',
      stack: 'TimeoutException: Email service did not respond within 30 seconds\n  at EmailService.sendEmail(EmailService.java:78)\n  at NotificationService.sendWelcomeEmail(NotificationService.java:45)',
      count: 2,
      resolved: false
    },
    {
      id: 5,
      timestamp: '2024-01-27 14:22:55',
      severity: 'critical',
      message: 'Memory leak detected in user session management',
      source: 'session-service',
      stack: 'OutOfMemoryError: Java heap space\n  at SessionManager.createSession(SessionManager.java:123)\n  at AuthService.authenticateUser(AuthService.java:67)',
      count: 1,
      resolved: true
    },
    {
      id: 6,
      timestamp: '2024-01-27 14:18:42',
      severity: 'warning',
      message: 'Deprecated API endpoint accessed',
      source: 'api-service',
      stack: 'DeprecationWarning: /api/v1/users endpoint is deprecated\n  at ApiController.handleDeprecatedEndpoint(ApiController.java:234)',
      count: 8,
      resolved: false
    }
  ]

  const tabs = [
    { id: 'all', label: 'All Errors', count: errorLogs.length },
    { id: 'critical', label: 'Critical', count: errorLogs.filter(l => l.severity === 'critical').length },
    { id: 'error', label: 'Error', count: errorLogs.filter(l => l.severity === 'error').length },
    { id: 'warning', label: 'Warning', count: errorLogs.filter(l => l.severity === 'warning').length },
    { id: 'unresolved', label: 'Unresolved', count: errorLogs.filter(l => !l.resolved).length }
  ]

  const getSeverityClasses = (severity) => {
    const severities = {
      critical: 'border-l-red-600 bg-red-50 text-red-800',
      error: 'border-l-orange-500 bg-orange-50 text-orange-800',
      warning: 'border-l-yellow-500 bg-yellow-50 text-yellow-800'
    }
    return severities[severity] || 'border-l-gray-500 bg-gray-50 text-gray-800'
  }

  const getSeverityIcon = (severity) => {
    const icons = {
      critical: 'fas fa-exclamation-triangle text-red-500',
      error: 'fas fa-times-circle text-orange-500',
      warning: 'fas fa-exclamation-circle text-yellow-500'
    }
    return icons[severity] || 'fas fa-circle text-gray-500'
  }

  const getSeverityBadge = (severity) => {
    const badges = {
      critical: 'bg-red-100 text-red-800',
      error: 'bg-orange-100 text-orange-800',
      warning: 'bg-yellow-100 text-yellow-800'
    }
    return badges[severity] || 'bg-gray-100 text-gray-800'
  }

  const filteredLogs = errorLogs.filter(log => {
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'unresolved' ? !log.resolved : log.severity === activeTab)
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity
    return matchesTab && matchesSeverity
  })

  const handleResolveError = (id) => {
    // Mark error as resolved
    console.log('Resolving error:', id)
    alert('Error marked as resolved successfully!')
  }

  const handleDeleteError = (id) => {
    if (confirm('Are you sure you want to delete this error log?')) {
      console.log('Deleting error:', id)
      alert('Error log deleted successfully!')
    }
  }

  const handleIgnoreError = (id) => {
    console.log('Ignoring error:', id)
    alert('Error ignored successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <i className="fas fa-exclamation-circle text-purple-600 mr-4"></i>
          Error Logs
        </h1>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-l-red-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Critical Errors</h3>
              <div className="text-2xl font-bold text-gray-800">2</div>
            </div>
            <i className="fas fa-exclamation-triangle text-3xl text-red-300"></i>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-l-orange-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Error Rate</h3>
              <div className="text-2xl font-bold text-gray-800">0.8%</div>
            </div>
            <i className="fas fa-chart-line text-3xl text-orange-300"></i>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-l-yellow-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Unresolved</h3>
              <div className="text-2xl font-bold text-gray-800">4</div>
            </div>
            <i className="fas fa-clock text-3xl text-yellow-300"></i>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-l-green-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">MTTR</h3>
              <div className="text-2xl font-bold text-gray-800">45m</div>
            </div>
            <i className="fas fa-tools text-3xl text-green-300"></i>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <motion.div
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
              <i className="fas fa-sync-alt mr-2"></i>
              Refresh
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center">
              <i className="fas fa-download mr-2"></i>
              Export
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
              <i className="fas fa-trash mr-2"></i>
              Clear Resolved
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Auto-refresh</span>
            </label>
            <select 
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>Last 1 hour</option>
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="bg-white rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Error Logs Display */}
        <div className="p-6">
          <div className="space-y-4">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                className={`border-l-4 rounded-lg p-4 ${getSeverityClasses(log.severity)}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <i className={getSeverityIcon(log.severity)}></i>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityBadge(log.severity)}`}>
                            {log.severity.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-600">
                            [{log.timestamp}] [{log.source}]
                          </span>
                          {log.count > 1 && (
                            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                              {log.count}x
                            </span>
                          )}
                          {log.resolved && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              RESOLVED
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-800 font-medium mb-2">{log.message}</p>
                      <details className="text-sm">
                        <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                          View Stack Trace
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-900 text-green-400 rounded text-xs overflow-x-auto">
                          {log.stack}
                        </pre>
                      </details>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {!log.resolved && (
                      <button
                        onClick={() => handleResolveError(log.id)}
                        className="bg-green-100 text-green-600 px-3 py-1 rounded text-xs hover:bg-green-200 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-200 transition-colors">
                      View Details
                    </button>
                    <button 
                      onClick={() => handleIgnoreError(log.id)}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs hover:bg-gray-200 transition-colors"
                    >
                      Ignore
                    </button>
                    <button 
                      onClick={() => handleDeleteError(log.id)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-check-circle text-green-300 text-6xl mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Errors Found</h3>
              <p className="text-gray-500">No errors match the selected filters.</p>
            </div>
          )}
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
              <h3 className="font-semibold text-blue-800">Demo Error Logs</h3>
              <p className="text-blue-700 text-sm">
                These are sample error logs for demonstration. In production, errors would be captured from your application monitoring system.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminErrorLogs