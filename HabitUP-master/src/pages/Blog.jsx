import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Blog = () => {
  const [dailyQuote, setDailyQuote] = useState({
    content: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle"
  })

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    })
    
    fetchDailyQuote()
  }, [])

  const fetchDailyQuote = async () => {
    try {
      const response = await fetch('https://api.quotable.io/random?tags=motivational|success')
      const data = await response.json()
      setDailyQuote({
        content: data.content,
        author: data.author
      })
    } catch (error) {
      console.error('Error fetching quote:', error)
    }
  }

  const habitArticles = [
    {
      title: "The Science of Habit Formation",
      description: "Learn how habits are formed in the brain and how you can rewire your routines for success.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      url: "https://www.quora.com/What-is-the-science-behind-habit-formation"
    },
    {
      title: "Morning Routines of High Achievers",
      description: "Discover how successful people start their day to maximize productivity and well-being.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      url: "https://www.quora.com/What-are-the-morning-routines-of-highly-successful-people"
    },
    {
      title: "Building Healthy Eating Habits",
      description: "Transform your relationship with food through sustainable habit changes.",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      url: "https://en.wikipedia.org/wiki/Healthy_diet"
    }
  ]

  const healthNews = [
    {
      title: "New Study Shows How 8,000 Weekly Steps Improve Health",
      source: "Science Daily",
      date: "May 15, 2023",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      url: "https://www.quora.com/How-many-steps-per-day-are-optimal-for-health"
    },
    {
      title: "Meditation Reduces Stress by 40% in 8 Weeks",
      source: "MindBodyGreen",
      date: "May 10, 2023",
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      url: "https://en.wikipedia.org/wiki/Meditation"
    },
    {
      title: "The Surprising Link Between Sleep and Weight Loss",
      source: "Harvard Health",
      date: "May 5, 2023",
      image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      url: "https://www.quora.com/What-is-the-relationship-between-sleep-and-weight-loss"
    }
  ]

  const habitTips = [
    {
      title: "Start Small",
      content: "Begin with tiny habits that are easy to accomplish. Consistency with small actions builds the foundation for bigger changes.",
      icon: "bi bi-calendar-check",
      url: "https://www.quora.com/Why-is-starting-small-important-when-building-new-habits"
    },
    {
      title: "Use Triggers",
      content: "Pair your new habit with an existing routine. For example, do 5 pushups after brushing your teeth each morning.",
      icon: "bi bi-alarm",
      url: "https://en.wikipedia.org/wiki/Habit#Formation"
    },
    {
      title: "Track Progress",
      content: "Use a habit tracker to visualize your consistency. Seeing your streak will motivate you to keep going.",
      icon: "bi bi-graph-up",
      url: "https://www.quora.com/What-are-the-best-ways-to-track-habit-progress"
    }
  ]

  return (
    <div className="hero-section bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Transform Your Life Through Habits
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Small daily improvements are the key to staggering long-term results. Start building better habits today.
            </p>
            <a
              href="#transformation"
              className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Begin Your Journey
            </a>
          </motion.div>
        </div>
      </section>

      {/* Habit Transformation Section */}
      <section className="py-20 bg-white" id="transformation">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-yellow-600">
              The Power of Habit Transformation
            </h2>
            <div className="w-20 h-1 bg-purple-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover how small changes can lead to massive results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {habitArticles.map((article, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-purple-600 group-hover:text-purple-700 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {article.description}
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border-2 border-purple-600 text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-600 hover:text-white transition-colors duration-300"
                  >
                    Read More
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Motivation Section */}
      <section className="py-20 bg-gradient-to-br from-gray-100 to-blue-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl relative">
              <div className="absolute top-6 left-6 text-6xl text-purple-600/20 font-serif leading-none">
                "
              </div>
              <div className="relative z-10">
                <p className="text-2xl sm:text-3xl font-medium italic text-gray-800 mb-6 leading-relaxed">
                  "{dailyQuote.content}"
                </p>
                <p className="text-right text-purple-600 font-semibold text-lg">
                  — {dailyQuote.author}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wellness News Section */}
      <section className="py-20 bg-white" id="news">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-yellow-600">
              Latest Wellness News
            </h2>
            <div className="w-20 h-1 bg-purple-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest research in health and habit formation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {healthNews.map((news, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="h-44 overflow-hidden">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-3">
                    {news.source}
                  </span>
                  <h3 className="text-lg font-semibold mb-2 text-purple-600 group-hover:text-purple-700 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">{news.date}</p>
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors duration-300"
                  >
                    Read Article
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Habit Tips Section */}
      <section className="py-20 bg-gray-50" id="tips">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-yellow-600">
              Practical Habit Building Tips
            </h2>
            <div className="w-20 h-1 bg-purple-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Actionable strategies to help you build lasting habits
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {habitTips.map((tip, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-600"></div>
                <div className="text-4xl text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <i className={tip.icon}></i>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-purple-600">
                  {tip.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {tip.content}
                </p>
                <a
                  href={tip.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border-2 border-purple-600 text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 hover:text-white transition-colors duration-300"
                >
                  Learn More
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Blog