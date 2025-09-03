import axios from 'axios';

const API_BASE_URL = '/api/content';

export const getLearningVideos = async () => {
  const response = await axios.get(`${API_BASE_URL}/videos`, { withCredentials: true });
  return response.data.data;
};

export const getVideoById = async (videoId) => {
  const response = await axios.get(`${API_BASE_URL}/videos/${videoId}`, { withCredentials: true });
  return response.data.data;
};

export const getRecommendedContent = async () => {
  const response = await axios.get(`${API_BASE_URL}/recommended`, { withCredentials: true });
  return response.data.data;
};
