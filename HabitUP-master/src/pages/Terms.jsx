import { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Terms = () => {
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  }, [])

  const handleAccept = () => {
    setAccepted(true)
    // Handle acceptance logic here
    console.log('Terms accepted')
  }

  const handleDecline = () => {
    // Handle decline logic here
    console.log('Terms declined')
    window.history.back()
  }

  return (
    <div className="hero-section min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8" data-aos="fade-up">
            <h1 className="text-3xl font-bold text-center mb-8 text-teal-700">
              Terms and Conditions - HabitUp
            </h1>

            <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto mb-6 text-sm leading-relaxed">
              <div className="space-y-6">
                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
                  <p className="text-gray-700">
                    By accessing and using HabitUp ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                    If you do not agree to abide by the above, please do not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">2. Description of Service</h2>
                  <p className="text-gray-700">
                    HabitUp is a habit tracking and personal development platform that helps users build better habits through 
                    tracking, analytics, coaching, and community support. The service includes mobile and web applications, 
                    content library, and coaching services.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">3. User Accounts</h2>
                  <p className="text-gray-700">
                    To access certain features of the Service, you must register for an account. You are responsible for 
                    maintaining the confidentiality of your account credentials and for all activities that occur under your account. 
                    You agree to notify us immediately of any unauthorized use of your account.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">4. Privacy Policy</h2>
                  <p className="text-gray-700">
                    Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information 
                    when you use our Service. By using our Service, you agree to the collection and use of information in 
                    accordance with our Privacy Policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">5. Subscription and Payment</h2>
                  <p className="text-gray-700">
                    Some features of the Service require a paid subscription. Subscription fees are charged in advance on a 
                    recurring basis (monthly or annually). You may cancel your subscription at any time, but no refunds will be 
                    provided for unused portions of the subscription period.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">6. User Content</h2>
                  <p className="text-gray-700">
                    You retain ownership of any content you submit, post, or display on or through the Service. By submitting 
                    content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and 
                    distribute your content in connection with the Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">7. Prohibited Uses</h2>
                  <p className="text-gray-700">
                    You may not use the Service for any unlawful purpose or to solicit others to perform unlawful acts. 
                    You may not violate any local, state, national, or international law or regulation. You may not transmit 
                    any material that is abusive, harassing, tortious, defamatory, vulgar, obscene, or otherwise objectionable.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">8. Disclaimer of Warranties</h2>
                  <p className="text-gray-700">
                    The Service is provided on an "as is" and "as available" basis. We make no representations or warranties 
                    of any kind, express or implied, as to the operation of the Service or the information, content, materials, 
                    or products included on the Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">9. Limitation of Liability</h2>
                  <p className="text-gray-700">
                    In no event shall HabitUp, its directors, employees, or agents be liable for any indirect, incidental, 
                    special, consequential, or punitive damages, including without limitation, loss of profits, data, use, 
                    goodwill, or other intangible losses.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">10. Termination</h2>
                  <p className="text-gray-700">
                    We may terminate or suspend your account and bar access to the Service immediately, without prior notice 
                    or liability, under our sole discretion, for any reason whatsoever and without limitation, including but 
                    not limited to a breach of the Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">11. Changes to Terms</h2>
                  <p className="text-gray-700">
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision 
                    is material, we will provide at least 30 days notice prior to any new terms taking effect.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">12. Contact Information</h2>
                  <p className="text-gray-700">
                    If you have any questions about these Terms and Conditions, please contact us at:
                    <br />
                    Email: habitupapplication@gmail.com
                    <br />
                    Phone: +91 9437135590
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">13. Governing Law</h2>
                  <p className="text-gray-700">
                    These Terms shall be interpreted and governed by the laws of India, without regard to its conflict of law provisions. 
                    Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Bhubaneswar, Odisha.
                  </p>
                </section>

                <section>
                  <p className="text-gray-600 text-xs mt-8">
                    Last updated: January 2024
                  </p>
                </section>
              </div>
            </div>

            {!accepted ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="100">
                <button
                  onClick={handleDecline}
                  className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Decline
                </button>
                <button
                  onClick={handleAccept}
                  className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  Accept Terms
                </button>
              </div>
            ) : (
              <div className="text-center" data-aos="fade-up" data-aos-delay="100">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                  <i className="fas fa-check text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">Terms Accepted!</h3>
                <p className="text-gray-600 mb-6">
                  Thank you for accepting our terms and conditions. You can now enjoy all features of HabitUp.
                </p>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  Continue to Dashboard
                </button>
              </div>
            )}

            <div className="mt-8 text-center text-gray-500 text-sm" data-aos="fade-up" data-aos-delay="200">
              <p>
                📩 <em>For any questions regarding these terms, please contact us at habitupapplication@gmail.com</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terms