const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GalleryItem = sequelize.define('GalleryItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  change: {
    type: DataTypes.STRING,
    allowNull: false
  },
  before_img: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  after_img: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'gallery_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = GalleryItem;
