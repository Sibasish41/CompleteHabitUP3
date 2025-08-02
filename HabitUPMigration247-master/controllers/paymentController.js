const { Payment, Meeting, Subscription, User, sequelize } = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const { createOrder, verifyPayment, generateUPIQRData, verifyUPIPayment } = require('../utils/paymentService');
const upiService = require('../utils/upiService');
const { Op } = require('sequelize');

class PaymentController {
  // Create payment order
  async createPaymentOrder(req, res, next) {
    try {
      const { entityId, entityType, amount, description } = req.body;
      const userId = req.user.userId;

      // Validate entity exists
      let entity;
      if (entityType === 'MEETING') {
        entity = await Meeting.findByPk(entityId);
        if (!entity || entity.userId !== userId) {
          return next(new ApiError('Meeting not found or unauthorized', 404));
        }
      } else if (entityType === 'SUBSCRIPTION') {
        entity = await Subscription.findByPk(entityId);
        if (!entity || entity.userId !== userId) {
          return next(new ApiError('Subscription not found or unauthorized', 404));
        }
      }

      // Create Razorpay order
      const razorpayOrder = await createOrder(amount);

      // Create payment record
      const payment = await Payment.create({
        userId,
        entityId,
        entityType,
        amount,
        description,
        razorpayOrderId: razorpayOrder.id,
        paymentStatus: 'PENDING',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      });

      res.status(201).json({
        success: true,
        data: {
          payment,
          razorpayOrder
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Create order for UPI payment
  async createUPIPaymentOrder(req, res, next) {
    try {
      const { entityId, entityType, amount, description, upiId } = req.body;
      const userId = req.user.userId;

      // Validate entity exists
      let entity;
      if (entityType === 'MEETING') {
        entity = await Meeting.findByPk(entityId);
        if (!entity || entity.userId !== userId) {
          return next(new ApiError('Meeting not found or unauthorized', 404));
        }
      } else if (entityType === 'SUBSCRIPTION') {
        entity = await Subscription.findByPk(entityId);
        if (!entity || entity.userId !== userId) {
          return next(new ApiError('Subscription not found or unauthorized', 404));
        }
      }

      // Create payment record
      const payment = await Payment.create({
        userId,
        entityId,
        entityType,
        amount,
        description,
        paymentMethod: 'UPI_ID',
        paymentStatus: 'PENDING',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        metadata: { upiId }
      });

      res.status(201).json({
        success: true,
        data: {
          payment
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Verify payment (alias for verifyPaymentSignature)
  async verifyPayment(req, res, next) {
    return this.verifyPaymentSignature(req, res, next);
  }

  // Verify payment
  async verifyPaymentSignature(req, res, next) {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = req.body;
      const userId = req.user.userId;

      // Find payment record
      const payment = await Payment.findOne({
        where: {
          paymentId,
          userId,
          razorpayOrderId
        }
      });

      if (!payment) {
        return next(new ApiError('Payment not found', 404));
      }

      // Verify signature
      const isValid = await verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

      if (!isValid) {
        await payment.update({
          paymentStatus: 'FAILED',
          failureReason: 'Invalid signature'
        });
        return next(new ApiError('Payment verification failed', 400));
      }

      // Update payment as successful
      await payment.update({
        paymentStatus: 'COMPLETED',
        razorpayPaymentId,
        razorpaySignature,
        paidAt: new Date()
      });

      // Update related entity status
      if (payment.entityType === 'MEETING') {
        await Meeting.update(
          { paymentStatus: 'PAID' },
          { where: { meetingId: payment.entityId } }
        );
      } else if (payment.entityType === 'SUBSCRIPTION') {
        await Subscription.update(
          { status: 'ACTIVE' },
          { where: { subscriptionId: payment.entityId } }
        );
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user's payment history
  async getPaymentHistory(req, res, next) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const userId = req.user.userId;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const whereClause = { userId };
      if (status) {
        whereClause.paymentStatus = status;
      }

      const { count, rows: payments } = await Payment.findAndCountAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset
      });

      res.json({
        success: true,
        data: {
          payments,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / parseInt(limit)),
            totalPayments: count,
            limit: parseInt(limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get specific payment details
  async getPaymentDetails(req, res, next) {
    try {
      const { paymentId } = req.params;
      const userId = req.user.userId;

      const payment = await Payment.findOne({
        where: {
          paymentId,
          userId
        },
        include: [{
          model: User,
          as: 'user',
          attributes: ['userId', 'name', 'email']
        }]
      });

      if (!payment) {
        return next(new ApiError('Payment not found', 404));
      }

      res.json({
        success: true,
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  // Request refund
  async requestRefund(req, res, next) {
    try {
      const { paymentId } = req.params;
      const { refundReason } = req.body;
      const userId = req.user.userId;

      const payment = await Payment.findOne({
        where: {
          paymentId,
          userId,
          paymentStatus: 'COMPLETED'
        }
      });

      if (!payment) {
        return next(new ApiError('Payment not found or not eligible for refund', 404));
      }

      // Check if refund is allowed (within 24 hours for meetings, 7 days for subscriptions)
      const hoursLimit = payment.entityType === 'MEETING' ? 24 : 168; // 7 days = 168 hours
      const hoursSincePaid = (new Date() - new Date(payment.paidAt)) / (1000 * 60 * 60);

      if (hoursSincePaid > hoursLimit) {
        return next(new ApiError('Refund window has expired', 400));
      }

      await payment.update({
        paymentStatus: 'REFUNDED',
        refundReason,
        refundAmount: payment.amount,
        refundedAt: new Date()
      });

      res.json({
        success: true,
        message: 'Refund request submitted successfully',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin: Get all payments
  async getAllPayments(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        entityType,
        dateFrom,
        dateTo
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const whereClause = {};

      if (status) whereClause.paymentStatus = status;
      if (entityType) whereClause.entityType = entityType;

      if (dateFrom || dateTo) {
        whereClause.createdAt = {};
        if (dateFrom) whereClause.createdAt[Op.gte] = new Date(dateFrom);
        if (dateTo) whereClause.createdAt[Op.lte] = new Date(dateTo);
      }

      const { count, rows: payments } = await Payment.findAndCountAll({
        where: whereClause,
        include: [{
          model: User,
          as: 'user',
          attributes: ['userId', 'name', 'email']
        }],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset
      });

      res.json({
        success: true,
        data: {
          payments,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / parseInt(limit)),
            totalPayments: count,
            limit: parseInt(limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin: Get payment statistics
  async getPaymentStats(req, res, next) {
    try {
      const { period = '30' } = req.query; // days
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(period));

      const [
        totalRevenue,
        completedPayments,
        failedPayments,
        refundedAmount,
        revenueByType,
        dailyRevenue
      ] = await Promise.all([
        Payment.sum('amount', {
          where: {
            paymentStatus: 'COMPLETED',
            createdAt: { [Op.gte]: startDate }
          }
        }),
        Payment.count({
          where: {
            paymentStatus: 'COMPLETED',
            createdAt: { [Op.gte]: startDate }
          }
        }),
        Payment.count({
          where: {
            paymentStatus: 'FAILED',
            createdAt: { [Op.gte]: startDate }
          }
        }),
        Payment.sum('refundAmount', {
          where: {
            paymentStatus: 'REFUNDED',
            createdAt: { [Op.gte]: startDate }
          }
        }),
        Payment.findAll({
          where: {
            paymentStatus: 'COMPLETED',
            createdAt: { [Op.gte]: startDate }
          },
          attributes: [
            'entityType',
            [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
            [sequelize.fn('COUNT', sequelize.col('paymentId')), 'count']
          ],
          group: ['entityType']
        }),
        Payment.findAll({
          where: {
            paymentStatus: 'COMPLETED',
            createdAt: { [Op.gte]: startDate }
          },
          attributes: [
            [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
            [sequelize.fn('SUM', sequelize.col('amount')), 'revenue'],
            [sequelize.fn('COUNT', sequelize.col('paymentId')), 'transactions']
          ],
          group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
          order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
        })
      ]);

      res.json({
        success: true,
        data: {
          period: parseInt(period),
          totalRevenue: totalRevenue || 0,
          netRevenue: (totalRevenue || 0) - (refundedAmount || 0),
          completedPayments,
          failedPayments,
          refundedAmount: refundedAmount || 0,
          revenueByType,
          dailyRevenue,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Webhook handler for Razorpay
  async handleWebhook(req, res, next) {
    try {
      const { event, payload } = req.body;

      // Verify webhook signature (you should implement this)
      // const isValid = verifyWebhookSignature(req.headers, req.body);
      // if (!isValid) {
      //   return res.status(400).json({ error: 'Invalid signature' });
      // }

      switch (event) {
        case 'payment.captured':
          await this.handlePaymentCaptured(payload);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(payload);
          break;
        case 'refund.processed':
          await this.handleRefundProcessed(payload);
          break;
        default:
          console.log(`Unhandled webhook event: ${event}`);
      }

      res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  // Helper methods for webhook handling
  async handlePaymentCaptured(payload) {
    const payment = await Payment.findOne({
      where: { razorpayOrderId: payload.order.id }
    });

    if (payment) {
      await payment.update({
        paymentStatus: 'COMPLETED',
        razorpayPaymentId: payload.id,
        paidAt: new Date()
      });
    }
  }

  async handlePaymentFailed(payload) {
    const payment = await Payment.findOne({
      where: { razorpayOrderId: payload.order.id }
    });

    if (payment) {
      await payment.update({
        paymentStatus: 'FAILED',
        failureReason: payload.error_description
      });
    }
  }

  async handleRefundProcessed(payload) {
    const payment = await Payment.findOne({
      where: { razorpayPaymentId: payload.payment.id }
    });

    if (payment) {
      await payment.update({
        paymentStatus: 'REFUNDED',
        refundAmount: payload.amount / 100, // Convert from paise to rupees
        refundedAt: new Date()
      });
    }
  }

  // Get subscription status
  async getSubscriptionStatus(req, res, next) {
    try {
      const userId = req.user.userId;
      
      const activeSubscription = await Subscription.findOne({
        where: {
          userId,
          status: 'ACTIVE'
        },
        include: [{
          model: Payment,
          as: 'payments',
          where: { paymentStatus: 'COMPLETED' },
          order: [['createdAt', 'DESC']],
          limit: 1
        }]
      });

      res.json({
        success: true,
        data: {
          hasActiveSubscription: !!activeSubscription,
          subscription: activeSubscription
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Cancel subscription
  async cancelSubscription(req, res, next) {
    try {
      const userId = req.user.userId;
      const { reason } = req.body;
      
      const subscription = await Subscription.findOne({
        where: {
          userId,
          status: 'ACTIVE'
        }
      });

      if (!subscription) {
        return next(new ApiError('No active subscription found', 404));
      }

      await subscription.update({
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationReason: reason
      });

      res.json({
        success: true,
        message: 'Subscription cancelled successfully',
        data: subscription
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin: Process refund
  async processRefund(req, res, next) {
    try {
      const { paymentId } = req.params;
      const { refundAmount, refundReason } = req.body;
      
      const payment = await Payment.findOne({
        where: {
          paymentId,
          paymentStatus: 'COMPLETED'
        }
      });

      if (!payment) {
        return next(new ApiError('Payment not found or not eligible for refund', 404));
      }

      const refundAmountFinal = refundAmount || payment.amount;

      if (refundAmountFinal > payment.amount) {
        return next(new ApiError('Refund amount cannot exceed payment amount', 400));
      }

      // Process refund through Razorpay (implement based on your payment service)
      // const refundResult = await processRazorpayRefund(payment.razorpayPaymentId, refundAmountFinal);

      await payment.update({
        paymentStatus: 'REFUNDED',
        refundAmount: refundAmountFinal,
        refundReason,
        refundedAt: new Date()
      });

      res.json({
        success: true,
        message: 'Refund processed successfully',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin: Get user payments
  async getUserPayments(req, res, next) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10, status } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const whereClause = { userId };
      if (status) {
        whereClause.paymentStatus = status;
      }

      const { count, rows: payments } = await Payment.findAndCountAll({
        where: whereClause,
        include: [{
          model: User,
          as: 'user',
          attributes: ['userId', 'name', 'email']
        }],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset
      });

      res.json({
        success: true,
        data: {
          payments,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / parseInt(limit)),
            totalPayments: count,
            limit: parseInt(limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin: Update payment status
  async updatePaymentStatus(req, res, next) {
    try {
      const { paymentId } = req.params;
      const { status, notes } = req.body;
      
      const validStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        return next(new ApiError('Invalid payment status', 400));
      }

      const payment = await Payment.findByPk(paymentId);
      if (!payment) {
        return next(new ApiError('Payment not found', 404));
      }

      const updateData = { paymentStatus: status };
      if (notes) updateData.adminNotes = notes;
      if (status === 'COMPLETED') updateData.paidAt = new Date();
      if (status === 'REFUNDED') updateData.refundedAt = new Date();

      await payment.update(updateData);

      res.json({
        success: true,
        message: 'Payment status updated successfully',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  // Generate UPI QR Code for payment
  async generateUPIQR(req, res, next) {
    try {
      const { entityId, entityType, amount, description } = req.body;
      const userId = req.user.userId;

      // Validate entity exists
      let entity;
      if (entityType === 'MEETING') {
        entity = await Meeting.findByPk(entityId);
        if (!entity || entity.userId !== userId) {
          return next(new ApiError('Meeting not found or unauthorized', 404));
        }
      } else if (entityType === 'SUBSCRIPTION') {
        entity = await Subscription.findByPk(entityId);
        if (!entity || entity.userId !== userId) {
          return next(new ApiError('Subscription not found or unauthorized', 404));
        }
      }

      // Create payment record
      const payment = await Payment.create({
        userId,
        entityId,
        entityType,
        amount,
        description,
        paymentMethod: 'UPI_QR',
        paymentStatus: 'PENDING',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      });

      // Generate UPI QR using service
      const qrResult = await upiService.generatePaymentQR({
        amount,
        orderId: payment.paymentId,
        description
      });

      // Generate deep links
      const deepLinks = upiService.generateDeepLinks({
        amount,
        orderId: payment.paymentId,
        description
      });

      // Generate payment instructions
      const instructions = upiService.generatePaymentInstructions({
        amount,
        orderId: payment.paymentId
      });

      // Update payment with QR data
      await payment.update({
        metadata: {
          qrDataURL: qrResult.qrDataURL,
          upiURL: qrResult.upiURL,
          deepLinks,
          merchantDetails: qrResult.merchantDetails
        }
      });

      res.status(201).json({
        success: true,
        data: {
          payment,
          qr: {
            dataURL: qrResult.qrDataURL,
            upiURL: qrResult.upiURL
          },
          deepLinks,
          instructions,
          merchantDetails: qrResult.merchantDetails,
          expiresAt: payment.expiresAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Submit UPI payment proof
  async submitUPIPaymentProof(req, res, next) {
    try {
      const { paymentId } = req.params;
      const { transactionId, screenshot, utrNumber } = req.body;
      const userId = req.user.userId;

      const payment = await Payment.findOne({
        where: {
          paymentId,
          userId,
          paymentStatus: 'PENDING',
          paymentMethod: ['UPI_QR', 'UPI_ID']
        }
      });

      if (!payment) {
        return next(new ApiError('Payment not found or not eligible for proof submission', 404));
      }

      // Update payment with proof details
      const updatedMetadata = {
        ...payment.metadata,
        paymentProof: {
          transactionId,
          utrNumber,
          screenshot,
          submittedAt: new Date().toISOString(),
          requiresVerification: true
        }
      };

      await payment.update({
        paymentStatus: 'PROCESSING',
        transactionId,
        metadata: updatedMetadata
      });

      res.json({
        success: true,
        message: 'Payment proof submitted successfully. It will be verified shortly.',
        data: {
          payment,
          estimatedVerificationTime: '5-10 minutes'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin: Verify UPI payment manually
  async verifyUPIPaymentManually(req, res, next) {
    try {
      const { paymentId } = req.params;
      const { verified, notes, transactionReference } = req.body;

      const payment = await Payment.findOne({
        where: {
          paymentId,
          paymentStatus: 'PROCESSING',
          paymentMethod: ['UPI_QR', 'UPI_ID']
        }
      });

      if (!payment) {
        return next(new ApiError('Payment not found or not in processing state', 404));
      }

      const newStatus = verified ? 'COMPLETED' : 'FAILED';
      const updateData = {
        paymentStatus: newStatus,
        adminNotes: notes
      };

      if (verified) {
        updateData.paidAt = new Date();
        if (transactionReference) {
          updateData.transactionId = transactionReference;
        }

        // Update related entity status
        if (payment.entityType === 'MEETING') {
          await Meeting.update(
            { paymentStatus: 'PAID' },
            { where: { meetingId: payment.entityId } }
          );
        } else if (payment.entityType === 'SUBSCRIPTION') {
          await Subscription.update(
            { status: 'ACTIVE' },
            { where: { subscriptionId: payment.entityId } }
          );
        }
      } else {
        updateData.failureReason = notes || 'Payment verification failed';
      }

      await payment.update(updateData);

      res.json({
        success: true,
        message: `Payment ${verified ? 'verified' : 'rejected'} successfully`,
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  // Get pending UPI payments for admin verification
  async getPendingUPIPayments(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { count, rows: payments } = await Payment.findAndCountAll({
        where: {
          paymentStatus: 'PROCESSING',
          paymentMethod: ['UPI_QR', 'UPI_ID']
        },
        include: [{
          model: User,
          as: 'user',
          attributes: ['userId', 'name', 'email', 'phone']
        }],
        order: [['createdAt', 'ASC']], // Oldest first for FIFO processing
        limit: parseInt(limit),
        offset
      });

      res.json({
        success: true,
        data: {
          payments,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / parseInt(limit)),
            totalPayments: count,
            limit: parseInt(limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
