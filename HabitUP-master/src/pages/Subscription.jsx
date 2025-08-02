import { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Subscription = () => {
  const [billingCycle, setBillingCycle] = useState('monthly')

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  }, [])

  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for getting started with habit building',
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      features: [
        'Track up to 5 habits',
        'Basic progress analytics',
        'Mobile app access',
        'Email support',
        'Community access'
      ],
      color: 'blue',
      popular: false
    },
    {
      name: 'Premium',
      description: 'Most popular choice for serious habit builders',
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      features: [
        'Unlimited habit tracking',
        'Advanced analytics & insights',
        'Personalized coaching tips',
        'Priority support',
        'Exclusive content library',
        'Goal setting tools',
        'Progress sharing'
      ],
      color: 'purple',
      popular: true
    },
    {
      name: 'Pro',
      description: 'For professionals and teams who want it all',
      monthlyPrice: 39.99,
      yearlyPrice: 399.99,
      features: [
        'Everything in Premium',
        'One-on-one coaching sessions',
        'Custom habit programs',
        'Team collaboration tools',
        'API access',
        'White-label options',
        'Dedicated account manager'
      ],
      color: 'green',
      popular: false
    }
  ]

  const getPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
  }

  const getSavings = (plan) => {
    const monthlyCost = plan.monthlyPrice * 12
    const yearlyCost = plan.yearlyPrice
    return monthlyCost - yearlyCost
  }

  return (
    <div className="hero-section">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6" data-aos="fade-up">
            Choose Your Plan
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Start your transformation journey with the perfect plan for your needs
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8" data-aos="fade-up" data-aos-delay="200">
            <span className={`${billingCycle === 'monthly' ? 'text-white' : 'text-purple-200'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`${billingCycle === 'yearly' ? 'text-white' : 'text-purple-200'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-sm font-semibold">
                Save up to 20%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                  plan.popular ? 'ring-2 ring-purple-500 transform scale-105' : ''
                }`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-800">
                      ${getPrice(plan)}
                    </span>
                    <span className="text-gray-600">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>

                  {billingCycle === 'yearly' && (
                    <p className="text-green-600 text-sm font-medium">
                      Save ${getSavings(plan).toFixed(2)} per year
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <i className={`fas fa-check text-${plan.color}-500 mt-0.5`}></i>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : `bg-${plan.color}-600 text-white hover:bg-${plan.color}-700`
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Compare All Features
            </h2>
            <p className="text-gray-600 text-lg">
              See what's included in each plan
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-x-auto" data-aos="fade-up" data-aos-delay="100">
            <table className="w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-6 font-semibold text-gray-800">Features</th>
                  <th className="text-center p-6 font-semibold text-blue-600">Basic</th>
                  <th className="text-center p-6 font-semibold text-purple-600">Premium</th>
                  <th className="text-center p-6 font-semibold text-green-600">Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Habit Tracking', basic: '5 habits', premium: 'Unlimited', pro: 'Unlimited' },
                  { feature: 'Progress Analytics', basic: 'Basic', premium: 'Advanced', pro: 'Advanced' },
                  { feature: 'Mobile App', basic: '✓', premium: '✓', pro: '✓' },
                  { feature: 'Email Support', basic: '✓', premium: '✓', pro: '✓' },
                  { feature: 'Priority Support', basic: '✗', premium: '✓', pro: '✓' },
                  { feature: 'Coaching Sessions', basic: '✗', premium: '✗', pro: '✓' },
                  { feature: 'Team Features', basic: '✗', premium: '✗', pro: '✓' },
                  { feature: 'API Access', basic: '✗', premium: '✗', pro: '✓' }
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="p-6 font-medium text-gray-800">{row.feature}</td>
                    <td className="p-6 text-center text-gray-600">{row.basic}</td>
                    <td className="p-6 text-center text-gray-600">{row.premium}</td>
                    <td className="p-6 text-center text-gray-600">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'Can I change my plan anytime?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
              },
              {
                question: 'Is there a free trial?',
                answer: 'Yes, we offer a 14-day free trial for all plans. No credit card required to start.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
              },
              {
                question: 'Can I cancel anytime?',
                answer: 'Absolutely! You can cancel your subscription at any time. Your access will continue until the end of your billing period.'
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-6"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <h3 className="font-semibold text-gray-800 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4" data-aos="fade-up">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl mb-8 text-purple-100" data-aos="fade-up" data-aos-delay="100">
            Join thousands of users who have already started their habit transformation journey
          </p>
          <button
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>
    </div>
  )
}

export default Subscription