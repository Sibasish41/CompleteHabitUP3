import axios from 'axios';

const API_BASE_URL = '/api/achievements';

export const getUserAchievements = async () => {
  const response = await axios.get(`${API_BASE_URL}`, { withCredentials: true });
  return response.data.data;
};

export const checkAchievement = async (achievementId) => {
  const response = await axios.get(`${API_BASE_URL}/${achievementId}/check`, { withCredentials: true });
  return response.data.data;
};
