import axios from 'axios';

const API_BASE_URL = '/api/system-settings';

export const getSystemSettings = async () => {
  const response = await axios.get(`${API_BASE_URL}`, { withCredentials: true });
  return response.data.data;
};

export const getSocialMediaLinks = async () => {
  const response = await axios.get(`${API_BASE_URL}/social-media`, { withCredentials: true });
  return response.data.data;
};

export const getQuickActions = async () => {
  const response = await axios.get(`${API_BASE_URL}/quick-actions`, { withCredentials: true });
  return response.data.data;
};
