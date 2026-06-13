const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { len: [2, 100] }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'trainer', 'admin'),
    defaultValue: 'user'
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  phone: {
    type: DataTypes.STRING(20),
    defaultValue: null
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    defaultValue: null
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    defaultValue: null
  },
  height_cm: {
    type: DataTypes.FLOAT,
    defaultValue: null
  },
  weight_kg: {
    type: DataTypes.FLOAT,
    defaultValue: null
  },
  fitness_goal: {
    type: DataTypes.STRING(255),
    defaultValue: null
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;
