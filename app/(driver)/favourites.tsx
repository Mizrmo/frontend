import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface RideItem {
  id: number;
  title: string;
  date: string;
  price: string;
  location: string;
  type: 'ride' | 'driver';
}

const FAVORITE_RIDES: RideItem[] = [
  { id: 1, title: 'Community One', date: '17 Oct, 24', price: 'GH¢22.00', location: 'Community one', type: 'ride' },
  { id: 2, title: 'Tema Station', date: '20 Oct, 24', price: 'GH¢35.00', location: 'Tema', type: 'ride' },
];

const FAVORITE_DRIVERS: RideItem[] = [
  { id: 3, title: 'Community One', date: '17 Oct, 24', price: 'GH¢22.00', location: 'Community one', type: 'driver' },
  { id: 4, title: 'Airport Route', date: '18 Oct, 24', price: 'GH¢80.00', location: 'Airport', type: 'driver' },
  { id: 5, title: 'Spintex Road', date: '19 Oct, 24', price: 'GH¢28.00', location: 'Spintex', type: 'driver' },
];

export default function DriverFavoriteRidesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filter = (items: RideItem[]) =>
    items.filter(i =>
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredRides = filter(FAVORITE_RIDES);
  const filteredDrivers = filter(FAVORITE_DRIVERS);

  const RideCard = ({ item }: { item: RideItem }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push('/(driver)/home')}>
      <View style={styles.cardIconWrap}>
        <MaterialCommunityIcons name="routes" size={26} color="#0056B3" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSub}>{item.date}  •  {item.price}  •  {item.location}</Text>
      </View>
      <Ionicons name="heart" size={20} color="#EF4444" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favourites</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search ride or driver"
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filteredRides.length === 0 && filteredDrivers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={52} color="#CBD5E1" />
            <Text style={styles.emptyText}>No favourites found</Text>
            <Text style={styles.emptySubText}>Try a different search term</Text>
          </View>
        ) : (
          <>
            {filteredRides.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>{filteredRides.length} {filteredRides.length === 1 ? 'Ride' : 'Rides'}</Text>
                {filteredRides.map(ride => <RideCard key={ride.id} item={ride} />)}
              </View>
            )}
            {filteredDrivers.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>{filteredDrivers.length} {filteredDrivers.length === 1 ? 'Driver' : 'Drivers'}</Text>
                {filteredDrivers.map(driver => <RideCard key={driver.id} item={driver} />)}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(driver)/home')}>
        <Ionicons name="add" size={28} color="#FFCC00" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 16, marginLeft: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    margin: 16, paddingHorizontal: 16, height: 48, borderRadius: 24,
    borderWidth: 1, borderColor: '#E2E8F0'
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#1A1A1A' },
  content: { paddingHorizontal: 16, paddingBottom: 100 },
  section: { marginBottom: 30 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 12 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    padding: 16, borderRadius: 16, marginBottom: 12,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }
  },
  cardIconWrap: { width: 44, height: 44, backgroundColor: '#EEF4FF', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1, marginLeft: 14 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  cardSub: { fontSize: 12, color: '#94A3B8', marginTop: 3 },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#94A3B8', marginTop: 16 },
  emptySubText: { fontSize: 14, color: '#CBD5E1', marginTop: 6 },
  fab: {
    position: 'absolute', bottom: 30, right: 20, width: 56, height: 56,
    backgroundColor: '#0056B3', borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', elevation: 6
  }
});
