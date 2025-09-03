const { Subscription, SubscriptionPlan, User, Payment, ApiError } = require('../models');

// Helper function to calculate plan details
const calculatePlanDetails = async (planType, duration) => {
  const baseRates = {
    BASIC: 99,
    PREMIUM: 199,
    PROFESSIONAL: 399
  };
  const features = {
    BASIC: ['Habit Tracking', 'Basic Analytics', 'Email Support'],
    PREMIUM: ['All Basic Features', 'Advanced Analytics', 'Priority Support', 'Doctor Consultation'],
    PROFESSIONAL: ['All Premium Features', 'Personal Coach', '24/7 Support', 'Custom Programs']
  };

  const durationMultiplier = {
    1: 1,    // Monthly
    3: 2.7,  // Quarterly (10% discount)
    6: 5.1,  // Half-yearly (15% discount)
    12: 9.6  // Yearly (20% discount)
  };
  const baseAmount = baseRates[planType];
  const amount = Math.round(baseAmount * durationMultiplier[duration]);

  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + duration);
  return {
    amount,
    endDate,
    features: features[planType]
  };
};

// Helper function to calculate refund amount
const calculateRefundAmount = async (subscription) => {
  const now = new Date();
  const usedDays = Math.floor((now - subscription.startDate) / (1000 * 60 * 60 * 24));
  const totalDays = Math.floor((subscription.endDate - subscription.startDate) / (1000 * 60 * 60 * 24));

  if (usedDays <= 7) {
    // Full refund within 7 days
    return subscription.amount;
  } else {
    // Prorated refund after 7 days
    const remainingDays = totalDays - usedDays;
    if (remainingDays <= 0) return 0;

    const refundAmount = Math.round((remainingDays / totalDays) * subscription.amount);
    return Math.max(0, refundAmount);
  }
};

const handleSubscriptionWebhook = async (req, res) => {
  try {
    if (payment.status === 'captured') {
      await subscription.update({
        status: 'ACTIVE',
        paymentId: payment.id,
        lastPaymentDate: new Date()
      });

      // Create payment record
      await Payment.create({
        userId: subscription.userId,
        amount: payment.amount / 100, // Convert from paise to rupees
        status: 'SUCCESS',
        paymentId: payment.id,
        orderId: payment.order_id,
        subscriptionId: subscription.id
      });

      // Update user subscription status
      await User.update(
        { subscriptionStatus: 'ACTIVE' },
        { where: { userId: subscription.userId } }
      );
    } else if (payment.status === 'failed') {
      await subscription.update({ status: 'FAILED' });

      await Payment.create({
        userId: subscription.userId,
        amount: payment.amount / 100,
        status: 'FAILED',
        paymentId: payment.id,
        orderId: payment.order_id,
        subscriptionId: subscription.id,
        failureReason: payment.error_description
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error processing webhook',
        error: error.message
      });
    }
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user.userId;

    const subscription = await Subscription.findOne({
      where: { id: subscriptionId, userId, status: 'ACTIVE' }
    });

    if (!subscription) {
      throw new ApiError('Active subscription not found', 404);
    }

    // Calculate refund if applicable
    const refundAmount = await calculateRefundAmount(subscription);

    // Process refund if amount > 0
    if (refundAmount > 0) {
      const refund = await razorpayService.createRefund(
        subscription.paymentId,
        refundAmount
      );

      await Payment.create({
        userId,
        amount: refundAmount,
        status: 'REFUNDED',
        paymentId: refund.id,
        subscriptionId: subscription.id,
        type: 'REFUND'
      });
    }

    // Update subscription status
    await subscription.update({
      status: 'CANCELLED',
      cancelledAt: new Date(),
      refundAmount
    });

    // Update user subscription status
    await User.update(
      { subscriptionStatus: 'CANCELLED' },
      { where: { userId } }
    );

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: {
        subscription,
        refundAmount
      }
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error cancelling subscription',
        error: error.message
      });
    }
  }
};

const getSubscriptionPlans = async (req, res) => {
  try {
    // Assuming you have a SubscriptionPlan model
    const plans = await SubscriptionPlan.findAll({
      order: [['amount', 'ASC']] // Assuming the plan model has an 'amount' or 'price' field
    });

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription plans'
    });
  }
};

const deleteSubscriptionPlan = async (req, res) => {
  try {
    // ... implementation for deleting a plan
    res.json({
      success: true,
      message: 'Subscription plan deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting subscription plan',
      error: error.message
    });
  }
};

const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByPk(id, {
      include: [{
        model: User,
        attributes: ['userId', 'username', 'email', 'firstName', 'lastName']
      }]
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription',
      error: error.message
    });
  }
};

const adminCancelSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    await subscription.update({
      status: 'cancelled',
      cancellationReason: reason || 'Admin cancellation',
      cancelledAt: new Date()
    });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: subscription
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling subscription',
      error: error.message
    });
  }
};

const extendSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { extensionDays } = req.body;

    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    const newEndDate = new Date(subscription.endDate);
    newEndDate.setDate(newEndDate.getDate() + parseInt(extensionDays));

    await subscription.update({
      endDate: newEndDate,
      extendedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Subscription extended successfully',
      data: subscription
    });
  } catch (error) {
    console.error('Error extending subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error extending subscription',
      error: error.message
    });
  }
};

const getExpiredSubscriptions = async (req, res) => {
  try {
    const expiredSubscriptions = await Subscription.findAll({
      where: {
        endDate: {
          [Op.lt]: new Date()
        },
        status: ['ACTIVE', 'PAST_DUE'] // Assuming these are the status strings
      },
      include: [{
        model: User,
        attributes: ['userId', 'name', 'email']
      }],
      order: [['endDate', 'DESC']]
    });

    res.json({
      success: true,
      data: expiredSubscriptions
    });
  } catch (error) {
    console.error('Error fetching expired subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expired subscriptions',
      error: error.message
    });
  }
};

const bulkCancelSubscriptions = async (req, res) => {
  try {
    const { subscriptionIds, reason } = req.body;
    
    await Subscription.update(
      {
        status: 'cancelled',
        cancellationReason: reason || 'Bulk cancellation',
        cancelledAt: new Date()
      },
      {
        where: {
          subscriptionId: {
            [Op.in]: subscriptionIds
          }
        }
      }
    );

    res.json({
      success: true,
      message: `${subscriptionIds.length} subscriptions cancelled successfully`
    });
  } catch (error) {
    console.error('Error bulk cancelling subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling subscriptions',
      error: error.message
    });
  }
};

const bulkExtendSubscriptions = async (req, res) => {
  try {
    const { subscriptionIds, extensionDays } = req.body;
    
    const subscriptions = await Subscription.findAll({
      where: {
        subscriptionId: {
          [Op.in]: subscriptionIds
        }
      }
    });

    for (const subscription of subscriptions) {
      const newEndDate = new Date(subscription.endDate);
      newEndDate.setDate(newEndDate.getDate() + parseInt(extensionDays));
      
      await subscription.update({
        endDate: newEndDate,
        extendedAt: new Date()
      });
    }

    res.json({
      success: true,
      message: `${subscriptionIds.length} subscriptions extended successfully`
    });
  } catch (error) {
    console.error('Error bulk extending subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Error extending subscriptions',
      error: error.message
    });
  }
};

module.exports = {
  // Make sure to export all functions you want to use in your routes
  bulkExtendSubscriptions,
  bulkCancelSubscriptions,
  getExpiredSubscriptions,
  getSubscriptionById,
  extendSubscription,
  adminCancelSubscription,
  deleteSubscriptionPlan,
  cancelSubscription,
  handleSubscriptionWebhook,
  getSubscriptionPlans
  // getAllSubscriptions,
  // getUserSubscriptions,
  // getCurrentSubscription,
  // createSubscription,
  // updateSubscription,
  // cancelSubscription,
  // activateSubscription,
  // getSubscriptionAnalytics,
  // handleSubscriptionWebhook,
  // getSubscriptionPlans,
  // getSubscriptionPlanById,
  // getUserSubscription,
  // subscribeUser,
  // getSubscriptionHistory,
  // checkSubscriptionStatus,
  // renewSubscription,
  // changeSubscription,
  // getSubscriptionsByStatus,
  // createSubscriptionPlan,
  // updateSubscriptionPlan,
  // deleteSubscriptionPlan,
  // getSubscriptionById,
  // adminCancelSubscription,
  // extendSubscription,
  // getExpiredSubscriptions,
  // bulkCancelSubscriptions,
  // bulkExtendSubscriptions
};
