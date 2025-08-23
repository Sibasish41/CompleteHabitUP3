import axios from 'axios';
import { API_BASE_URL } from '../config';

const dailyThoughtService = {
  // Get today's thought
  getTodayThought: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/daily-thoughts/today`, {
        withCredentials: true
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get random thought
  getRandomThought: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/daily-thoughts/random`, {
        withCredentials: true
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get thoughts by category
  getThoughtsByCategory: async (category, page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/daily-thoughts/category/${category}`, {
        params: { page, limit },
        withCredentials: true
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Save favorite thought
  saveFavorite: async (thoughtId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/daily-thoughts/${thoughtId}/favorite`,
        {},
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's favorite thoughts
  getFavorites: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/daily-thoughts/favorites`, {
        params: { page, limit },
        withCredentials: true
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // For admin: Create daily thought
  createDailyThought: async (thoughtData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/daily-thoughts`,
        thoughtData,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // For admin: Update daily thought
  updateDailyThought: async (thoughtId, updates) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/daily-thoughts/${thoughtId}`,
        updates,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // For admin: Get all thoughts with filters
  getAllThoughts: async (filters) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/daily-thoughts`, {
        params: filters,
        withCredentials: true
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get categories statistics
  getCategoriesStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/daily-thoughts/categories/stats`, {
        withCredentials: true
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default dailyThoughtService;
