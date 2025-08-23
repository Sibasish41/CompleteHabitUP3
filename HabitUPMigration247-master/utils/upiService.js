const QRCode = require('qrcode');
const crypto = require('crypto');

class UPIService {
  constructor() {
    this.merchantConfig = {
      upiId: process.env.MERCHANT_UPI_ID || 'merchant@paytm',
      merchantName: process.env.MERCHANT_NAME || 'HabitUP',
      merchantCode: process.env.MERCHANT_CODE || 'HABITUP',
      category: '0000' // Default category for person-to-person
    };
  }

  /**
   * Generate UPI payment URL according to UPI specifications
   * @param {Object} params - Payment parameters
   * @param {string} params.payeeAddress - UPI ID of the merchant
   * @param {string} params.payeeName - Name of the merchant
   * @param {number} params.amount - Amount in INR
   * @param {string} params.transactionId - Unique transaction ID
   * @param {string} params.note - Payment note/description
   * @param {string} params.currency - Currency code (default: INR)
   * @returns {string} UPI payment URL
   */
  generateUPIURL(params) {
    const {
      payeeAddress,
      payeeName,
      amount,
      transactionId,
      note = '',
      currency = 'INR'
    } = params;

    const upiParams = new URLSearchParams({
      pa: payeeAddress,    // Payee Address (UPI ID)
      pn: payeeName,       // Payee Name
      am: amount.toString(), // Amount
      tr: transactionId,   // Transaction Reference ID
      tn: note,           // Transaction Note
      cu: currency        // Currency
    });

    return `upi://pay?${upiParams.toString()}`;
  }

  /**
   * Generate QR code for UPI payment
   * @param {Object} paymentDetails - Payment details
   * @param {Object} options - QR code generation options
   * @returns {Promise<Object>} QR code data and URL
   */
  async generateQRCode(paymentDetails, options = {}) {
    try {
      const {
        amount,
        transactionId,
        note = 'Payment for HabitUP services'
      } = paymentDetails;

      const upiUrl = this.generateUPIURL({
        payeeAddress: this.merchantConfig.upiId,
        payeeName: this.merchantConfig.merchantName,
        amount,
        transactionId,
        note
      });

      // Generate QR code
      const qrOptions = {
        type: 'svg',
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        width: 300,
        ...options
      };

      const qrCode = await QRCode.toString(upiUrl, qrOptions);

      return {
        qrCode,
        upiUrl,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes validity
      };
    } catch (error) {
      console.error('Error generating UPI QR code:', error);
      throw error;
    }
  }

  /**
   * Verify UPI transaction status
   * @param {string} transactionId - Transaction reference ID
   * @param {string} upiId - UPI ID used for payment
   * @returns {Promise<Object>} Transaction status details
   */
  async verifyTransaction(transactionId, upiId) {
    try {
      // Generate verification parameters
      const timestamp = Date.now();
      const checksum = this.generateChecksum(transactionId, timestamp);

      // In a real implementation, this would make an API call to the UPI service
      // For now, we'll simulate a verification response
      const response = {
        transactionId,
        status: 'SUCCESS',
        amount: '0',
        payerVpa: upiId,
        payeeVpa: this.merchantConfig.upiId,
        timestamp: new Date(timestamp).toISOString(),
        checksum
      };

      return response;
    } catch (error) {
      console.error('Error verifying UPI transaction:', error);
      throw error;
    }
  }

  /**
   * Create a new UPI payment intent
   * @param {Object} params - Payment parameters
   * @returns {Promise<Object>} Payment intent details
   */
  async createPaymentIntent(params) {
    try {
      const {
        amount,
        customerId,
        description,
        metadata = {}
      } = params;

      const transactionId = this.generateTransactionId();
      const timestamp = Date.now();

      // Create payment intent object
      const paymentIntent = {
        id: transactionId,
        amount,
        currency: 'INR',
        customerId,
        description,
        metadata,
        merchantId: this.merchantConfig.merchantCode,
        timestamp,
        status: 'CREATED',
        paymentUrl: await this.generateQRCode({
          amount,
          transactionId,
          note: description
        })
      };

      return paymentIntent;
    } catch (error) {
      console.error('Error creating UPI payment intent:', error);
      throw error;
    }
  }

  /**
   * Generate transaction ID
   * @returns {string} Unique transaction ID
   */
  generateTransactionId() {
    return `${this.merchantConfig.merchantCode}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  }

  /**
   * Generate checksum for transaction verification
   * @param {string} transactionId - Transaction reference ID
   * @param {number} timestamp - Transaction timestamp
   * @returns {string} Generated checksum
   */
  generateChecksum(transactionId, timestamp) {
    const data = `${transactionId}|${timestamp}|${this.merchantConfig.merchantCode}`;
    return crypto
      .createHmac('sha256', process.env.UPI_SECRET_KEY || 'test-secret-key')
      .update(data)
      .digest('hex');
  }
}

module.exports = new UPIService();
