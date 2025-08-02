import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AOS from 'aos'
import 'aos/dist/aos.css'

const UserHome = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  }, [])

  const habitVideos = [
    {
      id: 1,
      title: 'The Psychology of Habits',
      description: 'Understand how habits form in your brain and how to rewire them effectively.',
      duration: '02:39',
      thumbnail: '/img/ThumbnailLearnig.png',
      url: 'https://drive.google.com/file/d/1t75UEcqnVnO9viGt90YtYRAOqRois5gg/preview'
    },
    {
      id: 2,
      title: 'Learning Hypnosis',
      description: 'Create a powerful mind using hypnosis for daily success.',
      duration: '00:58',
      thumbnail: '/img/ThumbnailLearnig.png',
      url: 'https://drive.google.com/file/d/1peINiv5delayaRicbdwjklpdR6VQptPK/preview'
    },
    {
      id: 3,
      title: 'Breaking Bad Habits',
      description: 'Proven strategies to eliminate negative patterns from your life.',
      duration: '01:00',
      thumbnail: '/img/ThumbnailLearnig.png',
      url: 'https://drive.google.com/file/d/1poyMuq8YnE8UbCgla5kioz5Mj8Ckpz8W/preview'
    },
    {
      id: 4,
      title: 'Habit Stacking Secrets',
      description: 'Combine multiple habits for maximum efficiency and compounding results.',
      duration: '02:23',
      thumbnail: '/img/ThumbnailLearnig.png',
      url: 'https://drive.google.com/file/d/1peYISaYDhFJn1q3YD9x0RVLIMyhbHGfn/preview'
    },
    {
      id: 5,
      title: 'Advanced Habit Formation',
      description: 'Take your habit-building skills to the next level with neuroscience-backed techniques.',
      duration: '25:12',
      thumbnail: '/img/ThumbnailLearnig.png',
      locked: user?.subscriptionType === 'Free'
    },
    {
      id: 6,
      title: 'Habit Tracking Systems',
      description: 'Discover the most effective systems to track and maintain your habits long-term.',
      duration: '19:45',
      thumbnail: '/img/ThumbnailLearnig.png',
      locked: user?.subscriptionType === 'Free'
    },
    {
      id: 7,
      title: 'Mindfulness & Habits',
      description: 'How mindfulness can supercharge your habit formation process.',
      duration: '21:08',
      thumbnail: '/img/ThumbnailLearnig.png',
      locked: user?.subscriptionType === 'Free'
    },
    {
      id: 8,
      title: 'Habit Resilience',
      description: 'How to maintain your habits even during challenging times and setbacks.',
      duration: '17:55',
      thumbnail: '/img/ThumbnailLearnig.png',
      locked: user?.subscriptionType === 'Free'
    },
    {
      id: 9,
      title: 'Lifetime Habit Mastery',
      description: 'The ultimate guide to making habits stick for a lifetime of success.',
      duration: '28:40',
      thumbnail: '/img/ThumbnailLearnig.png',
      locked: user?.subscriptionType === 'Free'
    }
  ]

  return (
    <div className="pt-20" style={{ backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
      {/* Hero Section - Following HTML structure */}
      <section className="hero-section" style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '8rem 0',
        background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
        color: 'white',
        clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)',
        marginBottom: '5rem'
      }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="hero-content" data-aos="fade-up">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 font-raleway" style={{ 
                fontFamily: 'Playfair Display, serif',
                textShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
              }}>
                Welcome Back, {user?.firstName || 'User'}!
              </h1>
              <p className="text-xl mb-8 opacity-90 max-w-2xl" data-aos="fade-up" data-aos-delay="100">
                Your journey to better habits starts here
              </p>
              <div className="flex flex-col sm:flex-row gap-4" data-aos="fade-up" data-aos-delay="200">
                <a 
                  href="#learning" 
                  className="bg-white text-primary-500 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 text-center"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('learning')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Start Learning
                </a>
                <a 
                  href="#subscription" 
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary-500 transition-all duration-300 text-center"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('subscription')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Go Premium
                </a>
              </div>
            </div>
            <div className="hidden lg:block" data-aos="fade-left">
              <img
                src="/img/HabitTracker.png"
                alt="Habit Tracker"
                className="w-full max-w-lg mx-auto"
                style={{ filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.2))' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mentor Spotlight - Following HTML structure */}
      <section id="mentor-showcase" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-primary-500" data-aos="fade-up">
            Mentor Spotlight: Dr. Sashi Bhusan Nayak
          </h2>
          <p className="text-gray-600 mb-8" data-aos="fade-up" data-aos-delay="100">
            Watch as Dr. Nayak demonstrates live hypnotism at GIET University, Gunupur — inspiring young minds
            through the power of focus and mental discipline.
          </p>
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl" data-aos="fade-up" data-aos-delay="200">
            <iframe
              src="https://www.youtube.com/embed/Z7jYfYdam9I"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>
  
    {/* Habit Mastery Videos - Following HTML structure */}
      <section id="learning" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-primary-500" data-aos="fade-up">
            Habit Mastery Videos
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Our expertly crafted video lessons will guide you through the science and practice of building lasting habits.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habitVideos.map((video, index) => (
              <div 
                key={video.id} 
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                data-aos="fade-up" 
                data-aos-delay={index * 100}
                style={{
                  transform: 'translateY(0)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(108, 92, 231, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    {video.id}
                  </div>
                  {video.locked && (
                    <>
                      <div className="absolute inset-0 bg-black/50"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white w-16 h-16 rounded-full flex items-center justify-center">
                        <i className="bi bi-lock-fill text-2xl"></i>
                      </div>
                      <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        <i className="bi bi-star-fill mr-1"></i>
                        PREMIUM
                      </div>
                    </>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2" style={{ color: '#fdc134' }}>
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{video.description}</p>
                  <div className="flex items-center text-primary-500 text-sm font-medium">
                    <i className="bi bi-clock mr-2"></i>
                    {video.duration}
                  </div>
                  {video.url && !video.locked && (
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0"
                    ></a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans - Following HTML structure */}
      <section id="subscription" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-primary-500" data-aos="fade-up">
            Choose Your Plan
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Unlock your full potential with our comprehensive habit-building programs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div 
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              data-aos="fade-up" 
              data-aos-delay="200"
              style={{
                transform: 'translateY(0)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(108, 92, 231, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div className="p-8 text-center bg-gray-50 relative">
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-blue-600"></div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Free Plan
                </h3>
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-500 to-blue-600 bg-clip-text text-transparent">
                  ₹0<span className="text-lg font-normal text-gray-600">/month</span>
                </div>
              </div>
              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <i className="bi bi-check text-green-500 text-xl mr-3"></i>
                    <span>Access to first 4 videos</span>
                  </li>
                  <li className="flex items-center">
                    <i className="bi bi-check text-green-500 text-xl mr-3"></i>
                    <span>Basic habit tracking</span>
                  </li>
                  <li className="flex items-center">
                    <i className="bi bi-check text-green-500 text-xl mr-3"></i>
                    <span>Community support</span>
                  </li>
                  <li className="flex items-center">
                    <i className="bi bi-x text-gray-300 text-xl mr-3"></i>
                    <span className="text-gray-400">Premium videos (5-9)</span>
                  </li>
                  <li className="flex items-center">
                    <i className="bi bi-x text-gray-300 text-xl mr-3"></i>
                    <span className="text-gray-400">Personal coaching</span>
                  </li>
                </ul>
                <button className="w-full border-2 border-primary-500 text-primary-500 py-3 rounded-full font-semibold hover:bg-primary-500 hover:text-white transition-all duration-300">
                  Current Plan
                </button>
              </div>
            </div>

            {/* Premium Plan */}
            <div 
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              data-aos="fade-up" 
              data-aos-delay="300"
              style={{
                transform: 'translateY(0)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 206, 201, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div className="p-8 text-center bg-gray-50 relative">
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-cyan-600"></div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Premium Plan
                </h3>
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
                  ₹999<span className="text-lg font-normal text-gray-600">/month</span>
                </div>
              </div>
              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <i className="bi bi-check text-green-500 text-xl mr-3"></i>
                    <span>Access to all 9 videos</span>
                  </li>
                  <li className="flex items-center">
                    <i className="bi bi-check text-green-500 text-xl mr-3"></i>
                    <span>Advanced habit tracking</span>
                  </li>
                  <li className="flex items-center">
                    <i className="bi bi-check text-green-500 text-xl mr-3"></i>
                    <span>Priority community support</span>
                  </li>
                  <li className="flex items-center">
                    <i className="bi bi-check text-green-500 text-xl mr-3"></i>
                    <span>Personal coaching sessions</span>
                  </li>
                  <li className="flex items-center">
                    <i className="bi bi-check text-green-500 text-xl mr-3"></i>
                    <span>Progress analytics</span>
                  </li>
                </ul>
                <button 
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                  onClick={() => navigate('/subscription')}
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Habit Coach - Following HTML structure */}
      <section className="py-16" style={{
        background: 'linear-gradient(135deg, #fd79a8 0%, #f8a5c2 100%)',
        color: 'white',
        borderRadius: '20px',
        margin: '5rem auto',
        overflow: 'hidden',
        position: 'relative',
        clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)',
        maxWidth: '95%'
      }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="doctor-content" data-aos="fade-up">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6" style={{ 
                fontFamily: 'Playfair Display, serif',
                textShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
              }}>
                Become a Habit Coach
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl">
                Join our network of certified habit coaches and help others transform their lives through the power of consistent habits and mindful practices.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="bi bi-people text-2xl"></i>
                  </div>
                  <h4 className="font-semibold mb-2">Patient Management</h4>
                  <p className="text-sm opacity-90">Track and manage your patients' progress</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="bi bi-calendar-check text-2xl"></i>
                  </div>
                  <h4 className="font-semibold mb-2">Session Scheduling</h4>
                  <p className="text-sm opacity-90">Schedule and conduct coaching sessions</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="bi bi-graph-up text-2xl"></i>
                  </div>
                  <h4 className="font-semibold mb-2">Progress Analytics</h4>
                  <p className="text-sm opacity-90">View detailed progress reports and insights</p>
                </div>
              </div>

              <button 
                className="bg-white text-pink-500 px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                onClick={() => navigate('/coach-application')}
              >
                Apply Now
              </button>
            </div>
            <div className="hidden lg:block doctor-illustration" data-aos="fade-left">
              <img
                src="/img/ApplyDoctor.png"
                alt="Become a Habit Coach"
                className="w-full max-w-lg mx-auto"
                style={{ filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.2))' }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default UserHome