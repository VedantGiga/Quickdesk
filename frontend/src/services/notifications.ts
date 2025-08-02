import { db } from '../config/firebase';
import { addDoc, collection } from 'firebase/firestore';

export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  type: 'ticket_created' | 'status_changed' | 'reply_added';
  ticketId: string;
  createdAt: Date;
  sent: boolean;
}

export const notificationService = {
  async sendTicketCreatedNotification(ticketId: string, userEmail: string, ticketTitle: string) {
    await addDoc(collection(db, 'email_queue'), {
      to: userEmail,
      subject: `Ticket Created: ${ticketTitle}`,
      body: `Your ticket "${ticketTitle}" has been created successfully. Ticket ID: ${ticketId}`,
      type: 'ticket_created',
      ticketId,
      createdAt: new Date(),
      sent: false
    });
  },

  async sendStatusChangeNotification(ticketId: string, userEmail: string, ticketTitle: string, oldStatus: string, newStatus: string, agentEmail?: string) {
    await addDoc(collection(db, 'email_queue'), {
      to: userEmail,
      subject: `Ticket Status Updated: ${ticketTitle}`,
      body: `Your ticket "${ticketTitle}" status has been changed from ${oldStatus} to ${newStatus}.${agentEmail ? ` Updated by: ${agentEmail}` : ''}`,
      type: 'status_changed',
      ticketId,
      createdAt: new Date(),
      sent: false
    });
  },

  async sendReplyNotification(ticketId: string, userEmail: string, ticketTitle: string, replyBy: string, isAgent: boolean) {
    await addDoc(collection(db, 'email_queue'), {
      to: userEmail,
      subject: `New Reply: ${ticketTitle}`,
      body: `A new reply has been added to your ticket "${ticketTitle}" by ${replyBy}${isAgent ? ' (Support Agent)' : ''}.`,
      type: 'reply_added',
      ticketId,
      createdAt: new Date(),
      sent: false
    });
  }
};