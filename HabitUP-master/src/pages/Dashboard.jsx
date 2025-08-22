import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getUserHabits, toggleHabitCompletion, getHabitStats } from '../services/habitService'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { getUserProfile } from '../services/userService'

const Dashboard = () => {
    const { isAuthenticated, isLoading, user } = useAuth()
    const navigate = useNavigate()
    const [habits, setHabits] = useState([])
    const [profileData, setProfileData] = useState(null)
    const [profileError, setProfileError] = useState(null)
    const [stats, setStats] = useState({
        totalHabits: 0,
        currentStreak: 0,
        longestStreak: 0,
        completionRate: 0,
        daysCompleted: 0
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        })

        loadUserData()
    }, [user])

    const loadUserData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Fetch habits and stats in parallel
            const [habitsData, statsData] = await Promise.all([
                getUserHabits(),
                getHabitStats()
            ])

            setHabits(habitsData)
            setStats(statsData)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard data')
            console.error('Dashboard data loading error:', err)
        } finally {
            setLoading(false)
        }
    }

    const toggleHabit = async (habitId) => {
        try {
            await toggleHabitCompletion(habitId)
            // Refresh habits and stats after toggling
            loadUserData()
        } catch (err) {
            console.error('Error toggling habit:', err)
            // Optionally show error to user
        }
    }

    const getGreeting = () => {
        const hour = new Date().getHours()
        const name = user?.firstName || 'User'

        if (hour < 12) return `Good Morning, ${name}!`
        if (hour < 17) return `Good Afternoon, ${name}!`
        return `Good Evening, ${name}!`
    }

    if (isLoading || loading) {
        return (
            <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        navigate('/')
        return null
    }

    if (error) {
        return (
            <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-lg font-semibold mb-4">{error}</div>
                    <button
                        onClick={loadUserData}
                        className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="pt-20" style={{ backgroundColor: '#f5f7ff', minHeight: '100vh' }}>
            {/* Dashboard Header - Following HTML structure */}
            <section className="dashboard-header" style={{
                background: 'linear-gradient(135deg, #5f2eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '60px 0 40px',
                marginBottom: '30px',
                position: 'relative'
            }}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2" data-aos="fade-up">
                                {getGreeting()}
                            </h1>
                            <p className="text-xl opacity-90" data-aos="fade-up" data-aos-delay="100">
                                Track your progress and stay motivated
                            </p>
                        </div>
                        <div className="hidden md:block" data-aos="fade-left">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                                <div className="text-3xl font-bold text-accent-400">{stats.totalHabits}</div>
                                <div className="text-sm opacity-90">Active Habits</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4">
                {/* Stats Overview - Following HTML structure */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-primary-500" data-aos="fade-up" data-aos-delay="100">
                        <div className="flex items-center">
                            <div className="text-3xl text-primary-500 mr-4">
                                <i className="bi bi-activity"></i>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-primary-500">{stats.currentStreak}</div>
                                <div className="text-sm text-gray-600">Current Streak</div>
                                <div className="text-xs text-gray-500">Days in a row</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-primary-500" data-aos="fade-up" data-aos-delay="200">
                        <div className="flex items-center">
                            <div className="text-3xl text-primary-500 mr-4">
                                <i className="bi bi-trophy"></i>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-primary-500">{stats.longestStreak}</div>
                                <div className="text-sm text-gray-600">Longest Streak</div>
                                <div className="text-xs text-gray-500">Your record</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-primary-500" data-aos="fade-up" data-aos-delay="300">
                        <div className="flex items-center">
                            <div className="text-3xl text-primary-500 mr-4">
                                <i className="bi bi-check-circle"></i>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-primary-500">{stats.completionRate}%</div>
                                <div className="text-sm text-gray-600">Completion Rate</div>
                                <div className="text-xs text-gray-500">This month</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-primary-500" data-aos="fade-up" data-aos-delay="400">
                        <div className="flex items-center">
                            <div className="text-3xl text-primary-500 mr-4">
                                <i className="bi bi-calendar-check"></i>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-primary-500">{stats.daysCompleted}</div>
                                <div className="text-sm text-gray-600">Days Completed</div>
                                <div className="text-xs text-gray-500">This month</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Habits List - Following HTML structure */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2" data-aos="fade-up">
                        <div className="bg-white rounded-lg shadow-lg">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-primary-500">Your Habits</h3>
                                <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm">
                                    <i className="bi bi-plus-lg mr-1"></i> Add Habit
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {habits.map((habit) => (
                                        <div key={habit.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center mb-2">
                                                        <h4 className="font-semibold text-primary-500 mr-3">{habit.name}</h4>
                                                        <span className="bg-primary-100 text-primary-500 px-2 py-1 rounded-full text-xs font-medium">
                                                            {habit.category}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 text-sm mb-3">{habit.description}</p>

                                                    <div className="mb-3">
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-gray-600">Progress</span>
                                                            <span className="text-primary-500 font-medium">{habit.progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${habit.progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => toggleHabit(habit.id)}
                                                    className={`ml-4 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${habit.completed
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                                        }`}
                                                >
                                                    <i className={`bi ${habit.completed ? 'bi-check-lg' : 'bi-circle'}`}></i>
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center text-primary-500 font-medium">
                                                    <i className="bi bi-fire text-accent-400 mr-1"></i>
                                                    {habit.streak} day streak
                                                </div>
                                                <div className="text-gray-500">
                                                    Daily • {habit.completed ? 'Completed' : 'Pending'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Section - Following HTML structure */}
                    <div className="lg:col-span-1" data-aos="fade-up" data-aos-delay="100">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-semibold text-primary-500 mb-4">Habit Calendar</h3>
                            <div className="text-center py-8">
                                <div className="text-4xl text-gray-300 mb-4">
                                    <i className="bi bi-calendar3"></i>
                                </div>
                                <p className="text-gray-500">Calendar view coming soon!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard