'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ShowcaseComponent = sequelize.define('ShowcaseComponent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  style_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'styles',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  html_code: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  css_code: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  react_code: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  javascript_code: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  preview_image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_premium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  download_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  like_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  usage_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  meta_title: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  meta_description: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  meta_keywords: {
    type: DataTypes.STRING(300),
    allowNull: true
  }
}, {
  tableName: 'showcase_components',
  timestamps: true,
  underscored: true
});

module.exports = ShowcaseComponent;
