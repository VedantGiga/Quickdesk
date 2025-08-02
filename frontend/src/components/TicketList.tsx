import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ticketService, Ticket } from '../services/tickets';

const TicketList: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    search: '',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    loadTickets();
  }, [filters, user]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      let data;
      
      if (user?.role === 'agent') {
        data = await ticketService.getAgentTickets(filters);
      } else {
        data = await ticketService.getUserTickets(filters);
      }
      
      setTickets(data.tickets);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId: string, status: string) => {
    try {
      await ticketService.updateTicketStatus(ticketId, status);
      loadTickets();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading tickets...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search tickets..."
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
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
            onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
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
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Tickets */}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
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
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Created: {new Date(ticket.createdAt).toLocaleDateString()}
                  {ticket.agentEmail && (
                    <span className="ml-4">Agent: {ticket.agentEmail}</span>
                  )}
                </div>
              </div>
              
              {user?.role === 'agent' && (
                <div className="ml-4">
                  <select
                    className="px-3 py-1 text-sm border border-gray-300 rounded"
                    value={ticket.status}
                    onChange={(e) => handleStatusUpdate(ticket._id, e.target.value)}
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