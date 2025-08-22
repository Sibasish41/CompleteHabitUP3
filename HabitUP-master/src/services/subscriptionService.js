import axios from 'axios';

const API_BASE_URL = '/api/subscription';

export const getSubscriptionPlans = async () => {
  const response = await axios.get(`${API_BASE_URL}/plans`, { withCredentials: true });
  return response.data.data;
};

export const getCurrentSubscription = async () => {
  const response = await axios.get(`${API_BASE_URL}/current`, { withCredentials: true });
  return response.data.data;
};

export const subscribeToPlan = async (planId, billingCycle) => {
  const response = await axios.post(`${API_BASE_URL}/subscribe`, {
    planId,
    billingCycle
  }, { withCredentials: true });
  return response.data.data;
};

export const cancelSubscription = async () => {
  const response = await axios.post(`${API_BASE_URL}/cancel`, {}, { withCredentials: true });
  return response.data.data;
};
