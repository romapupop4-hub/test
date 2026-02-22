const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const { Setting } = require('../models');

const DEFAULT_SETTINGS = {
  siteName: 'UI Asset Gallery',
  siteDescription: 'A comprehensive gallery for UI components, styles, and assets',
  allowPublicUpload: false,
  maxUploadSize: 10485760,
  itemsPerPage: 12,
  enableComments: true,
  enableRatings: true,
  maintenanceMode: false,
  theme: 'system'
};

router.get('/', async (req, res) => {
  try {
    const settings = await Setting.findAll();
    
    const settingsObj = { ...DEFAULT_SETTINGS };
    settings.forEach(s => {
      try {
        settingsObj[s.key] = JSON.parse(s.value);
      } catch {
        settingsObj[s.key] = s.value;
      }
    });
    
    res.json(settingsObj);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    
    const setting = await Setting.findOne({ where: { key } });
    
    if (setting) {
      try {
        res.json({ key, value: JSON.parse(setting.value) });
      } catch {
        res.json({ key, value: setting.value });
      }
    } else {
      res.json({ key, value: DEFAULT_SETTINGS[key] || null });
    }
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:key', auth, adminOnly, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    if (!(key in DEFAULT_SETTINGS)) {
      return res.status(400).json({ message: 'Invalid setting key' });
    }
    
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    
    const [setting, created] = await Setting.findOrCreate({
      where: { key },
      defaults: { value: stringValue }
    });
    
    if (!created) {
      setting.value = stringValue;
      await setting.save();
    }
    
    res.json({ key, value });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/', auth, adminOnly, async (req, res) => {
  try {
    const updates = req.body;
    
    for (const [key, value] of Object.entries(updates)) {
      if (!(key in DEFAULT_SETTINGS)) {
        continue;
      }
      
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      
      await Setting.upsert({ key, value: stringValue });
    }
    
    const settings = await Setting.findAll();
    const settingsObj = { ...DEFAULT_SETTINGS };
    settings.forEach(s => {
      try {
        settingsObj[s.key] = JSON.parse(s.value);
      } catch {
        settingsObj[s.key] = s.value;
      }
    });
    
    res.json(settingsObj);
  } catch (error) {
    console.error('Bulk update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:key', auth, adminOnly, async (req, res) => {
  try {
    const { key } = req.params;
    
    if (!(key in DEFAULT_SETTINGS)) {
      return res.status(400).json({ message: 'Invalid setting key' });
    }
    
    await Setting.destroy({ where: { key } });
    
    res.json({ message: 'Setting reset to default', key, value: DEFAULT_SETTINGS[key] });
  } catch (error) {
    console.error('Reset setting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset', auth, adminOnly, async (req, res) => {
  try {
    await Setting.destroy({ where: { } });
    
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await Setting.create({ key, value: stringValue });
    }
    
    res.json({ message: 'Settings reset to defaults', settings: DEFAULT_SETTINGS });
  } catch (error) {
    console.error('Reset all settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
