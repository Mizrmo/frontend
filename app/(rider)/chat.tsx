import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SupportChat } from '../../components/SupportChat';

export default function ChatScreen() {
  const { bookingId, ticketId } = useLocalSearchParams<{
    bookingId?: string;
    ticketId?: string;
  }>();

  return (
    <SupportChat
      bookingId={bookingId ? String(bookingId) : undefined}
      ticketId={ticketId ? String(ticketId) : undefined}
      title="Support"
    />
  );
}
