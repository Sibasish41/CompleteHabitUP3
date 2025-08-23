import axios from 'axios';
import { API_BASE_URL } from '../config';
import { io } from 'socket.io-client';
import { getToken } from '../utils/auth';

class NotificationService {
  constructor() {
    this.socket = null;
    this.handlers = new Set();
  }

  // Initialize socket connection
  initializeSocket() {
    if (this.socket) return;

    this.socket = io(API_BASE_URL, {
      auth: {
        token: getToken()
      }
    });

    this.socket.on('notification:new', (notification) => {
      this.handlers.forEach(handler => handler(notification));
    });
  }

  // Add notification handler
  addNotificationHandler(handler) {
    this.handlers.add(handler);
    if (!this.socket) {
      this.initializeSocket();
    }
    return () => this.handlers.delete(handler);
  }

  // Get user's notifications
  async getNotifications(params = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        params,
        withCredentials: true
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get unread count
  async getUnreadCount() {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/unread-count`, {
        withCredentials: true
      });
      return response.data.data.count;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Mark notifications as read
  async markAsRead(notificationIds) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/notifications/mark-read`,
        { notificationIds },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Delete notifications
  async deleteNotifications(notificationIds) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/notifications`,
        {
          data: { notificationIds },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Clean up socket connection
  cleanup() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.handlers.clear();
  }
}

export default new NotificationService();
