import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firebaseTicketService, Ticket } from '../services/firebaseTickets';
import CreateTicket from './CreateTicket';
import LoadingSpinner from './ui/LoadingSpinner';
import ThemeToggle from './ui/ThemeToggle';
import { Link } from 'react-router-dom';

const AgentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [activeQueue, setActiveQueue] = useState<'all' | 'my'>('all');
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: ''
  });

  useEffect(() => {
    loadDashboard();
  }, [activeQueue]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDashboard = async () => {
    try {
      if (!user) return;
      
      // Get all tickets
      const allTicketsData = await firebaseTicketService.getAllTickets();
      setAllTickets(allTicketsData as Ticket[]);
      
      // Filter tickets based on queue
      let filteredTickets = allTicketsData;
      if (activeQueue === 'my') {
        filteredTickets = allTicketsData.filter((t: any) => t.agentId === user.uid);
      }
      
      // Apply additional filters
      if (filters.search) {
        const searchRegex = new RegExp(filters.search, 'i');
        filteredTickets = filteredTickets.filter((t: any) => 
          searchRegex.test(t.title) || searchRegex.test(t.description)
        );
      }
      if (filters.status) {
        filteredTickets = filteredTickets.filter((t: any) => t.status === filters.status);
      }
      if (filters.category) {
        filteredTickets = filteredTickets.filter((t: any) => t.category === filters.category);
      }
      
      setTickets(filteredTickets as Ticket[]);
      
      // Calculate stats
      const myTickets = allTicketsData.filter((t: any) => t.agentId === user.uid);
      const stats = {
        all: {
          total: allTicketsData.length,
          open: allTicketsData.filter((t: any) => t.status === 'open').length,
          inProgress: allTicketsData.filter((t: any) => t.status === 'in_progress').length
        },
        my: {
          total: myTickets.length,
          open: myTickets.filter((t: any) => t.status === 'open').length,
          inProgress: myTickets.filter((t: any) => t.status === 'in_progress').length
        }
      };
      setStats(stats);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [activeQueue, filters, user]);

  const handleStatusUpdate = async (ticketId: string, status: string) => {
    try {
      await firebaseTicketService.updateTicketStatus(ticketId, status, user?.uid, user?.email);
      loadDashboard();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleShareTicket = (ticketId: string) => {
    const url = `${window.location.origin}/ticket/${ticketId}`;
    navigator.clipboard.writeText(url);
    alert('Ticket URL copied to clipboard!');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-indigo-900 dark:to-slate-800">
      <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-slate-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold text-white">Q</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  QuickDesk
                </h1>
                <p className="text-xs text-gray-500 dark:text-slate-400">Agent Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveQueue('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeQueue === 'all' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100'
                  }`}
                >
                  All Tickets
                </button>
                <button
                  onClick={() => setActiveQueue('my')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeQueue === 'my' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100'
                  }`}
                >
                  My Tickets
                </button>
              </div>
              <ThemeToggle />
              <button
                onClick={() => setShowCreateTicket(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Create Ticket</span>
              </button>
              <div className="flex items-center space-x-3 px-4 py-2 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-full border border-white/20 dark:border-slate-600/30">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{user?.email?.[0].toUpperCase()}</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-slate-100">{user?.email}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{user?.role}</p>
                </div>
              </div>
              <button 
                onClick={logout} 
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-2">
              Agent Dashboard 🛠️
            </h2>
            <p className="text-gray-600 dark:text-slate-300">Manage and respond to support tickets</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/30 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-slate-300">All Tickets</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-2">{stats.all?.total || 0}</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🎫</span>
                </div>
              </div>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/30 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-slate-300">My Tickets</h3>
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{stats.my?.total || 0}</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">💼</span>
                </div>
              </div>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/30 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-slate-300">Open</h3>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{stats.all?.open || 0}</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🔄</span>
                </div>
              </div>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/30 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-slate-300">In Progress</h3>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{stats.all?.inProgress || 0}</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">⏳</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/30 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search tickets..."
                className="px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <select
                className="px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
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
                className="px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>

          {/* Tickets */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 dark:border-slate-700/30">
            <div className="px-6 py-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-sm">🎫</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                    {activeQueue === 'all' ? 'All Tickets' : 'My Tickets'}
                  </h3>
                </div>
                <span className="text-sm text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                  {tickets.length} tickets
                </span>
              </div>
              
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white/50 dark:bg-slate-700/50 rounded-xl p-4 border border-white/30 dark:border-slate-600/30 hover:bg-white/70 dark:hover:bg-slate-600/60 transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start space-x-3">
                          <div className={`h-3 w-3 rounded-full mt-2 ${
                            ticket.status === 'open' ? 'bg-yellow-400' :
                            ticket.status === 'in_progress' ? 'bg-blue-400' :
                            ticket.status === 'resolved' ? 'bg-green-400' :
                            'bg-gray-400'
                          }`}></div>
                          <div className="flex-1">
                            <Link to={`/ticket/${ticket.id}`} className="font-semibold text-gray-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                              {ticket.title}
                            </Link>
                            <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">{ticket.description.substring(0, 120)}...</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                                ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {ticket.status.replace('_', ' ')}
                              </span>
                              <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                {ticket.category}
                              </span>
                              <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-slate-600 text-gray-800 dark:text-slate-200 rounded-full">
                                {ticket.userEmail}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <select
                          className="px-3 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                          value={ticket.status}
                          onChange={(e) => handleStatusUpdate(ticket.id!, e.target.value)}
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                        <Link
                          to={`/ticket/${ticket.id}`}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          💬 Reply
                        </Link>
                        <button
                          onClick={() => handleShareTicket(ticket.id!)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                        >
                          🔗 Share
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {tickets.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                    {activeQueue === 'my' ? 'No tickets assigned to you yet!' : 'No tickets found!'}
                  </h4>
                  <p className="text-gray-500 dark:text-slate-400">
                    {activeQueue === 'my' ? 'Tickets will appear here when assigned to you.' : 'Try adjusting your filters or check back later.'}
                  </p>
                </div>
              )}
            </div>
          </div>
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

export default AgentDashboard;