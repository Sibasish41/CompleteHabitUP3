import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Sashi = () => {
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  }, [])

  return (
    <div className="hero-section min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8" data-aos="fade-up">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                📞 Contact Info
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Feel free to reach out via the following methods:
              </p>
            </div>

            <div className="space-y-6 text-lg">
              <div className="flex items-start space-x-4" data-aos="fade-up" data-aos-delay="100">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-user"></i>
                </div>
                <div>
                  <strong className="text-gray-800">Name:</strong>
                  <p className="text-gray-600">Dr. Sashi Bhusan Nayak</p>
                </div>
              </div>

              <div className="flex items-start space-x-4" data-aos="fade-up" data-aos-delay="200">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-briefcase"></i>
                </div>
                <div>
                  <strong className="text-gray-800">Designation:</strong>
                  <p className="text-gray-600">Asst. Professor (Ravenshaw University)</p>
                </div>
              </div>

              <div className="flex items-start space-x-4" data-aos="fade-up" data-aos-delay="300">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div>
                  <strong className="text-gray-800">Specialization:</strong>
                  <p className="text-gray-600">Computer Science</p>
                </div>
              </div>

              <div className="flex items-start space-x-4" data-aos="fade-up" data-aos-delay="400">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div>
                  <strong className="text-gray-800">WhatsApp:</strong>
                  <a
                    href="https://wa.me/919437135590"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 transition-colors"
                  >
                    9437135590
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4" data-aos="fade-up" data-aos-delay="500">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <strong className="text-gray-800">Email:</strong>
                  <a
                    href="mailto:habitupapplication@gmail.com"
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    habitupapplication@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center" data-aos="fade-up" data-aos-delay="600">
              <p className="text-gray-600 italic">
                📩 <em>Contact me via these channels for any queries or support.</em>
              </p>
            </div>

            {/* Additional Contact Options */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4" data-aos="fade-up" data-aos-delay="700">
              <a
                href="https://wa.me/919437135590"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 text-white text-center py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                WhatsApp
              </a>
              <a
                href="mailto:habitupapplication@gmail.com"
                className="flex-1 bg-red-500 text-white text-center py-3 px-6 rounded-lg hover:bg-red-600 transition-colors"
              >
                <i className="fas fa-envelope mr-2"></i>
                Email
              </a>
            </div>

            {/* Profile Image Section */}
            <div className="mt-8 text-center" data-aos="fade-up" data-aos-delay="800">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-200">
                <img
                  src="/img/SashiSirTeam.png"
                  alt="Dr. Sashi Bhusan Nayak"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Dr. Sashi Bhusan Nayak
              </h3>
              <p className="text-gray-600">
                Founder & Lead Instructor at HabitUP
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sashi