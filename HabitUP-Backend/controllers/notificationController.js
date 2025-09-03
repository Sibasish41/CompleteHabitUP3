const { Notification, User } = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

class NotificationController {
  // Get user's notifications with pagination and filters
  async getUserNotifications(req, res, next) {
    try {
      const userId = req.user.userId;
      const {
        page = 1,
        limit = 20,
        type,
        isRead,
        startDate,
        endDate
      } = req.query;

      const whereClause = { userId };

      if (type) whereClause.type = type;
      if (isRead !== undefined) whereClause.isRead = isRead === 'true';
      if (startDate && endDate) {
        whereClause.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      const { count, rows: notifications } = await Notification.findAndCountAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      });

      res.json({
        success: true,
        data: {
          notifications,
          pagination: {
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / parseInt(limit))
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Mark notifications as read
  async markAsRead(req, res, next) {
    try {
      const userId = req.user.userId;
      const { notificationIds } = req.body;

      if (!Array.isArray(notificationIds)) {
        return next(new ApiError('Invalid notification IDs format', 400));
      }

      await Notification.update(
        { isRead: true },
        {
          where: {
            id: { [Op.in]: notificationIds },
            userId
          }
        }
      );

      res.json({
        success: true,
        message: 'Notifications marked as read'
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete notifications
  async deleteNotifications(req, res, next) {
    try {
      const userId = req.user.userId;
      const { notificationIds } = req.body;

      if (!Array.isArray(notificationIds)) {
        return next(new ApiError('Invalid notification IDs format', 400));
      }

      await Notification.destroy({
        where: {
          id: { [Op.in]: notificationIds },
          userId
        }
      });

      res.json({
        success: true,
        message: 'Notifications deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Create notification (internal use)
  async createNotification(userId, type, title, message, options = {}) {
    try {
      const notification = await Notification.create({
        userId,
        type,
        title,
        message,
        metadata: options.metadata || {},
        isActionRequired: options.isActionRequired || false,
        actionUrl: options.actionUrl,
        expiresAt: options.expiresAt
      });

      // Emit socket event if socket handler is available
      if (global.io) {
        global.io.to(`user:${userId}`).emit('notification:new', notification);
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Get unread count
  async getUnreadCount(req, res, next) {
    try {
      const userId = req.user.userId;

      const count = await Notification.count({
        where: {
          userId,
          isRead: false
        }
      });

      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      next(error);
    }
  }

  // Clear expired notifications (cron job)
  async clearExpiredNotifications() {
    try {
      const result = await Notification.destroy({
        where: {
          expiresAt: {
            [Op.lt]: new Date()
          }
        }
      });

      console.log(`Cleared ${result} expired notifications`);
      return result;
    } catch (error) {
      console.error('Error clearing expired notifications:', error);
      throw error;
    }
  }
}

module.exports = new NotificationController();
