import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MapView, Marker } from '../../components/Map';
import { getBookingById, getBookingDriverName } from '../../src/api/bookings';
import { getApiErrorMessage } from '../../src/api/errors';
import { useRiderTripTracking } from '../../src/hooks/useTripTracking';
import type { Booking } from '../../src/api/trip-types';

function formatEta(minutes: number | null): string {
  if (minutes == null || minutes <= 0) {
    return '--:--';
  }
  const hrs = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes % 1) * 60);
  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `00:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function DriverOnWayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bookingId?: string; tripId?: string }>();
  const tripId = typeof params.tripId === 'string' ? params.tripId : params.tripId?.[0];
  const bookingId = typeof params.bookingId === 'string' ? params.bookingId : params.bookingId?.[0];

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { driverLocation, etaMinutes, isConnected } = useRiderTripTracking({
    tripId,
    enabled: Boolean(tripId),
  });

  useEffect(() => {
    if (!bookingId) {
      setIsLoading(false);
      return;
    }

    getBookingById(bookingId)
      .then(setBooking)
      .catch(() => setBooking(null))
      .finally(() => setIsLoading(false));
  }, [bookingId]);

  const trip = booking?.trip;
  const driverCoord = driverLocation ?? {
    latitude: trip?.originLatitude ?? 5.6037,
    longitude: trip?.originLongitude ?? -0.187,
  };
  const destCoord = {
    latitude: trip?.destinationLatitude ?? 5.62,
    longitude: trip?.destinationLongitude ?? -0.2,
  };

  const mapRegion = useMemo(
    () => ({
      latitude: (driverCoord.latitude + destCoord.latitude) / 2,
      longitude: (driverCoord.longitude + destCoord.longitude) / 2,
      latitudeDelta: 0.06,
      longitudeDelta: 0.06,
    }),
    [driverCoord, destCoord]
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0056B3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={mapRegion}
      >
        <Marker coordinate={driverCoord}>
          <View style={styles.carMarker}>
            <Ionicons name="car" size={20} color="#0056B3" />
          </View>
        </Marker>
        <Marker coordinate={destCoord}>
          <View style={styles.destMarker}>
            <Ionicons name="location" size={24} color="#FFCC00" />
          </View>
        </Marker>
      </MapView>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.sheet}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.handle} />

          <View style={styles.etaRow}>
            <View>
              <Text style={styles.etaValue}>{formatEta(etaMinutes)}</Text>
              <Text style={styles.etaLabel}>Driver arriving in</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={[styles.statusDot, isConnected && styles.statusDotLive]} />
              <Text style={styles.statusText}>{isConnected ? 'Live' : 'Connecting'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.routeBlock}>
            <View style={styles.routeRow}>
              <View style={styles.blueDot} />
              <View>
                <Text style={styles.routeLabel}>Pickup location</Text>
                <Text style={styles.routeName}>{trip?.originAddress ?? trip?.originCity ?? '--'}</Text>
              </View>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routeRow}>
              <Ionicons name="location" size={20} color="#FFCC00" />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.routeLabel}>Drop off Location</Text>
                <Text style={styles.routeName}>
                  {trip?.destinationAddress ?? trip?.destinationCity ?? '--'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.driverRow}>
            <View style={styles.driverAvatar}>
              <Ionicons name="person-circle" size={46} color="#CBD5E1" />
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{getBookingDriverName(booking)}</Text>
              <Text style={styles.driverMeta}>On the way to pickup</Text>
            </View>
            <TouchableOpacity style={styles.callBtn} onPress={() => router.push('/(rider)/chat')}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#0056B3" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  map: { ...StyleSheet.absoluteFillObject },
  backBtn: {
    position: 'absolute',
    top: 55,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    elevation: 4,
  },
  backText: { fontSize: 15, marginLeft: 4, fontFamily: 'Roboto_400Regular' },
  carMarker: {
    width: 44,
    height: 44,
    backgroundColor: '#FFF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  destMarker: { alignItems: 'center' },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    paddingBottom: 36,
    maxHeight: '48%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  etaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  etaValue: { fontSize: 28, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  etaLabel: { fontSize: 13, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#94A3B8' },
  statusDotLive: { backgroundColor: '#10B981' },
  statusText: { fontSize: 12, fontFamily: 'Montserrat_600SemiBold', color: '#10B981' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  routeBlock: {},
  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  blueDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#0056B3', marginRight: 12 },
  routeLine: { width: 2, height: 16, backgroundColor: '#CBD5E1', marginLeft: 5, marginBottom: 4 },
  routeLabel: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  routeName: { fontSize: 14, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  driverRow: { flexDirection: 'row', alignItems: 'center' },
  driverAvatar: { marginRight: 12 },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  driverMeta: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
