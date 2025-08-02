const express = require('express');
const { User } = require('../data/store');
const { authenticateUser, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateUser, requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    let users = await User.find(role ? { role } : {});
    
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(user => 
        user.email.toLowerCase().includes(searchLower) ||
        (user.displayName && user.displayName.toLowerCase().includes(searchLower))
      );
    }

    const total = users.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = users.slice(startIndex, endIndex).map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({ users: paginatedUsers, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role and permissions (admin only)
router.put('/:id/role', authenticateUser, requireRole(['admin']), async (req, res) => {
  try {
    const { role, permissions } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, permissions }
    );
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Toggle user active status (admin only)
router.put('/:id/status', authenticateUser, requireRole(['admin']), async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive }
    );
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticateUser, requireRole(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Remove user from store
    const { store } = require('../data/store');
    const userIndex = store.users.findIndex(u => u.id === req.params.id);
    if (userIndex > -1) store.users.splice(userIndex, 1);
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;