import { useState } from 'react'
import { motion } from 'framer-motion'

const AdminSystemLogs = ({ isDemoMode }) => {
  const [activeTab, setActiveTab] = useState('all')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [selectedLogs, setSelectedLogs] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  const logs = [
    {
      id: 1,
      timestamp: '2024-01-27 14:30:25',
      level: 'info',
      message: 'User john.doe@example.com logged in successfully',
      source: 'auth-service'
    },
    {
      id: 2,
      timestamp: '2024-01-27 14:28:15',
      level: 'warning',
      message: 'High memory usage detected: 85%',
      source: 'system-monitor'
    },
    {
      id: 3,
      timestamp: '2024-01-27 14:25:10',
      level: 'error',
      message: 'Database connection timeout for user subscription update',
      source: 'subscription-service'
    },
    {
      id: 4,
      timestamp: '2024-01-27 14:22:45',
      level: 'info',
      message: 'Scheduled backup completed successfully',
      source: 'backup-service'
    },
    {
      id: 5,
      timestamp: '2024-01-27 14:20:30',
      level: 'info',
      message: 'New user registration: jane.smith@example.com',
      source: 'user-service'
    },
    {
      id: 6,
      timestamp: '2024-01-27 14:18:20',
      level: 'warning',
      message: 'API rate limit exceeded for IP: 192.168.1.100',
      source: 'api-gateway'
    },
    {
      id: 7,
      timestamp: '2024-01-27 14:15:55',
      level: 'error',
      message: 'Payment processing failed for order #12345',
      source: 'payment-service'
    },
    {
      id: 8,
      timestamp: '2024-01-27 14:12:40',
      level: 'info',
      message: 'System health check completed - All services operational',
      source: 'health-monitor'
    }
  ]

  const tabs = [
    { id: 'all', label: 'All Logs', count: logs.length },
    { id: 'info', label: 'Info', count: logs.filter(l => l.level === 'info').length },
    { id: 'warning', label: 'Warning', count: logs.filter(l => l.level === 'warning').length },
    { id: 'error', label: 'Error', count: logs.filter(l => l.level === 'error').length }
  ]

  const getLevelClasses = (level) => {
    const levels = {
      info: 'border-l-blue-500 bg-blue-50 text-blue-800',
      warning: 'border-l-yellow-500 bg-yellow-50 text-yellow-800',
      error: 'border-l-red-500 bg-red-50 text-red-800'
    }
    return levels[level] || 'border-l-gray-500 bg-gray-50 text-gray-800'
  }

  const getLevelIcon = (level) => {
    const icons = {
      info: 'fas fa-info-circle text-blue-500',
      warning: 'fas fa-exclamation-triangle text-yellow-500',
      error: 'fas fa-times-circle text-red-500'
    }
    return icons[level] || 'fas fa-circle text-gray-500'
  }

  const filteredLogs = activeTab === 'all' 
    ? logs 
    : logs.filter(log => log.level === activeTab)

  // Handler functions for CRUD operations
  const handleDeleteLog = (logId) => {
    if (confirm('Are you sure you want to delete this log entry?')) {
      console.log('Deleting log:', logId)
      alert('Log entry deleted successfully!')
    }
  }

  const handleClearLogs = (level = 'all') => {
    const message = level === 'all' 
      ? 'Are you sure you want to clear all logs?' 
      : `Are you sure you want to clear all ${level} logs?`
    
    if (confirm(message)) {
      console.log('Clearing logs:', level)
      alert('Logs cleared successfully!')
    }
  }

  const handleExportLogs = () => {
    console.log('Exporting logs...')
    alert('Log export started! Download will begin shortly.')
  }

  const handleRefreshLogs = () => {
    console.log('Refreshing logs...')
    alert('Logs refreshed successfully!')
  }

  const handleArchiveLogs = () => {
    if (confirm('Are you sure you want to archive old logs?')) {
      console.log('Archiving logs...')
      alert('Logs archived successfully!')
    }
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
          <i className="fas fa-clipboard-list text-purple-600 mr-4"></i>
          System Logs
        </h1>
      </motion.div>

      {/* Controls */}
      <motion.div
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleRefreshLogs}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <i className="fas fa-sync-alt mr-2"></i>
              Refresh
            </button>
            <button 
              onClick={handleExportLogs}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              <i className="fas fa-download mr-2"></i>
              Export
            </button>
            <button 
              onClick={() => handleClearLogs(activeTab)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <i className="fas fa-trash mr-2"></i>
              Clear {activeTab === 'all' ? 'All' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Logs
            </button>
            <button 
              onClick={handleArchiveLogs}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <i className="fas fa-archive mr-2"></i>
              Archive Old Logs
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
        transition={{ duration: 0.5, delay: 0.2 }}
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

        {/* Logs Display */}
        <div className="p-6">
          <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-sm">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                className={`mb-2 p-3 rounded border-l-4 ${getLevelClasses(log.level)}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              >
                <div className="flex items-start space-x-3">
                  <i className={getLevelIcon(log.level)}></i>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-xs text-gray-600">
                        [{log.timestamp}] [{log.source}]
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          log.level === 'info' ? 'bg-blue-100 text-blue-800' :
                          log.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {log.level.toUpperCase()}
                        </span>
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="text-red-500 hover:text-red-700 text-xs p-1"
                          title="Delete log entry"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-800">{log.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-clipboard-list text-gray-300 text-4xl mb-4"></i>
            <p className="text-gray-500">No logs found for the selected filter.</p>
          </div>
        )}
      </motion.div>

      {/* Log Statistics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Logs Today</h3>
              <div className="text-2xl font-bold text-gray-800">1,247</div>
            </div>
            <i className="fas fa-file-alt text-3xl text-blue-300"></i>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Error Rate</h3>
              <div className="text-2xl font-bold text-red-600">2.3%</div>
            </div>
            <i className="fas fa-exclamation-triangle text-3xl text-red-300"></i>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Average Response Time</h3>
              <div className="text-2xl font-bold text-green-600">245ms</div>
            </div>
            <i className="fas fa-tachometer-alt text-3xl text-green-300"></i>
          </div>
        </div>
      </motion.div>

      {isDemoMode && (
        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center">
            <i className="fas fa-info-circle text-blue-600 mr-3"></i>
            <div>
              <h3 className="font-semibold text-blue-800">Demo System Logs</h3>
              <p className="text-blue-700 text-sm">
                These are sample system logs for demonstration. In production, logs would be fetched from your logging system.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminSystemLogs