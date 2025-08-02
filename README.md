# 🏆 HabitUP - Complete Implementation Guide

![HabitUP Logo](https://via.placeholder.com/150x50/6366f1/white?text=HabitUP)

Welcome to **HabitUP**, a comprehensive habit tracking and wellness application with integrated payment processing, user management, and real-time features. This guide provides **complete step-by-step instructions** for setting up, configuring, and deploying the entire application.

## 📋 Table of Contents
1. [🔍 Overview](#-overview)
2. [📁 Project Structure](#-project-structure)
3. [⚡ Prerequisites](#-prerequisites)
4. [🔧 Environment Configuration](#-environment-configuration)
5. [🗄️ Database Setup](#️-database-setup)
6. [💳 Payment Integration](#-payment-integration)
7. [📧 Email Configuration](#-email-configuration)
8. [🚀 Running the Project](#-running-the-project)
9. [🛠️ API Endpoints](#️-api-endpoints)
10. [🎨 Frontend Features](#-frontend-features)
11. [🔒 Security Configuration](#-security-configuration)
12. [📱 Mobile Support](#-mobile-support)
13. [🐛 Troubleshooting](#-troubleshooting)
14. [📚 Additional Resources](#-additional-resources)
15. [🆘 Support](#-support)

### Overview
HabitUP is a dual-structured application comprising both a client-side frontend and a server-side backend. It offers features like habit tracking, payment processing using Razorpay, and email notifications.

### Project Structure
- **Frontend**: Located in `HabitUP-master` directory, built with React and Vite.
- **Backend**: Located in `HabitUPMigration247-master` directory, built with Node.js and Express.

### Prerequisites
- Node.js v14 or above
- npm v6 or above
- MySQL or SQLite3 database
- Razorpay account for payment processing
- SMTP server details for email notifications

### Environment Configuration
Both frontend and backend require configuration through environment variables. Create a `.env` file in the root directory of `HabitUPMigration247-master` and configure the following:

#### General
- `NODE_ENV`: Set to either `development` or `production`.

#### Database
- `DB_HOST`: Hostname of your database.
- `DB_PORT`: Port number (default for MySQL is `3306`).
- `DB_USER`: Database username.
- `DB_PASSWORD`: Database password.
- `DB_NAME`: Name of the database to connect to.

#### Razorpay (Payments)
- `RAZORPAY_KEY_ID`: Your Razorpay key ID.
- `RAZORPAY_KEY_SECRET`: Your Razorpay key secret.

#### Email Configuration
- `SMTP_HOST`: SMTP server host.
- `SMTP_PORT`: SMTP server port (usually `587` for TLS or `465` for SSL).
- `SMTP_USER`: SMTP username.
- `SMTP_PASS`: SMTP password.
- `FROM_EMAIL`: Default sender email address.

#### UPI Payment
- `MERCHANT_UPI_ID`: Merchant's UPI ID for payments.
- `MERCHANT_NAME`: Merchant's name to display.
- `MERCHANT_CODE`: Merchant code for identification.

#### Support Information
- `SUPPORT_PHONE`: Phone number for support.
- `SUPPORT_EMAIL`: Email for support inquiries.
- `SUPPORT_WHATSAPP`: WhatsApp contact number for support.

### Database Setup
1. **MySQL Setup**:
   - Create a database using the name specified in `DB_NAME`.
   - Grant privileges to the user defined in `DB_USER`.

2. **SQLite Setup**:
   - No additional setup required. The SQLite database will be auto-generated.

### Payment Integration
Ensure you have a Razorpay account. Enter your credentials in the `.env` file as shown above.

### Email Configuration
Configure your SMTP credentials in the `.env` file to enable email notifications. Services like Gmail, SendGrid, etc., can be used.

### Running the Project
#### Backend
Navigate to the `HabitUPMigration247-master` directory and run:
```bash
npm install
npm run dev
```

#### Frontend
Navigate to the `HabitUP-master` directory and run:
```bash
npm install
npm run dev
```

### Common Issues
- **Database Connection**: Ensure your database credentials are correct and the server is running.
- **Razorpay Errors**: Verify your Razorpay key and secret.
- **SMTP Errors**: Ensure SMTP credentials and configurations are correct.

### Support
For support inquiries, contact us:
- Email: `support@habitup.com`
- Phone: `+91-XXXXXXXXXX`
- WhatsApp: `+91-XXXXXXXXXX`

Thank you for using HabitUP! We hope this guide helps you in setting up and running the application seamlessly.
