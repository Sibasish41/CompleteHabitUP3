import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import AOS from 'aos'
import LoginModal from '../components/LoginModal'
import 'swiper/css'
import 'aos/dist/aos.css'

const Home = () => {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const servicesRef = useRef(null)
  const featuresRef = useRef(null)

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [adminLoginData, setAdminLoginData] = useState({
    email: '',
    password: ''
  })
  const [adminLoginMessage, setAdminLoginMessage] = useState('')
  const [isAdminLoading, setIsAdminLoading] = useState(false)

  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" })
  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" })
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" })
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" })



  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  }, [])

  // Admin Login Handler with Demo Mode
  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setIsAdminLoading(true)
    setAdminLoginMessage('')

    const email = e.target.adminEmail.value
    const password = e.target.adminPassword.value

    console.log('Admin login attempt:', { email, password: '***' })

    if (!email || !password) {
      setAdminLoginMessage('<div class="text-red-400 text-sm">Please fill in all fields</div>')
      setIsAdminLoading(false)
      return
    }

    // Super User Credentials for Testing
    const superUserCredentials = {
      email: 'superuser@habitup.com',
      password: 'SuperUser@2024!'
    }

    try {
      setAdminLoginMessage('<div class="text-white text-sm">Logging in...</div>')

      // Check for super user credentials first
      if (email === superUserCredentials.email && password === superUserCredentials.password) {
        console.log('Super user login successful')

        // Super user login success
        const superUserData = {
          token: 'superuser-token-' + Date.now(),
          admin: {
            name: 'Super User',
            email: 'superuser@habitup.com',
            role: 'Super User',
            permissions: ['create', 'read', 'update', 'delete', 'manage_users', 'manage_system', 'view_analytics']
          }
        }

        // Store super user data
        localStorage.setItem('adminToken', superUserData.token)
        localStorage.setItem('adminName', superUserData.admin.name)
        localStorage.setItem('adminEmail', superUserData.admin.email)
        localStorage.setItem('adminRole', superUserData.admin.role)
        localStorage.setItem('isDemoAdmin', 'false')

        console.log('Admin data stored in localStorage:', {
          token: superUserData.token,
          name: superUserData.admin.name,
          email: superUserData.admin.email
        })

        setAdminLoginMessage('<div class="text-green-400 text-sm">Super user login successful! Redirecting...</div>')

        // Redirect to admin dashboard
        setTimeout(() => {
          console.log('Navigating to /admin/dashboard')
          navigate('/admin/dashboard')
        }, 1000)

        setIsAdminLoading(false)
        return
      }

      // If not demo credentials, try real API
      const response = await fetch('https://habit-up-backend.onrender.com/habit/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || 'Admin login failed')
      }

      const data = await response.json()

      // Store real admin data
      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminName', data.admin.name)
      localStorage.setItem('adminEmail', data.admin.email)
      localStorage.removeItem('isDemoAdmin')

      setAdminLoginMessage('<div class="text-green-400 text-sm">Login successful! Redirecting...</div>')

      // Redirect to admin dashboard
      setTimeout(() => {
        navigate('/admin/dashboard')
      }, 1000)

    } catch (error) {
      setAdminLoginMessage(`<div class="text-red-400 text-sm">${error.message}</div>`)
    } finally {
      setIsAdminLoading(false)
    }
  }

  const testimonialImages = [
    'sanchita shetty qoute.png',
    'smriti kuchal new quote.png',
    'Benedict baba quote.png',
    'yogendra singh yadabv quote.png',
    'Dr. sidhartha nayak quote.png',
    'victoria quote.png',
    'Dr. dipak ranjan das quote.png',
    'Axel quote.png',
    'dr. dibyadrashan sahoo quote.png',
    'Khemeswar agasti quote.png'
  ]

  const services = [
    {
      image: 'science backed.jpg',
      icon: 'fa-solid fa-atom',
      title: 'Science-Backed Strategies',
      description: 'Our program uses proven psychological techniques to help you build sustainable habits.'
    },
    {
      image: 'PersonalizedHabit.jpg',
      icon: 'fa-solid fa-chart-gantt',
      title: 'Personalized Habit Tracking',
      description: 'Track your progress with customized habit-tracking tools tailored to your goals.'
    },
    {
      image: 'customer.jpg',
      icon: 'fa-solid fa-comments',
      title: 'Community Support',
      description: 'Join a supportive community of like-minded individuals on the same journey.'
    },
    {
      image: 'expert coaching.jpg',
      icon: 'fa-solid fa-chalkboard',
      title: 'Expert Coaching',
      description: 'Get guidance from experienced coaches to stay on track and overcome challenges.'
    },
    {
      image: 'comprehensive guide.jpg',
      icon: 'fa-solid fa-users-line',
      title: 'Comprehensive Guide',
      description: 'Access a step-by-step guide to help you build and maintain new habits.'
    },
    {
      image: 'guided challenges.jpg',
      icon: 'fa-solid fa-stairs',
      title: 'Guided Challenges',
      description: '21-days challenges to build habits, to adopt yourself in the process of transformation.'
    }
  ]

  const features = [
    {
      image: 'daily motivation.jpg',
      title: 'DAILY MOTIVATION',
      description: 'Stay inspired with daily motivational quotes and progress reminders tailored to your habit journey.',
      points: [
        'Personalized motivational content based on your habits',
        'Celebration of milestones and streaks to keep you engaged',
        'Encouraging notifications when you need them most'
      ]
    },
    {
      image: 'exclusive resources.jpg',
      title: 'EXCLUSIVE RESOURCES',
      description: 'Access premium content designed to help you build and maintain successful habits.',
      content: 'Our library includes guided meditations, habit-building worksheets, expert interviews, and science-backed strategies to make habit formation easier. You\'ll get step-by-step guides for common habit challenges and templates to track your progress effectively.'
    },
    {
      image: 'progress report.jpg',
      title: 'PROGRESS REPORTS',
      description: 'Visualize your habit journey with detailed analytics and progress tracking that shows your consistency and growth.',
      points: [
        'Weekly and monthly habit performance reports',
        'Streak counters to maintain motivation',
        'Customizable charts showing your habit evolution'
      ]
    },
    {
      image: 'adaptive learning.jpg',
      title: 'FLEXIBLE & ADAPTIVE LEARNING',
      description: 'Our system adapts to your progress and adjusts recommendations accordingly.',
      content: 'Whether you\'re a morning person or night owl, our platform adjusts to your schedule. The difficulty of challenges scales with your progress, and you can pause or modify habits as needed. We understand that life happens, and our system is designed to help you get back on track after setbacks.'
    }
  ]

  const faqs = [
    {
      question: 'What is this program about?',
      answer: 'This program is designed to help you build sustainable habits that lead to long-term transformation and personal growth.'
    },
    {
      question: 'How long does it take to see results?',
      answer: 'Most users start seeing positive changes within 21 days, with significant transformation occurring within 90 days of consistent practice.'
    },
    {
      question: 'Is this suitable for beginners?',
      answer: 'Absolutely! Our program is designed for people at all levels, from complete beginners to those looking to optimize their existing habits.'
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'We offer 24/7 community support, expert coaching sessions, and personalized guidance throughout your journey.'
    }
  ]

  return (
    <div className="hero-section relative">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent-400 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.button
          className="w-12 h-12 sm:w-14 sm:h-14 bg-accent-400 text-primary-500 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <i className="fas fa-arrow-up text-lg sm:text-xl"></i>
        </motion.button>
      </motion.div>
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="min-h-[80vh] sm:min-h-[90vh] bg-primary-500 text-white flex items-center py-12 sm:py-20 lg:py-28 relative"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Background Pattern with Logos */}
        <div className="absolute inset-0 opacity-15">
          {/* Large bubble with logo */}
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 border-2 border-accent-400 rounded-full flex items-center justify-center bg-accent-400/10"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="flex flex-col items-center">
              <i className="fas fa-arrow-up text-accent-400 text-xs mb-1"></i>
              <i className="fas fa-bullseye text-accent-400 text-lg"></i>
            </div>
          </motion.div>

          {/* Medium bubble with logo */}
          <motion.div
            className="absolute top-32 right-20 w-16 h-16 border-2 border-accent-400 rounded-full flex items-center justify-center bg-accent-400/10"
            animate={{
              rotate: [360, 0],
              y: [0, -15, 0]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="flex flex-col items-center">
              <i className="fas fa-arrow-up text-accent-400 text-xs mb-1"></i>
              <i className="fas fa-star text-accent-400 text-sm"></i>
            </div>
          </motion.div>

          {/* Small bubble with logo */}
          <motion.div
            className="absolute bottom-20 left-32 w-12 h-12 border-2 border-accent-400 rounded-full flex items-center justify-center bg-accent-400/10"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              y: [0, -8, 0]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="flex flex-col items-center">
              <i className="fas fa-arrow-up text-accent-400" style={{ fontSize: '6px' }}></i>
              <i className="fas fa-heart text-accent-400 text-xs"></i>
            </div>
          </motion.div>

          {/* Additional decorative bubbles */}
          <motion.div
            className="absolute top-1/2 right-10 w-8 h-8 border border-accent-400 rounded-full flex items-center justify-center bg-accent-400/5"
            animate={{
              x: [0, 10, 0],
              y: [0, -5, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="flex flex-col items-center">
              <i className="fas fa-arrow-up text-accent-400" style={{ fontSize: '4px' }}></i>
              <i className="fas fa-plus text-accent-400" style={{ fontSize: '8px' }}></i>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-32 right-32 w-10 h-10 border border-accent-400 rounded-full flex items-center justify-center bg-accent-400/5"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="flex flex-col items-center">
              <i className="fas fa-arrow-up text-accent-400" style={{ fontSize: '5px' }}></i>
              <i className="fas fa-rocket text-accent-400 text-xs"></i>
            </div>
          </motion.div>

          {/* HabitUP Logo Bubbles */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-14 h-14 border border-accent-400 rounded-full flex items-center justify-center bg-accent-400/8"
            animate={{
              rotate: [0, -360],
              scale: [1, 1.15, 1],
              y: [0, -12, 0]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="flex flex-col items-center">
              <i className="fas fa-arrow-up text-accent-400" style={{ fontSize: '5px' }}></i>
              <span className="text-accent-400 font-bold text-xs">H</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-1/4 right-1/4 w-6 h-6 border border-accent-400 rounded-full flex items-center justify-center bg-accent-400/8"
            animate={{
              x: [0, 8, 0],
              y: [0, -12, 0],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="flex flex-col items-center">
              <i className="fas fa-arrow-up text-accent-400" style={{ fontSize: '4px' }}></i>
              <i className="fas fa-check text-accent-400" style={{ fontSize: '6px' }}></i>
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              className="order-2 lg:order-1 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 font-raleway leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Habit Build Transformation Program
              </motion.h1>

              <motion.p
                className="text-accent-400 text-xs sm:text-sm font-medium mb-3 font-raleway"
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                ( A unit of Sadhana Mandira Charitable Trust )
              </motion.p>

              <motion.p
                className="text-lg sm:text-xl mb-8 text-white/90 max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Daily simple habits, create a life with more time and peace
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <motion.a
                  href="https://www.youtube.com/embed/U_nzqnXWvSo"
                  className="inline-flex items-center justify-center bg-accent-400 text-primary-500 font-raleway font-medium text-sm sm:text-base px-6 sm:px-7 py-3 rounded-full transition-all duration-500 shadow-lg hover:shadow-xl"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(253, 193, 52, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started <i className="fa-solid fa-circle-play fa-beat ml-2"></i>
                </motion.a>

                <motion.button
                  onClick={() => navigate('/about')}
                  className="inline-flex items-center justify-center border-2 border-accent-400 text-accent-400 font-raleway font-medium text-sm sm:text-base px-6 sm:px-7 py-3 rounded-full transition-all duration-500 hover:bg-accent-400 hover:text-primary-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More <i className="fas fa-arrow-right ml-2"></i>
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              className="order-1 lg:order-2 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <motion.img
                src="/img/BudhhaBlack.png"
                alt="Hero Image"
                className="w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 2, 0, -2, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-500 mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              Real stories from people who transformed their lives with HabitUP
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Swiper
              modules={[Autoplay]}
              loop={true}
              speed={600}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              slidesPerView={1}
              spaceBetween={20}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 30 },
                768: { slidesPerView: 1, spaceBetween: 30 },
                1024: { slidesPerView: 2, spaceBetween: 40 },
                1280: { slidesPerView: 2, spaceBetween: 50 }
              }}
              className="testimonials-swiper"
            >
              {testimonialImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <motion.div
                    className="p-4 sm:p-6"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={`/img/${image}`}
                      alt={`Testimonial ${index + 1}`}
                      className="quote-img w-full h-auto max-h-80 sm:max-h-96 object-contain rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                    />
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-12 sm:py-16 lg:py-20" id="about">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              className="lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.img
                src="/img/MentorMouth.jpg"
                alt="About us"
                className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <motion.h3
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-primary-500 font-raleway"
                initial={{ opacity: 0, y: 20 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                About Us
              </motion.h3>

              <motion.p
                className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base"
                initial={{ opacity: 0, y: 20 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                The heart of our mission is the belief that the mind holds extraordinary power to transform
                lives. We tap into the immense potential of hypnosis and affirmations to help individuals build
                meaningful habits, overcome inner blocks, and unlock lasting change. By gently reprogramming the
                subconscious, we make personal growth not only possible but practical.
              </motion.p>

              <div className="space-y-6">
                <motion.div
                  className="flex items-start space-x-3 sm:space-x-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <i className="bi bi-reception-4 text-accent-400 text-xl sm:text-2xl mt-1 flex-shrink-0"></i>
                  <div>
                    <h5 className="text-base sm:text-lg font-semibold mb-2 text-primary-500">Science and Wisdom in Harmony</h5>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      Rooted in both science and ancient wisdom, hypnosis allows us to access deeper layers
                      of the mind where true transformation begins. Whether it's for healing, focus, or
                      self-discovery, our approach empowers individuals to live more intentional,
                      balanced, and fulfilling lives—creating a ripple effect that uplifts both
                      individuals and the world around them.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start space-x-3 sm:space-x-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <i className="bi bi-person-heart text-accent-400 text-xl sm:text-2xl mt-1 flex-shrink-0"></i>
                  <div>
                    <h5 className="text-base sm:text-lg font-semibold mb-2 text-primary-500">Reviving Ancient Healing</h5>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      It is also an initiative to revive ancient healing practices rooted in Vedic wisdom
                      and the teachings of the Bhagavad Gita — guiding humanity toward the universal
                      science of meditation and nurturing noble qualities for a more harmonious world.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Guru Blessings Section */}
      <section className="py-16 bg-gray-50 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-primary-500 font-raleway">With the Blessings of Our Guru</h2>
          <p className="text-lg italic mb-12 text-gray-600 max-w-4xl mx-auto leading-relaxed">
            With the blessings and guidance of our Gurus, we support Kriyavans—those initiated into Kriya Yoga—who struggle with daily practice,
            by offering live, unrecorded virtual sessions to gently build the habit of regular meditation within a devoted community.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <img
                src="/img/path-to-image-1.png"
                className="w-full rounded-lg shadow-lg"
                alt="Prajñānānanda Paramahaṃsa Guru 1"
              />
            </div>
            <div>
              <img
                src="/img/path-to-image-2.png"
                className="w-full rounded-lg shadow-lg"
                alt="Prajñānānanda Paramahaṃsa Guru 2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section ref={servicesRef} className="py-12 sm:py-16 lg:py-20 bg-white" id="services">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-primary-500 font-raleway">Featured Services</h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">Track progress, set goals, and stay consistent with powerful habit-building tools</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 50 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="service-item relative h-full">
                  <div className="rounded-lg overflow-hidden mb-4">
                    <motion.img
                      src={`/img/${service.image}`}
                      alt={service.title}
                      className="w-full h-40 sm:h-48 object-cover transition-transform duration-600"
                      whileHover={{ scale: 1.1 }}
                    />
                  </div>
                  <motion.div
                    className="bg-white p-4 sm:p-6 lg:p-8 -mt-12 sm:-mt-16 mx-3 sm:mx-6 relative z-10 rounded-lg shadow-lg text-center transition-all duration-300 group-hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className="w-12 h-12 sm:w-16 sm:h-16 lg:w-18 lg:h-18 bg-accent-400 text-white border-4 sm:border-6 border-white rounded-full flex items-center justify-center text-lg sm:text-xl lg:text-2xl absolute -top-6 sm:-top-8 lg:-top-9 left-1/2 transform -translate-x-1/2 transition-all duration-300 group-hover:bg-white group-hover:border-accent-400"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <i className={`${service.icon} group-hover:text-accent-400`}></i>
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4 text-primary-500 transition-colors duration-300 group-hover:text-accent-400">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-12 sm:py-16 lg:py-20 bg-gray-50" id="features">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-primary-500 font-raleway">Features</h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">Smart Systems, Lasting Change - Features Designed for Your Success!</p>
          </motion.div>

          <div className="space-y-16 sm:space-y-20 lg:space-y-24">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center ${index % 2 === 1 ? 'md:grid-flow-col-dense' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  className={`${index % 2 === 1 ? 'md:order-2' : ''}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={`/img/${feature.image}`}
                    alt={feature.title}
                    className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                </motion.div>

                <motion.div
                  className={`${index % 2 === 1 ? 'md:order-1' : ''}`}
                  initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <motion.h3
                    className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-primary-500 font-raleway"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {feature.title}
                  </motion.h3>

                  <motion.p
                    className="text-gray-600 italic mb-4 leading-relaxed text-sm sm:text-base"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    {feature.description}
                  </motion.p>

                  {feature.points && (
                    <motion.ul
                      className="space-y-2 sm:space-y-3"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      {feature.points.map((point, pointIndex) => (
                        <motion.li
                          key={pointIndex}
                          className="flex items-start space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.7 + pointIndex * 0.1 }}
                        >
                          <i className="bi bi-check text-accent-400 text-base sm:text-lg mt-0.5 flex-shrink-0"></i>
                          <span className="text-gray-600 text-sm sm:text-base">{point}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}

                  {feature.content && (
                    <motion.p
                      className="text-gray-600 leading-relaxed text-sm sm:text-base"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      {feature.content}
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20" id="faq">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-primary-500 font-raleway">Frequently Asked Questions</h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">Your Questions, Answered – Build Better Habits, Transform Your Life!</p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border-b border-gray-200 pb-4 sm:pb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ x: 10 }}
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <motion.i
                    className="bi bi-question-circle text-accent-400 text-lg sm:text-xl mt-1 flex-shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  ></motion.i>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-bold mb-2 text-primary-500">{faq.question}</h4>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Login Section */}
      <section className="py-16 sm:py-20 bg-white" id="admin-login">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-primary-500 font-raleway">
              Admin Portal
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Secure access for HabitUP administrators
            </p>
          </motion.div>

          <div className="flex justify-center">
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-primary-500 rounded-2xl p-6 sm:p-8 shadow-2xl">
                <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 text-accent-400">
                  Admin Login
                </h3>

                {/* Demo Credentials Display */}
                <motion.div
                  className="bg-accent-400/20 border border-accent-400/30 rounded-lg p-4 mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <i className="bi bi-info-circle text-accent-400 mr-2"></i>
                    <span className="text-accent-400 font-semibold text-sm">Demo Credentials</span>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-white text-sm">
                      <span className="font-medium">Email:</span> superuser@habitup.com
                    </div>
                    <div className="text-white text-sm">
                      <span className="font-medium">Password:</span> SuperUser@2024!
                    </div>
                  </div>
                  <div className="text-center mt-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        document.getElementById('adminEmail').value = 'superuser@habitup.com'
                        document.getElementById('adminPassword').value = 'SuperUser@2024!'
                      }}
                      className="block text-accent-400 text-xs hover:text-accent-300 underline transition-colors"
                    >
                      Click to auto-fill
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // Set super user data for testing
                        localStorage.setItem('adminToken', 'superuser-token-' + Date.now())
                        localStorage.setItem('adminName', 'Super User')
                        localStorage.setItem('adminEmail', 'superuser@habitup.com')
                        localStorage.setItem('adminRole', 'Super User')
                        localStorage.setItem('isDemoAdmin', 'false')
                        navigate('/admin/test')
                      }}
                      className="block text-blue-400 text-xs hover:text-blue-300 underline transition-colors"
                    >
                      Direct Test (Debug)
                    </button>
                  </div>
                </motion.div>

                <form className="space-y-4" onSubmit={handleAdminLogin}>
                  <div>
                    <label htmlFor="adminEmail" className="block text-white font-medium mb-2 text-sm sm:text-base">
                      Email
                    </label>
                    <input
                      type="email"
                      id="adminEmail"
                      name="adminEmail"
                      className="w-full px-4 py-3 bg-gray-300 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400 transition-all duration-300 text-sm sm:text-base"
                      placeholder="Enter admin email"
                      required
                      disabled={isAdminLoading}
                    />
                  </div>
                  <div>
                    <label htmlFor="adminPassword" className="block text-white font-medium mb-2 text-sm sm:text-base">
                      Password
                    </label>
                    <input
                      type="password"
                      id="adminPassword"
                      name="adminPassword"
                      className="w-full px-4 py-3 bg-gray-300 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400 transition-all duration-300 text-sm sm:text-base"
                      placeholder="Enter password"
                      required
                      disabled={isAdminLoading}
                    />
                  </div>
                  {adminLoginMessage && (
                    <div
                      className="text-center text-sm"
                      dangerouslySetInnerHTML={{ __html: adminLoginMessage }}
                    />
                  )}
                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-accent-400 to-yellow-400 text-primary-500 font-bold py-3 px-6 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isAdminLoading ? { scale: 1.02 } : {}}
                    whileTap={!isAdminLoading ? { scale: 0.98 } : {}}
                    disabled={isAdminLoading}
                  >
                    {isAdminLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Logging in...
                      </div>
                    ) : (
                      'Login'
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50" id="contact">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-primary-500 font-raleway">Get In Touch</h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">Ready to start your transformation journey? Contact us today!</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {[
              { icon: 'bi-geo-alt', title: 'Address', info: 'Bhubaneswar, Odisha, India', delay: 0.1 },
              { icon: 'bi-phone', title: 'Call Us', info: '+91 XXX XXX XXXX', delay: 0.2 },
              { icon: 'bi-envelope', title: 'Email Us', info: 'info@habitup.com', delay: 0.3 }
            ].map((contact, index) => (
              <motion.div
                key={index}
                className="text-center bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: contact.delay }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-accent-400 text-white rounded-full flex items-center justify-center text-lg sm:text-xl mx-auto mb-4 border-2 border-accent-400/20"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <i className={`bi ${contact.icon}`}></i>
                </motion.div>
                <h3 className="text-base sm:text-lg font-bold mb-2 text-primary-500">{contact.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{contact.info}</p>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            className="text-center mt-12 sm:mt-16"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-primary-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34, 59, 82, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey Today
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Scroll to Top Button - Simple and Clean */}
      <motion.button
        className="fixed bottom-6 right-6 w-12 h-12 bg-accent-400 text-primary-500 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
      >
        <i className="fas fa-arrow-up text-lg"></i>
      </motion.button>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  )
}

export default Home