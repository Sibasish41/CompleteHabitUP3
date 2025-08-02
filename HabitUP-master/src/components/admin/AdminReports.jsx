import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const AdminReports = ({ isDemoMode }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('scheduled')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const scheduledReports = [
    {
      id: 1,
      name: 'Daily User Activity Report',
      type: 'User Analytics',
      schedule: 'Daily at 9:00 AM',
      format: 'PDF',
      recipients: ['admin@habitup.com', 'manager@habitup.com'],
      lastRun: '2024-01-27 09:00:00',
      status: 'Active',
      nextRun: '2024-01-28 09:00:00'
    },
    {
      id: 2,
      name: 'Weekly Revenue Summary',
      type: 'Financial',
      schedule: 'Weekly on Monday',
      format: 'Excel',
      recipients: ['finance@habitup.com'],
      lastRun: '2024-01-22 10:00:00',
      status: 'Active',
      nextRun: '2024-01-29 10:00:00'
    },
    {
      id: 3,
      name: 'Monthly Habit Completion Report',
      type: 'Habit Analytics',
      schedule: 'Monthly on 1st',
      format: 'PDF',
      recipients: ['team@habitup.com'],
      lastRun: '2024-01-01 08:00:00',
      status: 'Active',
      nextRun: '2024-02-01 08:00:00'
    },
    {
      id: 4,
      name: 'System Performance Report',
      type: 'Technical',
      schedule: 'Weekly on Friday',
      format: 'PDF',
      recipients: ['tech@habitup.com'],
      lastRun: '2024-01-26 17:00:00',
      status: 'Paused',
      nextRun: 'N/A'
    }
  ]

  const availableReports = [
    {
      id: 1,
      name: 'User Registration Report',
      description: 'Detailed analysis of user registrations and demographics',
      category: 'User Analytics',
      estimatedTime: '2-3 minutes',
      icon: 'fas fa-user-plus'
    },
    {
      id: 2,
      name: 'Revenue Analysis Report',
      description: 'Comprehensive revenue breakdown by subscription plans',
      category: 'Financial',
      estimatedTime: '1-2 minutes',
      icon: 'fas fa-chart-line'
    },
    {
      id: 3,
      name: 'Habit Completion Trends',
      description: 'Analysis of habit completion rates and user engagement',
      category: 'Habit Analytics',
      estimatedTime: '3-4 minutes',
      icon: 'fas fa-tasks'
    },
    {
      id: 4,
      name: 'System Usage Report',
      description: 'Server performance, API usage, and system health metrics',
      category: 'Technical',
      estimatedTime: '2-3 minutes',
      icon: 'fas fa-server'
    },
    {
      id: 5,
      name: 'Customer Support Report',
      description: 'Support ticket analysis and resolution metrics',
      category: 'Support',
      estimatedTime: '1-2 minutes',
      icon: 'fas fa-headset'
    },
    {
      id: 6,
      name: 'Marketing Campaign Report',
      description: 'Campaign performance and user acquisition metrics',
      category: 'Marketing',
      estimatedTime: '2-3 minutes',
      icon: 'fas fa-bullhorn'
    }
  ]

  const recentReports = [
    {
      id: 1,
      name: 'Daily User Activity Report',
      generatedAt: '2024-01-27 09:15:23',
      format: 'PDF',
      size: '2.4 MB',
      downloadUrl: '#',
      status: 'Completed'
    },
    {
      id: 2,
      name: 'System Performance Report',
      generatedAt: '2024-01-26 17:05:12',
      format: 'PDF',
      size: '1.8 MB',
      downloadUrl: '#',
      status: 'Completed'
    },
    {
      id: 3,
      name: 'Revenue Analysis Report',
      generatedAt: '2024-01-26 14:30:45',
      format: 'Excel',
      size: '856 KB',
      downloadUrl: '#',
      status: 'Completed'
    },
    {
      id: 4,
      name: 'Habit Completion Trends',
      generatedAt: '2024-01-26 11:20:18',
      format: 'PDF',
      size: '3.2 MB',
      downloadUrl: '#',
      status: 'Completed'
    }
  ]

  const tabs = [
    { id: 'scheduled', label: 'Scheduled Reports', count: scheduledReports.length },
    { id: 'generate', label: 'Generate Report', count: availableReports.length },
    { id: 'recent', label: 'Recent Reports', count: recentReports.length }
  ]

  const getStatusColor = (status) => {
    const colors = {
      Active: 'bg-green-100 text-green-800',
      Paused: 'bg-yellow-100 text-yellow-800',
      Completed: 'bg-blue-100 text-blue-800',
      Failed: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryColor = (category) => {
    const colors = {
      'User Analytics': 'bg-blue-100 text-blue-800',
      'Financial': 'bg-green-100 text-green-800',
      'Habit Analytics': 'bg-purple-100 text-purple-800',
      'Technical': 'bg-gray-100 text-gray-800',
      'Support': 'bg-orange-100 text-orange-800',
      'Marketing': 'bg-pink-100 text-pink-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const handleGenerateReport = (reportId) => {
    // Generate report logic here
    alert('Report generation started. You will be notified when it\'s ready.')
  }

  const handleDownloadReport = (reportId) => {
    // Download report logic here
    console.log('Downloading report:', reportId)
    alert('Report download started!')
  }

  const handleEditScheduledReport = (reportId) => {
    console.log('Editing scheduled report:', reportId)
    alert('Edit report functionality - would open edit modal')
  }

  const handleDeleteScheduledReport = (reportId) => {
    if (confirm('Are you sure you want to delete this scheduled report?')) {
      console.log('Deleting scheduled report:', reportId)
      alert('Scheduled report deleted successfully!')
    }
  }

  const handleRunReportNow = (reportId) => {
    console.log('Running report now:', reportId)
    alert('Report execution started!')
  }

  const handleToggleReportStatus = (reportId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active'
    console.log('Toggling report status:', reportId, 'to', newStatus)
    alert(`Report ${newStatus.toLowerCase()} successfully!`)
  }

  const handleDeleteReport = (reportId) => {
    if (confirm('Are you sure you want to delete this report?')) {
      console.log('Deleting report:', reportId)
      alert('Report deleted successfully!')
    }
  }

  const handleViewReport = (reportId) => {
    console.log('Viewing report:', reportId)
    alert('View report functionality - would open report viewer')
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
            <i className="fas fa-file-alt text-purple-600 mr-4"></i>
            Reports Management
          </h1>
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={() => navigate('/admin/analytics')}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-chart-line mr-2"></i>
              Analytics
            </motion.button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Schedule Report
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-l-blue-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Reports</h3>
              <div className="text-2xl font-bold text-gray-800">47</div>
            </div>
            <i className="fas fa-file-alt text-3xl text-blue-300"></i>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-l-green-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Scheduled</h3>
              <div className="text-2xl font-bold text-gray-800">12</div>
            </div>
            <i className="fas fa-clock text-3xl text-green-300"></i>
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
              <h3 className="text-sm font-medium text-gray-600 mb-2">This Month</h3>
              <div className="text-2xl font-bold text-gray-800">156</div>
            </div>
            <i className="fas fa-calendar text-3xl text-yellow-300"></i>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-l-purple-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Storage Used</h3>
              <div className="text-2xl font-bold text-gray-800">2.4 GB</div>
            </div>
            <i className="fas fa-database text-3xl text-purple-300"></i>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <motion.div
        className="bg-white rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
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

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'scheduled' && (
            <div className="space-y-4">
              {scheduledReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">{report.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <span className="font-medium">Type:</span> {report.type}
                        </div>
                        <div>
                          <span className="font-medium">Schedule:</span> {report.schedule}
                        </div>
                        <div>
                          <span className="font-medium">Format:</span> {report.format}
                        </div>
                        <div>
                          <span className="font-medium">Last Run:</span> {new Date(report.lastRun).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Recipients:</span> {report.recipients.join(', ')}
                      </div>
                      {report.nextRun !== 'N/A' && (
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Next Run:</span> {new Date(report.nextRun).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => handleEditScheduledReport(report.id)}
                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleRunReportNow(report.id)}
                        className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors"
                      >
                        Run Now
                      </button>
                      <button 
                        onClick={() => handleToggleReportStatus(report.id, report.status)}
                        className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
                      >
                        {report.status === 'Active' ? 'Pause' : 'Resume'}
                      </button>
                      <button 
                        onClick={() => handleDeleteScheduledReport(report.id)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'generate' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <i className={`${report.icon} text-2xl text-purple-600`}></i>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(report.category)}`}>
                      {report.category}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{report.name}</h4>
                  <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      <i className="fas fa-clock mr-1"></i>
                      {report.estimatedTime}
                    </span>
                    <button
                      onClick={() => handleGenerateReport(report.id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      Generate
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'recent' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentReports.map((report, index) => (
                    <motion.tr
                      key={report.id}
                      className="hover:bg-purple-50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.generatedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.format}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDownloadReport(report.id)}
                            className="bg-green-100 text-green-600 px-3 py-1 rounded text-xs hover:bg-green-200 transition-colors"
                          >
                            Download
                          </button>
                          <button 
                            onClick={() => handleViewReport(report.id)}
                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-200 transition-colors"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleDeleteReport(report.id)}
                            className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {isDemoMode && (
        <motion.div
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center">
            <i className="fas fa-info-circle text-yellow-600 mr-3"></i>
            <div>
              <h3 className="font-semibold text-yellow-800">Demo Reports</h3>
              <p className="text-yellow-700 text-sm">
                Report generation and download features are limited in demo mode. All data shown is for demonstration purposes.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminReports