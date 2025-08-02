import { createSlice } from '@reduxjs/toolkit'

const generateDemoHabits = () => [
  {
    id: 1,
    name: 'Morning Exercise',
    description: 'Daily 30-minute workout routine',
    category: 'Health & Fitness',
    frequency: 'daily',
    targetCount: 1,
    difficulty: 'medium',
    icon: 'fas fa-dumbbell',
    color: '#10B981',
    isTemplate: true,
    createdBy: 'system',
    users: 234,
    completionRate: 78.5,
    createdAt: '2024-01-01',
    updatedAt: '2024-07-15'
  },
  {
    id: 2,
    name: 'Read for 30 minutes',
    description: 'Daily reading habit to improve knowledge',
    category: 'Education',
    frequency: 'daily',
    targetCount: 30,
    difficulty: 'easy',
    icon: 'fas fa-book',
    color: '#3B82F6',
    isTemplate: true,
    createdBy: 'system',
    users: 189,
    completionRate: 85.2,
    createdAt: '2024-01-01',
    updatedAt: '2024-06-20'
  },
  {
    id: 3,
    name: 'Drink 8 glasses of water',
    description: 'Stay hydrated throughout the day',
    category: 'Health & Fitness',
    frequency: 'daily',
    targetCount: 8,
    difficulty: 'easy',
    icon: 'fas fa-tint',
    color: '#06B6D4',
    isTemplate: true,
    createdBy: 'system',
    users: 456,
    completionRate: 92.1,
    createdAt: '2024-01-01',
    updatedAt: '2024-07-01'
  },
  {
    id: 4,
    name: 'Meditation',
    description: '10-minute daily mindfulness practice',
    category: 'Mental Health',
    frequency: 'daily',
    targetCount: 10,
    difficulty: 'medium',
    icon: 'fas fa-leaf',
    color: '#8B5CF6',
    isTemplate: true,
    createdBy: 'system',
    users: 167,
    completionRate: 73.8,
    createdAt: '2024-01-01',
    updatedAt: '2024-07-10'
  },
  {
    id: 5,
    name: 'Weekly Meal Prep',
    description: 'Prepare healthy meals for the week',
    category: 'Nutrition',
    frequency: 'weekly',
    targetCount: 1,
    difficulty: 'hard',
    icon: 'fas fa-utensils',
    color: '#F59E0B',
    isTemplate: true,
    createdBy: 'system',
    users: 89,
    completionRate: 65.4,
    createdAt: '2024-01-01',
    updatedAt: '2024-06-30'
  }
]

const generateDemoCategories = () => [
  { id: 1, name: 'Health & Fitness', icon: 'fas fa-heartbeat', color: '#10B981', habitCount: 145 },
  { id: 2, name: 'Education', icon: 'fas fa-graduation-cap', color: '#3B82F6', habitCount: 89 },
  { id: 3, name: 'Mental Health', icon: 'fas fa-brain', color: '#8B5CF6', habitCount: 67 },
  { id: 4, name: 'Nutrition', icon: 'fas fa-apple-alt', color: '#F59E0B', habitCount: 78 },
  { id: 5, name: 'Productivity', icon: 'fas fa-tasks', color: '#EF4444', habitCount: 123 },
  { id: 6, name: 'Social', icon: 'fas fa-users', color: '#EC4899', habitCount: 45 }
]

const generateUserProgress = () => [
  {
    id: 1,
    userId: 1,
    habitId: 1,
    habitName: 'Morning Exercise',
    currentStreak: 15,
    longestStreak: 23,
    completionRate: 85.7,
    lastCompleted: '2024-07-27',
    totalCompletions: 45,
    status: 'active'
  },
  {
    id: 2,
    userId: 1,
    habitId: 2,
    habitName: 'Read for 30 minutes',
    currentStreak: 8,
    longestStreak: 12,
    completionRate: 72.3,
    lastCompleted: '2024-07-26',
    totalCompletions: 34,
    status: 'active'
  },
  {
    id: 3,
    userId: 2,
    habitId: 3,
    habitName: 'Drink 8 glasses of water',
    currentStreak: 22,
    longestStreak: 22,
    completionRate: 95.2,
    lastCompleted: '2024-07-27',
    totalCompletions: 67,
    status: 'active'
  }
]

const initialState = {
  habits: generateDemoHabits(),
  categories: generateDemoCategories(),
  userProgress: generateUserProgress(),
  loading: false,
  error: null,
  selectedHabit: null,
  selectedCategory: null,
  isEditHabitModalOpen: false,
  isDeleteHabitModalOpen: false,
  isEditCategoryModalOpen: false,
  isDeleteCategoryModalOpen: false,
  searchQuery: '',
  filterCategory: 'all',
  filterDifficulty: 'all',
  currentPage: 1,
  habitsPerPage: 10
}

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    // Habit management
    addHabit: (state, action) => {
      const newHabit = {
        id: Date.now(),
        ...action.payload,
        users: 0,
        completionRate: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }
      state.habits.push(newHabit)
    },
    updateHabit: (state, action) => {
      const index = state.habits.findIndex(habit => habit.id === action.payload.id)
      if (index !== -1) {
        state.habits[index] = {
          ...state.habits[index],
          ...action.payload,
          updatedAt: new Date().toISOString().split('T')[0]
        }
      }
    },
    deleteHabit: (state, action) => {
      state.habits = state.habits.filter(habit => habit.id !== action.payload)
    },
    setSelectedHabit: (state, action) => {
      state.selectedHabit = action.payload
    },
    setEditHabitModalOpen: (state, action) => {
      state.isEditHabitModalOpen = action.payload
    },
    setDeleteHabitModalOpen: (state, action) => {
      state.isDeleteHabitModalOpen = action.payload
    },
    // Category management
    addCategory: (state, action) => {
      const newCategory = {
        id: Date.now(),
        ...action.payload,
        habitCount: 0
      }
      state.categories.push(newCategory)
    },
    updateCategory: (state, action) => {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id)
      if (index !== -1) {
        state.categories[index] = { ...state.categories[index], ...action.payload }
      }
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload)
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
    },
    setEditCategoryModalOpen: (state, action) => {
      state.isEditCategoryModalOpen = action.payload
    },
    setDeleteCategoryModalOpen: (state, action) => {
      state.isDeleteCategoryModalOpen = action.payload
    },
    // Filters and search
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
      state.currentPage = 1
    },
    setFilterCategory: (state, action) => {
      state.filterCategory = action.payload
      state.currentPage = 1
    },
    setFilterDifficulty: (state, action) => {
      state.filterDifficulty = action.payload
      state.currentPage = 1
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    // User progress
    updateUserProgress: (state, action) => {
      const index = state.userProgress.findIndex(progress => progress.id === action.payload.id)
      if (index !== -1) {
        state.userProgress[index] = { ...state.userProgress[index], ...action.payload }
      }
    }
  }
})

export const {
  setLoading,
  setError,
  addHabit,
  updateHabit,
  deleteHabit,
  setSelectedHabit,
  setEditHabitModalOpen,
  setDeleteHabitModalOpen,
  addCategory,
  updateCategory,
  deleteCategory,
  setSelectedCategory,
  setEditCategoryModalOpen,
  setDeleteCategoryModalOpen,
  setSearchQuery,
  setFilterCategory,
  setFilterDifficulty,
  setCurrentPage,
  updateUserProgress
} = habitsSlice.actions

export default habitsSlice.reducer