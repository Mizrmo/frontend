import {
  createSupportTicket,
  getSupportTicket,
  type SupportMessage,
  type SupportTicketDetail,
} from '../api/support';
import { storage } from '../api/storage';

const ticketKey = (bookingId: string) => `support_ticket_${bookingId}`;

export async function getStoredBookingTicketId(bookingId: string): Promise<string | null> {
  return storage.getItem(ticketKey(bookingId));
}

export async function getOrCreateBookingSupportTicket(
  bookingId: string,
  subjectHint?: string
): Promise<SupportTicketDetail> {
  const storedId = await getStoredBookingTicketId(bookingId);
  if (storedId) {
    try {
      return await getSupportTicket(storedId);
    } catch {
      await storage.removeItem(ticketKey(bookingId));
    }
  }

  const ticket = await createSupportTicket({
    subject: subjectHint ?? `Booking ${bookingId.slice(0, 8)}`,
    description: 'Rider opened in-app support for this booking.',
    category: 'BOOKING',
    priority: 'MEDIUM',
  });

  const ticketId = ticket.id;
  await storage.setItem(ticketKey(bookingId), ticketId);
  return getSupportTicket(ticketId);
}

export function normalizeSupportMessages(
  ticket?: SupportTicketDetail | null
): SupportMessage[] {
  if (!ticket) {
    return [];
  }
  const messages = ticket.messages ?? [];
  return [...messages].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return aTime - bTime;
  });
}
