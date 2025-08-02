import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Teams = () => {
  const teamsRef = useRef(null)
  const teamsInView = useInView(teamsRef, { once: true, margin: "-100px" })

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  }, [])

  const teamMembers = [
    {
      name: 'Dr. Sashi Bhusan Nayak',
      role: 'Mentor & Research Guide',
      workplace: 'Ravenshaw University',
      image: 'SashiSirTeam.png',
      description: 'Assistant Professor with expertise in behavioral psychology and habit formation research.',
      social: {
        twitter: '/sashi',
        linkedin: '#',
        instagram: '#'
      }
    },
    {
      name: 'Basudev Naik',
      role: 'Backend Developer',
      workplace: 'Wisen Technology',
      image: 'BasudevProfile.jpeg',
      description: 'Architected the robust backend systems powering HabitUP\'s analytics and personalization engine.',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#'
      }
    },
    {
      name: 'Swastik Behera',
      role: 'FullStack Developer',
      workplace: 'Deloitte USI',
      image: 'SwastikTeam.jpg',
      description: 'Crafted the intuitive interface and visual design language of HabitUP.',
      social: {
        twitter: 'https://x.com/by_swastik',
        linkedin: '#',
        github: '#'
      }
    },
    {
      name: 'Sidharth Pradhan',
      role: 'Frontend Developer',
      workplace: 'Infosys Limited',
      image: 'SidharthProfile.jpeg',
      description: 'Specialized in creating responsive and user-friendly interfaces for optimal user experience.',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#'
      }
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    }
  }

  return (
    <div className="hero-section">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-raleway"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Meet The Team
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The brilliant minds behind HabitUP - Our team of experts is committed to exceeding your expectations and ensuring your success!
          </motion.p>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamsRef} className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={teamsInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <motion.img
                      src={`/img/${member.image}`}
                      alt={member.name}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Social Links Overlay */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      {member.social.twitter && (
                        <motion.a
                          href={member.social.twitter}
                          className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-primary-500 hover:bg-accent-400 hover:text-white transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <i className="bi bi-twitter-x text-sm"></i>
                        </motion.a>
                      )}
                      {member.social.linkedin && (
                        <motion.a
                          href={member.social.linkedin}
                          className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-primary-500 hover:bg-accent-400 hover:text-white transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <i className="bi bi-linkedin text-sm"></i>
                        </motion.a>
                      )}
                      {member.social.github && (
                        <motion.a
                          href={member.social.github}
                          className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-primary-500 hover:bg-accent-400 hover:text-white transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <i className="bi bi-github text-sm"></i>
                        </motion.a>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <motion.h3
                      className="text-xl font-bold text-primary-500 mb-2 font-raleway"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      {member.name}
                    </motion.h3>
                    
                    <div className="mb-3">
                      <div className="text-accent-400 font-semibold text-sm mb-1 relative">
                        {member.role}
                        <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-accent-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                      </div>
                      <div className="text-gray-600 text-sm">
                        {member.workplace}
                      </div>
                    </div>
                    
                    <motion.p
                      className="text-gray-700 text-sm leading-relaxed flex-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                    >
                      {member.description}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold mb-4 font-raleway"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Transform Your Habits?
          </motion.h2>
          <motion.p
            className="text-lg mb-8 text-white/90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of users who have already started their transformation journey with HabitUP
          </motion.p>
          <motion.button
            className="bg-accent-400 text-primary-500 font-bold px-8 py-3 rounded-full hover:bg-accent-500 transition-colors duration-300 shadow-lg hover:shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
          </motion.button>
        </div>
      </section>
    </div>
  )
}

export default Teams