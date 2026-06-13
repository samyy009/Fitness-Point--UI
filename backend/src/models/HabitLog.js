const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HabitLog = sequelize.define('HabitLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  habit_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  habit_category: {
    type: DataTypes.STRING(100),
    defaultValue: 'general'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  target_days: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  reminder_time: {
    type: DataTypes.TIME,
    defaultValue: null
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: null
  }
}, {
  tableName: 'habit_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = HabitLog;
