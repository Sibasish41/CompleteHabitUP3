# Environment Configuration Guide

This document explains how to configure environment variables for the HabitUP backend application.

## Files Overview

- `.env.example` - Template file with all available configuration options
- `.env` - Development environment configuration (DO NOT commit to version control)
- `.env.production` - Production environment template with documentation

## Development Setup

1. The `.env` file has been created with development settings:
   - `PORT=3001` - Backend server runs on port 3001
   - `CLIENT_URL=http://localhost:3000` - Frontend runs on port 3000
   - Database, email, and payment configurations use placeholder values

2. **Required Updates for Development:**
   - Update `DB_PASSWORD` with your local database password
   - Configure `EMAIL_*` variables if you need email functionality
   - Set `JWT_SECRET` to a secure random string
   - Update `RAZORPAY_*` keys if testing payment functionality

## Production Deployment

1. **Never use the development `.env` file in production**

2. **For production deployment:**
   - Copy `.env.production` to `.env` on your production server
   - Update all placeholder values with actual production credentials
   - Use strong, unique secrets for `JWT_SECRET`
   - Configure production database credentials
   - Set `CLIENT_URL` to your actual frontend domain
   - Use production email service credentials
   - Use production Razorpay keys

## Critical Variables to Override in Production

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Set to "production" | Yes |
| `CLIENT_URL` | Your production frontend URL | Yes |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Production database credentials | Yes |
| `JWT_SECRET` | Strong, unique secret (min 32 chars) | Yes |
| `EMAIL_*` | Production email service config | If using email |
| `RAZORPAY_*` | Production payment gateway keys | If using payments |

## Security Notes

- Never commit `.env` files to version control
- Use environment-specific secrets management in production
- Regularly rotate secrets and API keys
- Use strong, unique passwords and secrets
- Consider using services like AWS Secrets Manager or similar for production

## Verification

After setting up your environment file, verify the configuration by:
1. Starting the server: `npm start` or `node index.js`
2. Check the console output for the correct port and any connection errors
3. Test API endpoints to ensure proper configuration
