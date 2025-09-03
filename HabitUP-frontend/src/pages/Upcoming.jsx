import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Upcoming = () => {
  const navigate = useNavigate()

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  }, [])

  const pricingPlans = [
    {
      name: 'Free',
      price: '₹0',
      period: '/month',
      color: '#6c5ce7',
      features: [
        'Access to 4 Learning Videos',
        'Basic Habit Tracking',
        'WhatsApp Group Access',
        'Community Support'
      ],
      notIncluded: [
        'Exclusive Video Content',
        'Advanced Analytics Dashboard',
        'Access to all Upcoming features'
      ],
      buttonText: 'Current Plan',
      buttonDisabled: true
    },
    {
      name: 'Premium',
      price: '₹59',
      period: '/month',
      color: '#00cec9',
      popular: true,
      features: [
        'All Learning Videos Unlocked',
        'Advanced Habit Tracking',
        'Priority Support',
        'Premium Analytics Dashboard',
        'Special Habit Library',
        '1-on-1 Coaching'
      ],
      buttonText: 'Upgrade Now',
      buttonDisabled: false
    },
    {
      name: 'Pro',
      price: '₹99',
      period: '/month',
      color: '#fd79a8',
      features: [
        'All Premium Features',
        'AI Habit Coach (When Available)',
        'Health Integration (When Available)',
        'Advanced Analytics & Reports',
        'Priority Feature Access',
        'Unlimited 1-on-1 Coaching',
        'Custom Habit Programs'
      ],
      buttonText: 'Get Pro',
      buttonDisabled: false
    }
  ]

  return (
    <div className="pt-20">
      {/* Hero Section - Following HTML structure */}
      <section className="bg-primary-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 font-raleway" data-aos="fade-up">
            Upcoming Features - Coming Soon!
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="100">
            We're working on exciting new features for HabitUP. Stay tuned!
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold mb-4 text-primary-500 font-raleway">What's Coming Next</h2>
            <p className="text-gray-600 text-lg">Exciting new features to enhance your habit-building journey</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="100">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary-500">Community Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with like-minded individuals and share your habit-building journey.
              </p>
              <div className="mt-4">
                <span className="bg-accent-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Q2 2025
                </span>
              </div>
            </div>

            <div className="text-center bg-white p-8 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="200">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                <i className="fas fa-robot"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary-500">AI Habit Coach</h3>
              <p className="text-gray-600 leading-relaxed">
                Get personalized advice from our intelligent AI assistant for better habit formation.
              </p>
              <div className="mt-4">
                <span className="bg-accent-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Q3 2025
                </span>
              </div>
            </div>

            <div className="text-center bg-white p-8 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="300">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                <i className="fas fa-heartbeat"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary-500">Health Integration</h3>
              <p className="text-gray-600 leading-relaxed">
                Sync with health apps and devices for comprehensive wellness tracking.
              </p>
              <div className="mt-4">
                <span className="bg-accent-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Q4 2025
                </span>
              </div>
            </div>

            <div className="text-center bg-white p-8 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="400">
              <div className="w-16 h-16 bg-indigo-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary-500">Advanced Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Deep insights into your habit patterns with predictive analytics.
              </p>
              <div className="mt-4">
                <span className="bg-accent-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Q1 2026
                </span>
              </div>
            </div>

            <div className="text-center bg-white p-8 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="500">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                <i className="fas fa-trophy"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary-500">Habit Challenges</h3>
              <p className="text-gray-600 leading-relaxed">
                Join community challenges and compete with friends through gamification.
              </p>
              <div className="mt-4">
                <span className="bg-accent-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Q2 2026
                </span>
              </div>
            </div>

            <div className="text-center bg-white p-8 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="600">
              <div className="w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary-500">Mobile App</h3>
              <p className="text-gray-600 leading-relaxed">
                Native mobile apps for iOS and Android with offline capabilities.
              </p>
              <div className="mt-4">
                <span className="bg-accent-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Q3 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Three Plans */}
      <section className="py-16 bg-gray-50" id="subscription">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold mb-4 text-accent-400 font-raleway">Choose Your Plan</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Unlock premium content and accelerate your habit transformation journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl relative ${plan.popular ? 'ring-2 ring-primary-500' : ''}`}
                data-aos="fade-up"
                data-aos-delay={`${(index + 1) * 100}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  {/* Pricing Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-4" style={{ color: plan.color }}>
                      {plan.name}
                    </h3>
                    <div className="text-4xl font-bold text-gray-800 mb-2">
                      {plan.price}
                      <span className="text-lg font-normal text-gray-500">{plan.period}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <i className="bi bi-check text-green-500 text-xl mr-3"></i>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded && plan.notIncluded.map((feature, featureIndex) => (
                      <li key={`not-${featureIndex}`} className="flex items-center">
                        <i className="bi bi-x text-red-500 text-xl mr-3"></i>
                        <span className="text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <div className="text-center">
                    {plan.buttonDisabled ? (
                      <button 
                        className="w-full py-3 px-6 border-2 border-gray-300 text-gray-500 rounded-full font-semibold cursor-not-allowed"
                        disabled
                      >
                        {plan.buttonText}
                      </button>
                    ) : (
                      <button
                        className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                          plan.name === 'Premium' 
                            ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700' 
                            : plan.name === 'Pro'
                            ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700'
                            : 'bg-primary-500 text-white hover:bg-primary-600'
                        }`}
                        onClick={() => navigate('/subscription')}
                      >
                        {plan.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-raleway" data-aos="fade-up">
            Ready to Transform Your Habits?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Don't wait for the future features - start building better habits today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="200">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-accent-400 text-primary-500 px-8 py-4 rounded-full font-semibold text-lg hover:bg-accent-500 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Your Journey Today
            </button>
           
          </div>
        </div>
      </section>
    </div>
  )
}

export default Upcoming