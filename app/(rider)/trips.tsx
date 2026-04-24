import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const upcomingRides = [
  { id: 1, driver: 'Daniel Asante', date: '28 Feb, 10:10 AM', from: 'Ashaiman', to: 'Tema', startsIn: '1 Hr 12 mins' },
  { id: 2, driver: 'Kendrick Owusu', date: '28 Feb, 10:10 AM', from: 'Ashaiman', to: 'Tema', startsIn: '1 Hr 12 mins' },
  { id: 3, driver: 'Abena Frimpong', date: '28 Feb, 10:10 AM', from: 'Ashaiman', to: 'Tema', startsIn: '2 Hr 5 mins' },
];

const completedGroups = [
  {
    label: 'Today',
    rides: [
      { id: 1, driver: 'Daniel', date: '28 Feb, 10:10 AM', from: 'Ashaiman', to: 'Tema', price: 'GH¢22' },
      { id: 2, driver: 'Toby', date: '28 Feb, 08:20 AM', from: 'Ashaiman', to: 'Tema', price: 'GH¢18' },
    ],
  },
  {
    label: 'Yesterday',
    rides: [
      { id: 3, driver: 'Gracie', date: '27 Feb, 10:10 AM', from: 'Ashaiman', to: 'Tema', price: 'GH¢25' },
      { id: 4, driver: 'Ella', date: '27 Feb, 08:00 AM', from: 'Ashaiman', to: 'Tema', price: 'GH¢20' },
    ],
  },
];

export default function RiderTripsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'rides' | 'completed'>('rides');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rides</Text>
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
          style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>Completed</Text>
          {activeTab === 'completed' && <View style={styles.tabLine} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'rides' ? (
          <>
            {/* Active Ride Card */}
            <Text style={styles.sectionLabel}>Active Ride</Text>
            <TouchableOpacity
              style={styles.activeCard}
              onPress={() => router.push('/(rider)/driver-on-way')}
            >
              <View style={styles.activeTop}>
                <View style={styles.rideIconBox}>
                  <MaterialCommunityIcons name="car-connected" size={26} color="#0056B3" />
                </View>
                <View style={styles.activeInfo}>
                  <Text style={styles.activeTitle}>Accra – GH¢ 22.00</Text>
                  <Text style={styles.activeMeta}>ETA <Text style={styles.bold}>5 Hrs</Text>  |  Dist: <Text style={styles.bold}>85 km</Text></Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.routeBlock}>
                <View style={styles.routeRow}>
                  <View style={styles.blueDot} />
                  <Text style={styles.routeText}>Ashaiman, main station</Text>
                </View>
                <View style={styles.connector}><View style={styles.dash} /><View style={styles.dash} /><View style={styles.dash} /></View>
                <View style={styles.routeRow}>
                  <Ionicons name="location" size={16} color="#FFCC00" />
                  <Text style={styles.routeText}>Community One, Tema</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Upcoming Rides */}
            <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Upcoming Rides</Text>
            {upcomingRides.map(ride => (
              <TouchableOpacity
                key={ride.id}
                style={styles.upcomingCard}
                onPress={() => router.push('/(rider)/booked-ride-details')}
              >
                <View style={styles.upcomingAvatar}>
                  <Ionicons name="person-circle" size={42} color="#CBD5E1" />
                </View>
                <View style={styles.upcomingInfo}>
                  <View style={styles.upcomingRow}>
                    <Text style={styles.upcomingDriver}>{ride.driver}</Text>
                    <Text style={styles.upcomingDate}>{ride.date}</Text>
                  </View>
                  <Text style={styles.upcomingRoute}>
                    From <Text style={styles.bold}>{ride.from}</Text>  To: <Text style={styles.bold}>{ride.to}</Text>
                  </Text>
                  <Text style={styles.upcomingStarts}>
                    Starts in: <Text style={styles.bold}>{ride.startsIn}</Text>
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            {completedGroups.map(group => (
              <View key={group.label}>
                <Text style={[styles.sectionLabel, { marginTop: 16 }]}>{group.label}</Text>
                {group.rides.map(ride => (
                  <TouchableOpacity key={ride.id} style={styles.completedCard}>
                    <View style={styles.completedLeft}>
                      <View style={styles.completedIcon}>
                        <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                      </View>
                      <View>
                        <Text style={styles.completedDriver}>{ride.driver}</Text>
                        <Text style={styles.completedRoute}>
                          {ride.from} → {ride.to}
                        </Text>
                        <Text style={styles.completedDate}>{ride.date}</Text>
                      </View>
                    </View>
                    <Text style={styles.completedPrice}>{ride.price}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 22, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  tabs: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  tabActive: {},
  tabText: { fontSize: 15, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  tabTextActive: { color: '#0056B3', fontFamily: 'Montserrat_500Medium' },
  tabLine: { position: 'absolute', bottom: 0, height: 3, width: '60%', backgroundColor: '#0056B3', borderRadius: 2 },
  content: { padding: 20, paddingBottom: 40 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 12 },
  activeCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 16, marginBottom: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 } },
  activeTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  rideIconBox: { width: 46, height: 46, backgroundColor: '#EEF4FF', borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
  activeInfo: { marginLeft: 14, flex: 1 },
  activeTitle: { fontSize: 16, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  activeMeta: { fontSize: 12, color: '#64748B', marginTop: 3, fontFamily: 'Roboto_400Regular' },
  bold: { fontWeight: '700', color: '#1A1A1A' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 12 },
  routeBlock: {},
  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  blueDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0056B3', marginRight: 10 },
  connector: { flexDirection: 'row', marginLeft: 3, marginBottom: 4 },
  dash: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', marginHorizontal: 2 },
  routeText: { fontSize: 13, color: '#1A1A1A', fontFamily: 'Roboto_400Regular', marginLeft: 8 },
  upcomingCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 } },
  upcomingAvatar: { marginRight: 14, justifyContent: 'center' },
  upcomingInfo: { flex: 1 },
  upcomingRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  upcomingDriver: { fontSize: 14, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  upcomingDate: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  upcomingRoute: { fontSize: 13, color: '#64748B', fontFamily: 'Roboto_400Regular', marginBottom: 2 },
  upcomingStarts: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  completedCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 } },
  completedLeft: { flexDirection: 'row', alignItems: 'center' },
  completedIcon: { width: 40, height: 40, backgroundColor: '#F0FDF4', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  completedDriver: { fontSize: 14, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  completedRoute: { fontSize: 12, color: '#64748B', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  completedDate: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 1 },
  completedPrice: { fontSize: 15, fontFamily: 'Montserrat_500Medium', color: '#0056B3' },
});
