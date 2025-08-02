const bcrypt = require('bcryptjs');

// In-memory data store
const store = {
  users: [],
  tickets: [],
  categories: [
    { id: '1', name: 'technical', description: 'Technical support issues', color: '#007bff', isActive: true },
    { id: '2', name: 'billing', description: 'Billing and payment issues', color: '#28a745', isActive: true },
    { id: '3', name: 'general', description: 'General inquiries', color: '#6c757d', isActive: true },
    { id: '4', name: 'feature_request', description: 'Feature requests', color: '#17a2b8', isActive: true },
    { id: '5', name: 'bug_report', description: 'Bug reports', color: '#dc3545', isActive: true }
  ],
  nextId: 1
};

// Initialize with admin user
const initializeStore = async () => {
  if (store.users.length === 0) {
    console.log('Initializing store with admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    store.users.push({
      id: '1',
      email: 'admin@quickdesk.com',
      password: hashedPassword,
      role: 'admin',
      displayName: 'System Administrator',
      permissions: ['manage_users', 'manage_categories', 'manage_tickets', 'view_all_tickets', 'assign_tickets'],
      isActive: true,
      settings: {
        notifications: {
          emailNotifications: true,
          pushNotifications: true,
          ticketUpdates: true,
          agentReplies: true,
          statusChanges: true
        },
        language: 'en',
        theme: 'light'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    store.nextId = 2;
    console.log('Admin user created successfully');
  } else {
    console.log('Store already initialized with', store.users.length, 'users');
  }
};

const generateId = () => (store.nextId++).toString();

// User operations
const User = {
  async findOne(query) {
    return store.users.find(user => {
      if (query.email) return user.email === query.email;
      if (query.role) return user.role === query.role;
      return false;
    });
  },

  async findById(id) {
    console.log('Looking for user with id:', id, 'in store with', store.users.length, 'users');
    const user = store.users.find(user => user.id === id);
    console.log('Found user:', user ? 'Yes' : 'No');
    return user;
  },

  async findByIdAndUpdate(id, update, options = {}) {
    const userIndex = store.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;
    
    store.users[userIndex] = { ...store.users[userIndex], ...update, updatedAt: new Date() };
    return store.users[userIndex];
  },

  async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = {
      id: generateId(),
      ...userData,
      password: hashedPassword,
      isActive: true,
      settings: {
        notifications: {
          emailNotifications: true,
          pushNotifications: true,
          ticketUpdates: true,
          agentReplies: true,
          statusChanges: true
        },
        language: 'en',
        theme: 'light'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    store.users.push(user);
    return user;
  },

  async comparePassword(user, password) {
    return bcrypt.compare(password, user.password);
  },

  async find(query = {}) {
    return store.users.filter(user => {
      if (query.role && user.role !== query.role) return false;
      if (query.isActive !== undefined && user.isActive !== query.isActive) return false;
      return true;
    });
  }
};

// Ticket operations
const Ticket = {
  async find(query = {}) {
    return store.tickets.filter(ticket => {
      if (query.userId && ticket.userId !== query.userId) return false;
      if (query.agentId && ticket.agentId !== query.agentId) return false;
      return true;
    });
  },

  async findById(id) {
    return store.tickets.find(ticket => ticket.id === id);
  },

  async create(ticketData) {
    const ticket = {
      id: generateId(),
      ...ticketData,
      status: ticketData.status || 'open',
      priority: ticketData.priority || 'medium',
      attachments: ticketData.attachments || [],
      tags: ticketData.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    store.tickets.push(ticket);
    return ticket;
  },

  async findByIdAndUpdate(id, update, options = {}) {
    const ticketIndex = store.tickets.findIndex(ticket => ticket.id === id);
    if (ticketIndex === -1) return null;
    
    store.tickets[ticketIndex] = { ...store.tickets[ticketIndex], ...update, updatedAt: new Date() };
    return store.tickets[ticketIndex];
  }
};

// Category operations
const Category = {
  async find(query = {}) {
    return store.categories.filter(category => {
      if (query.isActive !== undefined && category.isActive !== query.isActive) return false;
      return true;
    });
  },

  async findById(id) {
    return store.categories.find(category => category.id === id);
  },

  async create(categoryData) {
    const category = {
      id: generateId(),
      ...categoryData,
      isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    store.categories.push(category);
    return category;
  },

  async findByIdAndUpdate(id, update, options = {}) {
    const categoryIndex = store.categories.findIndex(category => category.id === id);
    if (categoryIndex === -1) return null;
    
    store.categories[categoryIndex] = { ...store.categories[categoryIndex], ...update, updatedAt: new Date() };
    return store.categories[categoryIndex];
  }
};

// Initialize store immediately
initializeStore().catch(console.error);

module.exports = { User, Ticket, Category, store };