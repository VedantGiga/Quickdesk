/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import { UserRole, AuthenticatedUser, createUserWithRole, updateUserRole } from './auth';
import { TicketStatus, TicketCategory, TicketPriority, createTicket, updateTicketStatus, addTicketReply, shareTicket, assignTicketToAgent, getAgentTickets } from './tickets';
import { getUserProfile, updateUserProfile, getUserSettings, updateUserSettings } from './user';

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Auth middleware
const authenticateUser = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: userDoc.data()?.role || UserRole.END_USER
    } as AuthenticatedUser;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based middleware
const requireRole = (roles: UserRole[]) => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Routes
app.get('/hello', (req, res) => {
  res.send('👋 Hello from QuickDesk backend!');
});

// Create user with role
app.post('/admin/create-user', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await createUserWithRole(email, password, role);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user role
app.post('/admin/update-role', async (req, res) => {
  try {
    const { uid, role } = req.body;
    await updateUserRole(uid, role);
    res.json({ success: true, message: `Role updated to ${role}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create ticket with validations (end users only)
app.post('/tickets', authenticateUser, requireRole([UserRole.END_USER]), async (req, res) => {
  try {
    const { title, description, category, priority, attachments, tags } = req.body;
    
    // Validations
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: 'Title must be at least 3 characters' });
    }
    if (!description || description.trim().length < 10) {
      return res.status(400).json({ error: 'Description must be at least 10 characters' });
    }
    if (!Object.values(TicketCategory).includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    
    const ticket = await createTicket(
      req.user.uid, 
      req.user.email, 
      title.trim(), 
      description.trim(),
      category,
      priority || TicketPriority.MEDIUM,
      attachments,
      tags
    );
    
    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Get user's tickets with filters, search, pagination, sorting
app.get('/user/tickets', authenticateUser, requireRole([UserRole.END_USER]), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      category, 
      priority, 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;
    
    let query = admin.firestore().collection('tickets')
      .where('userId', '==', req.user.uid);
    
    // Apply filters
    if (status) query = query.where('status', '==', status);
    if (category) query = query.where('category', '==', category);
    if (priority) query = query.where('priority', '==', priority);
    
    // Apply sorting
    query = query.orderBy(sortBy as string, sortOrder as 'asc' | 'desc');
    
    // Get total count for pagination
    const totalSnapshot = await query.get();
    const total = totalSnapshot.size;
    
    // Apply pagination
    const offset = (Number(page) - 1) * Number(limit);
    const paginatedQuery = query.offset(offset).limit(Number(limit));
    
    const snapshot = await paginatedQuery.get();
    let tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Apply search filter (client-side for simplicity)
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      tickets = tickets.filter(ticket => 
        ticket.title.toLowerCase().includes(searchTerm) ||
        ticket.description.toLowerCase().includes(searchTerm)
      );
    }
    
    res.json({ 
      tickets,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get tickets with multiple queues (agents only)
app.get('/agent/tickets', authenticateUser, requireRole([UserRole.AGENT]), async (req, res) => {
  try {
    const { queue = 'all', page = 1, limit = 10, status, category, priority, search, sortBy = 'updatedAt', sortOrder = 'desc' } = req.query;
    
    let query = admin.firestore().collection('tickets');
    
    // Apply queue filter
    if (queue === 'my') {
      query = query.where('agentId', '==', req.user.uid);
    }
    
    // Apply other filters
    if (status) query = query.where('status', '==', status);
    if (category) query = query.where('category', '==', category);
    if (priority) query = query.where('priority', '==', priority);
    
    // Apply sorting
    query = query.orderBy(sortBy as string, sortOrder as 'asc' | 'desc');
    
    // Get total count
    const totalSnapshot = await query.get();
    const total = totalSnapshot.size;
    
    // Apply pagination
    const offset = (Number(page) - 1) * Number(limit);
    const paginatedQuery = query.offset(offset).limit(Number(limit));
    
    const snapshot = await paginatedQuery.get();
    let tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Apply search filter
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      tickets = tickets.filter(ticket => 
        ticket.title.toLowerCase().includes(searchTerm) ||
        ticket.description.toLowerCase().includes(searchTerm) ||
        ticket.userEmail.toLowerCase().includes(searchTerm)
      );
    }
    
    res.json({ 
      tickets,
      queue,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Update ticket status (agents only)
app.put('/tickets/:id/status', authenticateUser, requireRole([UserRole.AGENT]), async (req, res) => {
  try {
    const { status } = req.body;
    const ticketId = req.params.id;
    
    if (!Object.values(TicketStatus).includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    await updateTicketStatus(ticketId, status, req.user.uid, req.user.email);
    res.json({ success: true, message: 'Ticket status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

// Add reply to ticket
app.post('/tickets/:id/replies', authenticateUser, requireRole([UserRole.AGENT, UserRole.END_USER]), async (req, res) => {
  try {
    const { message } = req.body;
    const ticketId = req.params.id;
    
    // Check if user owns the ticket (for end users) or is an agent
    if (req.user.role === UserRole.END_USER) {
      const ticketDoc = await admin.firestore().collection('tickets').doc(ticketId).get();
      if (!ticketDoc.exists || ticketDoc.data()?.userId !== req.user.uid) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    
    const reply = await addTicketReply(
      ticketId, 
      req.user.uid, 
      req.user.email, 
      message, 
      req.user.role === UserRole.AGENT
    );
    
    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add reply' });
  }
});

// Get ticket replies
app.get('/tickets/:id/replies', authenticateUser, requireRole([UserRole.AGENT, UserRole.END_USER]), async (req, res) => {
  try {
    const ticketId = req.params.id;
    
    // Check if user owns the ticket (for end users) or is an agent
    if (req.user.role === UserRole.END_USER) {
      const ticketDoc = await admin.firestore().collection('tickets').doc(ticketId).get();
      if (!ticketDoc.exists || ticketDoc.data()?.userId !== req.user.uid) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    
    const snapshot = await admin.firestore().collection('ticket_replies')
      .where('ticketId', '==', ticketId)
      .orderBy('createdAt', 'asc')
      .get();
    
    const replies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ replies });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch replies' });
  }
});

// Get single ticket details
app.get('/tickets/:id', authenticateUser, requireRole([UserRole.AGENT, UserRole.END_USER]), async (req, res) => {
  try {
    const ticketId = req.params.id;
    const ticketDoc = await admin.firestore().collection('tickets').doc(ticketId).get();
    
    if (!ticketDoc.exists) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    const ticketData = ticketDoc.data();
    
    // Check if user owns the ticket (for end users) or is an agent
    if (req.user.role === UserRole.END_USER && ticketData?.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json({ ticket: { id: ticketDoc.id, ...ticketData } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// Get user profile
app.get('/profile', authenticateUser, requireRole([UserRole.AGENT, UserRole.END_USER]), async (req, res) => {
  try {
    const profile = await getUserProfile(req.user.uid);
    res.json({ 
      user: req.user,
      profile: profile || {
        uid: req.user.uid,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
app.put('/profile', authenticateUser, requireRole([UserRole.AGENT, UserRole.END_USER]), async (req, res) => {
  try {
    const { displayName, phone, company, timezone, avatar } = req.body;
    const profileData = { displayName, phone, company, timezone, avatar };
    
    const updatedProfile = await updateUserProfile(req.user.uid, profileData);
    res.json({ success: true, profile: updatedProfile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user settings
app.get('/settings', authenticateUser, requireRole([UserRole.AGENT, UserRole.END_USER]), async (req, res) => {
  try {
    const settings = await getUserSettings(req.user.uid);
    res.json({ settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update user settings
app.put('/settings', authenticateUser, requireRole([UserRole.AGENT, UserRole.END_USER]), async (req, res) => {
  try {
    const settings = req.body;
    const updatedSettings = await updateUserSettings(req.user.uid, settings);
    res.json({ success: true, settings: updatedSettings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Get ticket categories and priorities (for dropdowns)
app.get('/metadata', authenticateUser, requireRole([UserRole.AGENT, UserRole.END_USER]), (req, res) => {
  res.json({
    categories: Object.values(TicketCategory),
    priorities: Object.values(TicketPriority),
    statuses: Object.values(TicketStatus)
  });
});

// Get user dashboard stats
app.get('/user/dashboard', authenticateUser, requireRole([UserRole.END_USER]), async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('tickets')
      .where('userId', '==', req.user.uid)
      .get();
    
    const tickets = snapshot.docs.map(doc => doc.data());
    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === TicketStatus.OPEN).length,
      inProgress: tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
      resolved: tickets.filter(t => t.status === TicketStatus.RESOLVED).length,
      closed: tickets.filter(t => t.status === TicketStatus.CLOSED).length,
    };
    
    // Get recent tickets
    const recentTickets = tickets
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);
    
    res.json({ stats, recentTickets });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Agent dashboard stats
app.get('/agent/dashboard', authenticateUser, requireRole([UserRole.AGENT]), async (req, res) => {
  try {
    // Get all tickets stats
    const allTicketsSnapshot = await admin.firestore().collection('tickets').get();
    const allTickets = allTicketsSnapshot.docs.map(doc => doc.data());
    
    // Get agent's assigned tickets
    const myTickets = await getAgentTickets(req.user.uid);
    
    const stats = {
      all: {
        total: allTickets.length,
        open: allTickets.filter(t => t.status === TicketStatus.OPEN).length,
        inProgress: allTickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
        resolved: allTickets.filter(t => t.status === TicketStatus.RESOLVED).length,
        closed: allTickets.filter(t => t.status === TicketStatus.CLOSED).length,
      },
      my: {
        total: myTickets.length,
        open: myTickets.filter(t => t.status === TicketStatus.OPEN).length,
        inProgress: myTickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
        resolved: myTickets.filter(t => t.status === TicketStatus.RESOLVED).length,
        closed: myTickets.filter(t => t.status === TicketStatus.CLOSED).length,
      }
    };
    
    // Get recent tickets from both queues
    const recentAll = allTickets
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5);
      
    const recentMy = myTickets
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5);
    
    res.json({ stats, recentTickets: { all: recentAll, my: recentMy } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent dashboard data' });
  }
});

// Create ticket as agent (for customers)
app.post('/agent/tickets', authenticateUser, requireRole([UserRole.AGENT]), async (req, res) => {
  try {
    const { title, description, category, priority, userEmail, attachments, tags } = req.body;
    
    // Validations
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: 'Title must be at least 3 characters' });
    }
    if (!description || description.trim().length < 10) {
      return res.status(400).json({ error: 'Description must be at least 10 characters' });
    }
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }
    if (!Object.values(TicketCategory).includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    
    // Get user ID from email (or create placeholder)
    let userId = 'agent-created';
    try {
      const userRecord = await admin.auth().getUserByEmail(userEmail);
      userId = userRecord.uid;
    } catch (error) {
      // User doesn't exist, use placeholder
    }
    
    const ticket = await createTicket(
      userId,
      userEmail,
      title.trim(),
      description.trim(),
      category,
      priority || TicketPriority.MEDIUM,
      attachments,
      tags
    );
    
    // Auto-assign to creating agent
    await assignTicketToAgent(ticket.id, req.user.uid, req.user.email);
    
    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Assign ticket to agent
app.put('/tickets/:id/assign', authenticateUser, requireRole([UserRole.AGENT]), async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { agentId, agentEmail } = req.body;
    
    await assignTicketToAgent(ticketId, agentId || req.user.uid, agentEmail || req.user.email);
    res.json({ success: true, message: 'Ticket assigned successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign ticket' });
  }
});

// Share ticket with other agents
app.post('/tickets/:id/share', authenticateUser, requireRole([UserRole.AGENT]), async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { sharedWith, note } = req.body;
    
    if (!sharedWith || !Array.isArray(sharedWith)) {
      return res.status(400).json({ error: 'sharedWith must be an array of agent IDs' });
    }
    
    const share = await shareTicket(ticketId, req.user.uid, sharedWith, note);
    res.json({ success: true, share });
  } catch (error) {
    res.status(500).json({ error: 'Failed to share ticket' });
  }
});

// Get shared tickets
app.get('/agent/shared-tickets', authenticateUser, requireRole([UserRole.AGENT]), async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('ticket_shares')
      .where('sharedWith', 'array-contains', req.user.uid)
      .orderBy('sharedAt', 'desc')
      .get();
    
    const shares = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Get ticket details for each share
    const ticketIds = shares.map(share => share.ticketId);
    const ticketPromises = ticketIds.map(id => 
      admin.firestore().collection('tickets').doc(id).get()
    );
    
    const ticketDocs = await Promise.all(ticketPromises);
    const tickets = ticketDocs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.json({ shares, tickets });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shared tickets' });
  }
});

export const api = functions.https.onRequest(app);

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
