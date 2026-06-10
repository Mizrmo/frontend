import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MapView } from '../../components/Map';
import { getBookingById, getBookingAmount, getRiderName, type DriverBookingRequest } from '../../src/api/bookings';
import { getApiErrorMessage } from '../../src/api/errors';
import { formatCurrency, formatDepartureDate, getTripById } from '../../src/api/trips';
import type { Booking } from '../../src/api/trip-types';
import type { Trip } from '../../src/api/trip-types';

export default function DriverRideDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tripId?: string; bookingId?: string }>();
  const tripId = typeof params.tripId === 'string' ? params.tripId : params.tripId?.[0];
  const bookingId = typeof params.bookingId === 'string' ? params.bookingId : params.bookingId?.[0];

  const [booking, setBooking] = useState<Booking | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let loadedBooking: Booking | null = null;
        let loadedTrip: Trip | null = null;

        if (bookingId) {
          loadedBooking = await getBookingById(bookingId);
          if (loadedBooking.trip) {
            loadedTrip = loadedBooking.trip;
          } else if (loadedBooking.tripId) {
            loadedTrip = await getTripById(loadedBooking.tripId);
          }
        } else if (tripId) {
          loadedTrip = await getTripById(tripId);
        }

        if (!cancelled) {
          setBooking(loadedBooking);
          setTrip(loadedTrip);
          if (!loadedTrip && !loadedBooking) {
            setError('Ride details not found.');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [bookingId, tripId]);

  const displayTrip = trip ?? booking?.trip ?? null;
  const statusLabel = booking?.status ?? displayTrip?.status ?? 'COMPLETED';
  const earnings = getBookingAmount(booking);
  const mapLat = displayTrip?.originLatitude ?? 5.6037;
  const mapLng = displayTrip?.originLongitude ?? -0.187;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0056B3" />
      </View>
    );
  }

  if (error || !displayTrip) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ride Details</Text>
          <View style={styles.shareBtn} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error ?? 'Ride details not found.'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride Details</Text>
        <TouchableOpacity style={styles.shareBtn}>
          <Ionicons name="share-social-outline" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: mapLat,
              longitude: mapLng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          />
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{statusLabel.replace(/_/g, ' ')}</Text>
          </View>
        </View>

        <View style={styles.detailsContent}>
          {booking && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>PASSENGER</Text>
              <View style={styles.passengerCard}>
                <Image source={require('../../assets/lady_profile.png')} style={styles.avatar} />
                <View style={styles.passengerInfo}>
                  <Text style={styles.passengerName}>{getRiderName(booking as DriverBookingRequest)}</Text>
                  <Text style={styles.passengerMeta}>
                    {booking.seatsBooked ?? 1} seat{(booking.seatsBooked ?? 1) > 1 ? 's' : ''} booked
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.chatBtn}
                  onPress={() =>
                    router.push({
                      pathname: '/(driver)/chat',
                      params: { bookingId: booking.id },
                    })
                  }
                >
                  <Ionicons name="chatbubble-ellipses" size={20} color="#0056B3" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ROUTE</Text>
            <View style={styles.routeBox}>
              <View style={styles.routeLineRow}>
                <View style={[styles.dot, { backgroundColor: '#0056B3' }]} />
                <View style={styles.dashedLine} />
                <Ionicons name="location" size={18} color="#FFCC00" />
              </View>
              <View style={styles.routeTexts}>
                <View>
                  <Text style={styles.locLabel}>PICKUP</Text>
                  <Text style={styles.locName}>
                    {displayTrip.originAddress ?? displayTrip.originCity}
                  </Text>
                </View>
                <View style={{ marginTop: 20 }}>
                  <Text style={styles.locLabel}>DROP OFF</Text>
                  <Text style={styles.locName}>
                    {displayTrip.destinationAddress ?? displayTrip.destinationCity}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>FARE BREAKDOWN</Text>
            <View style={styles.fareCard}>
              <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>Seats booked</Text>
                <Text style={styles.fareValue}>{booking?.seatsBooked ?? 1}</Text>
              </View>
              {displayTrip.distanceKm != null && (
                <View style={styles.fareRow}>
                  <Text style={styles.fareLabel}>Distance</Text>
                  <Text style={styles.fareValue}>{displayTrip.distanceKm} km</Text>
                </View>
              )}
              <View style={styles.divider} />
              <View style={[styles.fareRow, { marginTop: 15 }]}>
                <Text style={styles.totalLabel}>Total Earnings</Text>
                <Text style={styles.totalValue}>{formatCurrency(earnings)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
              <View>
                <Text style={styles.metaLabel}>Departure</Text>
                <Text style={styles.metaValue}>{formatDepartureDate(displayTrip.departureDate)}</Text>
              </View>
            </View>
            {booking?.createdAt && (
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={20} color="#94A3B8" />
                <View>
                  <Text style={styles.metaLabel}>Booked</Text>
                  <Text style={styles.metaValue}>
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.supportBtn}
        onPress={() => router.push('/(profile)/help-support')}
      >
        <Text style={styles.supportText}>Report an Issue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { color: '#64748B', fontFamily: 'Roboto_400Regular', fontSize: 15, textAlign: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 16,
    paddingBottom: 15,
    backgroundColor: '#FFF',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  shareBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },

  scrollContent: { paddingBottom: 100 },
  mapContainer: { height: 200, width: '100%', backgroundColor: '#F1F5F9' },
  map: { ...StyleSheet.absoluteFillObject },
  statusBadge: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: '#10B981',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: { color: '#FFF', fontSize: 12, fontFamily: 'Montserrat_700Bold', textTransform: 'capitalize' },

  detailsContent: { padding: 20 },
  section: { marginBottom: 30 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Montserrat_700Bold',
    color: '#94A3B8',
    letterSpacing: 1.2,
    marginBottom: 15,
  },

  passengerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 20,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 15 },
  passengerInfo: { flex: 1 },
  passengerName: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  passengerMeta: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  chatBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#FFF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },

  routeBox: { flexDirection: 'row', gap: 15, paddingHorizontal: 10 },
  routeLineRow: { alignItems: 'center', paddingVertical: 5 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dashedLine: { width: 1, flex: 1, backgroundColor: '#E2E8F0', marginVertical: 4 },
  routeTexts: { flex: 1 },
  locLabel: { fontSize: 10, color: '#94A3B8', fontFamily: 'Montserrat_700Bold' },
  locName: { fontSize: 15, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A', marginTop: 4 },

  fareCard: { backgroundColor: '#F8FAFC', borderRadius: 24, padding: 20 },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  fareLabel: { fontSize: 14, color: '#64748B', fontFamily: 'Roboto_400Regular' },
  fareValue: { fontSize: 14, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginTop: 10 },
  totalLabel: { fontSize: 16, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  totalValue: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#0056B3' },

  metaGrid: { flexDirection: 'row', gap: 20, marginTop: 10, flexWrap: 'wrap' },
  metaItem: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 16,
  },
  metaLabel: { fontSize: 10, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  metaValue: { fontSize: 14, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },

  supportBtn: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  supportText: { fontSize: 15, color: '#EF4444', fontFamily: 'Montserrat_600SemiBold' },
});
