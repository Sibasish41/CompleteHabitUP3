import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingScreen from './LoadingScreen'

const LoginModal = ({ isOpen, onClose }) => {
  const { login, register, adminLogin, loginLoading, loginProgress } = useAuth()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [isAdminLogin, setIsAdminLogin] = useState(false)
  const [message, setMessage] = useState('')
  const [userTypeForLoading, setUserTypeForLoading] = useState('Adult')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    acceptTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isOpen])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (isLogin) {
      // Check if it's admin login
      if (formData.email === 'superuser@habitup.com' || isAdminLogin) {
        setUserTypeForLoading('Admin')
        const result = await adminLogin({
          email: formData.email,
          password: formData.password
        })

        if (result.success) {
          setMessage('✅ Admin login successful!')
          setTimeout(() => {
            onClose()
            navigate('/admin-dashboard')
          }, 1000)
        } else {
          setMessage(`❌ ${result.message}`)
        }
      } else {
        // Handle regular user login
        const result = await login({
          email: formData.email,
          password: formData.password
        })

        if (result.success) {
          setUserTypeForLoading(result.user.userType || 'Adult')
          setMessage('✅ Login successful!')
          console.log('Login result:', result)
          setTimeout(() => {
            onClose()
            // Redirect based on user type
            const userType = result.user.userType || result.user.role
            console.log('Redirecting user type:', userType)
            if (userType === 'Doctor') {
              console.log('Navigating to /services')
              navigate('/services') // Doctor goes to services page
            } else {
              console.log('Navigating to /user-home')
              navigate('/user-home') // Others go to user home
            }
          }, 1000)
        } else {
          setMessage(`❌ ${result.message}`)
        }
      }
    } else {
      // Handle registration
      if (formData.password !== formData.confirmPassword) {
        setMessage('❌ Passwords do not match')
        return
      }

      const result = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender.toLowerCase()
      })

      if (result.success) {
        setMessage('✅ Registration successful! You can now login.')
        setTimeout(() => {
          setIsLogin(true)
          setFormData({
            email: formData.email,
            password: '',
            firstName: '',
            lastName: '',
            phone: '',
            confirmPassword: '',
            dateOfBirth: '',
            gender: '',
            acceptTerms: false
          })
        }, 2000)
      } else {
        setMessage(`❌ ${result.message}`)
      }
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setMessage('')
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      confirmPassword: '',
      dateOfBirth: '',
      gender: '',
      acceptTerms: false
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }



  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }

  const formVariants = {
    hidden: { opacity: 0, x: isLogin ? -20 : 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    }
  }

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  }

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen
        isVisible={loginLoading}
        progress={loginProgress}
        title={isAdminLogin || formData.email === 'superuser@habitup.com' ? "Admin Login" : "Logging In"}
        subtitle={isAdminLogin || formData.email === 'superuser@habitup.com' ? "Accessing admin dashboard..." : "Welcome back! Preparing your personalized experience..."}
        userType={userTypeForLoading}
      />

      <AnimatePresence>
        {isOpen && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-lg"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative w-full ${isLogin ? 'max-w-sm sm:max-w-md h-[70vh]' : 'max-w-lg sm:max-w-2xl h-[95vh]'} bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div className="modal-header flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
              {!isLogin && (
                <motion.h5
                  className="modal-title text-lg sm:text-xl font-bold text-accent-400 flex-1 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Register Yourself
                </motion.h5>
              )}
              
              {isLogin && (
                <motion.div
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="w-10 h-10 bg-accent-400 rounded-full flex items-center justify-center"
                  >
                    <i className="fas fa-user-circle text-lg text-primary-500"></i>
                  </motion.div>
                  <div>
                    <motion.h2
                      className="text-lg sm:text-xl font-bold text-white"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      Welcome Back!
                    </motion.h2>
                    <motion.p
                      className="text-white/70 text-xs sm:text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      Sign in to continue
                    </motion.p>
                  </div>
                </motion.div>
              )}
              
              <motion.button
                onClick={onClose}
                className="btn-close w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.3 }}
              >
                <i className="fas fa-times text-sm"></i>
              </motion.button>
            </div>

            {/* Form Content */}
            <div className="modal-body flex-1 p-4 sm:p-6 overflow-y-auto">
              {/* Message Display */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 p-3 rounded-lg text-center text-sm ${
                    message.includes('✅') 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}
                >
                  {message}
                </motion.div>
              )}

              {/* Login Instructions */}
              {isLogin && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 text-center"
                >
                  <p className="text-white/70 text-sm">
                    Use any of these test accounts or create a new one
                  </p>
                  <div className="text-xs text-white/60 mt-2">
                    <p>Adult: adult@habitup.com / password123</p>
                    <p>Child: child@habitup.com / password123</p>
                    <p>Elder: elder@habitup.com / password123</p>
                    <p>Doctor: doctor@habitup.com / password123</p>
                    <p className="text-purple-300 font-semibold">Admin: superuser@habitup.com / SuperUser@2024!</p>
                  </div>
                  
                  {/* Admin Login Toggle */}
                  <motion.div
                    className="mt-3 flex items-center justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAdminLogin}
                        onChange={(e) => setIsAdminLogin(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`relative w-10 h-6 rounded-full transition-colors ${
                        isAdminLogin ? 'bg-purple-500' : 'bg-white/20'
                      }`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          isAdminLogin ? 'translate-x-4' : 'translate-x-0'
                        }`}></div>
                      </div>
                      <span className="ml-2 text-white/70 text-xs">Admin Login</span>
                    </label>
                  </motion.div>
                </motion.div>
              )}

              <motion.div
                key={isLogin ? 'login' : 'signup'}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                className={isLogin ? "h-full flex flex-col justify-center" : ""}
              >
                <form onSubmit={handleSubmit} id={isLogin ? "loginForm" : "signupForm"}>
                  {/* Login Form */}
                  {isLogin ? (
                    <>
                      <motion.div variants={inputVariants} className="form-group mb-3">
                        <label htmlFor="loginEmail" className="block text-white text-sm font-medium mb-2">Email</label>
                        <motion.input
                          type="email"
                          name="email"
                          id="loginEmail"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="form-control w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-accent-400 focus:bg-white/30 transition-all text-sm"
                          required
                          whileFocus={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      </motion.div>

                      <motion.div variants={inputVariants} className="form-group mb-3">
                        <label htmlFor="loginPassword" className="block text-white text-sm font-medium mb-2">Password</label>
                        <div className="relative">
                          <motion.input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="loginPassword"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="form-control w-full px-4 py-3 pr-12 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-accent-400 focus:bg-white/30 transition-all text-sm"
                            required
                            whileFocus={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          />
                          <motion.button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-accent-400 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                          </motion.button>
                        </div>
                      </motion.div>

                      <motion.button
                        type="submit"
                        disabled={loginLoading}
                        className="btn btn-primary d-block mx-auto bg-gradient-to-r from-accent-400 to-accent-500 text-primary-500 font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg text-sm disabled:opacity-50"
                        style={{ width: '30%' }}
                        whileHover={{
                          scale: loginLoading ? 1 : 1.05,
                          boxShadow: loginLoading ? "none" : "0 10px 25px rgba(253, 193, 52, 0.3)"
                        }}
                        whileTap={{ scale: loginLoading ? 1 : 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        {loginLoading ? 'Logging in...' : 'Login'}
                      </motion.button>

                      <div className="text-center mt-3">
                        <motion.button
                          type="button"
                          className="text-accent-400 hover:text-accent-300 transition-colors text-xs mr-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Forgot Password?
                        </motion.button>
                        <span className="text-white/60 text-xs">|</span>
                        <motion.button
                          type="button"
                          onClick={toggleMode}
                          className="text-accent-400 hover:text-accent-300 transition-colors text-xs ml-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Create Account
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    /* Signup Form - Exact HTML Structure */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* First Name and Last Name */}
                      <motion.div variants={inputVariants} className="form-group">
                        <label htmlFor="signupFirstName" className="block text-white text-sm font-medium mb-2">First Name</label>
                        <motion.input
                          type="text"
                          name="firstName"
                          id="signupFirstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="form-control w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-accent-400 focus:bg-white/30 transition-all text-sm"
                          placeholder="Enter your first name"
                          minLength="2"
                          required
                          whileFocus={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      </motion.div>

                      <motion.div variants={inputVariants} className="form-group">
                        <label htmlFor="signupLastName" className="block text-white text-sm font-medium mb-2">Last Name</label>
                        <motion.input
                          type="text"
                          name="lastName"
                          id="signupLastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="form-control w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-accent-400 focus:bg-white/30 transition-all text-sm"
                          placeholder="Enter your last name"
                          minLength="2"
                          required
                          whileFocus={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      </motion.div>

                      {/* Email and Phone */}
                      <motion.div variants={inputVariants} className="form-group">
                        <label htmlFor="signupEmail" className="block text-white text-sm font-medium mb-2">Email</label>
                        <motion.input
                          type="email"
                          name="email"
                          id="signupEmail"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="form-control w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-accent-400 focus:bg-white/30 transition-all text-sm"
                          placeholder="Enter your email"
                          required
                          whileFocus={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      </motion.div>

                      <motion.div variants={inputVariants} className="form-group">
                        <label htmlFor="signupPhone" className="block text-white text-sm font-medium mb-2">Phone Number</label>
                        <motion.input
                          type="tel"
                          name="phone"
                          id="signupPhone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="form-control w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-accent-400 focus:bg-white/30 transition-all text-sm"
                          placeholder="Enter your phone number"
                          whileFocus={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      </motion.div>

                      {/* Password and Confirm Password */}
                      <motion.div variants={inputVariants} className="form-group">
                        <label htmlFor="signupPassword" className="block text-white text-sm font-medium mb-2">Password</label>
                        <motion.input
                          type="password"
                          name="password"
                          id="signupPassword"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="form-control w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-accent-400 focus:bg-white/30 transition-all text-sm"
                          placeholder="eg: Abc@123"
                          pattern="^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$"
                          required
                          whileFocus={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      </motion.div>

                      <motion.div variants={inputVariants} className="form-group">
                        <label htmlFor="signupConfirmPassword" className="block text-white text-sm font-medium mb-2">Confirm Password</label>
                        <motion.input
                          type="password"
                          name="confirmPassword"
                          id="signupConfirmPassword"
                          value={formData.confirmPassword || ''}
                          onChange={handleInputChange}
                          className="form-control w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-accent-400 focus:bg-white/30 transition-all text-sm"
                          placeholder="Re-enter password"
                          required
                          whileFocus={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      </motion.div>

                      {/* DOB and Gender */}
                      <motion.div variants={inputVariants} className="form-group">
                        <label htmlFor="signupDOB" className="block text-white text-sm font-medium mb-2">Date of Birth</label>
                        <motion.input
                          type="date"
                          name="dateOfBirth"
                          id="signupDOB"
                          value={formData.dateOfBirth || ''}
                          onChange={handleInputChange}
                          className="form-control w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-accent-400 focus:bg-white/30 transition-all text-sm"
                          whileFocus={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      </motion.div>

                      <motion.div variants={inputVariants} className="form-group">
                        <label htmlFor="signupGender" className="block text-white text-sm font-medium mb-2">Gender</label>
                        <motion.select
                          name="gender"
                          id="signupGender"
                          value={formData.gender || ''}
                          onChange={handleInputChange}
                          className="form-control w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:border-accent-400 focus:bg-white/30 transition-all text-sm"
                          whileFocus={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <option disabled value="">Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </motion.select>
                      </motion.div>

                      {/* Message Area */}
                      <motion.div variants={inputVariants} className="md:col-span-2">
                        <div className="message" id="signupMessage">
                          {/* Message content will be displayed here */}
                        </div>
                      </motion.div>

                      {/* Terms and Conditions */}
                      <motion.div variants={inputVariants} className="md:col-span-2 text-center">
                        <div className="form-group inline-block">
                          <input
                            id="acceptTerms"
                            name="acceptTerms"
                            type="checkbox"
                            checked={formData.acceptTerms || false}
                            onChange={handleInputChange}
                            required
                            className="mr-2"
                          />
                          <label htmlFor="acceptTerms" className="text-white text-sm">
                            I accept the <Link to="/terms" className="text-accent-400 underline hover:text-accent-300">Terms and Conditions</Link>
                          </label>
                        </div>
                      </motion.div>

                      {/* Submit Button */}
                      <motion.div variants={inputVariants} className="md:col-span-2 text-center mt-2">
                        <motion.button
                          type="submit"
                          disabled={loginLoading}
                          className="btn btn-primary w-auto px-6 bg-gradient-to-r from-accent-400 to-accent-500 text-primary-500 font-bold py-3 rounded-full transition-all duration-300 hover:shadow-lg text-sm disabled:opacity-50"
                          whileHover={{
                            scale: loginLoading ? 1 : 1.05,
                            boxShadow: loginLoading ? "none" : "0 10px 25px rgba(253, 193, 52, 0.3)"
                          }}
                          whileTap={{ scale: loginLoading ? 1 : 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          {loginLoading ? 'Registering...' : 'Register'}
                        </motion.button>
                        
                        <div className="mt-3">
                          <motion.button
                            type="button"
                            onClick={toggleMode}
                            className="text-accent-400 hover:text-accent-300 transition-colors text-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Already have an account? Login
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </form>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default LoginModal