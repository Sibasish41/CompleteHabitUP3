import axios from 'axios';
import { API_BASE_URL } from '../config';

const feedbackService = {
  // Submit new feedback
  submitFeedback: async (feedbackData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/feedback`,
        feedbackData,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's feedback history
  getUserFeedback: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/feedback/user`,
        {
          params: { page, limit },
          withCredentials: true
        }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get specific feedback by ID
  getFeedbackById: async (feedbackId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/feedback/${feedbackId}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Get all feedback with filters
  getAllFeedback: async (filters) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/feedback`,
        {
          params: filters,
          withCredentials: true
        }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Update feedback status
  updateFeedbackStatus: async (feedbackId, statusData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/feedback/${feedbackId}/status`,
        statusData,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Get feedback analytics
  getFeedbackAnalytics: async (dateRange) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/feedback/analytics`,
        {
          params: dateRange,
          withCredentials: true
        }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Delete feedback
  deleteFeedback: async (feedbackId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/feedback/${feedbackId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default feedbackService;
