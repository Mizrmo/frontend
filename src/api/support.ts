import apiClient from './client.native';

export type SupportCategory =
  | 'PAYMENT'
  | 'BOOKING'
  | 'DRIVER_ISSUE'
  | 'ACCOUNT'
  | 'TECHNICAL'
  | 'OTHER';

export type SupportPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface CreateSupportTicketDto {
  subject: string;
  description: string;
  category: SupportCategory;
  priority?: SupportPriority;
}

export interface SupportTicket {
  id: string;
  subject?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupportMessage {
  id?: string;
  message?: string;
  content?: string;
  body?: string;
  createdAt?: string;
  senderType?: string;
  isFromUser?: boolean;
  authorRole?: string;
}

export interface SupportTicketDetail extends SupportTicket {
  description?: string;
  category?: string;
  messages?: SupportMessage[];
}

export function getSupportMessageText(message: SupportMessage): string {
  return message.message ?? message.content ?? message.body ?? '';
}

export function isUserSupportMessage(message: SupportMessage): boolean {
  if (message.isFromUser === true) {
    return true;
  }
  const role = (message.senderType ?? message.authorRole ?? '').toUpperCase();
  return role === 'USER' || role === 'RIDER' || role === 'DRIVER' || role === 'CUSTOMER';
}

export const createSupportTicket = async (data: CreateSupportTicketDto) => {
  const response = await apiClient.post<SupportTicket>('/support/tickets', data);
  return response.data;
};

export const getMySupportTickets = async () => {
  const response = await apiClient.get<SupportTicket[] | { data: SupportTicket[] }>(
    '/support/tickets/my-tickets'
  );
  const payload = response.data;
  return Array.isArray(payload) ? payload : payload.data ?? [];
};

export const getSupportTicket = async (ticketId: string) => {
  const response = await apiClient.get<SupportTicketDetail>(`/support/tickets/${ticketId}`);
  return response.data;
};

export const sendSupportMessage = async (ticketId: string, message: string) => {
  const response = await apiClient.post(`/support/tickets/${ticketId}/messages`, { message });
  return response.data;
};
