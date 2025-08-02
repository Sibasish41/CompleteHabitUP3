import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const AdminTopNav = ({ adminData, isDemoMode, onLogout, sidebarOpen, setSidebarOpen, isMobile }) => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <motion.div
      className={`flex items-center justify-between bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 ${
        isMobile ? 'px-4 py-3' : 'px-6 py-4'
      }`}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Mobile Menu Button & Search */}
      <div className="flex items-center flex-1">
        {isMobile && (
          <motion.button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-bars text-gray-600 text-lg"></i>
          </motion.button>
        )}
        
        {/* Search Bar */}
        <div className={`flex items-center bg-gray-50 rounded-full px-4 py-2 ${
          isMobile ? 'flex-1 max-w-xs' : 'w-96'
        }`}>
          <i className="fas fa-search text-gray-400 mr-3"></i>
          <input
            type="text"
            placeholder={isMobile ? "Search..." : "Search users, logs, settings..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      {/* Quick Navigation - Hidden on mobile */}
      {!isMobile && (
        <div className="flex items-center space-x-2 mx-4">
          <motion.button
            onClick={() => navigate('/admin/users')}
            className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-users mr-2"></i>
            Users
          </motion.button>
          <motion.button
            onClick={() => navigate('/admin/analytics')}
            className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-chart-line mr-2"></i>
            Analytics
          </motion.button>
          <motion.button
            onClick={() => navigate('/admin/settings')}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-cog mr-2"></i>
            Settings
          </motion.button>
        </div>
      )}

      {/* User Actions */}
      <div className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-4'}`}>

        {/* User Profile - Simplified on mobile */}
        {!isMobile ? (
          <div className="flex items-center space-x-3">
            <img
              src="/img/user.png"
              alt="Admin"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{adminData?.name}</p>
              <p className="text-xs text-gray-500">{adminData?.email}</p>
            </div>
            {isDemoMode && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                DEMO
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <img
              src="/img/user.png"
              alt="Admin"
              className="w-8 h-8 rounded-full object-cover"
            />
            {isDemoMode && (
              <span className="bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded-full text-xs font-semibold ml-2">
                DEMO
              </span>
            )}
          </div>
        )}

        {/* Logout Button */}
        <motion.button
          onClick={onLogout}
          className={`bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium ${
            isMobile ? 'p-2' : 'px-4 py-2'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className={`fas fa-sign-out-alt ${!isMobile ? 'mr-2' : ''}`}></i>
          {!isMobile && 'Logout'}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default AdminTopNav