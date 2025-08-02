import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firebaseTicketService, Ticket } from '../services/firebaseTickets';
import CreateTicket from './CreateTicket';
import LoadingSpinner from './ui/LoadingSpinner';
import NotificationStatus from './NotificationStatus';
import ThemeToggle from './ui/ThemeToggle';
import { Link } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    sortBy: 'recent'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  const loadDashboard = async () => {
    try {
      if (!user) return;
      
      const ticketsData = await firebaseTicketService.getUserTickets(user.uid);
      setAllTickets(ticketsData as Ticket[]);
      
      // Calculate stats
      const stats = {
        total: ticketsData.length,
        open: ticketsData.filter((t: any) => t.status === 'open').length,
        inProgress: ticketsData.filter((t: any) => t.status === 'in_progress').length,
        resolved: ticketsData.filter((t: any) => t.status === 'resolved').length
      };
      setStats(stats);
      
      // Apply filters and pagination
      applyFilters(ticketsData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (ticketsData: any[]) => {
    let filtered = [...ticketsData];
    
    // Search filter
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      filtered = filtered.filter(ticket => 
        searchRegex.test(ticket.title) || searchRegex.test(ticket.description)
      );
    }
    
    // Status filter
    if (filters.status) {
      filtered = filtered.filter(ticket => ticket.status === filters.status);
    }
    
    // Category filter
    if (filters.category) {
      filtered = filtered.filter(ticket => ticket.category === filters.category);
    }
    
    // Sort
    if (filters.sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sortBy === 'replies') {
      filtered.sort((a, b) => (b.replyCount || 0) - (a.replyCount || 0));
    }
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTickets = filtered.slice(startIndex, startIndex + itemsPerPage);
    
    setTickets(paginatedTickets as Ticket[]);
  };

  useEffect(() => {
    if (allTickets.length > 0) {
      applyFilters(allTickets);
    }
  }, [filters, currentPage, allTickets]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-900 dark:to-slate-800">
      <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-slate-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold text-white">Q</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  QuickDesk
                </h1>
                <p className="text-xs text-gray-500 dark:text-slate-400">User Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === 'tickets' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Tickets
                </button>
                <Link
                  to="/profile"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-all"
                >
                  Profile
                </Link>
              </div>
              <ThemeToggle />
              <NotificationStatus />
              <div className="flex items-center space-x-3 px-4 py-2 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-full border border-white/20 dark:border-slate-600/30">
                <div className="h-8 w-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{user?.email?.[0].toUpperCase()}</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-slate-100">{user?.email}</p>
                  <p className="text-xs text-green-600 dark:text-emerald-400 font-medium">{user?.role}</p>
                </div>
              </div>
              <button 
                onClick={logout} 
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                Welcome back! 👋
              </h2>
              <p className="text-gray-600 dark:text-slate-300 mt-1">Manage your support tickets and track their progress</p>
            </div>
            <button
              onClick={() => setShowCreateTicket(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <span>✨</span>
              <span>Create Ticket</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/30 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-slate-300">Total Tickets</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-2">{stats.total || 0}</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🎫</span>
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Open</h3>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.open || 0}</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🔄</span>
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{stats.inProgress || 0}</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">⏳</span>
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Resolved</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.resolved || 0}</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">✅</span>
                </div>
              </div>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 dark:border-slate-700/30">
              <div className="px-6 py-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🎫</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                      Recent Tickets
                    </h3>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {tickets.length} tickets
                  </span>
                </div>
                
                {tickets.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎆</div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">No tickets yet!</h4>
                    <p className="text-gray-500 dark:text-slate-400 mb-4">Create your first support ticket to get started</p>
                    <button
                      onClick={() => setShowCreateTicket(true)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                    >
                      Create First Ticket
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.slice(0, 5).map((ticket) => (
                      <Link key={ticket.id} to={`/ticket/${ticket.id}`} className="block">
                        <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl p-4 border border-white/30 dark:border-slate-600/30 hover:bg-white/70 dark:hover:bg-slate-600/60 transition-all duration-200">
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
                                  <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-1">{ticket.title}</h4>
                                  <p className="text-sm text-gray-600 dark:text-slate-300 mb-3">{ticket.description.substring(0, 120)}...</p>
                                  <div className="flex flex-wrap gap-2">
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
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                                {new Date(ticket.createdAt).toLocaleDateString()}
                              </p>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-400 dark:text-slate-500">👍 {ticket.upvotes || 0}</span>
                                <span className="text-xs text-gray-400 dark:text-slate-500">💬 {ticket.replyCount || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 dark:border-slate-700/30">
              <div className="px-6 py-6">
                {/* Filters */}
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      className="px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                    <select
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                      <option value="">All Categories</option>
                      <option value="technical">Technical</option>
                      <option value="billing">Billing</option>
                      <option value="general">General</option>
                    </select>
                    <select
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.sortBy}
                      onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    >
                      <option value="recent">Recently Created</option>
                      <option value="replies">Most Replied</option>
                    </select>
                  </div>
                </div>

                {/* Tickets List */}
                <div className="space-y-4 mb-6">
                  {tickets.map((ticket) => (
                    <Link key={ticket.id} to={`/ticket/${ticket.id}`} className="block">
                      <div className="bg-white/50 rounded-xl p-4 border border-white/30 hover:bg-white/70 transition-all duration-200">
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
                                <h4 className="font-semibold text-gray-900 mb-1">{ticket.title}</h4>
                                <p className="text-sm text-gray-600 mb-3">{ticket.description.substring(0, 150)}...</p>
                                <div className="flex flex-wrap gap-2">
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
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-xs text-gray-500 mb-1">
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-400">👍 {ticket.upvotes || 0}</span>
                              <span className="text-xs text-gray-400">💬 {ticket.replyCount || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {allTickets.length > itemsPerPage && (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 bg-white rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Page {currentPage} of {Math.ceil(allTickets.length / itemsPerPage)}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(Math.ceil(allTickets.length / itemsPerPage), currentPage + 1))}
                      disabled={currentPage === Math.ceil(allTickets.length / itemsPerPage)}
                      className="px-3 py-2 bg-white rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
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

export default UserDashboard;