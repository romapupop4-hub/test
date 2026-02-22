'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Variation = sequelize.define('Variation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  showcase_component_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'showcase_components',
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
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: true
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
  thumbnail: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  properties: {
    type: DataTypes.JSON,
    allowNull: true
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  usage_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'variations',
  timestamps: true,
  underscored: true
});

module.exports = Variation;
