const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BlogPost = sequelize.define('BlogPost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(300),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(350),
    allowNull: false,
    unique: true
  },
  excerpt: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  author_id: {
    type: DataTypes.UUID,
    defaultValue: null
  },
  image_url: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  category: {
    type: DataTypes.STRING(100),
    defaultValue: 'general'
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  published_at: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'blog_posts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = BlogPost;
