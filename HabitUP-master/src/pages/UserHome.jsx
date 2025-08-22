import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getLearningVideos, getRecommendedContent } from '../services/contentService'
import AOS from 'aos'
import 'aos/dist/aos.css'

const UserHome = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [recommendedContent, setRecommendedContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch videos and recommended content in parallel
      const [videosData, recommendedData] = await Promise.all([
        getLearningVideos(),
        getRecommendedContent()
      ])

      setVideos(videosData)
      setRecommendedContent(recommendedData)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load content')
      console.error('Content loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your content...</p>
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
            onClick={loadContent}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4" data-aos="fade-up">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-xl text-gray-600" data-aos="fade-up" data-aos-delay="100">
            Continue your journey to better habits
          </p>
        </div>

        {/* Learning Videos Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6" data-aos="fade-up">
            Learning Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{video.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{video.description}</p>
                  <button
                    onClick={() => window.open(video.url, '_blank')}
                    className="w-full bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors"
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Content Section */}
        {recommendedContent.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6" data-aos="fade-up">
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedContent.map((content, index) => (
                <div
                  key={content.id}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="flex items-center mb-4">
                    <i className={`${content.icon} text-2xl text-primary-500 mr-3`}></i>
                    <h3 className="font-semibold text-gray-800">{content.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{content.description}</p>
                  <button
                    onClick={() => navigate(content.path)}
                    className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
                  >
                    Learn More
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default UserHome