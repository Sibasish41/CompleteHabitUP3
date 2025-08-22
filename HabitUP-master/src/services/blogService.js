import axios from 'axios';

const API_BASE_URL = '/api/blog';

export const getBlogPosts = async (page = 1, limit = 10) => {
  const response = await axios.get(`${API_BASE_URL}/posts`, {
    params: { page, limit },
    withCredentials: true
  });
  return response.data.data;
};

export const getDailyThought = async () => {
  const response = await axios.get(`${API_BASE_URL}/daily-thought`, { withCredentials: true });
  return response.data.data;
};

export const getBlogCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/categories`, { withCredentials: true });
  return response.data.data;
};

export const searchBlogPosts = async (query) => {
  const response = await axios.get(`${API_BASE_URL}/search`, {
    params: { query },
    withCredentials: true
  });
  return response.data.data;
};
