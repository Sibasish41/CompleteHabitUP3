import axios from 'axios';

const API_BASE_URL = '/api/admin';

export const getAdminDashboardStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/stats`, { withCredentials: true });
  return response.data.data;
};

export const getRecentActivity = async () => {
  const response = await axios.get(`${API_BASE_URL}/recent-activity`, { withCredentials: true });
  return response.data.data;
};

export const getSystemHealth = async () => {
  const response = await axios.get(`${API_BASE_URL}/system-health`, { withCredentials: true });
  return response.data.data;
};

export const getAdminMetrics = async () => {
  const response = await axios.get(`${API_BASE_URL}/metrics`, { withCredentials: true });
  return response.data.data;
};
