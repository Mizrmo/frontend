import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const FAVORITE_RIDES = [
  { id: 1, title: 'Community One', date: '17 Oct, 24', price: 'GH¢22.00', location: 'Community one' },
  { id: 2, title: 'Accra Mall', date: '20 Oct, 24', price: 'GH¢45.00', location: 'Accra' },
  { id: 3, title: 'Tema Station', date: '21 Oct, 24', price: 'GH¢35.00', location: 'Tema' },
];

const FAVORITE_DRIVERS = [
  { id: 4, title: 'Daniel Asante', date: '17 Oct, 24', price: 'GH¢22.00', location: 'Community one' },
  { id: 5, title: 'Beatrice Owusu', date: '18 Oct, 24', price: 'GH¢38.00', location: 'Airport' },
];

export default function RiderFavouriteRidesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'rides' | 'drivers'>('rides');

  const FaveCard = ({ item }: { item: typeof FAVORITE_RIDES[0] }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push('/(rider)/available-rides')}>
      <View style={styles.cardIcon}>
        <MaterialCommunityIcons name="routes" size={24} color="#0056B3" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSub}>{item.date}  •  {item.price}  •  {item.location}</Text>
      </View>
      <Ionicons name="heart" size={20} color="#EF4444" />
    </TouchableOpacity>
  );

  const list = activeTab === 'rides' ? FAVORITE_RIDES : FAVORITE_DRIVERS;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favourites</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'rides' && styles.tabActive]}
          onPress={() => setActiveTab('rides')}
        >
          <Text style={[styles.tabText, activeTab === 'rides' && styles.tabTextActive]}>Rides</Text>
          {activeTab === 'rides' && <View style={styles.tabLine} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'drivers' && styles.tabActive]}
          onPress={() => setActiveTab('drivers')}
        >
          <Text style={[styles.tabText, activeTab === 'drivers' && styles.tabTextActive]}>Drivers</Text>
          {activeTab === 'drivers' && <View style={styles.tabLine} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.countLabel}>{list.length} {activeTab === 'rides' ? 'Rides' : 'Drivers'}</Text>
        {list.map(item => <FaveCard key={item.id} item={item} />)}

        {list.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={52} color="#CBD5E1" />
            <Text style={styles.emptyText}>No favourites yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    paddingTop: 60, paddingHorizontal: 16, paddingBottom: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  tabs: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  tabActive: {},
  tabText: { fontSize: 15, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  tabTextActive: { color: '#0056B3', fontFamily: 'Montserrat_500Medium' },
  tabLine: { position: 'absolute', bottom: 0, height: 3, width: '60%', backgroundColor: '#0056B3', borderRadius: 2 },
  content: { padding: 20, paddingBottom: 40 },
  countLabel: { fontSize: 13, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 14 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    padding: 16, borderRadius: 16, marginBottom: 12,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 },
  },
  cardIcon: { width: 44, height: 44, backgroundColor: '#EEF4FF', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1, marginLeft: 14 },
  cardTitle: { fontSize: 15, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  cardSub: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 3 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 16, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 16 },
});
