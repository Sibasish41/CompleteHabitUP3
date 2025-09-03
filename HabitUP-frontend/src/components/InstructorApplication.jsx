import { useState } from 'react'
import { motion } from 'framer-motion'

const InstructorApplication = () => {
  const [formData, setFormData] = useState({
    govId: null,
    educationCert: null,
    experienceCert: null,
    additionalDocs: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleFileChange = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      console.log('Submitting instructor application:', formData)
      setSubmitMessage('Application submitted successfully! We will review your documents and contact you within 3-5 business days.')
      
      // Reset form
      setFormData({
        govId: null,
        educationCert: null,
        experienceCert: null,
        additionalDocs: null
      })
    } catch (error) {
      console.error('Error submitting application:', error)
      setSubmitMessage('Error submitting application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const benefits = [
    {
      icon: 'fas fa-dollar-sign',
      title: 'Competitive Earnings',
      description: 'Earn competitive rates for each coaching session and build a sustainable income stream.'
    },
    {
      icon: 'fas fa-clock',
      title: 'Flexible Schedule',
      description: 'Set your own availability and work around your existing commitments.'
    },
    {
      icon: 'fas fa-users',
      title: 'Impact Lives',
      description: 'Help people transform their lives through better habits and personal growth.'
    },
    {
      icon: 'fas fa-graduation-cap',
      title: 'Professional Growth',
      description: 'Develop your coaching skills and gain experience in habit transformation.'
    },
    {
      icon: 'fas fa-headset',
      title: 'Full Support',
      description: 'Get comprehensive training and ongoing support from our expert team.'
    },
    {
      icon: 'fas fa-certificate',
      title: 'Certification',
      description: 'Receive official HabitUP instructor certification upon completion of training.'
    }
  ]

  const processSteps = [
    {
      number: '01',
      title: 'User Shares Challenge',
      description: 'Users describe their habit-related struggles and goals through our platform.',
      icon: 'fas fa-user-edit'
    },
    {
      number: '02',
      title: 'Instructor Analyzes',
      description: 'You review the user\'s situation, identify patterns, and understand the root causes of their habit challenges.',
      icon: 'fas fa-search'
    },
    {
      number: '03',
      title: 'Personalized Plan',
      description: 'Create a customized habit transformation plan tailored to the user\'s specific needs and lifestyle.',
      icon: 'fas fa-clipboard-list'
    },
    {
      number: '04',
      title: 'Ongoing Support',
      description: 'Provide continuous guidance, motivation, and adjustments to help users achieve lasting change.',
      icon: 'fas fa-hands-helping'
    }
  ]

  const chatMessages = [
    {
      type: 'user',
      message: 'I\'ve been trying to wake up at 6am for months but I keep hitting snooze. I feel so frustrated with myself.',
      time: 'Today, 9:15 AM'
    },
    {
      type: 'instructor',
      message: 'I understand the struggle. Let\'s analyze your current routine. What time do you usually go to bed?',
      time: 'Today, 9:16 AM'
    },
    {
      type: 'user',
      message: 'Usually around midnight, sometimes later if I\'m watching Netflix or scrolling my phone.',
      time: 'Today, 9:18 AM'
    },
    {
      type: 'instructor',
      message: 'This makes sense. For a 6am wake-up, you need 7-8 hours sleep. Let\'s create a gradual wind-down routine starting at 10pm.',
      time: 'Today, 9:20 AM'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-graduation-cap text-white"></i>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">HabitUP Instructor</h1>
            </div>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Become a HabitUP Instructor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our team of certified habit transformation experts and help users build better lives 
            through personalized guidance and support.
          </p>
        </motion.div>

        {/* Benefits Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Become a HabitUP Instructor?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <i className={`${benefit.icon} text-blue-600 text-xl`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How HabitUP Instructors Help
          </h2>
          <div className="relative">
            {/* Process Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-blue-200 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center relative"
                >
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-xl font-bold">{step.number}</span>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`${step.icon} text-blue-600 text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Chat Visualization */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-6 text-center">
              <h3 className="text-2xl font-bold">Instructor-User Interaction</h3>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: msg.type === 'user' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.2 }}
                    className={`flex ${msg.type === 'instructor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.type === 'instructor' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="mb-1">{msg.message}</p>
                      <span className={`text-xs ${
                        msg.type === 'instructor' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.time}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Application Form */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          id="apply_here"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Instructor Application
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h4 className="font-semibold text-blue-800 mb-3">Required Documents:</h4>
              <ul className="text-blue-700 space-y-2">
                <li>• Government-issued ID proof (Aadhar, Passport, etc.)</li>
                <li>• Educational certificates or relevant qualifications</li>
                <li>• Experience certificates (if applicable)</li>
                <li>• Any additional certifications in coaching, psychology, or related fields</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Government ID Proof <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('govId', e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Educational Certificates <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('educationCert', e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Certificates
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('experienceCert', e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Documents
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('additionalDocs', e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner animate-spin mr-2"></i>
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Submit Application
                    </>
                  )}
                </button>
              </div>

              {submitMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-center p-4 rounded-lg ${
                    submitMessage.includes('successfully') 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {submitMessage}
                </motion.div>
              )}
            </form>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default InstructorApplication