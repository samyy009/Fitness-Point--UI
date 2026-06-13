const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MealLog = sequelize.define('MealLog', {
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
  meals: {
    type: DataTypes.JSON,
    // [{type: 'breakfast'|'lunch'|'dinner'|'snack', items: [{name, calories, protein, carbs, fats}]}]
    defaultValue: []
  },
  total_calories: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_protein: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  total_carbs: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  total_fats: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  water_intake_ml: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: null
  }
}, {
  tableName: 'meal_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = MealLog;
