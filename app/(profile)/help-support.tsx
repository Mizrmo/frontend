import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = faqs.filter(f =>
    f.q.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          onPress={() => Linking.openURL('tel:+233000000000')}
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
          onPress={() => Linking.openURL('mailto:support@mizrmo.com')}
        >
          <View style={styles.contactIconBox}>
            <Ionicons name="mail" size={22} color="#0056B3" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Email Support</Text>
            <Text style={styles.contactSub}>support@mizrmo.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard}>
          <View style={styles.contactIconBox}>
            <Ionicons name="chatbubbles" size={22} color="#0056B3" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Live Chat</Text>
            <Text style={styles.contactSub}>Chat with a support agent</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
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
});
