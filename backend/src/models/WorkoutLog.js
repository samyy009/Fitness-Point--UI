const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkoutLog = sequelize.define('WorkoutLog', {
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
  title: {
    type: DataTypes.STRING(200),
    defaultValue: 'My Workout'
  },
  exercises: {
    type: DataTypes.JSON,
    // [{name, sets, reps, weight_kg, duration_min, notes}]
    defaultValue: []
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  calories_burned: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  category: {
    type: DataTypes.STRING(100),
    defaultValue: null
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  mood_before: {
    type: DataTypes.INTEGER, // 1-5
    defaultValue: null
  },
  mood_after: {
    type: DataTypes.INTEGER, // 1-5
    defaultValue: null
  }
}, {
  tableName: 'workout_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = WorkoutLog;
