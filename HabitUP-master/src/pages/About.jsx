import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPageContent, getTestimonials } from '../services/contentManagementService'
import AOS from 'aos'
import 'aos/dist/aos.css'

const About = () => {
  const navigate = useNavigate()
  const [pageContent, setPageContent] = useState({
    title: '',
    subtitle: '',
    mission: '',
    missionDetails: '',
    values: [],
    journey: '',
    impact: '',
    founder: {
      name: '',
      bio: '',
      image: ''
    }
  })
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
    loadPageContent()
  }, [])

  const loadPageContent = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch page content and testimonials in parallel
      const [aboutContent, testimonialsData] = await Promise.all([
        getPageContent('about'),
        getTestimonials()
      ])

      setPageContent(aboutContent)
      setTestimonials(testimonialsData)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load page content')
      console.error('Page content loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
            onClick={loadPageContent}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20">
      <section className="bg-primary-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 font-raleway">
            {pageContent.title}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {pageContent.subtitle}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary-500 font-raleway">Our Mission</h2>
              <div className="text-gray-600 mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: pageContent.mission }}></div>
              <div className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: pageContent.missionDetails }}></div>
            </div>
            <div>
              <img
                src="/img/AboutUs.jpg"
                alt="Our Mission"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-primary-500 font-raleway">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pageContent.values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="text-primary-500 text-3xl mb-4">
                  <i className={value.icon}></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-primary-500 font-raleway">Our Journey</h2>
            <div className="text-gray-600 mb-12 leading-relaxed text-center" dangerouslySetInnerHTML={{ __html: pageContent.journey }}></div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-primary-500 font-raleway">Our Impact</h2>
          <div className="text-gray-600 mb-12 leading-relaxed text-center max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: pageContent.impact }}></div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-primary-500 font-raleway">What People Say</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="bg-white p-6 rounded-lg shadow-md"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">{testimonial.quote}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-primary-500 font-raleway">Meet Our Founder</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img
                src={pageContent.founder.image}
                alt={pageContent.founder.name}
                className="w-48 h-48 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold mb-4">{pageContent.founder.name}</h3>
                <div className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: pageContent.founder.bio }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About