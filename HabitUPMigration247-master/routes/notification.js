const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authorize } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// Protect all routes
router.use(authorize);

// Get user's notifications
router.get('/', notificationController.getUserNotifications);

// Get unread count
router.get('/unread-count', notificationController.getUnreadCount);

// Mark notifications as read
router.put('/mark-read', [
  body('notificationIds').isArray().withMessage('Notification IDs must be an array'),
  handleValidationErrors
], notificationController.markAsRead);

// Delete notifications
router.delete('/', [
  body('notificationIds').isArray().withMessage('Notification IDs must be an array'),
  handleValidationErrors
], notificationController.deleteNotifications);

module.exports = router;
