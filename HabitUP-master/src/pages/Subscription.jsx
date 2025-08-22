import { useState, useEffect } from 'react'
import { getSubscriptionPlans, getCurrentSubscription, subscribeToPlan } from '../services/subscriptionService'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Subscription = () => {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [plans, setPlans] = useState([])
  const [currentPlan, setCurrentPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingSubscription, setProcessingSubscription] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
    loadSubscriptionData()
  }, [])

  const loadSubscriptionData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch subscription plans and current subscription in parallel
      const [plansData, currentSubData] = await Promise.all([
        getSubscriptionPlans(),
        getCurrentSubscription()
      ])

      setPlans(plansData)
      setCurrentPlan(currentSubData)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load subscription data')
      console.error('Subscription data loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (planId) => {
    try {
      setProcessingSubscription(true)
      await subscribeToPlan(planId, billingCycle)
      // Reload subscription data to get updated state
      await loadSubscriptionData()
      // Show success message or redirect to thank you page
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process subscription')
      console.error('Subscription error:', err)
    } finally {
      setProcessingSubscription(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-4">{error}</div>
          <button
            onClick={loadSubscriptionData}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4" data-aos="fade-up">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600" data-aos="fade-up" data-aos-delay="100">
            Select the perfect plan for your habit-building journey
          </p>
          
          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center bg-gray-100 rounded-lg p-2" data-aos="fade-up" data-aos-delay="200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-green-500">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Subscription Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                plan.popular ? 'border-2 border-primary-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary-500 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <div className="text-4xl font-bold text-gray-800">
                    ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </div>
                  <div className="text-gray-500">
                    per {billingCycle === 'monthly' ? 'month' : 'year'}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={processingSubscription || (currentPlan?.planId === plan.id)}
                  className={`w-full py-3 px-6 rounded-lg transition-colors ${
                    currentPlan?.planId === plan.id
                      ? 'bg-green-500 text-white cursor-default'
                      : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}
                >
                  {processingSubscription ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </span>
                  ) : currentPlan?.planId === plan.id ? (
                    'Current Plan'
                  ) : (
                    'Get Started'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <p className="text-gray-600" data-aos="fade-up">
            All plans include a 14-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  )
}

export default Subscription