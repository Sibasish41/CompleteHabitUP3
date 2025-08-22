import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { submitCoachApplication, uploadDocument, getApplicationStatus } from '../services/coachService'
import AOS from 'aos'
import 'aos/dist/aos.css'

const CoachApplication = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [files, setFiles] = useState({
    idProof: null,
    supportingDoc: null,
    optionalDoc: null
  })
  const [formData, setFormData] = useState({
    specialization: '',
    experience: '',
    availability: '',
    bio: ''
  })
  const [applicationStatus, setApplicationStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [responseMessage, setResponseMessage] = useState({ text: '', type: '' })
  const [uploadProgress, setUploadProgress] = useState({
    idProof: 0,
    supportingDoc: 0,
    optionalDoc: 0
  })

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })

    if (!isAuthenticated) {
      navigate('/')
      return
    }

    // Check if user has an existing application
    checkApplicationStatus()
  }, [isAuthenticated, navigate])

  const checkApplicationStatus = async () => {
    try {
      const status = await getApplicationStatus()
      setApplicationStatus(status)
      if (status.status === 'APPROVED' || status.status === 'REJECTED') {
        setResponseMessage({
          text: status.status === 'APPROVED'
            ? 'Your application has been approved!'
            : 'Your application has been rejected.',
          type: status.status === 'APPROVED' ? 'success' : 'error'
        })
      } else if (status.status === 'PENDING') {
        setResponseMessage({
          text: 'Your application is under review.',
          type: 'info'
        })
      }
    } catch (err) {
      console.error('Error checking application status:', err)
    }
  }

  const handleFileChange = async (field, event) => {
    const file = event.target.files[0]
    
    if (!file) return

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setResponseMessage({
        text: 'File size must be less than 5MB',
        type: 'error'
      })
      event.target.value = ''
      return
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      setResponseMessage({
        text: 'Only PDF, JPEG, and PNG files are allowed',
        type: 'error'
      })
      event.target.value = ''
      return
    }

    try {
      // Upload the file
      const result = await uploadDocument(file, field)
      setFiles(prev => ({
        ...prev,
        [field]: result.fileUrl
      }))
      setResponseMessage({
        text: 'File uploaded successfully',
        type: 'success'
      })
    } catch (err) {
      setResponseMessage({
        text: err.response?.data?.message || 'Failed to upload file',
        type: 'error'
      })
      event.target.value = ''
    }
  }

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!files.idProof || !files.supportingDoc) {
      setResponseMessage({
        text: 'Please upload required documents',
        type: 'error'
      })
      return
    }

    try {
      setIsSubmitting(true)
      setResponseMessage({ text: '', type: '' })

      // Create application data
      const applicationData = {
        ...formData,
        documents: {
          idProof: files.idProof,
          supportingDoc: files.supportingDoc,
          optionalDoc: files.optionalDoc
        }
      }

      // Submit application
      await submitCoachApplication(applicationData)

      setResponseMessage({
        text: 'Application submitted successfully! We will review your application and get back to you soon.',
        type: 'success'
      })

      // Reset form
      setFormData({
        specialization: '',
        experience: '',
        availability: '',
        bio: ''
      })
      setFiles({
        idProof: null,
        supportingDoc: null,
        optionalDoc: null
      })
    } catch (err) {
      setResponseMessage({
        text: err.response?.data?.message || 'Failed to submit application',
        type: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // If user already has an active application, show status
  if (applicationStatus && applicationStatus.status !== 'NEW') {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className={`p-6 rounded-lg shadow-lg ${
              applicationStatus.status === 'APPROVED' ? 'bg-green-50' :
              applicationStatus.status === 'REJECTED' ? 'bg-red-50' :
              'bg-blue-50'
            }`}>
              <h2 className="text-2xl font-bold mb-4">Application Status</h2>
              <p className={`text-lg ${
                applicationStatus.status === 'APPROVED' ? 'text-green-700' :
                applicationStatus.status === 'REJECTED' ? 'text-red-700' :
                'text-blue-700'
              }`}>
                {responseMessage.text}
              </p>
              {applicationStatus.feedback && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Feedback:</h3>
                  <p className="text-gray-700">{applicationStatus.feedback}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Coach Application</h1>

          {responseMessage.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              responseMessage.type === 'success' ? 'bg-green-50 text-green-700' :
              responseMessage.type === 'error' ? 'bg-red-50 text-red-700' :
              'bg-blue-50 text-blue-700'
            }`}>
              {responseMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Meditation, Fitness, Productivity"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Weekly Availability (hours)</label>
                <input
                  type="number"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="40"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Professional Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tell us about your experience and coaching philosophy..."
                ></textarea>
              </div>

              {/* Document Upload Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Required Documents</h3>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    ID Proof <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange('idProof', e)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-1">PDF, JPEG, or PNG (max 5MB)</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Supporting Document <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange('supportingDoc', e)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-1">PDF, JPEG, or PNG (max 5MB)</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Additional Document (Optional)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange('optionalDoc', e)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-1">PDF, JPEG, or PNG (max 5MB)</p>
                </div>
              </div>

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
                    Submitting...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CoachApplication