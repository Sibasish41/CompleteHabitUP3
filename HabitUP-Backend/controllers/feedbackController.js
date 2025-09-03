const { Feedback, User } = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

class FeedbackController {
  // Submit feedback
  async submitFeedback(req, res, next) {
    try {
      const {
        feedbackType,
        targetId,
        targetType,
        subject,
        message,
        rating,
        isAnonymous = false,
        tags,
        metadata
      } = req.body;

      const userId = req.user.userId;

      const feedback = await Feedback.create({
        userId,
        feedbackType,
        targetId,
        targetType,
        subject,
        message,
        rating,
        isAnonymous,
        tags,
        metadata,
        status: 'PENDING'
      });

      res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully',
        data: feedback
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user's feedback history
  async getUserFeedback(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.user.userId;

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { count, rows: feedback } = await Feedback.findAndCountAll({
        where: { userId },
        include: [{
          model: User,
          attributes: ['name', 'email'],
          where: { userId }
        }],
        limit: parseInt(limit),
        offset,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          feedback,
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

  // Get feedback by ID
  async getFeedbackById(req, res, next) {
    try {
      const { feedbackId } = req.params;
      const userId = req.user.userId;

      const feedback = await Feedback.findOne({
        where: {
          id: feedbackId,
          [Op.or]: [
            { userId },
            { '$User.role$': 'ADMIN' }
          ]
        },
        include: [{
          model: User,
          attributes: ['name', 'email', 'role']
        }]
      });

      if (!feedback) {
        return next(new ApiError('Feedback not found', 404));
      }

      res.json({
        success: true,
        data: feedback
      });
    } catch (error) {
      next(error);
    }
  }

  // Update feedback status (Admin only)
  async updateFeedbackStatus(req, res, next) {
    try {
      const { feedbackId } = req.params;
      const { status, adminResponse } = req.body;

      const feedback = await Feedback.findByPk(feedbackId);

      if (!feedback) {
        return next(new ApiError('Feedback not found', 404));
      }

      await feedback.update({
        status,
        adminResponse,
        respondedAt: new Date(),
        respondedBy: req.user.userId
      });

      // If feedback is resolved, notify the user
      if (status === 'RESOLVED' && !feedback.isAnonymous) {
        // Add notification logic here
      }

      res.json({
        success: true,
        message: 'Feedback status updated successfully',
        data: feedback
      });
    } catch (error) {
      next(error);
    }
  }

  // Get feedback analytics (Admin only)
  async getFeedbackAnalytics(req, res, next) {
    try {
      const { startDate, endDate } = req.query;

      const whereClause = {};
      if (startDate && endDate) {
        whereClause.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      // Get feedback counts by type and status
      const typeStats = await Feedback.findAll({
        where: whereClause,
        attributes: [
          'feedbackType',
          'status',
          [Feedback.sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['feedbackType', 'status']
      });

      // Get average ratings
      const avgRatings = await Feedback.findAll({
        where: { ...whereClause, rating: { [Op.not]: null } },
        attributes: [
          'targetType',
          [Feedback.sequelize.fn('AVG', Feedback.sequelize.col('rating')), 'avgRating'],
          [Feedback.sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['targetType']
      });

      // Get response time metrics
      const responseTimes = await Feedback.findAll({
        where: {
          ...whereClause,
          status: 'RESOLVED',
          respondedAt: { [Op.not]: null }
        },
        attributes: [
          [
            Feedback.sequelize.fn(
              'AVG',
              Feedback.sequelize.fn(
                'EXTRACT',
                'EPOCH',
                Feedback.sequelize.fn(
                  'AGE',
                  Feedback.sequelize.col('respondedAt'),
                  Feedback.sequelize.col('createdAt')
                )
              )
            ),
            'avgResponseTime'
          ]
        ]
      });

      res.json({
        success: true,
        data: {
          typeStats,
          avgRatings,
          responseTimes: responseTimes[0]
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all feedback with filters (Admin only)
  async getAllFeedback(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        type,
        startDate,
        endDate,
        search
      } = req.query;

      const whereClause = {};

      if (status) whereClause.status = status;
      if (type) whereClause.feedbackType = type;

      if (startDate && endDate) {
        whereClause.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      if (search) {
        whereClause[Op.or] = [
          { subject: { [Op.iLike]: `%${search}%` } },
          { message: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows: feedback } = await Feedback.findAndCountAll({
        where: whereClause,
        include: [{
          model: User,
          attributes: ['name', 'email']
        }],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          feedback,
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

  // Delete feedback (Admin only)
  async deleteFeedback(req, res, next) {
    try {
      const { feedbackId } = req.params;

      const feedback = await Feedback.findByPk(feedbackId);
      if (!feedback) {
        return next(new ApiError('Feedback not found', 404));
      }

      await feedback.destroy();

      res.json({
        success: true,
        message: 'Feedback deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FeedbackController();
