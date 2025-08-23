import axios from 'axios';
import { API_BASE_URL } from '../config';

const systemSettingsService = {
  // Get public settings
  getPublicSettings: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/settings/public`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Get all settings
  getAllSettings: async (filters) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/settings`,
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

  // Admin: Update settings
  updateSettings: async (settings) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/settings`,
        { settings },
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Create new setting
  createSetting: async (settingData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/settings`,
        settingData,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Delete setting
  deleteSetting: async (settingKey) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/settings/${settingKey}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get settings by category
  getSettingsByCategory: async (category) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/settings/category/${category}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Helper: Cache management
  clearSettingsCache: async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/settings/clear-cache`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default systemSettingsService;
