import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'

const About = () => {
  const navigate = useNavigate()
  
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  }, [])

  return (
    <div className="pt-20">
      <section className="bg-primary-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 font-raleway">
            About HabitUP
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Transforming lives through the power of consistent habits and ancient wisdom
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary-500 font-raleway">Our Mission</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                The heart of our mission is the belief that the mind holds extraordinary power to transform
                lives. We tap into the immense potential of hypnosis and affirmations to help individuals build
                meaningful habits, overcome inner blocks, and unlock lasting change.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By gently reprogramming the subconscious, we make personal growth not only possible but practical.
                Our approach combines modern psychology with ancient wisdom to create a holistic transformation experience.
              </p>
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

      <section className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-raleway">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of individuals who have already started their transformation journey with HabitUP
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-accent-400 text-primary-500 font-bold py-4 px-8 rounded-full transition-all duration-300 hover:bg-accent-500 hover:shadow-lg hover:scale-105"
          >
            Start Your Journey Today
          </button>
        </div>
      </section>
    </div>
  )
}

export default About