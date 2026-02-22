const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ComponentView = sequelize.define('ComponentView', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  showcaseComponentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'showcase_component_id',
    references: {
      model: 'showcase_components',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    field: 'ip_address'
  },
  viewDuration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'view_duration'
  }
}, {
  tableName: 'component_views',
  timestamps: true,
  underscored: true
});

module.exports = ComponentView;
