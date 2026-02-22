'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Style = sequelize.define('Style', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  primary_color: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  secondary_color: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  accent_color: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  background_color: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  text_color: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  font_family: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  border_radius: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  is_dark: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_premium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'styles',
  timestamps: true,
  underscored: true
});

module.exports = Style;
