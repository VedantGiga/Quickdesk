import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ticketService, Ticket } from '../services/tickets';
import CreateTicket from './CreateTicket';
import TicketList from './TicketList';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    try {
      if (user?.role === 'agent') {
        const [dashboardData, ticketsData] = await Promise.all([
          ticketService.getAgentDashboard(),
          ticketService.getAgentTickets({ queue: 'all', limit: 10 })
        ]);
        setStats(dashboardData.stats);
        setTickets(ticketsData.tickets);
      } else {
        const [dashboardData, ticketsData] = await Promise.all([
          ticketService.getUserDashboard(),
          ticketService.getUserTickets({ limit: 10 })
        ]);
        setStats(dashboardData.stats);
        setTickets(ticketsData.tickets);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
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
              <h1 className="text-xl font-semibold">QuickDesk</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === 'dashboard'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === 'tickets'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {user?.role === 'agent' ? 'All Tickets' : 'My Tickets'}
                </button>
              </div>
              <span className="text-gray-700">{user?.email}</span>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                {user?.role}
              </span>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'dashboard' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user?.role === 'agent' ? 'Agent Dashboard' : 'My Dashboard'}
                </h2>
                {user?.role === 'user' && (
                  <button
                    onClick={() => setShowCreateTicket(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Ticket
                  </button>
                )}
              </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {user?.role === 'agent' ? (
              <>
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
              </>
            ) : (
              <>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-500">Total Tickets</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-500">Open</h3>
                  <p className="text-2xl font-bold text-yellow-600">{stats.open || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-500">Resolved</h3>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved || 0}</p>
                </div>
              </>
            )}
          </div>

          {/* Recent Tickets */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Tickets
              </h3>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket._id} className="border-l-4 border-blue-400 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{ticket.title}</h4>
                        <p className="text-sm text-gray-500">{ticket.description.substring(0, 100)}...</p>
                        <div className="mt-2 flex space-x-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                            ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ticket.status}
                          </span>
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                            {ticket.category}
                          </span>
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
            </>
          )}

          {activeTab === 'tickets' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user?.role === 'agent' ? 'All Tickets' : 'My Tickets'}
                </h2>
                {user?.role === 'user' && (
                  <button
                    onClick={() => setShowCreateTicket(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Ticket
                  </button>
                )}
              </div>
              <TicketList />
            </div>
          )}
        </div>
      </div>

      {showCreateTicket && (
        <CreateTicket
          onClose={() => setShowCreateTicket(false)}
          onSuccess={loadDashboard}
        />
      )}
    </div>
  );
};

export default Dashboard;