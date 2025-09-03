import axios from 'axios';

const API_BASE_URL = '/api/programs';

export const getProgramsByUserType = async (userType) => {
  const response = await axios.get(`${API_BASE_URL}/by-type/${userType}`, { withCredentials: true });
  return response.data.data;
};

export const getHeroContent = async (userType) => {
  const response = await axios.get(`${API_BASE_URL}/hero-content/${userType}`, { withCredentials: true });
  return response.data.data;
};

export const getAllPrograms = async () => {
  const response = await axios.get(`${API_BASE_URL}`, { withCredentials: true });
  return response.data.data;
};
