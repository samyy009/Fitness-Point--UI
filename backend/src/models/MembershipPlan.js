const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MembershipPlan = sequelize.define('MembershipPlan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  duration_days: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30
  },
  features: {
    type: DataTypes.JSON, // ['Unlimited access', 'Personal trainer', ...]
    defaultValue: []
  },
  is_popular: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  color: {
    type: DataTypes.STRING(20),
    defaultValue: '#42c8c9'
  }
}, {
  tableName: 'membership_plans',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = MembershipPlan;
