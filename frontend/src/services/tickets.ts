import api from './api';

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: 'technical' | 'billing' | 'general' | 'feature_request' | 'bug_report';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  userId: string;
  userEmail: string;
  agentId?: string;
  agentEmail?: string;
  attachments?: any[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketReply {
  _id: string;
  ticketId: string;
  userId: string;
  userEmail: string;
  message: string;
  isAgent: boolean;
  createdAt: string;
}

export interface CreateTicketData {
  title: string;
  description: string;
  category: string;
  priority?: string;
  attachments?: any[];
  tags?: string[];
}

export const ticketService = {
  // End user methods
  async createTicket(data: CreateTicketData) {
    const response = await api.post('/tickets', data);
    return response.data;
  },

  async getUserTickets(params?: any) {
    const response = await api.get('/tickets/user', { params });
    return response.data;
  },

  async getUserDashboard() {
    const response = await api.get('/user/dashboard');
    return response.data;
  },

  // Agent methods
  async getAgentTickets(params?: any) {
    const response = await api.get('/tickets/agent', { params });
    return response.data;
  },

  async getAgentDashboard() {
    const response = await api.get('/agent/dashboard');
    return response.data;
  },

  // Common methods
  async getTicket(id: string) {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  async updateTicketStatus(id: string, status: string) {
    const response = await api.put(`/tickets/${id}/status`, { status });
    return response.data;
  },

  async addReply(ticketId: string, message: string) {
    const response = await api.post(`/tickets/${ticketId}/replies`, { message });
    return response.data;
  },

  async getReplies(ticketId: string) {
    const response = await api.get(`/tickets/${ticketId}/replies`);
    return response.data;
  },

  async getMetadata() {
    const response = await api.get('/metadata');
    return response.data;
  }
};