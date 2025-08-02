import { db } from '../config/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, query, where, orderBy, getDoc, increment } from 'firebase/firestore';
import { notificationService } from './notifications';

export interface Ticket {
  id?: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  userId: string;
  userEmail: string;
  agentId?: string;
  agentEmail?: string;
  attachments?: string[];
  upvotes: number;
  downvotes: number;
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketReply {
  id?: string;
  ticketId: string;
  userId: string;
  userEmail: string;
  message: string;
  isAgent: boolean;
  createdAt: Date;
}

export const firebaseTicketService = {
  async createTicket(ticketData: Omit<Ticket, 'id' | 'upvotes' | 'downvotes' | 'replyCount' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'tickets'), {
      ...ticketData,
      upvotes: 0,
      downvotes: 0,
      replyCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Send email notification
    await notificationService.sendTicketCreatedNotification(docRef.id, ticketData.userEmail, ticketData.title);
    
    return docRef.id;
  },

  async getUserTickets(userId: string, filters?: any) {
    let q = query(collection(db, 'tickets'), where('userId', '==', userId));
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }
    
    if (filters?.sortBy === 'replies') {
      q = query(q, orderBy('replyCount', 'desc'));
    } else {
      q = query(q, orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getAllTickets(filters?: any) {
    let q = query(collection(db, 'tickets'));
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }
    
    if (filters?.sortBy === 'replies') {
      q = query(q, orderBy('replyCount', 'desc'));
    } else {
      q = query(q, orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateTicketStatus(ticketId: string, status: string, agentId?: string, agentEmail?: string) {
    // Get current ticket data for notification
    const ticketDoc = await getDoc(doc(db, 'tickets', ticketId));
    const ticketData = ticketDoc.data();
    
    const updateData: any = { status, updatedAt: new Date() };
    if (agentId) updateData.agentId = agentId;
    if (agentEmail) updateData.agentEmail = agentEmail;
    
    await updateDoc(doc(db, 'tickets', ticketId), updateData);
    
    // Send email notification if status changed
    if (ticketData && ticketData.status !== status) {
      await notificationService.sendStatusChangeNotification(
        ticketId,
        ticketData.userEmail,
        ticketData.title,
        ticketData.status,
        status,
        agentEmail
      );
    }
  },

  async addReply(ticketId: string, replyData: Omit<TicketReply, 'id' | 'createdAt'>) {
    await addDoc(collection(db, 'replies'), {
      ...replyData,
      createdAt: new Date()
    });
    
    // Update reply count
    await updateDoc(doc(db, 'tickets', ticketId), {
      replyCount: increment(1),
      updatedAt: new Date()
    });
    
    // Get ticket data for notification
    const ticketDoc = await getDoc(doc(db, 'tickets', ticketId));
    const ticketData = ticketDoc.data();
    
    // Send notification to ticket owner (if reply is not from owner)
    if (ticketData && ticketData.userEmail !== replyData.userEmail) {
      await notificationService.sendReplyNotification(
        ticketId,
        ticketData.userEmail,
        ticketData.title,
        replyData.userEmail,
        replyData.isAgent
      );
    }
  },

  async getReplies(ticketId: string) {
    const q = query(collection(db, 'replies'), where('ticketId', '==', ticketId), orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async voteTicket(ticketId: string, voteType: 'up' | 'down') {
    const field = voteType === 'up' ? 'upvotes' : 'downvotes';
    await updateDoc(doc(db, 'tickets', ticketId), {
      [field]: increment(1)
    });
  },

  async getCategories() {
    const snapshot = await getDocs(collection(db, 'categories'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async addCategory(name: string, description: string) {
    await addDoc(collection(db, 'categories'), {
      name,
      description,
      createdAt: new Date()
    });
  }
};