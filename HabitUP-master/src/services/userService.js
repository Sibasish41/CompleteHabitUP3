import axios from 'axios';

const API_BASE_URL = '/api/user';

export const getUserProfile = async () => {
  const response = await axios.get(`${API_BASE_URL}/profile`, { withCredentials: true });
  return response.data.data;
};

