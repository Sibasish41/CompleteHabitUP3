import axios from 'axios';
import { API_BASE_URL } from '../config';

const subscriptionService = {
  // Get available subscription plans
  getPlans: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/plans`, {
        withCredentials: true
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get current active subscription
  getCurrentSubscription: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/current`, {
        withCredentials: true
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new subscription
  createSubscription: async (planData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/subscriptions`,
        planData,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId, reason) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/subscriptions/${subscriptionId}/cancel`,
        { reason },
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get subscription history
  getSubscriptionHistory: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/history`, {
        withCredentials: true
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify subscription payment
  verifyPayment: async (paymentId, orderId, signature) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/subscriptions/verify-payment`,
        {
          paymentId,
          orderId,
          signature
        },
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get subscription benefits
  getBenefits: async (planType) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/subscriptions/benefits/${planType}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default subscriptionService;
