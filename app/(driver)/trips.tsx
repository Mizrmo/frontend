import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  acceptBooking,
  declineBooking,
  getBookingAmount,
  getDriverBookingHistory,
  getDriverBookingRequests,
  getRiderName,
  type DriverBookingRequest,
} from '../../src/api/bookings';
import { getApiErrorMessage } from '../../src/api/errors';
import { formatCurrency, formatDepartureDate } from '../../src/api/trips';
import type { Booking } from '../../src/api/trip-types';

type Tab = 'rides' | 'completed';

export default function DriverTripsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('rides');
  const [requests, setRequests] = useState<DriverBookingRequest[]>([]);
  const [completed, setCompleted] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadTrips = useCallback(async () => {
    try {
      const [pending, history] = await Promise.all([
        getDriverBookingRequests(),
        getDriverBookingHistory({ limit: 30 }),
      ]);
      setRequests(pending);
      setCompleted(history.data ?? []);
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const handleAccept = async (bookingId: string, tripId?: string) => {
    try {
      await acceptBooking(bookingId);
      router.push({
        pathname: '/(driver)/start-ride',
        params: { bookingId, tripId: tripId ?? '' },
      });
    } catch (error) {
      Alert.alert('Accept failed', getApiErrorMessage(error));
    }
  };

  const handleDecline = async (bookingId: string) => {
    try {
      await declineBooking(bookingId);
      loadTrips();
    } catch (error) {
      Alert.alert('Decline failed', getApiErrorMessage(error));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ride History</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('rides')}>
          <Text style={[styles.tabText, activeTab === 'rides' && styles.tabTextActive]}>
            Active Requests
          </Text>
          {activeTab === 'rides' && <View style={styles.tabLine} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('completed')}>
          <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
            Completed
          </Text>
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
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                loadTrips();
              }}
            />
          }
        >
          {activeTab === 'rides' ? (
            requests.length === 0 ? (
              <Text style={styles.emptyText}>No pending booking requests.</Text>
            ) : (
              requests.map((card) => (
                <View key={card.id} style={styles.requestCard}>
                  <View style={styles.cardBody}>
                    <View style={styles.avatarBox}>
                      <Ionicons name="person-circle" size={52} color="#CBD5E1" />
                    </View>
                    <View style={styles.cardDetails}>
                      <Text style={styles.passengerName}>{getRiderName(card)}</Text>
                      <Text style={styles.routeInfo}>
                        From <Text style={styles.boldText}>{card.trip?.originCity ?? '--'}</Text> to{' '}
                        <Text style={styles.boldText}>{card.trip?.destinationCity ?? '--'}</Text>
                      </Text>
                      <Text style={styles.distText}>
                        {formatCurrency(getBookingAmount(card))} · {card.seatsBooked ?? 1} seat(s)
                      </Text>
                    </View>
                  </View>
                  <View style={styles.cardBtns}>
                    <TouchableOpacity
                      style={styles.acceptBtn}
                      onPress={() => handleAccept(card.id, card.tripId)}
                    >
                      <Text style={styles.acceptBtnText}>Accept Ride</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rejectBtn}
                      onPress={() => handleDecline(card.id)}
                    >
                      <Text style={styles.rejectBtnText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )
          ) : completed.length === 0 ? (
            <Text style={styles.emptyText}>No completed rides yet.</Text>
          ) : (
            completed.map((ride) => (
              <TouchableOpacity
                key={ride.id}
                style={styles.historyCard}
                onPress={() =>
                  router.push({
                    pathname: '/(driver)/ride-details',
                    params: { tripId: ride.tripId, bookingId: ride.id },
                  })
                }
              >
                <View style={styles.historyTop}>
                  <View style={styles.avatarBox}>
                    <Ionicons name="person-circle" size={48} color="#CBD5E1" />
                  </View>
                  <View style={styles.historyInfo}>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyTitle}>
                        {ride.trip?.originCity} → {ride.trip?.destinationCity}
                      </Text>
                      <Text style={styles.historyDate}>
                        {formatDepartureDate(ride.trip?.departureDate)}
                      </Text>
                    </View>
                    <Text style={styles.historyRoute}>
                      {formatCurrency(getBookingAmount(ride))}
                    </Text>
                    <View style={styles.statusRow}>
                      <View style={styles.successDot} />
                      <Text style={styles.statusText}>{ride.status}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 20, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  tabs: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 15 },
  tabText: { fontSize: 14, color: '#94A3B8', fontFamily: 'Montserrat_500Medium' },
  tabTextActive: { color: '#0056B3', fontFamily: 'Montserrat_600SemiBold' },
  tabLine: { position: 'absolute', bottom: 0, height: 3, width: '40%', backgroundColor: '#0056B3' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingBottom: 40 },
  emptyText: { color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  requestCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
  },
  cardBody: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  avatarBox: { justifyContent: 'center', alignItems: 'center' },
  cardDetails: { flex: 1, marginLeft: 15 },
  passengerName: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', marginBottom: 4 },
  routeInfo: { fontSize: 13, color: '#64748B', fontFamily: 'Roboto_400Regular', marginBottom: 6 },
  boldText: { fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  distText: { fontSize: 12, color: '#0056B3', fontFamily: 'Montserrat_600SemiBold' },
  cardBtns: { flexDirection: 'row', gap: 12 },
  acceptBtn: { flex: 1, height: 48, backgroundColor: '#0056B3', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  acceptBtnText: { color: '#FFF', fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
  rejectBtn: { flex: 1, height: 48, borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  rejectBtnText: { color: '#EF4444', fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
  historyCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  historyTop: { flexDirection: 'row', alignItems: 'center' },
  historyInfo: { flex: 1, marginLeft: 15 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  historyTitle: { fontSize: 15, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', flex: 1 },
  historyDate: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  historyRoute: { fontSize: 13, color: '#64748B', fontFamily: 'Roboto_400Regular', marginBottom: 6 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  successDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  statusText: { fontSize: 12, color: '#10B981', fontFamily: 'Montserrat_600SemiBold', textTransform: 'capitalize' },
});
