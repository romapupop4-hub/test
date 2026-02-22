const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Favorite, ShowcaseComponent, User } = require('../models');

router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: [{
        model: ShowcaseComponent,
        as: 'component',
        include: ['category', 'style', 'variations', 'tags']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:componentId', auth, async (req, res) => {
  try {
    const { componentId } = req.params;
    
    const component = await ShowcaseComponent.findByPk(componentId);
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }

    const existingFavorite = await Favorite.findOne({
      where: { userId: req.user.id, componentId }
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Component already in favorites' });
    }

    const favorite = await Favorite.create({
      userId: req.user.id,
      componentId
    });

    const fullFavorite = await Favorite.findByPk(favorite.id, {
      include: [{
        model: ShowcaseComponent,
        as: 'component',
        include: ['category', 'style', 'variations', 'tags']
      }]
    });

    res.status(201).json(fullFavorite);
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:componentId', auth, async (req, res) => {
  try {
    const { componentId } = req.params;
    
    const result = await Favorite.destroy({
      where: { userId: req.user.id, componentId }
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({ message: 'Favorite removed' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/check/:componentId', auth, async (req, res) => {
  try {
    const { componentId } = req.params;
    
    const favorite = await Favorite.findOne({
      where: { userId: req.user.id, componentId }
    });

    res.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/popular', async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      attributes: [
        'componentId',
        [require('sequelize').fn('COUNT', require('sequelize').col('componentId')), 'favoriteCount']
      ],
      group: ['componentId'],
      order: [[require('sequelize').literal('count'), 'DESC']],
      limit: 10,
      raw: true
    });

    const componentIds = favorites.map(f => f.componentId);
    
    const components = await ShowcaseComponent.findAll({
      where: { id: componentIds },
      include: ['category', 'style', 'variations', 'tags']
    });

    const componentMap = {};
    components.forEach(c => { componentMap[c.id] = c; });
    
    const sortedComponents = componentIds.map(id => componentMap[id]).filter(Boolean);

    res.json(sortedComponents);
  } catch (error) {
    console.error('Popular favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
