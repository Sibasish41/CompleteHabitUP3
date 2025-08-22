import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useDataManager } from '../hooks/useDataManager'
import { getDoctorDashboard, getDoctorPatients, updateDoctorProfile, updatePatientStatus } from '../services/doctorService'
import { useForm } from '../utils/useForm'
import { doctorProfileValidation } from '../utils/validation'
import Performance from '../utils/performance'
import Notify from '../utils/notify'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Doctor = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')

  // Use data manager for dashboard data with auto-refresh
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    refresh: refreshDashboard
  } = useDataManager({
    key: 'doctor_dashboard',
    fetchData: getDoctorDashboard,
    cacheDuration: 1, // 1 minute cache
    autoRefresh: true,
    refreshInterval: 60000, // Refresh every minute
    onError: (err) => {
      if (err.response?.status === 401) {
        navigate('/login')
      }
    }
  })

  // Use data manager for patients list with longer cache
  const {
    data: patients,
    loading: patientsLoading,
    error: patientsError,
    refresh: refreshPatients,
    optimisticUpdate: optimisticUpdatePatients,
    batchUpdate: batchUpdatePatients
  } = useDataManager({
    key: 'doctor_patients',
    fetchData: getDoctorPatients,
    cacheDuration: 5, // 5 minute cache
    retryOptions: {
      retries: 3,
      shouldRetry: (error) => error.response?.status >= 500
    }
  })

  // Use form management with validation
  const {
    values: formData,
    errors: formErrors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues: setFormData,
    shouldShowError
  } = useForm(
    dashboardData?.profile || {
      fullName: '',
      email: '',
      phone: '',
      specialization: '',
      experience: '',
      qualification: '',
      bio: '',
      availability: '',
      consultationFee: ''
    },
    doctorProfileValidation,
    async (values) => {
      await Performance.trackAsync(
        async () => {
          await updateDoctorProfile(values)
          await refreshDashboard()
          Notify.success('Profile updated successfully')
        },
        'update_doctor_profile'
      )
    }
  )

  const handlePatientStatusChange = async (patientId, newStatus) => {
    // Use optimistic update with rollback
    const { rollback } = optimisticUpdatePatients(currentPatients => {
      const patientIndex = currentPatients.findIndex(p => p.id === patientId)
      if (patientIndex !== -1) {
        currentPatients[patientIndex] = {
          ...currentPatients[patientIndex],
          status: newStatus
        }
      }
    })

    try {
      await updatePatientStatus(patientId, newStatus)
      Notify.success('Patient status updated successfully')
    } catch (err) {
      rollback()
      throw err
    }
  }

  // Handle batch operations on patients
  const handleBatchStatusUpdate = async (patientIds, newStatus) => {
    await batchUpdatePatients(
      patientIds,
      async (patients, patientId) => {
        const patient = patients.find(p => p.id === patientId)
        if (patient) {
          patient.status = newStatus
          await updatePatientStatus(patientId, newStatus)
        }
      }
    )
  }

  // Check if any data is loading
  const isLoading = dashboardLoading || patientsLoading

  // Check for any errors
  const error = dashboardError || patientsError

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctor dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-4">{error.message}</div>
          <button
            onClick={() => {
              refreshDashboard()
              refreshPatients()
            }}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome, Dr. {user?.name}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Active Patients</h3>
              <p className="text-3xl font-bold text-blue-600">
                {dashboardData?.stats?.activePatients || 0}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Sessions Today</h3>
              <p className="text-3xl font-bold text-green-600">
                {dashboardData?.stats?.sessionsToday || 0}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Success Rate</h3>
              <p className="text-3xl font-bold text-purple-600">
                {dashboardData?.stats?.successRate || 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`mr-4 py-2 px-4 ${
                activeTab === 'dashboard'
                  ? 'border-b-2 border-primary-500 text-primary-500'
                  : 'text-gray-600'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`mr-4 py-2 px-4 ${
                activeTab === 'patients'
                  ? 'border-b-2 border-primary-500 text-primary-500'
                  : 'text-gray-600'
              }`}
            >
              Patients
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-4 ${
                activeTab === 'profile'
                  ? 'border-b-2 border-primary-500 text-primary-500'
                  : 'text-gray-600'
              }`}
            >
              Profile
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              {dashboardData?.recentActivity?.map((activity, index) => (
                <div key={index} className="border-b border-gray-200 py-4 last:border-0">
                  <p className="text-gray-800">{activity.description}</p>
                  <p className="text-sm text-gray-500 mt-1">{activity.timestamp}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'patients' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Patient List</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Session
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 bg-gray-50"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patients.map((patient) => (
                      <tr key={patient.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{patient.age}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(patient.lastSession).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-green-600 h-2.5 rounded-full"
                              style={{ width: `${patient.progress}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            patient.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => navigate(`/patient/${patient.id}`)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Doctor Profile</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        shouldShowError('fullName') 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      }`}
                    />
                    {shouldShowError('fullName') && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        shouldShowError('email') 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      }`}
                    />
                    {shouldShowError('email') && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        shouldShowError('phone') 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      }`}
                    />
                    {shouldShowError('phone') && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        shouldShowError('specialization') 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      }`}
                    />
                    {shouldShowError('specialization') && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.specialization}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Experience (years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        shouldShowError('experience') 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      }`}
                    />
                    {shouldShowError('experience') && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.experience}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Qualification
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        shouldShowError('qualification') 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      }`}
                    />
                    {shouldShowError('qualification') && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.qualification}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows="4"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      shouldShowError('bio') 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    }`}
                  ></textarea>
                  {shouldShowError('bio') && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.bio}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Available Hours
                    </label>
                    <input
                      type="text"
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g., Mon-Fri, 9 AM - 5 PM"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        shouldShowError('availability') 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      }`}
                    />
                    {shouldShowError('availability') && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.availability}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Consultation Fee
                    </label>
                    <input
                      type="number"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        shouldShowError('consultationFee') 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      }`}
                    />
                    {shouldShowError('consultationFee') && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.consultationFee}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Updating...
                      </span>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctor