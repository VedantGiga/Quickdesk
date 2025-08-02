const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['open', 'in_progress', 'resolved', 'closed'], 
    default: 'open' 
  },
  category: { 
    type: String, 
    enum: ['technical', 'billing', 'general', 'feature_request', 'bug_report'],
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'], 
    default: 'medium' 
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String, required: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  agentEmail: String,
  attachments: [{
    id: String,
    filename: String,
    url: String,
    size: Number,
    type: String
  }],
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);