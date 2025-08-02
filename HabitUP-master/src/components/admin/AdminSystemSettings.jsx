import { useState } from 'react'
import { motion } from 'framer-motion'

const AdminSystemSettings = ({ isDemoMode }) => {
  const [activeTab, setActiveTab] = useState('general')
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [backupInProgress, setBackupInProgress] = useState(false)
  const [testingEmail, setTestingEmail] = useState(false)
  const [testEmailResult, setTestEmailResult] = useState(null)
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'HabitUP',
    siteDescription: 'Transform your life through better habits',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    
    // Security Settings
    passwordMinLength: 8,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactorEnabled: false,
    
    // Email Settings
    emailProvider: 'smtp',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'admin@habitup.com',
    smtpPassword: '••••••••',
    
    // Payment Settings
    paymentProvider: 'razorpay',
    razorpayKeyId: 'rzp_test_••••••••',
    razorpayKeySecret: '••••••••',
    currency: 'INR',
    
    // Notification Settings
    pushNotificationsEnabled: true,
    emailNotificationsEnabled: true,
    smsNotificationsEnabled: false,
    
    // API Settings
    apiRateLimit: 1000,
    apiTimeout: 30,
    corsEnabled: true,
    
    // Storage Settings
    storageProvider: 'local',
    maxFileSize: 10,
    allowedFileTypes: 'jpg,jpeg,png,pdf,doc,docx'
  })

  const tabs = [
    { id: 'general', label: 'General', icon: 'fas fa-cog' },
    { id: 'security', label: 'Security', icon: 'fas fa-shield-alt' },
    { id: 'email', label: 'Email', icon: 'fas fa-envelope' },
    { id: 'payment', label: 'Payment', icon: 'fas fa-credit-card' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'api', label: 'API', icon: 'fas fa-code' },
    { id: 'storage', label: 'Storage', icon: 'fas fa-database' }
  ]

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
    setHasChanges(true)
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Saving settings:', settings)
      setHasChanges(false)
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleResetToDefaults = () => {
    setSettings({
      siteName: 'HabitUP',
      siteDescription: 'Transform your life through better habits',
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerificationRequired: true,
      passwordMinLength: 8,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      twoFactorEnabled: false,
      emailProvider: 'smtp',
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: 'admin@habitup.com',
      smtpPassword: '',
      paymentProvider: 'razorpay',
      razorpayKeyId: '',
      razorpayKeySecret: '',
      currency: 'INR',
      pushNotificationsEnabled: true,
      emailNotificationsEnabled: true,
      smsNotificationsEnabled: false,
      apiRateLimit: 1000,
      apiTimeout: 30,
      corsEnabled: true,
      storageProvider: 'local',
      maxFileSize: 10,
      allowedFileTypes: 'jpg,jpeg,png,pdf,doc,docx'
    })
    setHasChanges(true)
    setShowResetConfirm(false)
  }

  const handleTestEmail = async () => {
    setTestingEmail(true)
    setTestEmailResult(null)
    
    try {
      // Simulate email test
      await new Promise(resolve => setTimeout(resolve, 3000))
      setTestEmailResult({ success: true, message: 'Test email sent successfully!' })
    } catch (error) {
      setTestEmailResult({ success: false, message: 'Failed to send test email. Please check your settings.' })
    } finally {
      setTestingEmail(false)
    }
  }

  const handleBackupDatabase = async () => {
    setBackupInProgress(true)
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 5000))
      alert('Database backup completed successfully!')
    } catch (error) {
      alert('Backup failed. Please try again.')
    } finally {
      setBackupInProgress(false)
    }
  }

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `habitup_settings_${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImportSettings = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result)
          setSettings(importedSettings)
          setHasChanges(true)
          alert('Settings imported successfully!')
        } catch (error) {
          alert('Invalid settings file. Please check the format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => handleSettingChange('siteName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
          <input
            type="text"
            value={settings.siteDescription}
            onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-800">Maintenance Mode</h4>
            <p className="text-sm text-gray-600">Temporarily disable site access</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-800">User Registration</h4>
            <p className="text-sm text-gray-600">Allow new user registrations</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.registrationEnabled}
              onChange={(e) => handleSettingChange('registrationEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-800">Email Verification</h4>
          <p className="text-sm text-gray-600">Require email verification for new accounts</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.emailVerificationRequired}
            onChange={(e) => handleSettingChange('emailVerificationRequired', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
        </label>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Password Length</label>
          <input
            type="number"
            value={settings.passwordMinLength}
            onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            min="6"
            max="20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            min="5"
            max="1440"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
          <input
            type="number"
            value={settings.maxLoginAttempts}
            onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            min="3"
            max="10"
          />
        </div>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-800">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-600">Enable 2FA for admin accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.twoFactorEnabled}
              onChange={(e) => handleSettingChange('twoFactorEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>
    </div>
  )

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Provider</label>
        <select
          value={settings.emailProvider}
          onChange={(e) => handleSettingChange('emailProvider', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="smtp">SMTP</option>
          <option value="sendgrid">SendGrid</option>
          <option value="mailgun">Mailgun</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
          <input
            type="text"
            value={settings.smtpHost}
            onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
          <input
            type="number"
            value={settings.smtpPort}
            onChange={(e) => handleSettingChange('smtpPort', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
          <input
            type="email"
            value={settings.smtpUsername}
            onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
          <input
            type="password"
            value={settings.smtpPassword}
            onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle text-yellow-600 mr-3"></i>
            <div>
              <h4 className="font-medium text-yellow-800">Test Email Configuration</h4>
              <p className="text-yellow-700 text-sm">Send a test email to verify your configuration.</p>
            </div>
          </div>
          <button 
            onClick={handleTestEmail}
            disabled={testingEmail}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm disabled:opacity-50 flex items-center"
          >
            {testingEmail ? (
              <>
                <i className="fas fa-spinner animate-spin mr-2"></i>
                Testing...
              </>
            ) : (
              <>
                <i className="fas fa-envelope mr-2"></i>
                Send Test Email
              </>
            )}
          </button>
        </div>
        
        {testEmailResult && (
          <div className={`mt-3 p-3 rounded-lg ${
            testEmailResult.success 
              ? 'bg-green-100 border border-green-200 text-green-800' 
              : 'bg-red-100 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <i className={`fas ${testEmailResult.success ? 'fa-check-circle' : 'fa-times-circle'} mr-2`}></i>
              {testEmailResult.message}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <i className="fas fa-cog text-purple-600 mr-4"></i>
          System Settings
        </h1>
      </motion.div>

      {/* Settings Navigation */}
      <motion.div
        className="bg-white rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="p-6">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'email' && renderEmailSettings()}
          
          {activeTab === 'payment' && (
            <div className="text-center py-20">
              <i className="fas fa-credit-card text-gray-300 text-6xl mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Payment Settings</h3>
              <p className="text-gray-500">Payment configuration options coming soon.</p>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="text-center py-20">
              <i className="fas fa-bell text-gray-300 text-6xl mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Notification Settings</h3>
              <p className="text-gray-500">Notification configuration options coming soon.</p>
            </div>
          )}
          
          {activeTab === 'api' && (
            <div className="text-center py-20">
              <i className="fas fa-code text-gray-300 text-6xl mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">API Settings</h3>
              <p className="text-gray-500">API configuration options coming soon.</p>
            </div>
          )}
          
          {activeTab === 'storage' && (
            <div className="text-center py-20">
              <i className="fas fa-database text-gray-300 text-6xl mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Storage Settings</h3>
              <p className="text-gray-500">Storage configuration options coming soon.</p>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <button 
                onClick={handleExportSettings}
                className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center text-sm"
              >
                <i className="fas fa-download mr-2"></i>
                Export Settings
              </button>
              <label className="px-4 py-2 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors flex items-center text-sm cursor-pointer">
                <i className="fas fa-upload mr-2"></i>
                Import Settings
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportSettings}
                  className="hidden"
                />
              </label>
              <button 
                onClick={handleBackupDatabase}
                disabled={backupInProgress}
                className="px-4 py-2 text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors flex items-center text-sm disabled:opacity-50"
              >
                {backupInProgress ? (
                  <>
                    <i className="fas fa-spinner animate-spin mr-2"></i>
                    Backing up...
                  </>
                ) : (
                  <>
                    <i className="fas fa-database mr-2"></i>
                    Backup Database
                  </>
                )}
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              {hasChanges && (
                <span className="text-sm text-orange-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  Unsaved changes
                </span>
              )}
              <button 
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={saving || !hasChanges}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner animate-spin mr-2"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* External Links */}
      <motion.div
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="https://docs.habitup.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <i className="fas fa-book text-blue-600 mr-3"></i>
            <span className="text-sm font-medium text-blue-700">Documentation</span>
          </a>
          <a
            href="https://support.habitup.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <i className="fas fa-headset text-green-600 mr-3"></i>
            <span className="text-sm font-medium text-green-700">Support</span>
          </a>
          <a
            href="https://github.com/habitup/habitup"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <i className="fab fa-github text-gray-600 mr-3"></i>
            <span className="text-sm font-medium text-gray-700">GitHub</span>
          </a>
          <a
            href="https://status.habitup.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <i className="fas fa-heartbeat text-purple-600 mr-3"></i>
            <span className="text-sm font-medium text-purple-700">Status</span>
          </a>
        </div>
      </motion.div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <i className="fas fa-exclamation-triangle text-orange-600 text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Reset to Defaults</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to reset all settings to their default values? 
              This will overwrite all your current configurations.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResetToDefaults}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Reset Settings
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {isDemoMode && (
        <motion.div
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center">
            <i className="fas fa-info-circle text-yellow-600 mr-3"></i>
            <div>
              <h3 className="font-semibold text-yellow-800">Demo Mode</h3>
              <p className="text-yellow-700 text-sm">
                System settings cannot be modified in demo mode. All changes are temporary and for demonstration only.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminSystemSettings