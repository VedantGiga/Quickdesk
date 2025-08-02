const requirePermission = (permission) => {
  return (req, res, next) => {
    if (req.user.role === 'admin') {
      return next(); // Admins have all permissions
    }
    
    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_CATEGORIES: 'manage_categories',
  MANAGE_TICKETS: 'manage_tickets',
  VIEW_ALL_TICKETS: 'view_all_tickets',
  ASSIGN_TICKETS: 'assign_tickets'
};

module.exports = { requirePermission, PERMISSIONS };