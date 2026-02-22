const express = require('express');
const router = express.Router();
const { Style } = require('../models');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const styles = await Style.findAll({
      order: [['name', 'ASC']]
    });
    res.json(styles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const style = await Style.findByPk(req.params.id, {
      include: ['components']
    });
    if (!style) {
      return res.status(404).json({ message: 'Style not found' });
    }
    res.json(style);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, description, cssVariables, previewUrl } = req.body;
    const style = await Style.create({
      name,
      description,
      cssVariables: JSON.stringify(cssVariables),
      previewUrl
    });
    res.status(201).json(style);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const style = await Style.findByPk(req.params.id);
    if (!style) {
      return res.status(404).json({ message: 'Style not found' });
    }
    const { name, description, cssVariables, previewUrl } = req.body;
    await style.update({
      name: name || style.name,
      description: description || style.description,
      cssVariables: cssVariables ? JSON.stringify(cssVariables) : style.cssVariables,
      previewUrl: previewUrl || style.previewUrl
    });
    res.json(style);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const style = await Style.findByPk(req.params.id);
    if (!style) {
      return res.status(404).json({ message: 'Style not found' });
    }
    await style.destroy();
    res.json({ message: 'Style deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
