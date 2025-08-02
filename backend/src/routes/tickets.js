const express = require('express');
const Ticket = require('../models/Ticket');
const TicketReply = require('../models/TicketReply');
const TicketShare = require('../models/TicketShare');
const User = require('../models/User');
const { authenticateUser, requireRole } = require('../middleware/auth');

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

    const ticket = new Ticket({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      userId: req.user.uid,
      userEmail: req.user.email,
      attachments,
      tags
    });

    await ticket.save();
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

    let tickets = await Ticket.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      tickets = tickets.filter(ticket => 
        searchRegex.test(ticket.title) || searchRegex.test(ticket.description)
      );
    }

    const total = await Ticket.countDocuments(query);

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

    let tickets = await Ticket.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      tickets = tickets.filter(ticket => 
        searchRegex.test(ticket.title) || 
        searchRegex.test(ticket.description) ||
        searchRegex.test(ticket.userEmail)
      );
    }

    const total = await Ticket.countDocuments(query);

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
      },
      { new: true }
    );
    
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
      if (!ticket || ticket.userId.toString() !== req.user.uid) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    
    const reply = new TicketReply({
      ticketId,
      userId: req.user.uid,
      userEmail: req.user.email,
      message,
      isAgent: req.user.role === 'agent'
    });
    
    await reply.save();
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
      if (!ticket || ticket.userId.toString() !== req.user.uid) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    
    const replies = await TicketReply.find({ ticketId }).sort({ createdAt: 1 });
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
    
    if (req.user.role === 'end_user' && ticket.userId.toString() !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

module.exports = router;