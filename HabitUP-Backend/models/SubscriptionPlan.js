const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // Duration in days, months, or years
    allowNull: false,
  },
  durationType: {
    type: DataTypes.ENUM('days', 'months', 'years'),
    allowNull: false,
  },
  features: {
    type: DataTypes.TEXT, // Store features as a JSON string or comma-separated
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

module.exports = SubscriptionPlan;
