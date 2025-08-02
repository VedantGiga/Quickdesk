const express = require('express');
const { Category } = require('../data/store');
const { authenticateUser, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/', authenticateUser, async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    categories.sort((a, b) => a.name.localeCompare(b.name));
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get all categories (including inactive) - admin only
router.get('/all', authenticateUser, requireRole(['admin']), async (req, res) => {
  try {
    const categories = await Category.find();
    categories.sort((a, b) => a.name.localeCompare(b.name));
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create category (admin only)
router.post('/', authenticateUser, requireRole(['admin']), async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    // Check if category already exists
    const existing = await Category.find();
    if (existing.some(cat => cat.name === name)) {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    
    const category = await Category.create({ name, description, color });
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category (admin only)
router.put('/:id', authenticateUser, requireRole(['admin']), async (req, res) => {
  try {
    const { name, description, color, isActive } = req.body;
    
    // Check if name already exists (excluding current category)
    const existing = await Category.find();
    if (name && existing.some(cat => cat.name === name && cat.id !== req.params.id)) {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, color, isActive }
    );
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category (admin only)
router.delete('/:id', authenticateUser, requireRole(['admin']), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Remove category from store
    const { store } = require('../data/store');
    const categoryIndex = store.categories.findIndex(c => c.id === req.params.id);
    if (categoryIndex > -1) store.categories.splice(categoryIndex, 1);
    
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;