import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const PremiumFeatureGate = ({ 
  children, 
  feature, 
  fallbackComponent = null,
  showUpgrade = true 
}) => {
  const { user } = useAuth()
  
  const isPremium = user?.subscriptionType === 'premium' || user?.subscriptionType === 'Premium'
  const isWithin30Days = checkUserEligibility(user)

  function checkUserEligibility(user) {
    if (!user?.joinDate) return false
    
    const joinDate = new Date(user.joinDate)
    const now = new Date()
    const daysDiff = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24))
    
    return daysDiff <= 30
  }

  // If user is premium or within 30 days, show the feature
  if (isPremium || isWithin30Days) {
    return children
  }

  // If fallback component is provided, show it
  if (fallbackComponent) {
    return fallbackComponent
  }

  // Default upgrade prompt
  if (!showUpgrade) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-8 text-center border border-purple-200"
    >
      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i className="fas fa-crown text-purple-600 text-2xl"></i>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Premium Feature
      </h3>
      
      <p className="text-gray-600 mb-6">
        {feature ? `${feature} is available for premium subscribers.` : 
         'This feature is available for premium subscribers.'}
        {!isPremium && isWithin30Days && ' Your free trial has ended.'}
      </p>

      <div className="space-y-3">
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
          <i className="fas fa-star mr-2"></i>
          Upgrade to Premium
        </button>
        
        <div className="text-sm text-gray-500">
          <p>✓ Unlimited access to all features</p>
          <p>✓ Priority support</p>
          <p>✓ Advanced analytics</p>
        </div>
      </div>
    </motion.div>
  )
}

export default PremiumFeatureGate