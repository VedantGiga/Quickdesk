require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const { authenticateUser, requireRole } = require('./middleware/auth');
const { User, Ticket } = require('./data/store');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

// Profile routes
app.get('/api/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.uid);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, profile: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/profile', authenticateUser, async (req, res) => {
  try {
    const { displayName, phone, company, timezone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.uid,
      { displayName, phone, company, timezone, avatar }
    );
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, profile: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Settings routes
app.get('/api/settings', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.uid);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ settings: user.settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', authenticateUser, async (req, res) => {
  try {
    const settings = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.uid,
      { settings }
    );
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, settings: user.settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Dashboard routes
app.get('/api/user/dashboard', authenticateUser, requireRole(['end_user']), async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.uid });
    
    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length,
    };
    
    const recentTickets = tickets
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    res.json({ stats, recentTickets });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

app.get('/api/agent/dashboard', authenticateUser, requireRole(['agent']), async (req, res) => {
  try {
    const allTickets = await Ticket.find({});
    const myTickets = await Ticket.find({ agentId: req.user.uid });
    
    const stats = {
      all: {
        total: allTickets.length,
        open: allTickets.filter(t => t.status === 'open').length,
        inProgress: allTickets.filter(t => t.status === 'in_progress').length,
        resolved: allTickets.filter(t => t.status === 'resolved').length,
        closed: allTickets.filter(t => t.status === 'closed').length,
      },
      my: {
        total: myTickets.length,
        open: myTickets.filter(t => t.status === 'open').length,
        inProgress: myTickets.filter(t => t.status === 'in_progress').length,
        resolved: myTickets.filter(t => t.status === 'resolved').length,
        closed: myTickets.filter(t => t.status === 'closed').length,
      }
    };
    
    const recentAll = allTickets
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
      
    const recentMy = myTickets
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
    
    res.json({ stats, recentTickets: { all: recentAll, my: recentMy } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent dashboard data' });
  }
});

// Metadata route
app.get('/api/metadata', authenticateUser, async (req, res) => {
  try {
    const { Category } = require('./data/store');
    const categories = await Category.find({ isActive: true });
    
    res.json({
      categories: categories.map(c => c.name),
      priorities: ['low', 'medium', 'high', 'urgent'],
      statuses: ['open', 'in_progress', 'resolved', 'closed']
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
});

app.get('/api/hello', (req, res) => {
  res.send('👋 Hello from QuickDesk Express backend!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});