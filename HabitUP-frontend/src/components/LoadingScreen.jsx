import { motion } from 'framer-motion'

const LoadingScreen = ({ 
  isVisible, 
  progress = 0, 
  title = "Loading...", 
  subtitle = "Please wait while we prepare your experience",
  userType = "Adult"
}) => {
  if (!isVisible) return null

  // Get theme colors based on user type
  const getThemeColors = () => {
    switch(userType) {
      case 'Child':
        return {
          gradient: 'from-pink-500 via-purple-500 to-pink-600',
          accent: 'bg-pink-300',
          text: 'text-pink-100'
        }
      case 'Elder':
        return {
          gradient: 'from-green-500 via-teal-500 to-green-600',
          accent: 'bg-green-300',
          text: 'text-green-100'
        }
      case 'Doctor':
        return {
          gradient: 'from-blue-500 via-indigo-500 to-blue-600',
          accent: 'bg-blue-300',
          text: 'text-blue-100'
        }
      default: // Adult or Admin
        return {
          gradient: 'from-purple-600 via-blue-600 to-indigo-700',
          accent: 'bg-white',
          text: 'text-white/80'
        }
    }
  }

  const theme = getThemeColors()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 bg-gradient-to-br ${theme.gradient} flex items-center justify-center z-[99999] overflow-hidden`}
    >
      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/4 right-20 w-16 h-16 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-8 h-8 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="text-center p-8 relative z-10 max-w-md mx-auto">
        {/* Main Loading Animation */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Outer Ring */}
          <div className="w-24 h-24 border-4 border-white/20 rounded-full mx-auto relative">
            {/* Inner Spinning Ring */}
            <motion.div
              className={`absolute inset-0 border-4 ${theme.accent} border-t-transparent rounded-full`}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            {/* Center Dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className={`w-3 h-3 ${theme.accent} rounded-full`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className={`${theme.text} mb-6 text-sm md:text-base`}>
            {subtitle}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="w-full max-w-xs mx-auto mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className={`h-2 ${theme.accent} rounded-full transition-all duration-300 ease-out`}
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>

        {/* Progress Text */}
        <motion.p
          className="text-white/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {progress}% Complete
        </motion.p>

        {/* Loading Messages */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {progress < 30 && (
            <p className="text-white/70 text-xs">Authenticating credentials...</p>
          )}
          {progress >= 30 && progress < 60 && (
            <p className="text-white/70 text-xs">Preparing your dashboard...</p>
          )}
          {progress >= 60 && progress < 90 && (
            <p className="text-white/70 text-xs">Loading personalized content...</p>
          )}
          {progress >= 90 && (
            <p className="text-white/70 text-xs">Almost ready!</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default LoadingScreen