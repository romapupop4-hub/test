const express = require('express');
const { Category } = require('../models');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { parent_id } = req.query;
    const where = parent_id ? { parentId: parent_id } : { parentId: null };
    
    const categories = await Category.findAll({
      where,
      include: [{
        model: Category,
        as: 'children',
        include: [{ model: Category, as: 'children' }]
      }],
      order: [['order', 'ASC'], ['name', 'ASC']]
    });

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'children' },
        { model: Category, as: 'parent' }
      ]
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to fetch category.' });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, slug, description, icon, parent_id, order } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required.' });
    }

    const existing = await Category.findOne({ where: { slug } });
    if (existing) {
      return res.status(400).json({ error: 'Category with this slug already exists.' });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      icon,
      parentId: parent_id || null,
      order: order || 0
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category.' });
  }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    const { name, description, icon, parent_id, order } = req.body;

    await category.update({
      name: name || category.name,
      description: description !== undefined ? description : category.description,
      icon: icon !== undefined ? icon : category.icon,
      parentId: parent_id !== undefined ? parent_id : category.parentId,
      order: order !== undefined ? order : category.order
    });

    res.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category.' });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    const hasChildren = await Category.count({ where: { parentId: category.id } });
    if (hasChildren > 0) {
      return res.status(400).json({ error: 'Cannot delete category with subcategories.' });
    }

    await category.destroy();
    res.json({ message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category.' });
  }
});

module.exports = router;
