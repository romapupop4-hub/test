const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Style = require('./Style');
const ShowcaseComponent = require('./ShowcaseComponent');
const Variation = require('./Variation');
const Tag = require('./Tag');
const Favorite = require('./Favorite');
const ComponentView = require('./ComponentView');
const Setting = require('./Setting');

// User associations
User.hasMany(ShowcaseComponent, { foreignKey: 'userId', as: 'components' });
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });

// Category self-referencing (parent/children)
Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });

// Category - ShowcaseComponent
Category.hasMany(ShowcaseComponent, { foreignKey: 'categoryId', as: 'components' });
ShowcaseComponent.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Style - ShowcaseComponent
Style.hasMany(ShowcaseComponent, { foreignKey: 'styleId', as: 'components' });
ShowcaseComponent.belongsTo(Style, { foreignKey: 'styleId', as: 'style' });

// ShowcaseComponent - Variation
ShowcaseComponent.hasMany(Variation, { foreignKey: 'showcaseComponentId', as: 'variations', onDelete: 'CASCADE' });
Variation.belongsTo(ShowcaseComponent, { foreignKey: 'showcaseComponentId', as: 'component' });

// ShowcaseComponent - Tags (many-to-many)
ShowcaseComponent.belongsToMany(Tag, { 
  through: 'component_tags', 
  foreignKey: 'showcase_component_id',
  otherKey: 'tag_id',
  as: 'tags'
});
Tag.belongsToMany(ShowcaseComponent, { 
  through: 'component_tags', 
  foreignKey: 'tag_id',
  otherKey: 'showcase_component_id',
  as: 'components'
});

// User - Favorite
User.hasMany(Favorite, { foreignKey: 'userId', as: 'userFavorites' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });

ShowcaseComponent.hasMany(Favorite, { foreignKey: 'showcaseComponentId', as: 'componentFavorites' });
Favorite.belongsTo(ShowcaseComponent, { foreignKey: 'showcaseComponentId', as: 'component' });

// ComponentView associations
ShowcaseComponent.hasMany(ComponentView, { foreignKey: 'showcaseComponentId', as: 'views' });
ComponentView.belongsTo(ShowcaseComponent, { foreignKey: 'showcaseComponentId', as: 'component' });

User.hasMany(ComponentView, { foreignKey: 'userId', as: 'componentViews' });
ComponentView.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Category,
  Style,
  ShowcaseComponent,
  Variation,
  Tag,
  Favorite,
  ComponentView,
  Setting
};
