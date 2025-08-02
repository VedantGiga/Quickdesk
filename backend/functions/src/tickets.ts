import * as admin from 'firebase-admin';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum TicketCategory {
  TECHNICAL = 'technical',
  BILLING = 'billing',
  GENERAL = 'general',
  FEATURE_REQUEST = 'feature_request',
  BUG_REPORT = 'bug_report'
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  category: TicketCategory;
  priority: TicketPriority;
  userId: string;
  userEmail: string;
  agentId?: string;
  agentEmail?: string;
  attachments?: Attachment[];
  tags?: string[];
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

export interface TicketReply {
  id: string;
  ticketId: string;
  userId: string;
  userEmail: string;
  message: string;
  isAgent: boolean;
  createdAt: admin.firestore.Timestamp;
}

export const createTicket = async (
  userId: string, 
  userEmail: string, 
  title: string, 
  description: string,
  category: TicketCategory,
  priority: TicketPriority = TicketPriority.MEDIUM,
  attachments?: Attachment[],
  tags?: string[]
) => {
  const ticketData = {
    title,
    description,
    status: TicketStatus.OPEN,
    category,
    priority,
    userId,
    userEmail,
    attachments: attachments || [],
    tags: tags || [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const docRef = await admin.firestore().collection('tickets').add(ticketData);
  return { id: docRef.id, ...ticketData };
};

export const updateTicketStatus = async (ticketId: string, status: TicketStatus, agentId?: string, agentEmail?: string) => {
  const updateData: any = {
    status,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (agentId && agentEmail) {
    updateData.agentId = agentId;
    updateData.agentEmail = agentEmail;
  }

  await admin.firestore().collection('tickets').doc(ticketId).update(updateData);
};

export const addTicketReply = async (ticketId: string, userId: string, userEmail: string, message: string, isAgent: boolean) => {
  const replyData = {
    ticketId,
    userId,
    userEmail,
    message,
    isAgent,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const docRef = await admin.firestore().collection('ticket_replies').add(replyData);
  
  // Update ticket's updatedAt timestamp
  await admin.firestore().collection('tickets').doc(ticketId).update({
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { id: docRef.id, ...replyData };
};

export const shareTicket = async (ticketId: string, sharedBy: string, sharedWith: string[], note?: string) => {
  const shareData = {
    ticketId,
    sharedBy,
    sharedWith,
    note: note || '',
    sharedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const docRef = await admin.firestore().collection('ticket_shares').add(shareData);
  return { id: docRef.id, ...shareData };
};

export const assignTicketToAgent = async (ticketId: string, agentId: string, agentEmail: string) => {
  await admin.firestore().collection('tickets').doc(ticketId).update({
    agentId,
    agentEmail,
    status: TicketStatus.IN_PROGRESS,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
};

export const getAgentTickets = async (agentId: string) => {
  const snapshot = await admin.firestore().collection('tickets')
    .where('agentId', '==', agentId)
    .orderBy('updatedAt', 'desc')
    .get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};