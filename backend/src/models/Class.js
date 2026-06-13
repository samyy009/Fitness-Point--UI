const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  trainer_id: {
    type: DataTypes.UUID,
    defaultValue: null
  },
  category: {
    type: DataTypes.ENUM('strength', 'cardio', 'hiit', 'yoga', 'pilates', 'crossfit', 'dance', 'other'),
    defaultValue: 'other'
  },
  difficulty: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner'
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 20
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  schedule: {
    type: DataTypes.JSON, // [{day: 'Monday', time: '09:00', recurring: true}]
    defaultValue: []
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'classes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Class;
