const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProgressLog = sequelize.define('ProgressLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  weight_kg: {
    type: DataTypes.FLOAT,
    defaultValue: null
  },
  body_fat_percent: {
    type: DataTypes.FLOAT,
    defaultValue: null
  },
  bmi: {
    type: DataTypes.FLOAT,
    defaultValue: null
  },
  chest_cm: {
    type: DataTypes.FLOAT,
    defaultValue: null
  },
  waist_cm: {
    type: DataTypes.FLOAT,
    defaultValue: null
  },
  hips_cm: {
    type: DataTypes.FLOAT,
    defaultValue: null
  },
  arms_cm: {
    type: DataTypes.FLOAT,
    defaultValue: null
  },
  thighs_cm: {
    type: DataTypes.FLOAT,
    defaultValue: null
  },
  sleep_hours: {
    type: DataTypes.FLOAT,
    defaultValue: null
  },
  mood: {
    type: DataTypes.INTEGER, // 1-5
    defaultValue: null
  },
  energy_level: {
    type: DataTypes.INTEGER, // 1-5
    defaultValue: null
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: null
  }
}, {
  tableName: 'progress_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ProgressLog;
