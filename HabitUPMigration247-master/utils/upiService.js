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
  async generatePaymentQR(paymentDetails, options = {}) {
    const {
      amount,
      orderId,
      description = '',
      customUpiId = null
    } = paymentDetails;

    const upiId = customUpiId || this.merchantConfig.upiId;
    const merchantName = this.merchantConfig.merchantName;

    // Generate UPI URL
    const upiURL = this.generateUPIURL({
      payeeAddress: upiId,
      payeeName: merchantName,
      amount,
      transactionId: orderId,
      note: description
    });

    // QR Code generation options
    const qrOptions = {
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: options.size || 256,
      ...options.qrOptions
    };

    try {
      // Generate QR code as base64 data URL
      const qrDataURL = await QRCode.toDataURL(upiURL, qrOptions);
      
      // Generate QR code as buffer for file storage if needed
      const qrBuffer = await QRCode.toBuffer(upiURL, qrOptions);

      return {
        upiURL,
        qrDataURL,
        qrBuffer,
        merchantDetails: {
          upiId,
          merchantName: merchantName,
          amount,
          orderId,
          description
        },
        instructions: {
          step1: 'Open any UPI app (PhonePe, GooglePay, Paytm, etc.)',
          step2: 'Scan this QR code or click the UPI link',
          step3: 'Verify the amount and merchant details',
          step4: 'Enter your UPI PIN to complete payment',
          step5: 'Take a screenshot of the success message'
        }
      };
    } catch (error) {
      throw new Error(`QR Code generation failed: ${error.message}`);
    }
  }

  /**
   * Validate UPI ID format
   * @param {string} upiId - UPI ID to validate
   * @returns {boolean} Is valid UPI ID
   */
  validateUPIId(upiId) {
    // UPI ID format: username@bankname or mobile@bankname
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    return upiRegex.test(upiId);
  }

  /**
   * Generate transaction reference ID
   * @param {string} prefix - Prefix for transaction ID
   * @returns {string} Unique transaction ID
   */
  generateTransactionId(prefix = 'HABITUP') {
    const timestamp = Date.now();
    const randomStr = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `${prefix}${timestamp}${randomStr}`;
  }

  /**
   * Create UPI deep link for mobile apps
   * @param {Object} paymentDetails - Payment details
   * @returns {Object} Deep links for different UPI apps
   */
  generateDeepLinks(paymentDetails) {
    const { amount, orderId, description } = paymentDetails;
    const upiId = this.merchantConfig.upiId;
    const merchantName = this.merchantConfig.merchantName;

    const baseParams = {
      pa: upiId,
      pn: merchantName,
      am: amount.toString(),
      tr: orderId,
      tn: description,
      cu: 'INR'
    };

    const paramString = new URLSearchParams(baseParams).toString();

    return {
      // Generic UPI link (works with all UPI apps)
      generic: `upi://pay?${paramString}`,
      
      // Specific app deep links
      phonepe: `phonepe://pay?${paramString}`,
      googlepay: `tez://upi/pay?${paramString}`,
      paytm: `paytmmp://pay?${paramString}`,
      bhim: `bhim://pay?${paramString}`,
      
      // Web fallback links
      web: {
        phonepe: `https://phon.pe/ru_${orderId}`,
        googlepay: `https://pay.google.com/gp/p/ui/pay?${paramString}`,
      }
    };
  }

  /**
   * Parse UPI transaction details from UTR or transaction reference
   * @param {string} utr - Unique Transaction Reference number
   * @returns {Object} Parsed transaction details
   */
  parseTransactionReference(utr) {
    // UTR format varies by bank, but generally 12 digits
    const utrRegex = /^\d{12}$/;
    
    return {
      isValidUTR: utrRegex.test(utr),
      utr,
      timestamp: new Date().toISOString(),
      parsed: {
        // This would need to be implemented based on your bank's UTR format
        // For now, just basic validation
        isValid: utrRegex.test(utr)
      }
    };
  }

  /**
   * Generate payment instructions for users
   * @param {Object} paymentDetails - Payment details
   * @returns {Object} User-friendly payment instructions
   */
  generatePaymentInstructions(paymentDetails) {
    const { amount, orderId } = paymentDetails;
    
    return {
      title: 'Complete Your Payment',
      amount: `₹${amount}`,
      orderId,
      steps: [
        {
          step: 1,
          title: 'Open UPI App',
          description: 'Open any UPI app like PhonePe, GooglePay, Paytm, BHIM, etc.',
          icon: 'mobile'
        },
        {
          step: 2,
          title: 'Scan QR Code',
          description: 'Scan the QR code shown above or click the UPI link',
          icon: 'qr-code'
        },
        {
          step: 3,
          title: 'Verify Details',
          description: `Verify amount ₹${amount} and merchant details`,
          icon: 'check'
        },
        {
          step: 4,
          title: 'Complete Payment',
          description: 'Enter your UPI PIN to complete the payment',
          icon: 'lock'
        },
        {
          step: 5,
          title: 'Submit Proof',
          description: 'Take a screenshot and submit payment proof',
          icon: 'camera'
        }
      ],
      tips: [
        'Payment will be auto-verified in most cases',
        'If verification fails, you can submit payment proof manually',
        'Payment expires in 15 minutes',
        'Contact support if you face any issues'
      ],
      supportInfo: {
        phone: process.env.SUPPORT_PHONE || '+91-XXXXXXXXXX',
        email: process.env.SUPPORT_EMAIL || 'support@habitup.com',
        whatsapp: process.env.SUPPORT_WHATSAPP || '+91-XXXXXXXXXX'
      }
    };
  }
}

module.exports = new UPIService();
