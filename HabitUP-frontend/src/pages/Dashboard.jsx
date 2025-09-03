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
        <div className="pt-20 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Greeting Section */}
                <div className="mb-8" data-aos="fade-up">
                    <h1 className="text-3xl font-bold text-gray-900">{getGreeting()}</h1>
                    <p className="mt-2 text-gray-600">Here's your habit progress overview</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/*
                        {
                            title: 'Total Habits',
                            value: stats.totalHabits,
                            icon: '📝'
                        },
                        {
                            title: 'Current Streak',
                            value: `${stats.currentStreak} days`,
                            icon: '🔥'
                        },
                        {
                            title: 'Completion Rate',
                            value: `${Math.round(stats.completionRate)}%`,
                            icon: '📊'
                        },
                        {
                            title: 'Days Completed',
                            value: stats.daysCompleted,
                            icon: '✅'
                        }
                    */}
                    {Object.entries(stats).map(([key, value], index) => (
                        <div
                            key={key}
                            className="bg-white rounded-lg shadow p-6"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                                    <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
                                </div>
                                <span className="text-2xl">{/* Add corresponding icons here */}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Today's Habits */}
                <div className="bg-white rounded-lg shadow mb-8" data-aos="fade-up">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Habits</h2>
                        {habits.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600">No habits added yet.</p>
                                <button
                                    onClick={() => navigate('/habits/new')}
                                    className="mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                                >
                                    Create Your First Habit
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {habits.map((habit) => (
                                    <div
                                        key={habit.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <h3 className="font-medium text-gray-900">{habit.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                Streak: {habit.currentStreak} days
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => toggleHabit(habit.id)}
                                            className={`p-2 rounded-full ${
                                                habit.completedToday
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-gray-200 text-gray-600'
                                            } hover:bg-opacity-80 transition-colors`}
                                        >
                                            {habit.completedToday ? '✓' : '○'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress Chart */}
                <div className="bg-white rounded-lg shadow p-6 mb-8" data-aos="fade-up">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Progress</h2>
                    <div className="h-64">
                        {/* Add your chart component here */}
                        {/* This is where you'd integrate a chart library like Chart.js or Recharts */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard