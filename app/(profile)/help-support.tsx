import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { getConfigString, getPublicConfig } from '../../src/api/config';
import { getApiErrorMessage } from '../../src/api/errors';
import { createSupportTicket, getMySupportTickets, type SupportTicket } from '../../src/api/support';

const faqs = [
  { id: 1, q: 'How do I book a ride?', a: 'Tap "Book Ride" on your home screen, enter your pickup and drop-off location, then select an available driver.' },
  { id: 2, q: 'How do I cancel a ride?', a: 'Open your active ride in the Trips tab and tap "Cancel Ride". Note that cancellation fees may apply.' },
  { id: 3, q: 'How are fares calculated?', a: 'Fares are based on distance, time of day, and demand. You can always see the full fare before confirming your ride.' },
  { id: 4, q: 'What payment methods are accepted?', a: 'We accept Visa/Mastercard, MTN Mobile Money, and Airtel Money.' },
  { id: 5, q: 'How do I report an issue with a driver?', a: 'Go to Settings → Help & Support → Contact Us, or request a call back from our support team.' },
  { id: 6, q: 'How do I earn MizMiles?', a: 'You earn MizMiles every time you complete a ride. Refer friends to earn bonus points.' },
];

export default function HelpSupportScreen() {
  const router = useRouter();
  const { topic } = useLocalSearchParams<{ topic?: string }>();
  const { activeRole } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [supportPhone, setSupportPhone] = useState('+233000000000');
  const [supportEmail, setSupportEmail] = useState('support@mizrmo.com');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myTickets, setMyTickets] = useState<SupportTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);

  const loadTickets = () => {
    setTicketsLoading(true);
    getMySupportTickets()
      .then(setMyTickets)
      .catch(() => setMyTickets([]))
      .finally(() => setTicketsLoading(false));
  };

  useEffect(() => {
    loadTickets();
    getPublicConfig()
      .then((config) => {
        setSupportPhone(
          getConfigString(config, ['SUPPORT_PHONE', 'supportPhone', 'support_phone'], supportPhone)
        );
        setSupportEmail(
          getConfigString(config, ['SUPPORT_EMAIL', 'supportEmail', 'support_email'], supportEmail)
        );
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (topic === 'driver-approval') {
      setTicketSubject('Driver approval follow-up');
      setTicketMessage(
        'I completed driver onboarding and my application is still pending approval. Please advise on the status.'
      );
    }
  }, [topic]);

  const filtered = faqs.filter(f =>
    f.q.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTicket = async () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      Alert.alert('Support', 'Please enter a subject and message.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createSupportTicket({
        subject: ticketSubject.trim(),
        description: ticketMessage.trim(),
        category: 'OTHER',
      });
      Alert.alert('Ticket submitted', 'Our team will respond shortly.');
      setTicketSubject('');
      setTicketMessage('');
      loadTickets();
    } catch (error) {
      Alert.alert('Could not submit ticket', getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="headset" size={40} color="#0056B3" />
          </View>
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroSub}>Search FAQs or contact support below</Text>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for answers..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {filtered.map(faq => (
          <TouchableOpacity
            key={faq.id}
            style={[styles.faqCard, openFaq === faq.id && styles.faqCardOpen]}
            onPress={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
            activeOpacity={0.8}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.q}</Text>
              <Ionicons
                name={openFaq === faq.id ? 'chevron-up' : 'chevron-down'}
                size={18} color={openFaq === faq.id ? "#0056B3" : "#94A3B8"}
              />
            </View>
            {openFaq === faq.id && (
              <View style={styles.answerWrap}>
                <Text style={styles.faqAnswer}>{faq.a}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Contact Cards */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Contact Us</Text>
        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => Linking.openURL(`tel:${supportPhone}`)}
        >
          <View style={styles.contactIconBox}>
            <Ionicons name="call" size={22} color="#0056B3" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Call Support</Text>
            <Text style={styles.contactSub}>Available Mon–Fri, 8am–6pm</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => Linking.openURL(`mailto:${supportEmail}`)}
        >
          <View style={styles.contactIconBox}>
            <Ionicons name="mail" size={22} color="#0056B3" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Email Support</Text>
            <Text style={styles.contactSub}>{supportEmail}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>My tickets</Text>
        {ticketsLoading ? (
          <ActivityIndicator color="#0056B3" style={{ marginBottom: 16 }} />
        ) : myTickets.length === 0 ? (
          <Text style={styles.ticketsEmpty}>No support tickets yet.</Text>
        ) : (
          myTickets.map((ticket) => (
            <TouchableOpacity
              key={ticket.id}
              style={styles.ticketRow}
              onPress={() =>
                router.push({
                  pathname: activeRole === 'DRIVER' ? '/(driver)/chat' : '/(rider)/chat',
                  params: { ticketId: ticket.id },
                } as never)
              }
            >
              <View style={styles.ticketRowInfo}>
                <Text style={styles.ticketSubject} numberOfLines={1}>
                  {ticket.subject ?? 'Support ticket'}
                </Text>
                <Text style={styles.ticketMeta}>
                  {(ticket.status ?? 'open').replace('_', ' ')}
                  {ticket.createdAt
                    ? ` · ${new Date(ticket.createdAt).toLocaleDateString()}`
                    : ''}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
            </TouchableOpacity>
          ))
        )}

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Submit a ticket</Text>
        <TextInput
          style={styles.ticketInput}
          placeholder="Subject"
          placeholderTextColor="#94A3B8"
          value={ticketSubject}
          onChangeText={setTicketSubject}
        />
        <TextInput
          style={[styles.ticketInput, styles.ticketMessage]}
          placeholder="Describe your issue..."
          placeholderTextColor="#94A3B8"
          value={ticketMessage}
          onChangeText={setTicketMessage}
          multiline
        />
        <TouchableOpacity
          style={styles.submitTicketBtn}
          onPress={handleCreateTicket}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitTicketText}>Submit ticket</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 16, paddingBottom: 20,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  content: { padding: 20, paddingBottom: 50 },
  hero: { alignItems: 'center', paddingVertical: 10 },
  heroIcon: {
    width: 80, height: 80, backgroundColor: '#EEF6FF',
    borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  heroTitle: { fontSize: 22, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', marginBottom: 8 },
  heroSub: { fontSize: 14, color: '#94A3B8', fontFamily: 'Roboto_400Regular', textAlign: 'center' },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9',
    paddingHorizontal: 16, height: 54, marginTop: 30, marginBottom: 30, gap: 12,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  sectionTitle: { fontSize: 12, fontFamily: 'Montserrat_700Bold', color: '#94A3B8', letterSpacing: 1.2, marginBottom: 16, marginLeft: 4 },
  faqCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 18, marginBottom: 12,
    borderWidth: 1, borderColor: '#F1F5F9'
  },
  faqCardOpen: { borderColor: '#E0EEFF', backgroundColor: '#F8FAFF' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 15, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', flex: 1, paddingRight: 12 },
  answerWrap: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  faqAnswer: { fontSize: 14, color: '#64748B', fontFamily: 'Roboto_400Regular', lineHeight: 22 },
  contactCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderRadius: 20, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#F1F5F9'
  },
  contactIconBox: {
    width: 48, height: 48, backgroundColor: '#EEF6FF',
    borderRadius: 24, justifyContent: 'center', alignItems: 'center',
  },
  contactInfo: { flex: 1, marginLeft: 14 },
  contactTitle: { fontSize: 15, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  contactSub: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 3 },
  ticketInput: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 12,
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    color: '#1A1A1A',
  },
  ticketMessage: { height: 120, paddingTop: 14, textAlignVertical: 'top' },
  submitTicketBtn: {
    backgroundColor: '#0056B3',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  submitTicketText: { color: '#FFF', fontFamily: 'Montserrat_600SemiBold', fontSize: 15 },
  ticketsEmpty: {
    fontSize: 14,
    color: '#94A3B8',
    fontFamily: 'Roboto_400Regular',
    marginBottom: 12,
    marginLeft: 4,
  },
  ticketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  ticketRowInfo: { flex: 1, marginRight: 8 },
  ticketSubject: { fontSize: 15, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  ticketMeta: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'Roboto_400Regular',
    marginTop: 3,
    textTransform: 'capitalize',
  },
});
