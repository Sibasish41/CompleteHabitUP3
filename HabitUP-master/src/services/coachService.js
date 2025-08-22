import axios from 'axios';

const API_BASE_URL = '/api/coach';

export const submitCoachApplication = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/apply`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const uploadDocument = async (file, type) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await axios.post(`${API_BASE_URL}/upload-document`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getApplicationStatus = async () => {
  const response = await axios.get(`${API_BASE_URL}/application-status`, { withCredentials: true });
  return response.data.data;
};
