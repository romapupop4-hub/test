const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  showcaseComponentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'showcase_component_id',
    references: {
      model: 'showcase_components',
      key: 'id'
    }
  }
}, {
  tableName: 'favorites',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'showcase_component_id']
    }
  ]
});

module.exports = Favorite;
