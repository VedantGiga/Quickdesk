require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickdesk');
    
    // Create default categories
    const defaultCategories = [
      { name: 'technical', description: 'Technical support issues', color: '#007bff' },
      { name: 'billing', description: 'Billing and payment issues', color: '#28a745' },
      { name: 'general', description: 'General inquiries', color: '#6c757d' },
      { name: 'feature_request', description: 'Feature requests', color: '#17a2b8' },
      { name: 'bug_report', description: 'Bug reports', color: '#dc3545' }
    ];

    for (const cat of defaultCategories) {
      await Category.findOneAndUpdate(
        { name: cat.name },
        cat,
        { upsert: true, new: true }
      );
    }

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = new User({
        email: 'admin@quickdesk.com',
        password: 'admin123',
        role: 'admin',
        displayName: 'System Administrator',
        permissions: ['manage_users', 'manage_categories', 'manage_tickets', 'view_all_tickets', 'assign_tickets']
      });
      await admin.save();
      console.log('Admin user created: admin@quickdesk.com / admin123');
    }

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();