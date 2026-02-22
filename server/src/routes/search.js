const express = require('express');
const router = express.Router();
const { ShowcaseComponent, Category, Style, Tag, User } = require('../models');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  try {
    const { 
      q = '', 
      categoryId, 
      styleId, 
      tags,
      page = 1, 
      limit = 20,
      sort = 'recent'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } }
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (styleId) {
      where.styleId = styleId;
    }

    let order;
    switch (sort) {
      case 'popular':
        order = [['views', 'DESC']];
        break;
      case 'name':
        order = [['name', 'ASC']];
        break;
      case 'recent':
      default:
        order = [['createdAt', 'DESC']];
    }

    const include = [
      { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
      { model: Style, as: 'style', attributes: ['id', 'name'] },
      { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'], through: { attributes: [] } },
      { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }
    ];

    if (tags) {
      const tagList = tags.split(',');
      include[2].where = {
        slug: { [Op.in]: tagList }
      };
      include[2].required = true;
    }

    const { count, rows: components } = await ShowcaseComponent.findAndCountAll({
      where,
      include,
      order,
      limit: parseInt(limit),
      offset,
      distinct: true
    });

    const categories = await Category.findAll({
      where: q ? {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { slug: { [Op.like]: `%${q}%` } }
        ]
      } : {},
      limit: 10
    });

    const styles = await Style.findAll({
      where: q ? {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } }
        ]
      } : {},
      limit: 10
    });

    res.json({
      components,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
      suggestions: {
        categories,
        styles
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const components = await ShowcaseComponent.findAll({
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Style, as: 'style', attributes: ['id', 'name'] },
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }
      ],
      order: [['views', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(components);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const components = await ShowcaseComponent.findAll({
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Style, as: 'style', attributes: ['id', 'name'] },
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(components);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/random', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const components = await ShowcaseComponent.findAll({
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Style, as: 'style', attributes: ['id', 'name'] },
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }
      ],
      order: Sequelize.literal('RAND()'),
      limit: parseInt(limit)
    });

    res.json(components);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
