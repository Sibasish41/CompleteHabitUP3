import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import VideoMeeting from '../components/VideoMeeting'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Services = () => {
  const { user } = useAuth()
  const [userType, setUserType] = useState('Adult')

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    })
    
    // Get user type from authenticated user or default to Adult for non-authenticated users
    const currentUserType = user?.userType || 'Adult'
    setUserType(currentUserType)
  }, [user])

  const getHeroContent = () => {
    switch(userType) {
      case 'Child':
        return {
          title: 'Fun & Engaging Programs for Kids',
          description: 'Help your child develop healthy habits, focus, and creativity through our interactive sessions designed just for them.'
        }
      case 'Elder':
        return {
          title: 'Gentle & Nurturing Programs for Seniors',
          description: 'Maintain vitality, peace of mind, and spiritual growth in your golden years with our specially designed programs.'
        }
      case 'Doctor':
        return {
          title: 'Coach Dashboard',
          description: 'Connect with and guide your clients through our coaching platform.'
        }
      default:
        return {
          title: 'Transformative Programs for Adults',
          description: 'Comprehensive programs to manage stress, improve productivity, and find balance in modern life through time-tested techniques.'
        }
    }
  }

  const getServicesContent = () => {
    switch(userType) {
      case 'Child':
        return [
          {
            title: 'Balgopal Gita Chanting',
            description: 'Introduce children to the divine wisdom of the Bhagavad Gita through simple chanting sessions with melodic tunes that make learning enjoyable and memorable.',
            icon: 'bi-music-note-beamed',
            image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          },
          {
            title: 'Meditation & Yoga',
            description: 'Child-friendly yoga poses and short meditation exercises to improve concentration, reduce anxiety, and promote physical flexibility and balance.',
            icon: 'bi-tree',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          },
          {
            title: 'Memory Hacks',
            description: 'Fun techniques based on ancient Vedic memory methods to enhance learning capacity, recall ability, and academic performance.',
            icon: 'bi-lightbulb',
            image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          }
        ]
      case 'Elder':
        return [
          {
            title: 'Gentle Yoga & Meditation',
            description: 'Specially designed gentle yoga sequences and meditation practices that accommodate physical limitations while promoting flexibility and inner peace.',
            icon: 'bi-heart',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          },
          {
            title: 'Spiritual Guidance',
            description: 'Deep spiritual discussions and guidance based on ancient wisdom texts to find meaning, purpose, and peace in the golden years of life.',
            icon: 'bi-book',
            image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          },
          {
            title: 'Health & Wellness',
            description: 'Holistic health practices including breathing exercises, gentle movements, and lifestyle guidance to maintain vitality and well-being.',
            icon: 'bi-shield-check',
            image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          }
        ]
      default: // Adult
        return [
          {
            title: 'Stress Management',
            description: 'Learn powerful techniques to manage work-life stress, anxiety, and overwhelm through meditation, breathing exercises, and mindfulness practices.',
            icon: 'bi-peace',
            image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          },
          {
            title: 'Productivity Enhancement',
            description: 'Boost your focus, concentration, and productivity through ancient techniques combined with modern time management strategies.',
            icon: 'bi-graph-up-arrow',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          },
          {
            title: 'Life Balance',
            description: 'Find harmony between personal and professional life through holistic practices that nurture mind, body, and spirit.',
            icon: 'bi-yin-yang',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          },
          {
            title: 'Habit Formation',
            description: 'Build lasting positive habits and break negative patterns using scientifically-backed methods combined with ancient wisdom.',
            icon: 'bi-arrow-repeat',
            image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          }
        ]
    }
  }

  const testimonials = [
    {
      quote: "The meditation techniques I learned here have completely changed my daily routine. I'm more focused and peaceful than ever before.",
      author: "Priyansh Sharma",
      role: "Adult Program",
      image: "/img/ElderBoyReview.jpg"
    },
    {
      quote: "My kids love the Balgopal sessions! They look forward to it every week and I can already see positive changes in their behavior.",
      author: "Rahul Verma",
      role: "Parent",
      image: "/img/ChildBoyReview.jpg"
    },
    {
      quote: "As a senior citizen, I was skeptical at first, but the gentle yoga and meditation sessions have improved my mobility and peace of mind.",
      author: "Shanti Devi",
      role: "Elder Program",
      image: "/img/ElderGirlReview.jpg"
    }
  ]

  const faqs = [
    {
      question: "How do I choose the right program for me?",
      answer: "Our programs are designed for different age groups and needs. Simply select your user type (Child, Adult, or Elder) during registration, and we'll recommend the most suitable programs for you. You can always change or adjust your program later."
    },
    {
      question: "What technology do I need to participate?",
      answer: "You'll need a smartphone or computer with internet access. We use WhatsApp for communication and Google Meet for live sessions. No special software is required beyond these free applications."
    },
    {
      question: "Can I switch between different programs?",
      answer: "Yes, you can switch programs at any time. Our mentors will help guide you to the most appropriate program based on your needs and progress. There's no additional charge for switching between programs."
    },
    {
      question: "How are the mentors selected?",
      answer: "All our mentors undergo a rigorous selection process including background checks, verification of qualifications, and extensive training in our methodology. They are experienced practitioners who are passionate about helping others."
    },
    {
      question: "What if I miss a live session?",
      answer: "While we encourage attending live sessions for the best experience, we understand that sometimes you might miss one. We provide session summaries and practice materials after each session, and you can schedule a catch-up with your mentor if needed."
    }
  ]

  const [openFaq, setOpenFaq] = useState(null)
  const heroContent = getHeroContent()
  const servicesContent = getServicesContent()

  return (
    <div className="hero-section bg-gray-50 min-h-screen">


      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {heroContent.title}
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-white/90 max-w-4xl mx-auto leading-relaxed">
              {heroContent.description}
            </p>
            <a
              href="#services-section"
              className="inline-block bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Explore Services
            </a>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white" id="services-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-700">
              Our Services for {userType === 'Child' ? 'Children' : userType === 'Elder' ? 'Seniors' : 'Adults'}
            </h2>
            <div className="w-20 h-1 bg-green-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {userType === 'Child' 
                ? 'Engaging programs designed to cultivate healthy habits, focus, and creativity in young minds through fun and interactive sessions.'
                : userType === 'Elder'
                ? 'Gentle and nurturing programs to maintain vitality, peace of mind, and spiritual growth in your golden years.'
                : 'Comprehensive programs to manage stress, improve productivity, and find balance in modern life through time-tested techniques.'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesContent.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6 relative z-10">
                  <div className="text-4xl text-green-600 mb-4 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
                    <i className={service.icon}></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-700 group-hover:text-green-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <button className="bg-green-600 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 transition-colors duration-300 relative overflow-hidden">
                    Learn More
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      {userType !== 'Doctor' && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-700">
                How Our Services Work
              </h2>
              <div className="w-20 h-1 bg-green-600 mx-auto rounded-full mb-4"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Simple steps to transform your life through our guided programs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="text-4xl text-green-600 mb-4">
                  <i className="bi bi-envelope"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-700">1. Mail Details</h3>
                <p className="text-gray-600">
                  After registration, you'll receive mentor details and Meeting link via Gmail.
                </p>
              </motion.div>

              <motion.div
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="text-4xl text-green-600 mb-4">
                  <i className="bi bi-calendar-check"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-700">2. Session Timing</h3>
                <p className="text-gray-600">
                  Your session timing will be confirmed and shared through mail communication.
                </p>
              </motion.div>

              <motion.div
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="text-4xl text-green-600 mb-4">
                  <i className="bi bi-people"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-700">3. Live Session</h3>
                <p className="text-gray-600">
                  Attend the live session with our expert mentor at the scheduled time via the meeting here.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-700">
              What Our Users Say
            </h2>
            <div className="w-20 h-1 bg-green-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from people who have transformed their lives with HabitUP
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl text-green-600 mb-4">
                  <i className="bi bi-quote"></i>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h5 className="font-semibold text-green-600 mb-0">
                      {testimonial.author}
                    </h5>
                    <small className="text-gray-500">{testimonial.role}</small>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Meeting Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-700">
              Join Your Coaching Session
            </h2>
            <div className="w-20 h-1 bg-green-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with your mentor through our video meeting platform
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <VideoMeeting 
              userType={userType} 
              subscriptionType={user?.subscriptionType || 'free'} 
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-700">
              Frequently Asked Questions
            </h2>
            <div className="w-20 h-1 bg-green-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our services
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <button
                  className="w-full text-left p-6 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 border-0 shadow-md"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <i className={`bi bi-chevron-${openFaq === index ? 'up' : 'down'} text-green-600 transition-transform duration-300`}></i>
                  </div>
                </button>
                {openFaq === index && (
                  <motion.div
                    className="px-6 pb-6 pt-2 bg-white rounded-b-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services