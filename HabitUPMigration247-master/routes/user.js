const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authorize } = require('../middleware/auth');
const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// Protect all routes
router.use(authorize);

// Get current user profile
router.get('/profile', userController.getCurrentUser);

// Get user dashboard with stats and habits
router.get('/dashboard', userController.getDashboard);

// Get user statistics
router.get('/statistics', userController.getStatistics);

// Update user profile
router.put('/profile', [
  body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phoneNo').optional().isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
  body('gender').optional().isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Invalid gender'),
  body('dob').optional().isISO8601().toDate().withMessage('Invalid date of birth'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must not exceed 500 characters'),
  handleValidationErrors
], userController.updateProfile);

// Update profile photo
router.put('/profile/photo', 
  userController.constructor.getUploadMiddleware(),
  userController.updateProfilePhoto
);

// Get profile photo
router.get('/profile-photo/:email', [
  param('email').isEmail().withMessage('Invalid email format'),
  handleValidationErrors
], userController.getProfilePhoto);

// Change password
router.put('/password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/)
    .withMessage('Password must contain at least one letter and one number'),
  handleValidationErrors
], userController.changePassword);

// Delete account
router.delete('/account', [
  body('password').notEmpty().withMessage('Password is required for account deletion'),
  handleValidationErrors
], userController.deleteAccount);

module.exports = router;
