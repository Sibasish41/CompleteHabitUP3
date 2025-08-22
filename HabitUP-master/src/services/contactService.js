import axios from 'axios';

const API_BASE_URL = '/api/contact';

export const submitContactForm = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/submit`, formData, { withCredentials: true });
  return response.data;
};

export const getContactInfo = async () => {
  const response = await axios.get(`${API_BASE_URL}/info`, { withCredentials: true });
  return response.data.data;
};

export const getOfficeLocations = async () => {
  const response = await axios.get(`${API_BASE_URL}/locations`, { withCredentials: true });
  return response.data.data;
};
