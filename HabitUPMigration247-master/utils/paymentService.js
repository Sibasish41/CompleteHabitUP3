const Razorpay = require('razorpay');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Razorpay instance with graceful error handling
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn('⚠️  Razorpay credentials not found. Payment service will use mock mode.');
}

// Create new order
const createOrder = async (amount, currency = 'INR') => {
  if (!razorpay) {
    // Return mock order for development/testing
    console.log(`🧪 Mock order created for amount: ${amount} ${currency}`);
    return {
      id: `order_${uuidv4()}`,
      entity: 'order',
      amount: amount * 100,
      amount_paid: 0,
      amount_due: amount * 100,
      currency,
      receipt: `receipt_${uuidv4()}`,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000)
    };
  }

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise/cents
      currency,
      receipt: `receipt_${uuidv4()}`,
    });

    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

// Verify payment
const verifyPayment = async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    // Mock verification for development/testing
    console.log(`🧪 Mock payment verification for order: ${razorpayOrderId}`);
    return true; // Always return true in mock mode
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  return generatedSignature === razorpaySignature; // Returns true if signatures match
};

// Generate UPI payment URL
const generateUPIPaymentURL = (upiId, name, amount, transactionId, note = '') => {
  const baseURL = 'upi://pay';
  const params = new URLSearchParams({
    pa: upiId, // Payee Address (UPI ID)
    pn: name,  // Payee Name
    am: amount.toString(), // Amount
    tr: transactionId, // Transaction Reference ID
    tn: note || `Payment for ${transactionId}`, // Transaction Note
    cu: 'INR' // Currency
  });
  
  return `${baseURL}?${params.toString()}`;
};

// Generate QR code data for UPI payment
const generateUPIQRData = (merchantConfig, amount, orderId, description = '') => {
  const {
    upiId,
    merchantName,
    merchantCode = '',
    category = '0000' // Default category for person-to-person
  } = merchantConfig;

  // UPI QR Code follows UPI spec with the following format
  const qrData = generateUPIPaymentURL(
    upiId,
    merchantName,
    amount,
    orderId,
    description
  );

  return qrData;
};

// Verify UPI payment (manual verification for now)
const verifyUPIPayment = async (paymentId, transactionReference, amount) => {
  // In a real implementation, this would connect to your bank's API
  // or use a payment gateway that supports UPI verification
  // For now, this is a placeholder that requires manual verification
  
  console.log(`🧪 Mock UPI payment verification for payment: ${paymentId}`);
  console.log(`Transaction Reference: ${transactionReference}`);
  console.log(`Amount: ${amount}`);
  
  // Return a mock response - in production, implement actual verification logic
  return {
    verified: false, // This will require manual verification by admin
    transactionId: transactionReference,
    amount: amount,
    timestamp: new Date().toISOString(),
    requiresManualVerification: true
  };
};

module.exports = { 
  createOrder, 
  verifyPayment, 
  generateUPIPaymentURL, 
  generateUPIQRData, 
  verifyUPIPayment 
};
