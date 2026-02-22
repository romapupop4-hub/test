const express = require('express');
const { User } = require('../models');
const { auth, adminOnly } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const router = express.Router();

router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (role) {
      where.role = role;
    }
    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] }
    });

    res.json({
      users,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

router.put('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { username, email, avatar, bio } = req.body;

    const existingEmail = await User.findOne({ 
      where: { email, id: { [Op.ne]: user.id } }
    });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    const existingUsername = await User.findOne({ 
      where: { username, id: { [Op.ne]: user.id } }
    });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already in use.' });
    }

    await user.update({
      username: username || user.username,
      email: email || user.email,
      avatar: avatar !== undefined ? avatar : user.avatar,
      bio: bio !== undefined ? bio : user.bio
    });

    const { password: _, ...userData } = user.toJSON();
    res.json(userData);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

router.put('/me/password', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Failed to update password.' });
  }
});

router.put('/:id/role', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { role } = req.body;

    if (!['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot change your own role.' });
    }

    await user.update({ role });
    const { password: _, ...userData } = user.toJSON();
    res.json(userData);
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role.' });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account.' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

module.exports = router;
