import { useState } from 'react'
import { motion } from 'framer-motion'

const AdminHabitTracking = ({ isDemoMode }) => {
  const [activeTab, setActiveTab] = useState('templates')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false)
  const [showEditTemplateModal, setShowEditTemplateModal] = useState(false)
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [editingTemplate, setEditingTemplate] = useState(null)

  const habitTemplates = [
    {
      id: 1,
      name: 'Morning Meditation',
      category: 'Mindfulness',
      difficulty: 'Beginner',
      duration: '10 minutes',
      users: 1247,
      completionRate: '78%',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Daily Exercise',
      category: 'Fitness',
      difficulty: 'Intermediate',
      duration: '30 minutes',
      users: 856,
      completionRate: '65%',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Reading Books',
      category: 'Learning',
      difficulty: 'Easy',
      duration: '20 minutes',
      users: 634,
      completionRate: '82%',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Drink Water',
      category: 'Health',
      difficulty: 'Easy',
      duration: '2 minutes',
      users: 1456,
      completionRate: '91%',
      status: 'Active'
    }
  ]

  const userProgress = [
    {
      id: 1,
      user: 'John Doe',
      email: 'john.doe@example.com',
      habit: 'Morning Meditation',
      streak: 15,
      completion: '85%',
      lastActivity: '2 hours ago',
      status: 'On Track'
    },
    {
      id: 2,
      user: 'Jane Smith',
      email: 'jane.smith@example.com',
      habit: 'Daily Exercise',
      streak: 7,
      completion: '70%',
      lastActivity: '1 day ago',
      status: 'At Risk'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      habit: 'Reading Books',
      streak: 0,
      completion: '45%',
      lastActivity: '3 days ago',
      status: 'Struggling'
    }
  ]

  const categories = [
    { name: 'Mindfulness', count: 12, color: 'bg-purple-100 text-purple-800' },
    { name: 'Fitness', count: 8, color: 'bg-green-100 text-green-800' },
    { name: 'Learning', count: 15, color: 'bg-blue-100 text-blue-800' },
    { name: 'Health', count: 10, color: 'bg-red-100 text-red-800' },
    { name: 'Productivity', count: 6, color: 'bg-yellow-100 text-yellow-800' }
  ]

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'bg-green-100 text-green-800',
      'Beginner': 'bg-blue-100 text-blue-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-red-100 text-red-800'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status) => {
    const colors = {
      'On Track': 'bg-green-100 text-green-800',
      'At Risk': 'bg-yellow-100 text-yellow-800',
      'Struggling': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const tabs = [
    { id: 'templates', label: 'Habit Templates', count: habitTemplates.length },
    { id: 'progress', label: 'User Progress', count: userProgress.length },
    { id: 'analytics', label: 'Analytics', count: 0 }
  ]

  // Handler functions for CRUD operations
  const handleEditTemplate = (template) => {
    setSelectedTemplate(template)
    setEditingTemplate({ ...template })
    setShowEditTemplateModal(true)
  }

  const handleDeleteTemplate = (template) => {
    setSelectedTemplate(template)
    setShowDeleteConfirmModal(true)
  }

  const handleViewTemplate = (template) => {
    console.log('Viewing template:', template)
    alert(`Viewing template: ${template.name}`)
  }

  const confirmDeleteTemplate = () => {
    if (selectedTemplate) {
      console.log('Deleting template:', selectedTemplate)
      alert(`Template "${selectedTemplate.name}" deleted successfully!`)
      setShowDeleteConfirmModal(false)
      setSelectedTemplate(null)
    }
  }

  const handleSaveEditTemplate = () => {
    if (editingTemplate) {
      console.log('Saving template:', editingTemplate)
      alert(`Template "${editingTemplate.name}" updated successfully!`)
      setShowEditTemplateModal(false)
      setEditingTemplate(null)
      setSelectedTemplate(null)
    }
  }

  const handleAddTemplate = () => {
    console.log('Adding new template')
    alert('Add template functionality - would open add modal')
    setShowAddTemplateModal(false)
  }

  const handleViewUserProgress = (progress) => {
    console.log('Viewing user progress:', progress)
    alert(`Viewing progress for ${progress.user}`)
  }

  const handleContactUser = (progress) => {
    console.log('Contacting user:', progress)
    alert(`Contacting ${progress.user} about their habit progress`)
  }

  const handleResetUserProgress = (progress) => {
    if (confirm(`Are you sure you want to reset progress for ${progress.user}?`)) {
      console.log('Resetting user progress:', progress)
      alert(`Progress reset for ${progress.user}`)
    }
  }

  const handleDeleteUserProgress = (progress) => {
    if (confirm(`Are you sure you want to delete progress data for ${progress.user}?`)) {
      console.log('Deleting user progress:', progress)
      alert(`Progress data deleted for ${progress.user}`)
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
          <i className="fas fa-tasks text-purple-600 mr-4"></i>
          Habit Tracking Management
        </h1>
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
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Habits</h3>
              <div className="text-2xl font-bold text-gray-800">51</div>
            </div>
            <i className="fas fa-list text-3xl text-blue-300"></i>
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
              <h3 className="text-sm font-medium text-gray-600 mb-2">Active Users</h3>
              <div className="text-2xl font-bold text-gray-800">4,193</div>
            </div>
            <i className="fas fa-users text-3xl text-green-300"></i>
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
              <h3 className="text-sm font-medium text-gray-600 mb-2">Avg Completion</h3>
              <div className="text-2xl font-bold text-gray-800">79%</div>
            </div>
            <i className="fas fa-chart-line text-3xl text-yellow-300"></i>
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
              <h3 className="text-sm font-medium text-gray-600 mb-2">Avg Streak</h3>
              <div className="text-2xl font-bold text-gray-800">12 days</div>
            </div>
            <i className="fas fa-fire text-3xl text-purple-300"></i>
          </div>
        </motion.div>
      </div>

      {/* Categories Overview */}
      <motion.div
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Habit Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${category.color}`}>
                {category.name}
              </div>
              <p className="text-2xl font-bold text-gray-800">{category.count}</p>
              <p className="text-sm text-gray-600">habits</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="bg-white rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
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
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'templates' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2 w-96">
                  <i className="fas fa-search text-gray-400 mr-3"></i>
                  <input
                    type="text"
                    placeholder="Search habit templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none w-full text-sm"
                  />
                </div>
                <button
                  onClick={() => setShowAddTemplateModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add Template
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habitTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold text-gray-800">{template.name}</h4>
                      <span className="text-green-500">
                        <i className="fas fa-check-circle"></i>
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{template.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{template.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Users:</span>
                        <span className="font-medium">{template.users.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Completion:</span>
                        <span className="font-medium text-green-600">{template.completionRate}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                        {template.difficulty}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditTemplate(template)}
                        className="flex-1 bg-blue-100 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleViewTemplate(template)}
                        className="bg-gray-100 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleDeleteTemplate(template)}
                        className="bg-red-100 text-red-600 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Habit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Streak</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userProgress.map((progress, index) => (
                      <motion.tr
                        key={progress.id}
                        className="hover:bg-purple-50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{progress.user}</div>
                            <div className="text-sm text-gray-500">{progress.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{progress.habit}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <i className="fas fa-fire text-orange-500 mr-2"></i>
                            <span className="text-sm font-medium">{progress.streak} days</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: progress.completion }}
                              ></div>
                            </div>
                            <span className="text-sm">{progress.completion}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(progress.status)}`}>
                            {progress.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{progress.lastActivity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewUserProgress(progress)}
                              className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
                              title="View Progress"
                            >
                              <i className="fas fa-eye text-xs"></i>
                            </button>
                            <button 
                              onClick={() => handleContactUser(progress)}
                              className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
                              title="Contact User"
                            >
                              <i className="fas fa-comment text-xs"></i>
                            </button>
                            <button 
                              onClick={() => handleResetUserProgress(progress)}
                              className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center hover:bg-yellow-200 transition-colors"
                              title="Reset Progress"
                            >
                              <i className="fas fa-undo text-xs"></i>
                            </button>
                            <button 
                              onClick={() => handleDeleteUserProgress(progress)}
                              className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                              title="Delete Progress"
                            >
                              <i className="fas fa-trash text-xs"></i>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="text-center py-20">
              <i className="fas fa-chart-bar text-gray-300 text-6xl mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Habit Analytics</h3>
              <p className="text-gray-500">Advanced analytics and insights coming soon.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Edit Template Modal */}
      {showEditTemplateModal && editingTemplate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Edit Habit Template</h3>
              <button
                onClick={() => setShowEditTemplateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={editingTemplate.category}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Mindfulness">Mindfulness</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Learning">Learning</option>
                  <option value="Health">Health</option>
                  <option value="Productivity">Productivity</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={editingTemplate.difficulty}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, difficulty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={editingTemplate.duration}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 10 minutes"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditTemplateModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditTemplate}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && selectedTemplate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <i className="fas fa-exclamation-triangle text-red-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Delete Habit Template</h3>
                <p className="text-gray-600">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the <strong>{selectedTemplate.name}</strong> template? 
              This will affect {selectedTemplate.users.toLocaleString()} users.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTemplate}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Template
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Add Template Modal */}
      {showAddTemplateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Add New Habit Template</h3>
              <button
                onClick={() => setShowAddTemplateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                  <option value="">Select category</option>
                  <option value="Mindfulness">Mindfulness</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Learning">Learning</option>
                  <option value="Health">Health</option>
                  <option value="Productivity">Productivity</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                  <option value="">Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 10 minutes"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddTemplateModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTemplate}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add Template
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Super User Mode Indicator */}
      <motion.div
        className="bg-green-50 border border-green-200 rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="flex items-center">
          <i className="fas fa-check-circle text-green-600 mr-3"></i>
          <div>
            <h3 className="font-semibold text-green-800">Super User Mode</h3>
            <p className="text-green-700 text-sm">
              Full habit tracking management access enabled. All CRUD operations are available.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminHabitTracking