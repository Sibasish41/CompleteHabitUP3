import axios from 'axios';

const API_BASE_URL = '/api/content-management';

export const getPageContent = async (pageName) => {
  const response = await axios.get(`${API_BASE_URL}/pages/${pageName}`, { withCredentials: true });
  return response.data.data;
};

export const getTeamMembers = async () => {
  const response = await axios.get(`${API_BASE_URL}/team`, { withCredentials: true });
  return response.data.data;
};

export const getTestimonials = async () => {
  const response = await axios.get(`${API_BASE_URL}/testimonials`, { withCredentials: true });
  return response.data.data;
};
