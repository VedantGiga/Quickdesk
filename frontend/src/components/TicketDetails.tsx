import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { firebaseTicketService, Ticket, TicketReply } from '../services/firebaseTickets';

const TicketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTicketDetails();
    }
  }, [id]);

  const loadTicketDetails = async () => {
    try {
      // Note: You'll need to implement getTicket in firebaseTicketService
      const replies = await firebaseTicketService.getReplies(id!);
      setReplies(replies as TicketReply[]);
    } catch (error) {
      console.error('Failed to load ticket details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim() || !user) return;

    try {
      await firebaseTicketService.addReply(id!, {
        ticketId: id!,
        userId: user.uid,
        userEmail: user.email,
        message: newReply,
        isAgent: user.role === 'agent'
      });
      setNewReply('');
      loadTicketDetails();
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!id) return;
    try {
      await firebaseTicketService.voteTicket(id, voteType);
      loadTicketDetails();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!id || !user || user.role !== 'agent') return;
    try {
      await firebaseTicketService.updateTicketStatus(id, newStatus, user.uid, user.email);
      loadTicketDetails();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!ticket) return <div className="p-6">Ticket not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Ticket Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleVote('up')}
              className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <span>👍</span>
              <span>{ticket.upvotes}</span>
            </button>
            <button
              onClick={() => handleVote('down')}
              className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <span>👎</span>
              <span>{ticket.downvotes}</span>
            </button>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">{ticket.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm ${
            ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
            ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {ticket.status.replace('_', ' ').toUpperCase()}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            {ticket.category}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            {ticket.priority}
          </span>
        </div>

        {user?.role === 'agent' && (
          <div className="flex space-x-2">
            {['open', 'in_progress', 'resolved', 'closed'].map(status => (
              <button
                key={status}
                onClick={() => handleStatusUpdate(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  ticket.status === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Replies */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Replies ({replies.length})</h2>
        <div className="space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className={`p-4 rounded-lg ${
              reply.isAgent ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-gray-900">
                  {reply.userEmail} {reply.isAgent && <span className="text-blue-600">(Agent)</span>}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(reply.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700">{reply.message}</p>
            </div>
          ))}
        </div>

        {/* Add Reply Form */}
        <form onSubmit={handleAddReply} className="mt-6">
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Add a reply..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            required
          />
          <button
            type="submit"
            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Reply
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetails;