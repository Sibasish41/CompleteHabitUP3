import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { getProgramsByUserType, getHeroContent } from '../services/programService'
import VideoMeeting from '../components/VideoMeeting'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Services = () => {
  const { user } = useAuth()
  const [userType, setUserType] = useState('Adult')
  const [services, setServices] = useState([])
  const [heroContent, setHeroContent] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    })
    
    // Get user type from authenticated user or default to Adult
    const currentUserType = user?.userType || 'Adult'
    setUserType(currentUserType)
    loadServices(currentUserType)
  }, [user])

  const loadServices = async (type) => {
    try {
      setLoading(true)
      setError(null)

      // Fetch services and hero content in parallel
      const [servicesData, heroData] = await Promise.all([
        getProgramsByUserType(type),
        getHeroContent(type)
      ])

      setServices(servicesData)
      setHeroContent(heroData)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load services')
      console.error('Services loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
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
            onClick={() => loadServices(userType)}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              {heroContent.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-purple-100"
            >
              {heroContent.description}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <i className={`${service.icon} text-4xl text-white`}></i>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <button
                    onClick={() => window.location.href = `/service/${service.id}`}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                  >
                    Learn More
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Meeting Section */}
      {userType === 'Doctor' && (
        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <VideoMeeting />
          </div>
        </section>
      )}
    </div>
  )
}

export default Services