import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getApiErrorMessage } from '../src/api/errors';
import {
  getSupportMessageText,
  getSupportTicket,
  isUserSupportMessage,
  sendSupportMessage,
  type SupportMessage,
} from '../src/api/support';
import {
  getOrCreateBookingSupportTicket,
  normalizeSupportMessages,
} from '../src/utils/bookingSupport';

interface SupportChatProps {
  bookingId?: string;
  ticketId?: string;
  title?: string;
}

function formatMessageTime(createdAt?: string): string {
  if (!createdAt) {
    return '';
  }
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function SupportChat({ bookingId, ticketId, title = 'Support' }: SupportChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [activeTicketId, setActiveTicketId] = useState<string | undefined>(ticketId);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const loadThread = useCallback(async () => {
    setIsLoading(true);
    try {
      if (bookingId) {
        const ticket = await getOrCreateBookingSupportTicket(bookingId);
        setActiveTicketId(ticket.id);
        setMessages(normalizeSupportMessages(ticket));
        return;
      }

      if (!ticketId) {
        setMessages([]);
        return;
      }

      const ticket = await getSupportTicket(ticketId);
      setActiveTicketId(ticket.id);
      setMessages(normalizeSupportMessages(ticket));
    } catch (error) {
      Alert.alert('Support chat', getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [bookingId, ticketId]);

  useEffect(() => {
    loadThread();
  }, [loadThread]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !activeTicketId) {
      return;
    }

    setIsSending(true);
    try {
      await sendSupportMessage(activeTicketId, text);
      setDraft('');
      await loadThread();
    } catch (error) {
      Alert.alert('Send failed', getApiErrorMessage(error));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 60 }} />
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0056B3" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.msgList} showsVerticalScrollIndicator={false}>
          {messages.length === 0 ? (
            <Text style={styles.emptyHint}>
              Send a message and our support team will reply in this thread.
            </Text>
          ) : null}
          {messages.map((msg, index) => {
            const isUser = isUserSupportMessage(msg);
            const text = getSupportMessageText(msg);
            return (
              <View
                key={msg.id ?? `msg-${index}`}
                style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowSupport]}
              >
                <View style={styles.bubbleContainer}>
                  <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleSupport]}>
                    <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>{text}</Text>
                  </View>
                  <Text style={[styles.timestamp, isUser && { textAlign: 'right' }]}>
                    {formatMessageTime(msg.createdAt)}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.footer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter your message"
              placeholderTextColor="#94A3B8"
              value={draft}
              onChangeText={setDraft}
              editable={!isSending && !!activeTicketId}
            />
          </View>
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={handleSend}
            disabled={isSending || !activeTicketId}
          >
            {isSending ? (
              <ActivityIndicator color="#0056B3" size="small" />
            ) : (
              <Ionicons name="send" size={24} color="#0056B3" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 16, color: '#1A1A1A', marginLeft: 4, fontFamily: 'Roboto_400Regular' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  msgList: { paddingHorizontal: 16, paddingVertical: 20, gap: 16 },
  emptyHint: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    fontFamily: 'Roboto_400Regular',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  msgRow: { flexDirection: 'row', alignItems: 'flex-start' },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowSupport: { justifyContent: 'flex-start' },
  bubbleContainer: { maxWidth: '80%' },
  bubble: { borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 4 },
  bubbleSupport: { backgroundColor: '#F3F4F6', borderTopLeftRadius: 4 },
  bubbleUser: { backgroundColor: '#E0EEFF', borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular', lineHeight: 21 },
  bubbleTextUser: { color: '#0052B4' },
  timestamp: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 48,
  },
  input: { flex: 1, fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  sendBtn: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },
});
