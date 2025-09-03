import { motion } from 'framer-motion'

const ContactInfo = () => {
  const contactMethods = [
    {
      icon: 'fab fa-whatsapp',
      label: 'WhatsApp',
      value: '9437135590',
      link: 'https://wa.me/919437135590',
      color: 'bg-green-500',
      description: 'Quick support and instant responses'
    },
    {
      icon: 'fas fa-envelope',
      label: 'Email',
      value: 'habitupapplication@gmail.com',
      link: 'mailto:habitupapplication@gmail.com',
      color: 'bg-blue-500',
      description: 'Detailed queries and documentation'
    },
    {
      icon: 'fas fa-phone',
      label: 'Phone',
      value: '+91 9437135590',
      link: 'tel:+919437135590',
      color: 'bg-purple-500',
      description: 'Direct voice communication'
    }
  ]

  const handleContactClick = (method) => {
    window.open(method.link, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-phone text-white text-2xl"></i>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">📞 Contact Info</h1>
          <p className="text-xl text-gray-600">Feel free to reach out via the following methods:</p>
        </motion.div>

        {/* Main Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user-tie text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold mb-2">Dr. Sashi Bhusan Nayak</h2>
            <p className="text-blue-100 mb-1">Assistant Professor</p>
            <p className="text-blue-100">Ravenshaw University</p>
            <p className="text-blue-100 mt-2">Specialization: Computer Science</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onClick={() => handleContactClick(method)}
                  className="group cursor-pointer"
                >
                  <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <i className={`${method.icon} text-white text-xl`}></i>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">{method.label}</h3>
                    <p className="text-gray-600 font-medium mb-2">{method.value}</p>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-clock text-green-600"></i>
              </div>
              <h3 className="font-bold text-gray-800">Office Hours</h3>
            </div>
            <div className="space-y-2 text-gray-600">
              <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
              <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
              <p><strong>Sunday:</strong> Closed</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-headset text-blue-600"></i>
              </div>
              <h3 className="font-bold text-gray-800">Support Types</h3>
            </div>
            <div className="space-y-2 text-gray-600">
              <p>• Technical Support</p>
              <p>• Habit Coaching Guidance</p>
              <p>• Account & Subscription Help</p>
              <p>• General Inquiries</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Send a Message</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What is this regarding?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your message here..."
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
              >
                <i className="fas fa-paper-plane mr-2"></i>
                Send Message
              </button>
            </div>
          </form>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600">
            📩 <em>Contact me via these channels for any queries or support.</em>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default ContactInfo