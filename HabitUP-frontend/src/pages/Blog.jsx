import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getBlogPosts, getDailyThought, getBlogCategories } from '../services/blogService'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Blog = () => {
  const [dailyThought, setDailyThought] = useState(null)
  const [blogPosts, setBlogPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    })
    
    loadBlogData()
  }, [])

  const loadBlogData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch blog data in parallel
      const [thoughtData, postsData, categoriesData] = await Promise.all([
        getDailyThought(),
        getBlogPosts(1, 6),
        getBlogCategories()
      ])

      setDailyThought(thoughtData)
      setBlogPosts(postsData.posts)
      setCategories(categoriesData)
      setHasMore(postsData.hasMore)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load blog content')
      console.error('Blog content loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadMorePosts = async () => {
    try {
      const nextPage = currentPage + 1
      const postsData = await getBlogPosts(nextPage, 6)
      setBlogPosts(prev => [...prev, ...postsData.posts])
      setCurrentPage(nextPage)
      setHasMore(postsData.hasMore)
    } catch (err) {
      console.error('Error loading more posts:', err)
    }
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog content...</p>
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
            onClick={loadBlogData}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Daily Thought Section */}
        {dailyThought && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl p-8 mb-16"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-semibold mb-4">Daily Thought</h2>
              <p className="text-xl italic mb-4">{dailyThought.content}</p>
              <p className="text-sm opacity-80">- {dailyThought.author}</p>
            </div>
          </motion.div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Categories</h2>
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className="px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-primary-500"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative pb-[56.25%]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {post.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <i className="far fa-clock"></i>
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Read More
                    <i className="fas fa-arrow-right ml-2"></i>
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={loadMorePosts}
              className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Load More Posts
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog