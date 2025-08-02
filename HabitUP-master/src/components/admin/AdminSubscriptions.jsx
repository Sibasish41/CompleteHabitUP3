import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  addPlan,
  updatePlan,
  deletePlan,
  setSelectedPlan,
  setEditPlanModalOpen,
  setDeletePlanModalOpen,
  updateSubscription,
  cancelSubscription,
  setSelectedSubscription,
  setEditSubscriptionModalOpen
} from '../../store/slices/subscriptionsSlice'

const AdminSubscriptions = ({ isDemoMode }) => {
  const dispatch = useDispatch()
  const {
    plans,
    subscriptions,
    loading,
    selectedPlan,
    selectedSubscription,
    isEditPlanModalOpen,
    isDeletePlanModalOpen,
    isEditSubscriptionModalOpen,
    revenue,
    analytics
  } = useSelector(state => state.subscriptions)

  const [activeTab, setActiveTab] = useState('plans')
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false)
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: 0,
    interval: 'month',
    features: [],
    limits: {
      habits: 0,
      reminders: 0,
      analytics: false,
      export: false
    },
    status: 'active'
  })
  const [editPlan, setEditPlan] = useState(null)
  const [newFeature, setNewFeature] = useState('')

  const handleAddPlan = () => {
    if (newPlan.name && newPlan.price >= 0) {
      dispatch(addPlan(newPlan))
      setNewPlan({
        name: '',
        price: 0,
        interval: 'month',
        features: [],
        limits: { habits: 0, reminders: 0, analytics: false, export: false },
        status: 'active'
      })
      setIsAddPlanModalOpen(false)
    }
  }

  const handleEditPlan = () => {
    if (editPlan) {
      dispatch(updatePlan(editPlan))
      dispatch(setEditPlanModalOpen(false))
      setEditPlan(null)
    }
  }

  const handleDeletePlan = () => {
    if (selectedPlan) {
      dispatch(deletePlan(selectedPlan.id))
      dispatch(setDeletePlanModalOpen(false))
      dispatch(setSelectedPlan(null))
    }
  }

  const openEditPlanModal = (plan) => {
    setEditPlan({ ...plan })
    dispatch(setEditPlanModalOpen(true))
  }

  const openDeletePlanModal = (plan) => {
    dispatch(setSelectedPlan(plan))
    dispatch(setDeletePlanModalOpen(true))
  }

  const handleCancelSubscription = (subscription) => {
    dispatch(cancelSubscription(subscription.id))
  }

  const openEditSubscriptionModal = (subscription) => {
    dispatch(setSelectedSubscription(subscription))
    dispatch(setEditSubscriptionModalOpen(true))
  }

  const handleDeleteSubscription = (subscription) => {
    if (confirm(`Are you sure you want to delete subscription for User #${subscription.userId}?`)) {
      // For now, we'll use cancelSubscription to mark it as cancelled
      // In a real app, you'd have a separate deleteSubscription action
      dispatch(cancelSubscription(subscription.id))
    }
  }

  const handleEditSubscription = (subscriptionData) => {
    dispatch(updateSubscription(subscriptionData))
    dispatch(setEditSubscriptionModalOpen(false))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      if (isAddPlanModalOpen) {
        setNewPlan({
          ...newPlan,
          features: [...newPlan.features, newFeature.trim()]
        })
      } else if (editPlan) {
        setEditPlan({
          ...editPlan,
          features: [...editPlan.features, newFeature.trim()]
        })
      }
      setNewFeature('')
    }
  }

  const removeFeature = (index) => {
    if (isAddPlanModalOpen) {
      setNewPlan({
        ...newPlan,
        features: newPlan.features.filter((_, i) => i !== index)
      })
    } else if (editPlan) {
      setEditPlan({
        ...editPlan,
        features: editPlan.features.filter((_, i) => i !== index)
      })
    }
  }

  const getPlanColor = (planName) => {
    switch (planName.toLowerCase()) {
      case 'free': return 'bg-gray-100 text-gray-800'
      case 'basic': return 'bg-blue-100 text-blue-800'
      case 'premium': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Subscription Management</h2>
          <p className="text-gray-600 mt-1">Manage subscription plans and user subscriptions with full CRUD access</p>
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
            <i className="fas fa-check-circle mr-1"></i>
            Super User Mode: Full subscription management access enabled
          </div>
        </div>
        <button
          onClick={() => setIsAddPlanModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <i className="fas fa-plus mr-2"></i>
          Add Plan
        </button>
      </motion.div>

      {/* Revenue Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${revenue.total.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fas fa-dollar-sign text-green-600"></i>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">
            <i className="fas fa-arrow-up mr-1"></i>
            +{revenue.growth}% from last month
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${revenue.monthly.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-calendar text-blue-600"></i>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Current month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.conversionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="fas fa-chart-line text-purple-600"></i>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Free to paid conversion</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm"
      >
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('plans')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'plans'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Subscription Plans
              <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                {plans.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'subscriptions'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              User Subscriptions
              <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                {subscriptions.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                      <div className="flex items-baseline mt-1">
                        <span className="text-2xl font-bold text-gray-900">
                          ${plan.price}
                        </span>
                        <span className="text-gray-500 ml-1">/{plan.interval}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {plan.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>{plan.users} users</span>
                    <span>${plan.revenue.toLocaleString()} revenue</span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditPlanModal(plan)}
                      className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded text-sm hover:bg-blue-100 transition-colors"
                    >
                      <i className="fas fa-edit mr-1"></i>
                      Edit
                    </button>
                    <button
                      onClick={() => openDeletePlanModal(plan)}
                      className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded text-sm hover:bg-red-100 transition-colors"
                    >
                      <i className="fas fa-trash mr-1"></i>
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Billing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.map((subscription, index) => (
                  <motion.tr
                    key={subscription.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">User #{subscription.userId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(subscription.planName)}`}>
                        {subscription.planName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(subscription.status)}`}>
                        {subscription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${subscription.amount} {subscription.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscription.nextBilling || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditSubscriptionModal(subscription)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Subscription"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteSubscription(subscription)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Subscription"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                        {subscription.status === 'active' && (
                          <button
                            onClick={() => handleCancelSubscription(subscription)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Cancel Subscription"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Edit Plan Modal */}
      <AnimatePresence>
        {isEditPlanModalOpen && editPlan && (
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
              className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Edit Plan</h3>
                <button
                  onClick={() => dispatch(setEditPlanModalOpen(false))}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                    <input
                      type="text"
                      value={editPlan.name}
                      onChange={(e) => setEditPlan({ ...editPlan, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="number"
                      value={editPlan.price}
                      onChange={(e) => setEditPlan({ ...editPlan, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editPlan.status}
                    onChange={(e) => setEditPlan({ ...editPlan, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Add a feature..."
                      onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    />
                    <button
                      onClick={addFeature}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-1">
                    {editPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                        <span className="text-sm">{feature}</span>
                        <button
                          onClick={() => removeFeature(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => dispatch(setEditPlanModalOpen(false))}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditPlan}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Update Plan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Plan Modal */}
      <AnimatePresence>
        {isDeletePlanModalOpen && selectedPlan && (
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
                  <h3 className="text-lg font-semibold text-gray-800">Delete Plan</h3>
                  <p className="text-gray-600">This action cannot be undone.</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete the <strong>{selectedPlan.name}</strong> plan? 
                This will affect {selectedPlan.users} users.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => dispatch(setDeletePlanModalOpen(false))}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePlan}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Plan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Subscription Modal */}
      <AnimatePresence>
        {isEditSubscriptionModalOpen && selectedSubscription && (
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
                <h3 className="text-lg font-semibold text-gray-800">Edit Subscription</h3>
                <button
                  onClick={() => dispatch(setEditSubscriptionModalOpen(false))}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedSubscription.status}
                    onChange={(e) => dispatch(setSelectedSubscription({ ...selectedSubscription, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="active">Active</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auto Renew</label>
                  <select
                    value={selectedSubscription.autoRenew}
                    onChange={(e) => dispatch(setSelectedSubscription({ ...selectedSubscription, autoRenew: e.target.value === 'true' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Billing Date</label>
                  <input
                    type="date"
                    value={selectedSubscription.nextBilling || ''}
                    onChange={(e) => dispatch(setSelectedSubscription({ ...selectedSubscription, nextBilling: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => dispatch(setEditSubscriptionModalOpen(false))}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEditSubscription(selectedSubscription)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Update Subscription
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Plan Modal */}
      <AnimatePresence>
        {isAddPlanModalOpen && (
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
              className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Add New Plan</h3>
                <button
                  onClick={() => setIsAddPlanModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                    <input
                      type="text"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Premium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="number"
                      value={newPlan.price}
                      onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Add a feature..."
                      onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    />
                    <button
                      onClick={addFeature}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-1">
                    {newPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                        <span className="text-sm">{feature}</span>
                        <button
                          onClick={() => removeFeature(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsAddPlanModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPlan}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Create Plan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminSubscriptions