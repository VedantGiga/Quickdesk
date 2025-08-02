import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ticketService, Ticket } from '../services/tickets';

const AgentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [activeQueue, setActiveQueue] = useState<'all' | 'my'>('all');

  useEffect(() => {
    loadDashboard();
  }, [activeQueue]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDashboard = async () => {
    try {
      const [dashboardData, ticketsData] = await Promise.all([
        ticketService.getAgentDashboard(),
        ticketService.getAgentTickets({ queue: activeQueue, limit: 10 })
      ]);
      setStats(dashboardData.stats);
      setTickets(ticketsData.tickets);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId: string, status: string) => {
    try {
      await ticketService.updateTicketStatus(ticketId, status);
      loadDashboard();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">QuickDesk - Agent Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveQueue('all')}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeQueue === 'all'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All Tickets
                </button>
                <button
                  onClick={() => setActiveQueue('my')}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeQueue === 'my'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Tickets
                </button>
              </div>
              <span className="text-gray-700">{user?.email}</span>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                {user?.role}
              </span>
              <button onClick={logout} className="text-gray-500 hover:text-gray-700">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Agent Dashboard</h2>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">All Tickets</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.all?.total || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">My Tickets</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.my?.total || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Open</h3>
              <p className="text-2xl font-bold text-yellow-600">{stats.all?.open || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.all?.inProgress || 0}</p>
            </div>
          </div>

          {/* Tickets */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {activeQueue === 'all' ? 'All Tickets' : 'My Tickets'}
              </h3>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{ticket.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{ticket.description.substring(0, 100)}...</p>
                        <div className="mt-2 flex space-x-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                            ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ticket.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                            {ticket.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {ticket.userEmail}
                          </span>
                        </div>
                      </div>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;