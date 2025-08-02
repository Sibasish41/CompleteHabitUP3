import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const AdminSidebar = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen, isMobile }) => {
  const navigate = useNavigate()
  const menuItems = [
    {
      category: 'Main',
      items: [
        { id: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard', path: '/admin/dashboard' }
      ]
    },
    {
      category: 'Management',
      items: [
        { id: 'users', icon: 'fas fa-users', label: 'User Management', path: '/admin/users' },
        { id: 'subscriptions', icon: 'fas fa-credit-card', label: 'Subscriptions', path: '/admin/subscriptions' },
        { id: 'habits', icon: 'fas fa-tasks', label: 'Habit Tracking', path: '/admin/habits' }
      ]
    },
    {
      category: 'System',
      items: [
        { id: 'logs', icon: 'fas fa-clipboard-list', label: 'System Logs', path: '/admin/logs' },
        { id: 'error-logs', icon: 'fas fa-exclamation-circle', label: 'Error Logs', path: '/admin/error-logs' },
        { id: 'settings', icon: 'fas fa-cog', label: 'System Settings', path: '/admin/settings' },
        { id: 'health', icon: 'fas fa-heartbeat', label: 'Health Check', path: '/admin/health' }
      ]
    },
    {
      category: 'Analytics',
      items: [
        { id: 'analytics', icon: 'fas fa-chart-line', label: 'Analytics', path: '/admin/analytics' },
        { id: 'reports', icon: 'fas fa-file-alt', label: 'Reports', path: '/admin/reports' }
      ]
    }
  ]

  const handleNavigation = (item) => {
    setActiveSection(item.id)
    navigate(item.path)
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  return (
    <motion.div
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-purple-600 to-blue-600 text-white transition-all duration-300 ${
        isMobile 
          ? `z-50 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}` 
          : `z-40 ${sidebarOpen ? 'w-64' : 'w-16'}`
      }`}
      initial={{ x: isMobile ? -280 : -280 }}
      animate={{ x: isMobile ? (sidebarOpen ? 0 : -280) : 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Sidebar Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <motion.h2
            className={`font-bold text-xl flex items-center ${sidebarOpen ? 'block' : 'hidden'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <i className="fas fa-shield-alt mr-3"></i>
            <span>HabitUP Admin</span>
          </motion.h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Sidebar Menu */}
      <nav className="mt-8">
        {menuItems.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            <motion.p
              className={`px-4 text-xs font-medium text-white/70 mb-2 uppercase tracking-wider ${
                sidebarOpen ? 'block' : 'hidden'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
            >
              {category.category}
            </motion.p>
            <ul>
              {category.items.map((item, itemIndex) => (
                <motion.li
                  key={item.id}
                  className={`px-4 py-3 flex items-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    activeSection === item.id
                      ? 'bg-white/20 border-r-4 border-white'
                      : 'hover:bg-white/10'
                  }`}
                  onClick={() => handleNavigation(item)}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: (categoryIndex * 0.1) + (itemIndex * 0.05) }}
                  whileHover={{ x: 5 }}
                >
                  <i className={`${item.icon} text-lg mr-4`}></i>
                  <motion.span
                    className={`text-sm font-medium transition-all duration-300 ${
                      sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                    }`}
                  >
                    {item.label}
                  </motion.span>
                  
                  {/* Active indicator */}
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute left-0 top-0 h-full w-1 bg-white"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </motion.div>
  )
}

export default AdminSidebar