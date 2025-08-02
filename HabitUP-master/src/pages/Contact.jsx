import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Contact = () => {
  const contactRef = useRef(null)
  const contactInView = useInView(contactRef, { once: true, margin: "-100px" })
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Contact form submitted:', formData)
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  }

  const contactInfo = [
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Address',
      details: ['Mahanadi Bihar', 'Cuttack, Odisha, India'],
      color: 'text-red-500'
    },
    {
      icon: 'fas fa-phone',
      title: 'Call Us',
      details: ['+91 94371 35590'],
      color: 'text-green-500'
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email Us',
      details: ['info@habitup.com', 'support@habitup.com'],
      color: 'text-blue-500'
    },
    {
      icon: 'fas fa-clock',
      title: 'Open Hours',
      details: ['Monday - Friday: 9AM - 6PM', 'Saturday: 10AM - 4PM'],
      color: 'text-purple-500'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <div className="hero-section">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-raleway"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Get in touch with us. We're here to help you on your habit transformation journey.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                  <motion.div
                    className={`w-16 h-16 ${info.color} bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <i className={`${info.icon} text-2xl`}></i>
                  </motion.div>
                  <h3 className="text-xl font-bold text-primary-500 mb-3 font-raleway">
                    {info.title}
                  </h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section ref={contactRef} className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={contactInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              className="bg-gray-50 rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-500 mb-6 font-raleway">
                Contact Form
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <label className="block text-gray-700 font-medium mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 transition-all"
                      placeholder="Enter your name"
                      required
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <label className="block text-gray-700 font-medium mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <label className="block text-gray-700 font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 transition-all"
                    placeholder="Enter subject"
                    required
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <label className="block text-gray-700 font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 transition-all resize-none"
                    placeholder="Enter your message"
                    required
                  ></textarea>
                </motion.div>
                
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-accent-400 to-accent-500 text-primary-500 font-bold py-3 px-6 rounded-full hover:from-accent-500 hover:to-accent-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <i className="fas fa-paper-plane mr-2"></i>
                  Send Message
                </motion.button>
              </form>
            </motion.div>

            {/* Map/Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={contactInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-primary-500 mb-4 font-raleway">
                  Get in Touch
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We'd love to hear from you! Whether you have questions about our services, 
                  need support, or want to share your success story, our team is here to help.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent-400/10 rounded-full flex items-center justify-center">
                      <i className="fas fa-clock text-accent-400"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Response Time</p>
                      <p className="text-gray-600 text-sm">We typically respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent-400/10 rounded-full flex items-center justify-center">
                      <i className="fas fa-headset text-accent-400"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Support</p>
                      <p className="text-gray-600 text-sm">24/7 customer support available</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent-400/10 rounded-full flex items-center justify-center">
                      <i className="fas fa-shield-alt text-accent-400"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Privacy</p>
                      <p className="text-gray-600 text-sm">Your information is secure with us</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
                <h4 className="text-xl font-bold mb-4 font-raleway">Follow Us</h4>
                <p className="text-white/90 mb-6 text-sm">
                  Stay connected with us on social media for updates, tips, and inspiration.
                </p>
                <div className="flex space-x-4">
                  {[
                    { icon: 'fab fa-facebook-f', color: 'hover:bg-blue-600' },
                    { icon: 'fab fa-twitter', color: 'hover:bg-blue-400' },
                    { icon: 'fab fa-instagram', color: 'hover:bg-pink-500' },
                    { icon: 'fab fa-linkedin-in', color: 'hover:bg-blue-700' }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      className={`w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 ${social.color}`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <i className={social.icon}></i>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact