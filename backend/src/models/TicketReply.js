const mongoose = require('mongoose');

const ticketReplySchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String, required: true },
  message: { type: String, required: true },
  isAgent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('TicketReply', ticketReplySchema);