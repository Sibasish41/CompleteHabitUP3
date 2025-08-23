const Stripe = require('stripe');
const { Payment, User, Subscription } = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const { sendPaymentConfirmationEmail } = require('./emailService');

class PaymentProcessor {
  constructor() {
    this.stripe = process.env.STRIPE_SECRET_KEY ?
      new Stripe(process.env.STRIPE_SECRET_KEY) : null;
  }

  async createPaymentSession(options) {
    const {
      amount,
      currency = 'inr',
      userId,
      itemType,
      itemId,
      successUrl,
      cancelUrl,
      metadata = {}
    } = options;

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new ApiError('User not found', 404);
      }

      // Create Stripe session
      if (this.stripe) {
        const session = await this.stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          customer_email: user.email,
          mode: 'payment',
          line_items: [{
            price_data: {
              currency,
              product_data: {
                name: this.getItemName(itemType, metadata),
                description: this.getItemDescription(itemType, metadata)
              },
              unit_amount: Math.round(amount * 100)
            },
            quantity: 1
          }],
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: {
            userId,
            itemType,
            itemId,
            ...metadata
          }
        });

        // Create payment record
        await Payment.create({
          userId,
          amount,
          currency,
          provider: 'STRIPE',
          status: 'PENDING',
          sessionId: session.id,
          itemType,
          itemId,
          metadata
        });

        return { provider: 'STRIPE', session };
      }

      // Fallback to Razorpay if Stripe is not configured
      const razorpayOrder = await createRazorpayOrder(amount, currency);

      await Payment.create({
        userId,
        amount,
        currency,
        provider: 'RAZORPAY',
        status: 'PENDING',
        orderId: razorpayOrder.id,
        itemType,
        itemId,
        metadata
      });

      return { provider: 'RAZORPAY', order: razorpayOrder };
    } catch (error) {
      console.error('Payment session creation error:', error);
      throw new ApiError('Failed to create payment session', 500);
    }
  }

  async handlePaymentWebhook(provider, payload, signature) {
    try {
      if (provider === 'STRIPE') {
        return await this.handleStripeWebhook(payload, signature);
      } else if (provider === 'RAZORPAY') {
        return await this.handleRazorpayWebhook(payload, signature);
      }
      throw new ApiError('Invalid payment provider', 400);
    } catch (error) {
      console.error('Payment webhook handling error:', error);
      throw error;
    }
  }

  async handleStripeWebhook(payload, signature) {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await this.processSuccessfulPayment({
        userId: session.metadata.userId,
        itemType: session.metadata.itemType,
        itemId: session.metadata.itemId,
        provider: 'STRIPE',
        sessionId: session.id,
        amount: session.amount_total / 100
      });
    }

    return { received: true };
  }

  async handleRazorpayWebhook(payload, signature) {
    // Verify Razorpay signature
    const isValid = verifyRazorpaySignature(payload, signature);
    if (!isValid) {
      throw new ApiError('Invalid webhook signature', 400);
    }

    if (payload.event === 'payment.captured') {
      const payment = payload.payload.payment.entity;
      await this.processSuccessfulPayment({
        provider: 'RAZORPAY',
        orderId: payment.order_id,
        amount: payment.amount / 100
      });
    }

    return { received: true };
  }

  async processSuccessfulPayment(options) {
    const { userId, itemType, itemId, provider, sessionId, orderId, amount } = options;

    // Update payment record
    const payment = await Payment.findOne({
      where: provider === 'STRIPE' ? { sessionId } : { orderId }
    });

    if (!payment) {
      throw new ApiError('Payment record not found', 404);
    }

    await payment.update({
      status: 'SUCCESS',
      completedAt: new Date()
    });

    // Handle different payment types
    switch (itemType) {
      case 'SUBSCRIPTION':
        await this.handleSubscriptionPayment(itemId);
        break;
      case 'CONSULTATION':
        await this.handleConsultationPayment(itemId);
        break;
      // Add other payment types as needed
    }

    // Send confirmation email
    const user = await User.findByPk(userId);
    if (user) {
      await sendPaymentConfirmationEmail(user.email, {
        amount,
        itemType,
        paymentId: payment.id
      });
    }
  }

  async handleSubscriptionPayment(subscriptionId) {
    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      throw new ApiError('Subscription not found', 404);
    }

    await subscription.update({
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: this.calculateSubscriptionEndDate(subscription.duration)
    });

    // Update user subscription status
    await User.update(
      { subscriptionStatus: 'ACTIVE' },
      { where: { userId: subscription.userId } }
    );
  }

  async handleConsultationPayment(meetingId) {
    const meeting = await Meeting.findByPk(meetingId);
    if (!meeting) {
      throw new ApiError('Meeting not found', 404);
    }

    await meeting.update({
      status: 'CONFIRMED',
      paymentStatus: 'PAID'
    });
  }

  calculateSubscriptionEndDate(durationMonths) {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationMonths);
    return endDate;
  }

  getItemName(itemType, metadata) {
    switch (itemType) {
      case 'SUBSCRIPTION':
        return `${metadata.planName || 'Premium'} Subscription`;
      case 'CONSULTATION':
        return `Consultation with Dr. ${metadata.doctorName}`;
      default:
        return 'Payment';
    }
  }

  getItemDescription(itemType, metadata) {
    switch (itemType) {
      case 'SUBSCRIPTION':
        return `${metadata.duration} month${metadata.duration > 1 ? 's' : ''} subscription`;
      case 'CONSULTATION':
        return `${metadata.duration} minute consultation on ${metadata.date}`;
      default:
        return '';
    }
  }
}

module.exports = new PaymentProcessor();
