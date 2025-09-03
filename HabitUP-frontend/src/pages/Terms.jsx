import { useState, useEffect } from 'react'
import { getPageContent } from '../services/contentManagementService'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Terms = () => {
  const [accepted, setAccepted] = useState(false)
  const [termsContent, setTermsContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
    loadTermsContent()
  }, [])

  const loadTermsContent = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPageContent('terms')
      setTermsContent(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load terms and conditions')
      console.error('Terms content loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = () => {
    setAccepted(true)
    // Store acceptance in local storage or user preferences
    localStorage.setItem('termsAccepted', 'true')
    window.history.back()
  }

  const handleDecline = () => {
    window.history.back()
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading terms and conditions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-4">{error}</div>
          <button
            onClick={loadTermsContent}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="hero-section min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8" data-aos="fade-up">
            <h1 className="text-3xl font-bold text-center mb-8 text-teal-700">
              {termsContent?.title || 'Terms and Conditions'}
            </h1>

            <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto mb-6 text-sm leading-relaxed">
              <div
                className="space-y-6"
                dangerouslySetInnerHTML={{ __html: termsContent?.content }}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleDecline}
                className="px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
              >
                Accept Terms
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terms