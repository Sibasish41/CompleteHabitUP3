import axios from 'axios';

const API_BASE_URL = '/api/doctor';

export const getDoctorDashboard = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard`, { withCredentials: true });
  return response.data.data;
};

export const getDoctorPatients = async () => {
  const response = await axios.get(`${API_BASE_URL}/patients`, { withCredentials: true });
  return response.data.data;
};

export const updateDoctorProfile = async (profileData) => {
  const response = await axios.put(`${API_BASE_URL}/profile`, profileData, { withCredentials: true });
  return response.data.data;
};

export const getPatientDetails = async (patientId) => {
  const response = await axios.get(`${API_BASE_URL}/patients/${patientId}`, { withCredentials: true });
  return response.data.data;
};

export const updatePatientStatus = async (patientId, status) => {
  const response = await axios.put(`${API_BASE_URL}/patients/${patientId}/status`, { status }, { withCredentials: true });
  return response.data.data;
};
