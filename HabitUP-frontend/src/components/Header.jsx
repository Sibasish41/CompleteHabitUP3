import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import LoginModal from './LoginModal'

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const profileDropdownRef = useRef(null)

  const isLoggedIn = isAuthenticated

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  // Get navbar color to match footer exactly
  const getNavbarColor = () => {
    // Match footer color exactly - solid primary-500 with slight transparency
    return 'bg-primary-500/90 backdrop-blur-sm'
  }

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('mobile-menu-open')
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.classList.remove('mobile-menu-open')
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-menu-open')
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isMenuOpen])

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
    setIsProfileDropdownOpen(false)
  }, [location.pathname])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const menuVariants = {
    closed: {
      x: '100%',
      opacity: 0,
      transition: {
        type: 'tween',
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'tween',
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  }

  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  }

  const menuItemVariants = {
    closed: {
      opacity: 0,
      x: 30,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  }

  const staggerContainer = {
    open: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15
      }
    },
    closed: {
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1
      }
    }
  }

  return (
    <>
      <header className={`header-fixed ${getNavbarColor()} backdrop-blur-md transition-all duration-500 border-b border-white/10 overflow-visible`}>
        <div className="header-container container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3 sm:py-4 relative">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center text-white no-underline">
              <h1 className="text-xl sm:text-2xl font-bold font-raleway m-0">HabitUP</h1>
              <span className="text-accent-400 text-xl sm:text-2xl font-bold">.</span>
            </Link>
          </motion.div>

          {/* Mobile Navigation Controls */}
          <div className="flex items-center space-x-3 md:hidden">
            {/* Mobile Login/Profile Button - Visible on small screens */}
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="flex items-center space-x-1 bg-accent-400 text-primary-500 px-3 py-2 rounded-lg font-semibold text-sm shadow-lg"
              >
                <i className="bi bi-person text-xs"></i>
                <span className="text-xs">Profile</span>
              </Link>
            ) : (
              <motion.button
                className="bg-gradient-to-r from-accent-400 to-accent-500 text-primary-500 px-3 py-2 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl"
                onClick={() => setIsLoginModalOpen(true)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="bi bi-box-arrow-in-right mr-1"></i>
                <span className="text-xs">Login</span>
              </motion.button>
            )}

            {/* Animated Burger Menu Button */}
            <motion.button
              className="relative w-10 h-10 flex flex-col items-center justify-center text-white rounded-md hover:bg-white/10 transition-colors z-[99999] overflow-hidden"
              onClick={toggleMenu}
              aria-label="Toggle navigation"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                className="w-6 h-0.5 bg-white block burger-line"
                animate={isMenuOpen ? {
                  rotate: 45,
                  y: 6,
                  scaleX: 1.2
                } : {
                  rotate: 0,
                  y: 0,
                  scaleX: 1
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              <motion.span
                className="w-6 h-0.5 bg-white block mt-1.5 burger-line"
                animate={isMenuOpen ? {
                  opacity: 0,
                  x: -20
                } : {
                  opacity: 1,
                  x: 0
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              />
              <motion.span
                className="w-6 h-0.5 bg-white block mt-1.5 burger-line"
                animate={isMenuOpen ? {
                  rotate: -45,
                  y: -6,
                  scaleX: 1.2
                } : {
                  rotate: 0,
                  y: 0,
                  scaleX: 1
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />

              {/* Ripple effect */}
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                animate={isMenuOpen ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:space-x-6 xl:space-x-8">
            <ul className="flex items-center space-x-6 xl:space-x-8 list-none m-0 p-0">
              {(isLoggedIn ? [
                { path: '/user-home', label: 'Home', altPath: '/dashboard' },
                { path: '/about', label: 'About' },
                { path: '/services', label: 'Services' },
                { path: '/blog', label: 'Blogs' },
                { path: '/upcoming', label: 'Upcoming' }
              ] : [
                { path: '/', label: 'Home', altPath: '/home' },
                { path: '/about', label: 'About' },
                { path: '/services', label: 'Services' },
                { path: '/teams', label: 'Teams' },
                { path: '/contact', label: 'Contact' }
              ]).map((item, index) => (
                <motion.li
                  key={item.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {item.label === 'Services' && (location.pathname === '/' || location.pathname === '/home') ? (
                    <button
                      onClick={() => {
                        const servicesSection = document.getElementById('services')
                        if (servicesSection) {
                          servicesSection.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                      className={`block px-3 py-2 rounded transition-colors duration-300 font-poppins text-sm lg:text-base ${
                        'text-white hover:text-accent-400'
                      }`}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className={`block px-3 py-2 rounded transition-colors duration-300 font-poppins text-sm lg:text-base ${isActive(item.path) || (item.altPath && isActive(item.altPath))
                        ? 'text-accent-400'
                        : 'text-white hover:text-accent-400'
                        }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Desktop & Tablet Login/Profile Button */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="dropdown-parent relative" ref={profileDropdownRef}>
                <motion.button
                  className="flex items-center space-x-2 text-white hover:text-accent-400 transition-colors p-2 rounded-lg hover:bg-white/10"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 bg-accent-400 rounded-full flex items-center justify-center">
                    <i className="bi bi-person text-primary-500 text-sm"></i>
                  </div>
                  <span className="hidden lg:inline text-sm font-medium">{user?.name || 'User'}</span>
                  <i className={`bi bi-chevron-down text-xs transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}></i>
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      className="profile-dropdown w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <i className="bi bi-person text-gray-500"></i>
                        <span className="text-sm font-medium">Profile</span>
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <i className="bi bi-speedometer2 text-gray-500"></i>
                        <span className="text-sm font-medium">Dashboard</span>
                      </Link>
                      <hr className="my-2 border-gray-200" />
                      <button
                        className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        onClick={() => {
                          logout()
                          setIsProfileDropdownOpen(false)
                        }}
                      >
                        <i className="bi bi-box-arrow-right text-red-500"></i>
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                className="bg-gradient-to-r from-accent-400 to-accent-500 text-primary-500 px-4 lg:px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:from-accent-500 hover:to-accent-600 font-semibold text-sm lg:text-base"
                onClick={() => setIsLoginModalOpen(true)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="bi bi-box-arrow-in-right mr-2"></i>
                <span className="hidden lg:inline">Login / Signup</span>
                <span className="lg:hidden">Login</span>
              </motion.button>
            )}
          </div>


        </div>


      </header>

      {/* Full Screen Mobile Navigation Overlay - Outside Header */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 lg:hidden z-[99999]"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Enhanced Blurred Background */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              onClick={toggleMenu}
            />
            
            {/* Sidebar Menu Panel - 45% Width */}
            <motion.div
              className={`absolute top-0 right-0 h-full w-[45%] min-w-[280px] max-w-[400px] shadow-2xl ${
                isLoggedIn && user?.userType 
                  ? user.userType === 'Child' 
                    ? 'bg-gradient-to-br from-pink-500 via-pink-600 to-purple-700'
                    : user.userType === 'Elder'
                    ? 'bg-gradient-to-br from-green-500 via-green-600 to-teal-700'
                    : user.userType === 'Doctor'
                    ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700'
                    : 'bg-gradient-to-br from-primary-500 via-primary-600 to-blue-700'
                  : 'bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700'
              }`}
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Sidebar Menu Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-lg sm:text-xl font-bold font-raleway text-white">HabitUP</h2>
                  <span className="text-accent-400 text-lg sm:text-xl font-bold">.</span>
                </motion.div>
                <motion.button
                  onClick={toggleMenu}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 text-white"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <i className="bi bi-x-lg text-lg"></i>
                </motion.button>
              </div>

              {/* Welcome Message */}
              <motion.div 
                className="px-4 sm:px-6 py-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Welcome to HabitUP</h3>
                <p className="text-white/80 text-xs sm:text-sm">
                  Transform your life with better habits
                </p>
              </motion.div>

              {/* Sidebar Menu Content */}
              <div className="flex flex-col justify-center h-[calc(100vh-140px)] px-4 sm:px-6 py-4">
                {/* Navigation Links */}
                <motion.nav
                  className="w-full"
                  variants={staggerContainer}
                  initial="closed"
                  animate="open"
                >
                  <ul className="space-y-3">
                    {(isLoggedIn ? [
                      { path: '/user-home', label: 'Home', icon: 'bi bi-house', altPath: '/dashboard' },
                      { path: '/about', label: 'About', icon: 'bi bi-info-circle' },
                      { path: '/services', label: 'Services', icon: 'bi bi-grid-3x3-gap' },
                      { path: '/blog', label: 'Blog', icon: 'bi bi-journal-text' },
                      { path: '/upcoming', label: 'Upcoming', icon: 'bi bi-calendar-event' }
                    ] : [
                      { path: '/', label: 'Home', icon: 'bi bi-house', altPath: '/home' },
                      { path: '/about', label: 'About', icon: 'bi bi-info-circle' },
                      { path: '/services', label: 'Services', icon: 'bi bi-grid-3x3-gap' },
                      { path: '/teams', label: 'Teams', icon: 'bi bi-people' },
                      { path: '/contact', label: 'Contact', icon: 'bi bi-envelope' }
                    ]).map((item) => (
                      <motion.li key={item.path} variants={menuItemVariants}>
                        {item.label === 'Services' && (location.pathname === '/' || location.pathname === '/home') ? (
                          <button
                            onClick={() => {
                              const servicesSection = document.getElementById('services')
                              if (servicesSection) {
                                servicesSection.scrollIntoView({ behavior: 'smooth' })
                              }
                              setIsMenuOpen(false)
                            }}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left group ${
                              'text-white hover:text-accent-400 hover:bg-white/10 hover:shadow-lg'
                            }`}
                          >
                            <i className={`${item.icon} text-lg group-hover:scale-110 transition-transform`}></i>
                            <span className="font-semibold text-base">{item.label}</span>
                          </button>
                        ) : (
                          <Link
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left group ${
                              isActive(item.path) || (item.altPath && isActive(item.altPath))
                                ? 'bg-accent-400 text-primary-500 shadow-lg'
                                : 'text-white hover:text-accent-400 hover:bg-white/10 hover:shadow-lg'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <i className={`${item.icon} text-lg group-hover:scale-110 transition-transform`}></i>
                            <span className="font-semibold text-base">{item.label}</span>
                          </Link>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </motion.nav>

                {/* Login/Logout Button */}
                <motion.div
                  className="mt-6 w-full"
                  variants={menuItemVariants}
                >
                  {isLoggedIn ? (
                    <div className="space-y-3">
                      <Link
                        to="/profile"
                        className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <i className="bi bi-person mr-2"></i>
                        View Profile
                      </Link>
                      <motion.button
                        className="w-full bg-gradient-to-r from-red-400 to-red-500 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:from-red-500 hover:to-red-600"
                        onClick={() => {
                          logout()
                          setIsMenuOpen(false)
                        }}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <i className="bi bi-box-arrow-right mr-2"></i>
                        Logout
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button
                      className="w-full bg-gradient-to-r from-accent-400 to-accent-500 text-primary-500 py-3 px-4 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:from-accent-500 hover:to-accent-600"
                      onClick={() => {
                        setIsLoginModalOpen(true)
                        setIsMenuOpen(false)
                      }}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <i className="bi bi-box-arrow-in-right mr-2"></i>
                      Login / Sign Up
                    </motion.button>
                  )}
                </motion.div>

                {/* Social Links */}
                <motion.div
                  className="mt-6 flex items-center justify-center space-x-4"
                  variants={menuItemVariants}
                >
                  {[
                    { icon: 'bi bi-facebook', label: 'Facebook', url: 'https://facebook.com/habitup' },
                    { icon: 'bi bi-twitter-x', label: 'Twitter', url: 'https://twitter.com/habitup' },
                    { icon: 'bi bi-instagram', label: 'Instagram', url: 'https://instagram.com/habitup' },
                    { icon: 'bi bi-linkedin', label: 'LinkedIn', url: 'https://linkedin.com/company/habitup' }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 hover:bg-accent-400 text-white hover:text-primary-500 rounded-full flex items-center justify-center transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={social.label}
                    >
                      <i className={`${social.icon} text-sm`}></i>
                    </motion.a>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}

export default Header