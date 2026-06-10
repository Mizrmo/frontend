import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  getBookingAmount,
  getBookingDriverName,
  getMyBookings,
} from '../../src/api/bookings';
import { getApiErrorMessage } from '../../src/api/errors';
import { formatCurrency, formatDepartureDate } from '../../src/api/trips';
import type { Booking } from '../../src/api/trip-types';

export default function RiderTripsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'rides' | 'completed'>('rides');
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTrips = useCallback(async () => {
    try {
      setError(null);
      const [activeResult, awaitingResult, upcomingResult, completedResult] = await Promise.all([
        getMyBookings({ status: 'IN_PROGRESS', limit: 1 }),
        getMyBookings({ status: 'AWAITING_PAYMENT', limit: 20 }),
        getMyBookings({ status: 'CONFIRMED', limit: 20 }),
        getMyBookings({ status: 'COMPLETED', limit: 30 }),
      ]);

      setActiveBooking(activeResult.data[0] ?? null);
      setUpcomingBookings([...(awaitingResult.data ?? []), ...(upcomingResult.data ?? [])]);
      setCompletedBookings(completedResult.data ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadTrips();
  };

  const openBooking = (booking: Booking) => {
    router.push({
      pathname: '/(rider)/booked-ride-details',
      params: { bookingId: booking.id },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rides</Text>
      </View>

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

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0056B3" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        >
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {activeTab === 'rides' ? (
            <>
              <Text style={styles.sectionLabel}>Active Ride</Text>
              {activeBooking ? (
                <TouchableOpacity
                  style={styles.activeCard}
                  onPress={() =>
                    activeBooking.status === 'IN_PROGRESS'
                      ? router.push('/(rider)/driver-on-way')
                      : openBooking(activeBooking)
                  }
                >
                  <View style={styles.activeTop}>
                    <View style={styles.rideIconBox}>
                      <MaterialCommunityIcons name="car-connected" size={26} color="#0056B3" />
                    </View>
                    <View style={styles.activeInfo}>
                      <Text style={styles.activeTitle}>
                        {activeBooking.trip?.originCity} → {activeBooking.trip?.destinationCity}
                      </Text>
                      <Text style={styles.activeMeta}>
                        {formatCurrency(getBookingAmount(activeBooking))} · {activeBooking.status.replace('_', ' ')}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : (
                <Text style={styles.emptyInline}>No active ride right now.</Text>
              )}

              <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Upcoming Rides</Text>
              {upcomingBookings.length === 0 ? (
                <Text style={styles.emptyInline}>No upcoming bookings.</Text>
              ) : (
                upcomingBookings.map((booking) => (
                  <TouchableOpacity
                    key={booking.id}
                    style={styles.upcomingCard}
                    onPress={() => openBooking(booking)}
                  >
                    <View style={styles.upcomingAvatar}>
                      <Ionicons name="person-circle" size={42} color="#CBD5E1" />
                    </View>
                    <View style={styles.upcomingInfo}>
                      <View style={styles.upcomingRow}>
                        <Text style={styles.upcomingDriver}>{getBookingDriverName(booking)}</Text>
                        <Text style={styles.upcomingDate}>
                          {formatDepartureDate(booking.trip?.departureDate)}
                        </Text>
                      </View>
                      <Text style={styles.upcomingRoute}>
                        From <Text style={styles.bold}>{booking.trip?.originCity ?? '--'}</Text> To:{' '}
                        <Text style={styles.bold}>{booking.trip?.destinationCity ?? '--'}</Text>
                      </Text>
                      <Text style={styles.upcomingStarts}>
                        Fare: <Text style={styles.bold}>{formatCurrency(getBookingAmount(booking))}</Text>
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </>
          ) : completedBookings.length === 0 ? (
            <Text style={styles.emptyInline}>No completed rides yet.</Text>
          ) : (
            <>
              <Text style={styles.sectionLabel}>Completed</Text>
              {completedBookings.map((booking) => (
                <TouchableOpacity
                  key={booking.id}
                  style={styles.completedCard}
                  onPress={() =>
                    router.push({
                      pathname: '/(rider)/rate-driver',
                      params: { bookingId: booking.id },
                    })
                  }
                >
                  <View style={styles.completedLeft}>
                    <View style={styles.completedIcon}>
                      <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                    </View>
                    <View>
                      <Text style={styles.completedDriver}>{getBookingDriverName(booking)}</Text>
                      <Text style={styles.completedRoute}>
                        {booking.trip?.originCity ?? '--'} → {booking.trip?.destinationCity ?? '--'}
                      </Text>
                      <Text style={styles.completedDate}>
                        {formatDepartureDate(booking.trip?.departureDate)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.completedPrice}>{formatCurrency(getBookingAmount(booking))}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 22, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  tabs: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  tabActive: {},
  tabText: { fontSize: 15, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  tabTextActive: { color: '#0056B3', fontFamily: 'Montserrat_500Medium' },
  tabLine: { position: 'absolute', bottom: 0, height: 3, width: '60%', backgroundColor: '#0056B3', borderRadius: 2 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingBottom: 40 },
  errorText: { color: '#EF4444', marginBottom: 12, fontFamily: 'Roboto_400Regular' },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 12 },
  emptyInline: { color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginBottom: 8 },
  activeCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 16, marginBottom: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 } },
  activeTop: { flexDirection: 'row', alignItems: 'center' },
  rideIconBox: { width: 46, height: 46, backgroundColor: '#EEF4FF', borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
  activeInfo: { marginLeft: 14, flex: 1 },
  activeTitle: { fontSize: 16, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  activeMeta: { fontSize: 12, color: '#64748B', marginTop: 3, fontFamily: 'Roboto_400Regular' },
  bold: { fontWeight: '700', color: '#1A1A1A' },
  upcomingCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 } },
  upcomingAvatar: { marginRight: 14, justifyContent: 'center' },
  upcomingInfo: { flex: 1 },
  upcomingRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  upcomingDriver: { fontSize: 14, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  upcomingDate: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  upcomingRoute: { fontSize: 13, color: '#64748B', fontFamily: 'Roboto_400Regular', marginBottom: 2 },
  upcomingStarts: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  completedCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 } },
  completedLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  completedIcon: { width: 40, height: 40, backgroundColor: '#F0FDF4', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  completedDriver: { fontSize: 14, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  completedRoute: { fontSize: 12, color: '#64748B', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  completedDate: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 1 },
  completedPrice: { fontSize: 15, fontFamily: 'Montserrat_500Medium', color: '#0056B3' },
});
