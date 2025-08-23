import React, { createContext, useContext, useState, useEffect } from 'react';
import notificationService from '../services/notificationService';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    const cleanup = notificationService.addNotificationHandler(handleNewNotification);
    return cleanup;
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const { notifications: notificationsData } = await notificationService.getNotifications();
      setNotifications(notificationsData);
      updateUnreadCount();
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error updating unread count:', error);
    }
  };

  const handleNewNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    toast.info(notification.title, {
      onClick: () => {
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
      }
    });
  };

  const markAsRead = async (notificationIds) => {
    try {
      await notificationService.markAsRead(notificationIds);
      setNotifications(prev =>
        prev.map(notif =>
          notificationIds.includes(notif.id)
            ? { ...notif, isRead: true }
            : notif
        )
      );
      updateUnreadCount();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const deleteNotifications = async (notificationIds) => {
    try {
      await notificationService.deleteNotifications(notificationIds);
      setNotifications(prev =>
        prev.filter(notif => !notificationIds.includes(notif.id))
      );
      updateUnreadCount();
    } catch (error) {
      console.error('Error deleting notifications:', error);
      toast.error('Failed to delete notifications');
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    deleteNotifications,
    refreshNotifications: loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
