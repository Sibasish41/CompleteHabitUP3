import axios from 'axios';

const API_BASE_URL = '/api/habit';

export const getUserHabits = async () => {
  const response = await axios.get(`${API_BASE_URL}/user-habits`, { withCredentials: true });
  return response.data.data;
};

export const toggleHabitCompletion = async (habitId) => {
  const response = await axios.post(`${API_BASE_URL}/${habitId}/toggle`, {}, { withCredentials: true });
  return response.data.data;
};

export const getHabitStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/stats`, { withCredentials: true });
  return response.data.data;
};
