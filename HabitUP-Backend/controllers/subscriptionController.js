const { Subscription, SubscriptionPlan, User, Payment, ApiError } = require('../models');
const razorpay = require('../utils/razorpayService'); // Assuming you have a razorpay utility
const { Op } = require('sequelize');

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

const getSubscriptionPlanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plan = await SubscriptionPlan.findByPk(id);

    if (!plan) {
      return next(new ApiError('Subscription plan not found', 404));
    }

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Error fetching subscription plan by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription plan',
      error: error.message
    });
  }
};

const deleteSubscriptionPlan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const plan = await SubscriptionPlan.findByPk(id);

    if (!plan) {
      return next(new ApiError('Subscription plan not found.', 404));
    }

    // Check for active subscriptions on this plan before deleting.
    const activeSubscriptions = await Subscription.count({
      where: { planId: id, status: 'ACTIVE' }
    });

    if (activeSubscriptions > 0) {
      // It's safer to deactivate than to delete if there are active users.
      await plan.update({ isActive: false });
      return res.json({
        success: true,
        message: `Plan has ${activeSubscriptions} active subscribers and has been deactivated instead of deleted.`
      });
    }

    await plan.destroy();

    res.status(200).json({ success: true, message: 'Subscription plan deleted successfully.' });
  } catch (error) {
    next(error);
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

const adminCancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user.userId; // Assuming admin's ID is in req.user

    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      return next(new ApiError('Subscription not found', 404));
    }

    if (subscription.status === 'CANCELLED') {
      return next(new ApiError('This subscription has already been cancelled.', 400));
    }

    await subscription.update({
      status: 'CANCELLED',
      cancellationReason: reason || 'Admin cancellation',
      cancelledAt: new Date(),
      cancelledBy: 'ADMIN', // Add who cancelled it
      // You might want to log which admin did this, if your model supports it.
      // e.g., cancelledByAdminId: adminId
    });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

const extendSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { extensionDays, reason } = req.body;

    if (!extensionDays || parseInt(extensionDays) <= 0) {
      return next(new ApiError('A positive number of extension days is required.', 400));
    }

    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      return next(new ApiError('Subscription not found', 404));
    }

    // If the subscription has already expired, start the extension from today.
    // Otherwise, extend from the current end date.
    const now = new Date();
    const currentEndDate = new Date(subscription.endDate);
    const newEndDate = currentEndDate > now ? currentEndDate : now;

    newEndDate.setDate(newEndDate.getDate() + parseInt(extensionDays));

    await subscription.update({
      endDate: newEndDate,
      status: 'ACTIVE' // Ensure the subscription is active after extension
    });

    res.json({
      success: true,
      message: `Subscription extended successfully by ${extensionDays} days.`,
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};
const getExpiredSubscriptions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: expiredSubscriptions } = await Subscription.findAndCountAll({
      where: {
        endDate: {
          [Op.lt]: new Date()
        },
        // Find subscriptions that are still marked active but should be expired
        status: 'ACTIVE'
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['userId', 'name', 'email']
      }],
      order: [['endDate', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        subscriptions: expiredSubscriptions,
        pagination: {
          totalItems: count,
          totalPages: Math.ceil(count / limit),
          currentPage: parseInt(page)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const bulkCancelSubscriptions = async (req, res, next) => {
  try {
    const { subscriptionIds, reason = 'Bulk administrative cancellation' } = req.body;

    if (!Array.isArray(subscriptionIds) || subscriptionIds.length === 0) {
      return next(new ApiError('An array of subscription IDs is required.', 400));
    }

    const [affectedCount] = await Subscription.update(
      {
        status: 'CANCELLED',
        cancellationReason: reason,
        cancelledAt: new Date()
      },
      {
        where: {
          subscriptionId: { [Op.in]: subscriptionIds },
          status: { [Op.ne]: 'CANCELLED' } // Don't update already cancelled ones
        }
      }
    );

    res.json({
      success: true,
      message: `${affectedCount} subscriptions were cancelled successfully.`
    });
  } catch (error) {
    next(error);
  }
};

const bulkExtendSubscriptions = async (req, res, next) => {
  try {
    const { subscriptionIds, extensionDays } = req.body;

    if (!Array.isArray(subscriptionIds) || subscriptionIds.length === 0) {
      return next(new ApiError('An array of subscription IDs is required.', 400));
    }
    if (!extensionDays || parseInt(extensionDays) <= 0) {
      return next(new ApiError('A positive number of extension days is required.', 400));
    }

    const [affectedCount] = await Subscription.update(
      { endDate: sequelize.literal(`"endDate" + INTERVAL '${parseInt(extensionDays)} days'`) },
      { where: { subscriptionId: { [Op.in]: subscriptionIds } } }
    );

    res.json({
      success: true,
      message: `${affectedCount} subscriptions were extended successfully by ${extensionDays} days.`
    });
  } catch (error) {
    next(error);
  }
};

const getUserSubscription = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const subscription = await Subscription.findOne({
      where: {
        userId,
        status: 'ACTIVE'
      },
      include: [
        {
          model: SubscriptionPlan,
          as: 'plan' // Assuming you set up this alias in your model associations
        }
      ],
      order: [['startDate', 'DESC']] // Get the most recent active one
    });

    if (!subscription) {
      // It's not an error to not have a subscription, so return a specific status.
      return res.json({
        success: true,
        message: 'No active subscription found.',
        data: null
      });
    }

    res.json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

const subscribeUser = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const { billingCycle = 'monthly' } = req.body; // 'monthly' or 'yearly'
    const userId = req.user.userId;

    // 1. Find the subscription plan
    const plan = await SubscriptionPlan.findOne({ where: { id: planId, isActive: true } });
    if (!plan) {
      return next(new ApiError('Subscription plan not found or is not active', 404));
    }

    // 2. Check if user already has an active subscription
    const existingActiveSubscription = await Subscription.findOne({
      where: { userId, status: 'ACTIVE' }
    });

    if (existingActiveSubscription) {
      return next(new ApiError('You already have an active subscription. Please cancel or update it.', 400));
    }

    // 3. Determine the amount based on billing cycle
    // Assuming SubscriptionPlan model has `price` (monthly) and `yearlyPrice` fields.
    // If not, you'll need to calculate it. Let's assume `plan.price` is monthly.
    const amount = billingCycle === 'yearly' ? plan.price * 12 * 0.8 : plan.price; // 20% discount for yearly
    const currency = 'INR';

    // 4. Create a new subscription record with PENDING status
    const subscription = await Subscription.create({
      userId,
      planId: plan.id,
      planType: plan.name.toUpperCase(), // Or however you map it
      billingCycle: billingCycle.toUpperCase(),
      status: 'PENDING',
      amount,
      currency,
      startDate: new Date(),
      // endDate will be set upon successful payment
    });

    // 5. Create a Razorpay order
    const options = {
      amount: amount * 100, // Amount in paise
      currency,
      receipt: `sub_${subscription.subscriptionId}`,
      notes: {
        subscriptionId: subscription.subscriptionId,
        userId: userId,
        planId: plan.id,
      },
    };

    const order = await razorpay.orders.create(options);

    // 6. Link Razorpay order ID to our subscription record
    await subscription.update({ razorpayOrderId: order.id });

    res.status(201).json({
      success: true,
      message: 'Subscription order created. Please proceed with payment.',
      data: {
        orderId: order.id,
        subscriptionId: subscription.subscriptionId,
        amount: order.amount,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const { planId: newPlanId } = req.params;
    const { billingCycle: newBillingCycle = 'monthly' } = req.body;
    const userId = req.user.userId;

    // 1. Find the new plan
    const newPlan = await SubscriptionPlan.findOne({ where: { id: newPlanId, isActive: true } });
    if (!newPlan) {
      return next(new ApiError('The selected plan is not available.', 404));
    }

    // 2. Find the user's current active subscription
    const currentSubscription = await Subscription.findOne({
      where: { userId, status: 'ACTIVE' },
      include: [{ model: SubscriptionPlan, as: 'plan' }]
    });

    if (!currentSubscription) {
      return next(new ApiError('No active subscription found to update. Please subscribe first.', 404));
    }

    if (currentSubscription.planId == newPlanId) {
      return next(new ApiError('You are already subscribed to this plan.', 400));
    }

    // 3. Proration Calculation
    const today = new Date();
    const endDate = new Date(currentSubscription.endDate);
    const totalDaysInCycle = (endDate - new Date(currentSubscription.startDate)) / (1000 * 60 * 60 * 24);
    const remainingDays = (endDate - today) / (1000 * 60 * 60 * 24);

    if (remainingDays <= 0) {
      return next(new ApiError('Your subscription has expired or is ending today. Please renew instead of updating.', 400));
    }

    // Value of the remaining time on the old plan
    const remainingValueOfOldPlan = (currentSubscription.amount / totalDaysInCycle) * remainingDays;

    // Cost of the new plan for the remaining time
    const newPlanMonthlyPrice = newPlan.price; // Assuming `price` is monthly
    const newPlanPriceForCycle = currentSubscription.billingCycle === 'YEARLY' ? newPlanMonthlyPrice * 12 * 0.8 : newPlanMonthlyPrice;
    const costOfNewPlanForRemainingTime = (newPlanPriceForCycle / totalDaysInCycle) * remainingDays;

    const proratedAmount = Math.max(0, Math.round(costOfNewPlanForRemainingTime - remainingValueOfOldPlan));

    // 4. Handle Upgrade/Downgrade
    if (proratedAmount > 0) {
      // This is an UPGRADE, create a payment order
      const options = {
        amount: proratedAmount * 100, // Amount in paise
        currency: 'INR',
        receipt: `upgrade_${currentSubscription.subscriptionId}_to_${newPlan.id}`,
        notes: {
          type: 'UPGRADE',
          userId: userId,
          fromPlanId: currentSubscription.planId,
          toPlanId: newPlan.id,
          subscriptionId: currentSubscription.subscriptionId
        },
      };

      const order = await razorpay.orders.create(options);

      res.status(200).json({
        success: true,
        message: 'Upgrade order created. Please proceed with payment.',
        data: {
          orderId: order.id,
          amount: order.amount,
          isUpgrade: true,
        },
      });
    } else {
      // This is a DOWNGRADE, apply changes immediately
      await currentSubscription.update({
        planId: newPlan.id,
        planType: newPlan.name.toUpperCase(),
        // Keep the same endDate and billingCycle until next renewal
      });
      res.status(200).json({
        success: true,
        message: 'Your subscription has been downgraded. Changes will be effective immediately.',
        data: { isUpgrade: false, subscription: currentSubscription },
      });
    }
  } catch (error) {
    next(error);
  }
};

const getSubscriptionHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: history } = await Subscription.findAndCountAll({
      where: { userId },
      include: [
        {
          model: SubscriptionPlan,
          as: 'plan',
          attributes: ['id', 'name', 'price']
        }
      ],
      order: [['startDate', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      success: true,
      data: {
        history,
        pagination: {
          totalItems: count,
          totalPages: Math.ceil(count / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const checkSubscriptionStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const subscription = await Subscription.findOne({
      where: { userId },
      order: [['startDate', 'DESC']],
      include: [{ model: SubscriptionPlan, as: 'plan' }]
    });

    if (!subscription) {
      return res.json({
        success: true,
        data: {
          status: 'NO_SUBSCRIPTION',
          message: 'User has never subscribed.',
          subscription: null
        }
      });
    }

    let statusMessage = `Your subscription is currently ${subscription.status}.`;
    if (subscription.status === 'ACTIVE' && new Date(subscription.endDate) < new Date()) {
      // This is a sanity check in case a cron job hasn't marked it as expired yet.
      subscription.status = 'EXPIRED';
      statusMessage = 'Your subscription has expired.';
    }

    res.json({
      success: true,
      data: {
        status: subscription.status,
        message: statusMessage,
        subscription
      }
    });
  } catch (error) {
    next(error);
  }
};

const renewSubscription = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // 1. Find the user's most recent subscription to determine what to renew.
    const lastSubscription = await Subscription.findOne({
      where: { userId },
      order: [['endDate', 'DESC']],
      include: [{ model: SubscriptionPlan, as: 'plan' }]
    });

    if (!lastSubscription) {
      return next(new ApiError('No subscription found to renew. Please subscribe to a plan first.', 404));
    }

    if (lastSubscription.status === 'PENDING') {
        return next(new ApiError('You have a pending subscription. Please complete or cancel it before renewing.', 400));
    }

    const plan = lastSubscription.plan;
    if (!plan || !plan.isActive) {
      return next(new ApiError('The plan associated with your last subscription is no longer active.', 404));
    }

    // 2. Create a new subscription record with PENDING status
    const newSubscription = await Subscription.create({
      userId,
      planId: plan.id,
      planType: plan.name.toUpperCase(),
      billingCycle: lastSubscription.billingCycle,
      status: 'PENDING',
      amount: lastSubscription.amount, // Renew at the same price
      currency: lastSubscription.currency,
      // Start date and end date will be set by the webhook upon successful payment.
      // The webhook will set startDate to the old endDate, or today if it has expired.
    });

    // 3. Create a Razorpay order
    const options = {
      amount: lastSubscription.amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `renew_${newSubscription.subscriptionId}`,
      notes: {
        type: 'RENEWAL',
        subscriptionId: newSubscription.subscriptionId,
        userId: userId,
        planId: plan.id,
      },
    };

    const order = await razorpay.orders.create(options);

    // 4. Link Razorpay order ID to our new subscription record
    await newSubscription.update({ razorpayOrderId: order.id });

    res.status(201).json({
      success: true,
      message: 'Renewal order created. Please proceed with payment.',
      data: { orderId: order.id, subscriptionId: newSubscription.subscriptionId },
    });
  } catch (error) {
    next(error);
  }
};

const getAllSubscriptions = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      planType,
      billingCycle,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const whereClause = {};
    const userWhereClause = {};

    if (status) whereClause.status = status;
    if (planType) whereClause.planType = planType;
    if (billingCycle) whereClause.billingCycle = billingCycle;

    if (search) {
      userWhereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: subscriptions } = await Subscription.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          where: userWhereClause,
          attributes: ['userId', 'name', 'email']
        },
        {
          model: SubscriptionPlan,
          as: 'plan',
          attributes: ['id', 'name']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      success: true,
      data: {
        subscriptions,
        pagination: { totalItems: count, totalPages: Math.ceil(count / limit), currentPage: parseInt(page) }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getSubscriptionsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const validStatuses = ['ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED', 'PENDING'];
    if (!validStatuses.includes(status.toUpperCase())) {
      return next(new ApiError('Invalid subscription status provided.', 400));
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: subscriptions } = await Subscription.findAndCountAll({
      where: { status: status.toUpperCase() },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['userId', 'name', 'email']
        },
        {
          model: SubscriptionPlan,
          as: 'plan',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      success: true,
      data: {
        subscriptions,
        pagination: {
          totalItems: count,
          totalPages: Math.ceil(count / limit),
          currentPage: parseInt(page)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getSubscriptionAnalytics = async (req, res, next) => {
  try {
    const { period = 30 } = req.query; // Default period of 30 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const [
      totalRevenue,
      activeSubscriptions,
      newSubscriptions,
      cancelledSubscriptions,
      subscriptionsByPlan,
      totalActiveUsersAtStartOfPeriod
    ] = await Promise.all([
      // 1. Total revenue from completed subscription payments in the period
      Payment.sum('amount', {
        where: {
          entityType: 'SUBSCRIPTION',
          paymentStatus: 'COMPLETED',
          createdAt: { [Op.gte]: startDate }
        }
      }),
      // 2. Current number of active subscriptions
      Subscription.count({ where: { status: 'ACTIVE' } }),

      // 3. New subscriptions in the period
      Subscription.count({
        where: {
          status: { [Op.in]: ['ACTIVE', 'EXPIRED', 'CANCELLED'] }, // Count plans that became active
          startDate: { [Op.gte]: startDate }
        }
      }),

      // 4. Cancelled subscriptions in the period
      Subscription.count({
        where: {
          status: 'CANCELLED',
          cancelledAt: { [Op.gte]: startDate }
        }
      }),

      // 5. Breakdown of active subscriptions by plan
      Subscription.findAll({
        where: { status: 'ACTIVE' },
        attributes: [
          'planType',
          [sequelize.fn('COUNT', sequelize.col('subscriptionId')), 'count']
        ],
        group: ['planType']
      }),

      // 6. Active users at the start of the period for churn calculation
      Subscription.count({
        where: {
          status: 'ACTIVE',
          startDate: { [Op.lt]: startDate }
        }
      })
    ]);

    // Calculate Monthly Recurring Revenue (MRR)
    const activeSubsForMRR = await Subscription.findAll({
      where: { status: 'ACTIVE' },
      include: [{ model: SubscriptionPlan, as: 'plan' }]
    });

    const mrr = activeSubsForMRR.reduce((acc, sub) => {
      const monthlyPrice = sub.billingCycle === 'YEARLY' ? sub.amount / 12 : sub.amount;
      return acc + parseFloat(monthlyPrice);
    }, 0);

    // Calculate Churn Rate
    const churnRate = totalActiveUsersAtStartOfPeriod > 0
      ? (cancelledSubscriptions / totalActiveUsersAtStartOfPeriod) * 100
      : 0;

    res.json({
      success: true,
      data: {
        periodDays: parseInt(period),
        totalRevenue: totalRevenue || 0,
        mrr: parseFloat(mrr.toFixed(2)),
        activeSubscriptions,
        newSubscriptions,
        cancelledSubscriptions,
        churnRate: parseFloat(churnRate.toFixed(2)),
        subscriptionsByPlan
      }
    });
  } catch (error) {
    next(error);
  }
};

const createSubscriptionPlan = async (req, res, next) => {
  try {
    const { name, price, duration, durationType, features, isActive = true } = req.body;

    // Check if a plan with the same name already exists
    const existingPlan = await SubscriptionPlan.findOne({ where: { name } });
    if (existingPlan) {
      return next(new ApiError('A subscription plan with this name already exists.', 409));
    }

    // Create the new subscription plan
    const newPlan = await SubscriptionPlan.create({
      name,
      price,
      duration,
      durationType,
      features: Array.isArray(features) ? JSON.stringify(features) : features,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: 'Subscription plan created successfully.',
      data: newPlan,
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscriptionPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const plan = await SubscriptionPlan.findByPk(id);

    if (!plan) {
      return next(new ApiError('Subscription plan not found.', 404));
    }

    // If features are sent as an array, stringify them for the database
    if (updates.features && Array.isArray(updates.features)) {
      updates.features = JSON.stringify(updates.features);
    }

    // Update the plan with the new details
    const updatedPlan = await plan.update(updates);

    res.json({
      success: true,
      message: 'Subscription plan updated successfully.',
      data: updatedPlan,
    });
  } catch (error) {
    next(error);
  }
};

const changeSubscription = async (req, res, next) => {
  try {
    const { planId: newPlanId } = req.params;
    const { billingCycle: newBillingCycle = 'monthly' } = req.body;
    const userId = req.user.userId;

    // 1. Find the new plan
    const newPlan = await SubscriptionPlan.findOne({ where: { id: newPlanId, isActive: true } });
    if (!newPlan) {
      return next(new ApiError('The selected plan is not available.', 404));
    }

    // 2. Find the user's current active subscription
    const currentSubscription = await Subscription.findOne({
      where: { userId, status: 'ACTIVE' },
      include: [{ model: SubscriptionPlan, as: 'plan' }]
    });

    if (!currentSubscription) {
      return next(new ApiError('No active subscription found to update. Please subscribe first.', 404));
    }

    if (currentSubscription.planId == newPlanId) {
      return next(new ApiError('You are already subscribed to this plan.', 400));
    }

    // 3. Proration Calculation
    const today = new Date();
    const endDate = new Date(currentSubscription.endDate);
    const totalDaysInCycle = (endDate - new Date(currentSubscription.startDate)) / (1000 * 60 * 60 * 24);
    const remainingDays = (endDate - today) / (1000 * 60 * 60 * 24);

    if (remainingDays <= 0) {
      return next(new ApiError('Your subscription has expired or is ending today. Please renew instead of updating.', 400));
    }

    // Value of the remaining time on the old plan
    const remainingValueOfOldPlan = (currentSubscription.amount / totalDaysInCycle) * remainingDays;

    // Cost of the new plan for the remaining time
    const newPlanMonthlyPrice = newPlan.price; // Assuming `price` is monthly
    const newPlanPriceForCycle = currentSubscription.billingCycle === 'YEARLY' ? newPlanMonthlyPrice * 12 * 0.8 : newPlanMonthlyPrice;
    const costOfNewPlanForRemainingTime = (newPlanPriceForCycle / totalDaysInCycle) * remainingDays;

    const proratedAmount = Math.max(0, Math.round(costOfNewPlanForRemainingTime - remainingValueOfOldPlan));

    // 4. Handle Upgrade/Downgrade
    if (proratedAmount > 0) {
      // This is an UPGRADE, create a payment order
      const options = {
        amount: proratedAmount * 100, // Amount in paise
        currency: 'INR',
        receipt: `upgrade_${currentSubscription.subscriptionId}_to_${newPlan.id}`,
        notes: {
          type: 'UPGRADE',
          userId: userId,
          fromPlanId: currentSubscription.planId,
          toPlanId: newPlan.id,
          subscriptionId: currentSubscription.subscriptionId
        },
      };

      const order = await razorpay.orders.create(options);

      res.status(200).json({
        success: true,
        message: 'Upgrade order created. Please proceed with payment.',
        data: {
          orderId: order.id,
          amount: order.amount,
          isUpgrade: true,
        },
      });
    } else {
      // This is a DOWNGRADE, apply changes immediately
      await currentSubscription.update({
        planId: newPlan.id,
        planType: newPlan.name.toUpperCase(),
        // Keep the same endDate and billingCycle until next renewal
      });
      res.status(200).json({
        success: true,
        message: 'Your subscription has been downgraded. Changes will be effective immediately.',
        data: { isUpgrade: false, subscription: currentSubscription },
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Make sure to export all functions you want to use in your routes
  getAllSubscriptions,
  bulkExtendSubscriptions,
  bulkCancelSubscriptions,
  getExpiredSubscriptions,
  getSubscriptionById,
  extendSubscription,
  adminCancelSubscription,
  deleteSubscriptionPlan,
  cancelSubscription,
  handleSubscriptionWebhook,
  getSubscriptionPlans,
  getSubscriptionPlanById,
  getUserSubscription,
  subscribeUser,
  updateSubscription,
  getSubscriptionHistory,
  checkSubscriptionStatus,
  getSubscriptionsByStatus,
  renewSubscription,
  getSubscriptionAnalytics,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  changeSubscription,
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
