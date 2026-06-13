const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trainer = sequelize.define('Trainer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    defaultValue: null
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  specialty: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  experience_years: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 5.0,
    validate: { min: 0, max: 5 }
  },
  certifications: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  social_links: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'trainers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Trainer;
