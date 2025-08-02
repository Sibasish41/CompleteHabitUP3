import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [responseMessage, setResponseMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })

    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleFileChange = (field, event) => {
    const file = event.target.files[0]
    
    if (!file) return

    // Check file size (100KB max)
    if (file.size > 100 * 1024) {
      alert('File size must be less than 100KB')
      event.target.value = ''
      return
    }

    // Check file type
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed')
      event.target.value = ''
      return
    }

    setFiles(prev => ({
      ...prev,
      [field]: file
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!files.idProof || !files.supportingDoc) {
      setResponseMessage({
        text: 'Please upload ID proof and supporting document.',
        type: 'error'
      })
      return
    }

    const formData = new FormData()
    formData.append('userId', user?.id || localStorage.getItem('userId'))
    formData.append('idProof', files.idProof)
    formData.append('supportingDoc', files.supportingDoc)

    if (files.optionalDoc) {
      formData.append('optionalDoc', files.optionalDoc)
    }

    try {
      setIsSubmitting(true)
      
      const response = await fetch('https://habit-up-backend.onrender.com/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      const resultText = await response.text()

      if (response.ok) {
        setResponseMessage({
          text: resultText.includes('successfully') ? resultText : 'Application submitted successfully!',
          type: 'success'
        })
        // Reset form
        setFiles({ idProof: null, supportingDoc: null, optionalDoc: null })
        document.getElementById('coachForm').reset()
      } else {
        setResponseMessage({
          text: resultText || 'Document upload failed.',
          type: 'error'
        })
      }
    } catch (error) {
      console.error(error)
      setResponseMessage({
        text: 'Network error. Please try again later.',
        type: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const FileUploadBox = ({ field, label, icon, required = false }) => (
    <div className="mb-6">
      <label className="block text-gray-700 font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 hover:bg-blue-50 transition-all duration-300 cursor-pointer"
        onClick={() => document.getElementById(field).click()}
      >
        <i className={`${icon} text-4xl text-primary-500 mb-3`}></i>
        <p className="text-gray-600 mb-2">
          {files[field] ? files[field].name : `Click to upload ${label.toLowerCase()}`}
        </p>
        <p className="text-sm text-gray-500">PDF only, max 100KB</p>
        <input
          type="file"
          id={field}
          accept=".pdf"
          onChange={(e) => handleFileChange(field, e)}
          className="hidden"
          required={required}
        />
      </div>
      {files[field] && (
        <p className="text-sm text-green-600 mt-2">
          Selected: {files[field].name} ({(files[field].size / 1024).toFixed(1)}KB)
        </p>
      )}
    </div>
  )

  return (
    <div className="pt-20 min-h-screen" style={{ backgroundColor: '#f5f7ff' }}>
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <i className="fas fa-graduation-cap text-3xl text-primary-500 mr-3"></i>
            <h1 className="text-3xl font-bold text-primary-500">HabitUP</h1>
          </div>
          <button
            onClick={() => navigate('/user-home')}
            className="bg-primary-500 text-white px-6 py-3 rounded-full font-medium hover:bg-primary-600 transition-all duration-300 flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Home
          </button>
        </div>

        <div className="text-center mb-12" data-aos="fade-up">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Become a HabitUP Instructor</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our team of certified habit transformation experts and help users build better lives through personalized guidance and support.
          </p>
        </div>

        {/* Benefits Section */}
        <section className="mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Become a HabitUP Instructor?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-primary-500">
              <div className="text-4xl text-primary-500 mb-6">
                <i className="fas fa-hand-holding-heart"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Make a Real Impact</h3>
              <p className="text-gray-600">
                Help individuals transform their lives by building positive habits and breaking negative ones through your expert guidance.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-primary-500">
              <div className="text-4xl text-primary-500 mb-6">
                <i className="fas fa-user-clock"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Flexible Schedule</h3>
              <p className="text-gray-600">
                Work on your own time and set your availability to match your lifestyle while helping others.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-primary-500">
              <div className="text-4xl text-primary-500 mb-6">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Growth Opportunities</h3>
              <p className="text-gray-600">
                Access ongoing training, resources, and certification programs to enhance your coaching skills.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How HabitUP Instructors Help</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-500 to-blue-600"></div>
              
              <div className="space-y-12">
                {[
                  {
                    icon: 'fas fa-user-edit',
                    title: 'User Shares Their Challenge',
                    desc: 'Users describe their habit struggles, goals, and challenges through our secure messaging system.'
                  },
                  {
                    icon: 'fas fa-search',
                    title: 'Instructor Analyzes',
                    desc: 'You review the user\'s situation, identify patterns, and understand the root causes of their habit challenges.'
                  },
                  {
                    icon: 'fas fa-lightbulb',
                    title: 'Personalized Solution',
                    desc: 'You create a tailored action plan with practical steps, accountability measures, and motivational strategies.'
                  },
                  {
                    icon: 'fas fa-hands-helping',
                    title: 'Ongoing Support',
                    desc: 'You provide continuous guidance, adjust strategies as needed, and celebrate progress with the user.'
                  }
                ].map((step, index) => (
                  <div key={index} className={`flex items-center ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                    <div className="w-16 h-16 bg-white border-4 border-primary-500 rounded-full flex items-center justify-center text-primary-500 text-xl font-bold z-10">
                      <i className={step.icon}></i>
                    </div>
                    <div className={`bg-white rounded-xl p-6 shadow-lg flex-1 ${index % 2 === 0 ? 'ml-8' : 'mr-8'}`}>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Chat Visualization */}
        <section className="mb-16" data-aos="fade-up">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Instructor-User Interaction</h3>
            <div className="space-y-4">
              <div className="flex">
                <div className="bg-gray-100 rounded-lg p-4 max-w-xs">
                  <p className="text-gray-800">I've been trying to wake up at 6am for months but always end up hitting snooze until 7:30. I feel so unproductive!</p>
                  <span className="text-xs text-gray-500 mt-2 block">Today, 9:14 AM</span>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-primary-500 text-white rounded-lg p-4 max-w-xs">
                  <p>I understand the struggle. Let's analyze your current routine. What time do you usually go to bed?</p>
                  <span className="text-xs text-blue-200 mt-2 block">Today, 9:16 AM</span>
                </div>
              </div>
              <div className="flex">
                <div className="bg-gray-100 rounded-lg p-4 max-w-xs">
                  <p className="text-gray-800">Around midnight, sometimes later. I know it's late but I can't seem to unwind earlier.</p>
                  <span className="text-xs text-gray-500 mt-2 block">Today, 9:18 AM</span>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-primary-500 text-white rounded-lg p-4 max-w-xs">
                  <p>This makes sense. For a 6am wake-up, you need 7-8 hours sleep. Let's create a gradual wind-down routine starting at 10pm.</p>
                  <span className="text-xs text-blue-200 mt-2 block">Today, 9:20 AM</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="max-w-4xl mx-auto" data-aos="fade-up">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Instructor Application</h2>

            {/* Documents Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-file-alt text-primary-500 mr-3"></i>
                Required Documents
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  Government-issued ID proof (front and back in one image)
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  Supporting document (certification, degree, or proof of experience in coaching/psychology/habit formation)
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  Optional: Additional documents that support your application (max 100KB each, PDF only)
                </li>
              </ul>
            </div>

            <form id="coachForm" onSubmit={handleSubmit}>
              <FileUploadBox
                field="idProof"
                label="Government ID Proof"
                icon="fas fa-id-card"
                required={true}
              />

              <FileUploadBox
                field="supportingDoc"
                label="Supporting Document"
                icon="fas fa-certificate"
                required={true}
              />

              <FileUploadBox
                field="optionalDoc"
                label="Optional Document"
                icon="fas fa-file-upload"
                required={false}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-500 text-white py-4 rounded-full font-semibold text-lg hover:bg-primary-600 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>

              {responseMessage.text && (
                <div className={`mt-6 p-4 rounded-lg text-center ${
                  responseMessage.type === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {responseMessage.text}
                </div>
              )}
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}

export default CoachApplication