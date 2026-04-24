import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Tab = 'rides' | 'completed';

const requestCards = [
  { id: 1, name: 'Jane Asantewa', from: 'Ashaiman', to: 'Community one', dist: '800m (5mins away)' },
  { id: 2, name: 'Abena Frimpong', from: 'Tema', to: 'Accra Mall', dist: '1.2km (8mins away)' },
  { id: 3, name: 'Kofi Mensah', from: 'Spintex', to: 'Airport', dist: '3.5km (12mins away)' },
];

const completedToday = [
  { id: 1, name: 'Toby Asante', date: '28 Feb, 10:10 AM', from: 'Ashaiman', to: 'Tema', startsIn: '1 Hr 12 mins' },
  { id: 2, name: 'Grace Owusu', date: '28 Feb, 08:20 AM', from: 'Tema', to: 'Accra', startsIn: '2 Hr 05 mins' },
];

const completedYesterday = [
  { id: 3, name: 'Victor Boateng', date: '27 Feb, 10:10 AM', from: 'Ashaiman', to: 'Tema', startsIn: '1 Hr 12 mins' },
  { id: 4, name: 'Lydia Asiedu', date: '27 Feb, 07:45 AM', from: 'Spintex', to: 'Airport', startsIn: '30 mins' },
];

export default function DriverTripsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('rides');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ride History</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('rides')}
        >
          <Text style={[styles.tabText, activeTab === 'rides' && styles.tabTextActive]}>Active Requests</Text>
          {activeTab === 'rides' && <View style={styles.tabLine} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>Completed</Text>
          {activeTab === 'completed' && <View style={styles.tabLine} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'rides' ? (
          <>
            <Text style={styles.sectionLabel}>PENDING REQUESTS</Text>
            {requestCards.map(card => (
              <View key={card.id} style={styles.requestCard}>
                <View style={styles.cardBody}>
                  <View style={styles.avatarBox}>
                    <Ionicons name="person-circle" size={52} color="#CBD5E1" />
                  </View>
                  <View style={styles.cardDetails}>
                    <Text style={styles.passengerName}>{card.name}</Text>
                    <Text style={styles.routeInfo}>
                      From <Text style={styles.boldText}>{card.from}</Text> to <Text style={styles.boldText}>{card.to}</Text>
                    </Text>
                    <View style={styles.distRow}>
                      <Ionicons name="location-outline" size={14} color="#0056B3" />
                      <Text style={styles.distText}>{card.dist}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.cardBtns}>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => router.push('/(driver)/start-ride')}
                  >
                    <Text style={styles.acceptBtnText}>Accept Ride</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectBtn}>
                    <Text style={styles.rejectBtnText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.sectionLabel}>TODAY</Text>
            {completedToday.map(ride => (
              <TouchableOpacity key={ride.id} style={styles.historyCard} onPress={() => router.push({ pathname: '/(driver)/ride-details', params: { id: ride.id } })}>
                <View style={styles.historyTop}>
                   <View style={styles.avatarBox}>
                    <Ionicons name="person-circle" size={48} color="#CBD5E1" />
                  </View>
                  <View style={styles.historyInfo}>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyTitle}>Inter-City Ride</Text>
                      <Text style={styles.historyDate}>{ride.date}</Text>
                    </View>
                    <Text style={styles.historyRoute}>
                      {ride.from} → {ride.to}
                    </Text>
                    <View style={styles.statusRow}>
                        <View style={styles.successDot} />
                        <Text style={styles.statusText}>Completed</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>YESTERDAY</Text>
            {completedYesterday.map(ride => (
              <TouchableOpacity key={ride.id} style={styles.historyCard} onPress={() => router.push({ pathname: '/(driver)/ride-details', params: { id: ride.id } })}>
                <View style={styles.historyTop}>
                   <View style={styles.avatarBox}>
                    <Ionicons name="person-circle" size={48} color="#CBD5E1" />
                  </View>
                  <View style={styles.historyInfo}>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyTitle}>Shared Ride</Text>
                      <Text style={styles.historyDate}>{ride.date}</Text>
                    </View>
                    <Text style={styles.historyRoute}>
                      {ride.from} → {ride.to}
                    </Text>
                    <View style={styles.statusRow}>
                        <View style={styles.successDot} />
                        <Text style={styles.statusText}>Completed</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20, paddingBottom: 15,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 20, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  tabs: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 15 },
  tabText: { fontSize: 14, color: '#94A3B8', fontFamily: 'Montserrat_500Medium' },
  tabTextActive: { color: '#0056B3', fontFamily: 'Montserrat_600SemiBold' },
  tabLine: { position: 'absolute', bottom: 0, height: 3, width: '40%', backgroundColor: '#0056B3', borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  content: { padding: 20, paddingBottom: 40 },
  sectionLabel: { fontSize: 11, fontFamily: 'Montserrat_700Bold', color: '#94A3B8', letterSpacing: 1, marginBottom: 15 },
  requestCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 18, marginBottom: 15,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10
  },
  cardBody: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  avatarBox: { justifyContent: 'center', alignItems: 'center' },
  cardDetails: { flex: 1, marginLeft: 15 },
  passengerName: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', marginBottom: 4 },
  routeInfo: { fontSize: 13, color: '#64748B', fontFamily: 'Roboto_400Regular', marginBottom: 6 },
  boldText: { fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  distText: { fontSize: 12, color: '#0056B3', fontFamily: 'Montserrat_600SemiBold' },
  cardBtns: { flexDirection: 'row', gap: 12 },
  acceptBtn: { flex: 1, height: 48, backgroundColor: '#0056B3', borderRadius: 24, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  acceptBtnText: { color: '#FFF', fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
  rejectBtn: { flex: 1, height: 48, borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  rejectBtnText: { color: '#EF4444', fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
  historyCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 18, marginBottom: 12,
    borderWidth: 1, borderColor: '#F1F5F9'
  },
  historyTop: { flexDirection: 'row', alignItems: 'center' },
  historyInfo: { flex: 1, marginLeft: 15 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  historyTitle: { fontSize: 15, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  historyDate: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  historyRoute: { fontSize: 13, color: '#64748B', fontFamily: 'Roboto_400Regular', marginBottom: 6 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  successDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  statusText: { fontSize: 12, color: '#10B981', fontFamily: 'Montserrat_600SemiBold' }
});
