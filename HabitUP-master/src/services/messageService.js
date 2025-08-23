import axios from 'axios';
import { API_BASE_URL } from '../config';
import { io } from 'socket.io-client';
import { getToken } from '../utils/auth';

class MessageService {
  constructor() {
    this.socket = null;
    this.messageHandlers = new Map();
    this.typingHandlers = new Map();
  }

  // Initialize socket connection
  initializeSocket() {
    if (this.socket) return;

    this.socket = io(`${API_BASE_URL}/chat`, {
      auth: { token: getToken() }
    });

    this.socket.on('message:new', (message) => {
      const handlers = this.messageHandlers.get(message.conversationId) || [];
      handlers.forEach(handler => handler(message));
    });

    this.socket.on('user:typing', ({ conversationId, userId }) => {
      const handlers = this.typingHandlers.get(conversationId) || [];
      handlers.forEach(handler => handler(userId));
    });
  }

  // Subscribe to new messages in a conversation
  subscribeToConversation(conversationId, messageHandler, typingHandler) {
    if (!this.socket) {
      this.initializeSocket();
    }

    this.socket.emit('join:conversation', { conversationId });

    if (messageHandler) {
      const handlers = this.messageHandlers.get(conversationId) || [];
      this.messageHandlers.set(conversationId, [...handlers, messageHandler]);
    }

    if (typingHandler) {
      const handlers = this.typingHandlers.get(conversationId) || [];
      this.typingHandlers.set(conversationId, [...handlers, typingHandler]);
    }

    return () => {
      this.socket?.emit('leave:conversation', { conversationId });
      if (messageHandler) {
        const handlers = this.messageHandlers.get(conversationId) || [];
        this.messageHandlers.set(
          conversationId,
          handlers.filter(h => h !== messageHandler)
        );
      }
      if (typingHandler) {
        const handlers = this.typingHandlers.get(conversationId) || [];
        this.typingHandlers.set(
          conversationId,
          handlers.filter(h => h !== typingHandler)
        );
      }
    };
  }

  // Send typing indicator
  sendTypingIndicator(conversationId) {
    this.socket?.emit('user:typing', { conversationId });
  }

  // Send a message
  async sendMessage(receiverId, receiverType, messageContent, messageType = 'TEXT') {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/messages`,
        {
          receiverId,
          receiverType,
          messageContent,
          messageType
        },
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get messages for a conversation
  async getMessages(conversationId, page = 1, limit = 50) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/messages/${conversationId}`,
        {
          params: { page, limit },
          withCredentials: true
        }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get user's conversations
  async getConversations(page = 1, limit = 20) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/messages/conversations`,
        {
          params: { page, limit },
          withCredentials: true
        }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Delete a message
  async deleteMessage(messageId) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/messages/${messageId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get unread messages count
  async getUnreadCount() {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/messages/unread-count`,
        { withCredentials: true }
      );
      return response.data.data.count;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Mark conversation as read
  async markConversationAsRead(conversationId) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/messages/${conversationId}/read`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Clean up resources
  cleanup() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.messageHandlers.clear();
    this.typingHandlers.clear();
  }
}

export default new MessageService();
