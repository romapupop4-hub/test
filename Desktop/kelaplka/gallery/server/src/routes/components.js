const express = require('express');
const router = express.Router();
const { ShowcaseComponent, Category, Style, Variation, Tag, User, ComponentView } = require('../models');
const { Op } = require('sequelize');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { categoryId, styleId, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (categoryId) where.categoryId = categoryId;
    if (styleId) where.styleId = styleId;

    const { count, rows: components } = await ShowcaseComponent.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category' },
        { model: Style, as: 'style' },
        { model: Variation, as: 'variations' },
        { model: Tag, as: 'tags' },
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      components,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const component = await ShowcaseComponent.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Style, as: 'style' },
        { model: Variation, as: 'variations' },
        { model: Tag, as: 'tags' },
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }
      ]
    });

    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }

    await ComponentView.create({
      componentId: component.id,
      viewedAt: new Date()
    });

    res.json(component);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, description, categoryId, styleId, htmlCode, cssCode, reactCode, thumbnail, previewUrl, tags, variations } = req.body;

    const component = await ShowcaseComponent.create({
      name,
      description,
      categoryId,
      styleId,
      htmlCode,
      cssCode,
      reactCode,
      thumbnail,
      previewUrl,
      authorId: req.user.id
    });

    if (tags && tags.length > 0) {
      const tagObjects = await Tag.findAll({
        where: { id: { [Op.in]: tags } }
      });
      await component.addTags(tagObjects);
    }

    if (variations && variations.length > 0) {
      for (const variation of variations) {
        await Variation.create({
          componentId: component.id,
          name: variation.name,
          code: variation.code,
          thumbnail: variation.thumbnail
        });
      }
    }

    const fullComponent = await ShowcaseComponent.findByPk(component.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Style, as: 'style' },
        { model: Variation, as: 'variations' },
        { model: Tag, as: 'tags' }
      ]
    });

    res.status(201).json(fullComponent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const component = await ShowcaseComponent.findByPk(req.params.id);
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }

    const { name, description, categoryId, styleId, htmlCode, cssCode, reactCode, thumbnail, previewUrl, tags, variations } = req.body;

    await component.update({
      name: name || component.name,
      description: description || component.description,
      categoryId: categoryId || component.categoryId,
      styleId: styleId || component.styleId,
      htmlCode: htmlCode || component.htmlCode,
      cssCode: cssCode || component.cssCode,
      reactCode: reactCode || component.reactCode,
      thumbnail: thumbnail || component.thumbnail,
      previewUrl: previewUrl || component.previewUrl
    });

    if (tags) {
      const tagObjects = await Tag.findAll({
        where: { id: { [Op.in]: tags } }
      });
      await component.setTags(tagObjects);
    }

    if (variations) {
      await Variation.destroy({ where: { componentId: component.id } });
      for (const variation of variations) {
        await Variation.create({
          componentId: component.id,
          name: variation.name,
          code: variation.code,
          thumbnail: variation.thumbnail
        });
      }
    }

    const fullComponent = await ShowcaseComponent.findByPk(component.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Style, as: 'style' },
        { model: Variation, as: 'variations' },
        { model: Tag, as: 'tags' }
      ]
    });

    res.json(fullComponent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const component = await ShowcaseComponent.findByPk(req.params.id);
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }
    await component.destroy();
    res.json({ message: 'Component deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/code', async (req, res) => {
  try {
    const component = await ShowcaseComponent.findByPk(req.params.id);
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }
    res.json({
      htmlCode: component.htmlCode,
      cssCode: component.cssCode,
      reactCode: component.reactCode
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
