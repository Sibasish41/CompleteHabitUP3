import { motion } from 'framer-motion'

const MentorContact = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919437135590', '_blank')
  }

  const handleEmailClick = () => {
    window.location.href = 'mailto:habitupapplication@gmail.com'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i className="fas fa-phone text-3xl"></i>
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">📞 Contact Info</h2>
          <p className="opacity-90">Feel free to reach out via the following methods:</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 text-left"
          >
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-purple-600"></i>
              </div>
              <div>
                <span className="font-semibold text-gray-800">Name:</span>
                <p className="text-gray-600">Dr. Sashi Bhusan Nayak</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-briefcase text-blue-600"></i>
              </div>
              <div>
                <span className="font-semibold text-gray-800">Designation:</span>
                <p className="text-gray-600">Asst. Professor (Ravenshaw University)</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-graduation-cap text-green-600"></i>
              </div>
              <div>
                <span className="font-semibold text-gray-800">Specialization:</span>
                <p className="text-gray-600">Computer Science</p>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
              onClick={handleWhatsAppClick}
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <i className="fab fa-whatsapp text-white"></i>
              </div>
              <div>
                <span className="font-semibold text-gray-800">WhatsApp:</span>
                <p className="text-green-600 hover:underline">9437135590</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={handleEmailClick}
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <i className="fas fa-envelope text-white"></i>
              </div>
              <div>
                <span className="font-semibold text-gray-800">Email:</span>
                <p className="text-blue-600 hover:underline">habitupapplication@gmail.com</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 space-y-3"
          >
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <i className="fab fa-whatsapp"></i>
              <span>Contact via WhatsApp</span>
            </button>
            
            <button
              onClick={handleEmailClick}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <i className="fas fa-envelope"></i>
              <span>Send Email</span>
            </button>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-500 text-sm flex items-center justify-center">
              <i className="fas fa-paper-plane mr-2"></i>
              <em>Contact me via these channels for any queries or support.</em>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default MentorContact