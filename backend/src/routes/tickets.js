const express = require('express');
const { Ticket, User } = require('../data/store');
const { authenticateUser, requireRole } = require('../middleware/auth');

// In-memory storage for replies
const ticketReplies = [];
let replyIdCounter = 1;

const router = express.Router();

// Create ticket (end users only)
router.post('/', authenticateUser, requireRole(['end_user']), async (req, res) => {
  try {
    const { title, description, category, priority = 'medium', attachments = [], tags = [] } = req.body;
    
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: 'Title must be at least 3 characters' });
    }
    if (!description || description.trim().length < 10) {
      return res.status(400).json({ error: 'Description must be at least 10 characters' });
    }

    const ticket = await Ticket.create({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      userId: req.user.uid,
      userEmail: req.user.email,
      attachments,
      tags
    });
    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Get user's tickets with filters
router.get('/user', authenticateUser, requireRole(['end_user']), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, priority, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = { userId: req.user.uid };
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    const skip = (page - 1) * limit;

    let tickets = await Ticket.find(query);
    
    if (search) {
      const searchLower = search.toLowerCase();
      tickets = tickets.filter(ticket => 
        ticket.title.toLowerCase().includes(searchLower) || 
        ticket.description.toLowerCase().includes(searchLower)
      );
    }

    const total = tickets.length;
    
    // Sort tickets
    tickets.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (sortOrder === 'desc') {
        return new Date(bVal) - new Date(aVal);
      }
      return new Date(aVal) - new Date(bVal);
    });
    
    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    tickets = tickets.slice(startIndex, endIndex);

    res.json({
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get agent tickets with queues
router.get('/agent', authenticateUser, requireRole(['agent']), async (req, res) => {
  try {
    const { queue = 'all', page = 1, limit = 10, status, category, priority, search, sortBy = 'updatedAt', sortOrder = 'desc' } = req.query;
    
    let query = {};
    if (queue === 'my') query.agentId = req.user.uid;
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    const skip = (page - 1) * limit;

    let tickets = await Ticket.find(query);
    
    if (search) {
      const searchLower = search.toLowerCase();
      tickets = tickets.filter(ticket => 
        ticket.title.toLowerCase().includes(searchLower) || 
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.userEmail.toLowerCase().includes(searchLower)
      );
    }

    const total = tickets.length;
    
    // Sort tickets
    tickets.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (sortOrder === 'desc') {
        return new Date(bVal) - new Date(aVal);
      }
      return new Date(aVal) - new Date(bVal);
    });
    
    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    tickets = tickets.slice(startIndex, endIndex);

    res.json({
      tickets,
      queue,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Update ticket status (agents only)
router.put('/:id/status', authenticateUser, requireRole(['agent']), async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        agentId: req.user.uid,
        agentEmail: req.user.email
      }
    );
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

// Add reply to ticket
router.post('/:id/replies', authenticateUser, requireRole(['agent', 'end_user']), async (req, res) => {
  try {
    const { message } = req.body;
    const ticketId = req.params.id;
    
    if (req.user.role === 'end_user') {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket || ticket.userId !== req.user.uid) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    
    const reply = {
      id: (replyIdCounter++).toString(),
      ticketId,
      userId: req.user.uid,
      userEmail: req.user.email,
      message,
      isAgent: req.user.role === 'agent',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    ticketReplies.push(reply);
    await Ticket.findByIdAndUpdate(ticketId, { updatedAt: new Date() });
    
    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add reply' });
  }
});

// Get ticket replies
router.get('/:id/replies', authenticateUser, requireRole(['agent', 'end_user']), async (req, res) => {
  try {
    const ticketId = req.params.id;
    
    if (req.user.role === 'end_user') {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket || ticket.userId !== req.user.uid) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    
    const replies = ticketReplies
      .filter(reply => reply.ticketId === ticketId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    res.json({ replies });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch replies' });
  }
});

// Get single ticket
router.get('/:id', authenticateUser, requireRole(['agent', 'end_user']), async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    if (req.user.role === 'end_user' && ticket.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

module.exports = router;