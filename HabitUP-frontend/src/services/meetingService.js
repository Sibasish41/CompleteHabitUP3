import axios from 'axios';
import { API_BASE_URL } from '../config';

const meetingService = {
  // Get available time slots
  getAvailableSlots: async (doctorId, date) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/doctors/${doctorId}/availability`,
        {
          params: { date },
          withCredentials: true
        }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Schedule a meeting
  scheduleMeeting: async (doctorId, meetingData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/doctors/${doctorId}/meetings`,
        meetingData,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's upcoming meetings
  getUpcomingMeetings: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/meetings/upcoming`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get meeting details
  getMeetingDetails: async (meetingId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/meetings/${meetingId}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cancel meeting
  cancelMeeting: async (meetingId, reason) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/meetings/${meetingId}/cancel`,
        { reason },
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Join meeting
  joinMeeting: async (meetingId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/meetings/${meetingId}/join`,
        {},
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // End meeting
  endMeeting: async (meetingId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/meetings/${meetingId}/end`,
        {},
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Submit meeting feedback
  submitFeedback: async (meetingId, feedback) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/meetings/${meetingId}/feedback`,
        feedback,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get meeting history
  getMeetingHistory: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/meetings/history`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default meetingService;
