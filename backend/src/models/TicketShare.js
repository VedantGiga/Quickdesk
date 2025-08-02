const mongoose = require('mongoose');

const ticketShareSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  sharedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  note: String
}, { timestamps: true });

module.exports = mongoose.model('TicketShare', ticketShareSchema);