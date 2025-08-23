import axios from 'axios';
import { API_BASE_URL } from '../config';

class PaymentService {
  async createPaymentSession(options) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payments/create-session`,
        options,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async verifyPayment(provider, paymentId, signature) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payments/verify`,
        {
          provider,
          paymentId,
          signature
        },
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getPaymentHistory(filters = {}) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/payments/history`,
        {
          params: filters,
          withCredentials: true
        }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getPaymentDetails(paymentId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/payments/${paymentId}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async initiateRefund(paymentId, reason) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payments/${paymentId}/refund`,
        { reason },
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getRefundStatus(refundId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/payments/refund/${refundId}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Helper method to handle Razorpay payments
  initializeRazorpay(options) {
    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.success', resolve);
      rzp.on('payment.error', reject);
      rzp.open();
    });
  }

  // Helper method to handle Stripe payments
  async handleStripeRedirect(sessionId) {
    const stripe = window.Stripe(process.env.STRIPE_PUBLIC_KEY);
    const { error } = await stripe.redirectToCheckout({
      sessionId
    });
    if (error) {
      throw new Error(error.message);
    }
  }
}

export default new PaymentService();
