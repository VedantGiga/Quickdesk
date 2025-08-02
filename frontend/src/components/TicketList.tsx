import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firebaseTicketService, Ticket } from '../services/firebaseTickets';
import { Link } from 'react-router-dom';

const TicketList: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    search: '',
    sortBy: 'recent',
    showOwn: user?.role === 'user'
  });

  useEffect(() => {
    loadTickets();
  }, [filters, user]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      let data;
      
      if (filters.showOwn && user) {
        data = await firebaseTicketService.getUserTickets(user.uid, filters);
      } else {
        data = await firebaseTicketService.getAllTickets(filters);
      }
      
      // Apply search filter
      if (filters.search) {
        const searchRegex = new RegExp(filters.search, 'i');
        data = data.filter((ticket: any) => 
          searchRegex.test(ticket.title) || searchRegex.test(ticket.description)
        );
      }
      
      setTickets(data as Ticket[]);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId: string, status: string) => {
    try {
      await firebaseTicketService.updateTicketStatus(ticketId, status, user?.uid, user?.email);
      loadTickets();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleVote = async (ticketId: string, voteType: 'up' | 'down') => {
    try {
      await firebaseTicketService.voteTicket(ticketId, voteType);
      loadTickets();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading tickets...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="Search tickets..."
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
            <option value="general">General</option>
            <option value="feature_request">Feature Request</option>
            <option value="bug_report">Bug Report</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          >
            <option value="recent">Recently Modified</option>
            <option value="replies">Most Replied</option>
          </select>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.showOwn}
              onChange={(e) => setFilters({ ...filters, showOwn: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">My Tickets Only</span>
          </label>
        </div>
      </div>

      {/* Tickets */}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-white p-6 rounded-lg shadow card-hover">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Link to={`/ticket/${ticket.id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  {ticket.title}
                </Link>
                <p className="text-gray-600 mt-1">{ticket.description.substring(0, 150)}...</p>
                <div className="flex space-x-2 mt-3">
                  <span className={`px-2 py-1 text-xs rounded ${
                    ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                    ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {ticket.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                    {ticket.category.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                    {ticket.replyCount} replies
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="text-sm text-gray-500">
                    Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    {ticket.agentEmail && (
                      <span className="ml-4">Agent: {ticket.agentEmail}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVote(ticket.id!, 'up')}
                      className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      <span>👍</span>
                      <span>{ticket.upvotes}</span>
                    </button>
                    <button
                      onClick={() => handleVote(ticket.id!, 'down')}
                      className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      <span>👎</span>
                      <span>{ticket.downvotes}</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {user?.role === 'agent' && (
                <div className="ml-4">
                  <select
                    className="px-3 py-1 text-sm border border-gray-300 rounded"
                    value={ticket.status}
                    onChange={(e) => handleStatusUpdate(ticket.id!, e.target.value)}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {tickets.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No tickets found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default TicketList;