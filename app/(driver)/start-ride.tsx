import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MapView, Marker } from '../../components/Map';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getBookingAmount, getBookingById, getRiderName } from '../../src/api/bookings';
import { getApiErrorMessage } from '../../src/api/errors';
import { useDriverLocationPublisher } from '../../src/hooks/useTripTracking';
import {
  emitDriverTripComplete,
  emitDriverTripStart,
} from '../../src/services/tracking';
import {
  completeTrip,
  formatCurrency,
  formatDepartureDate,
  getTripById,
  startTrip,
} from '../../src/api/trips';
import type { Trip } from '../../src/api/trip-types';

type Status = 'ready' | 'in-progress' | 'completed';

export default function DriverStartRideScreen() {
  const router = useRouter();
  const { tripId, bookingId } = useLocalSearchParams<{ tripId?: string; bookingId?: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [riderName, setRiderName] = useState('Rider');
  const [fare, setFare] = useState(0);
  const [status, setStatus] = useState<Status>('ready');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    if (!tripId) {
      setIsLoading(false);
      return;
    }

    try {
      const tripData = await getTripById(String(tripId));
      setTrip(tripData);
      if (tripData.status === 'IN_PROGRESS') {
        setStatus('in-progress');
      }

      if (bookingId) {
        const booking = await getBookingById(String(bookingId));
        setRiderName(getRiderName(booking as any));
        setFare(getBookingAmount(booking));
      }
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [tripId, bookingId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useDriverLocationPublisher({
    tripId: tripId ? String(tripId) : undefined,
    enabled: status === 'in-progress',
  });

  const handlePrimaryAction = async () => {
    if (!tripId) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (status === 'ready') {
        await startTrip(String(tripId));
        emitDriverTripStart(String(tripId));
        setStatus('in-progress');
        return;
      }

      if (status === 'in-progress') {
        await completeTrip(String(tripId));
        emitDriverTripComplete(String(tripId));
        setStatus('completed');
        router.replace({
          pathname: '/(driver)/rate-rider',
          params: { bookingId: bookingId ?? '', tripId: String(tripId) },
        });
      }
    } catch (error) {
      Alert.alert('Action failed', getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusLabels: Record<Status, string> = {
    ready: 'Start Ride',
    'in-progress': 'Complete Ride',
    completed: 'Completed',
  };

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
        initialRegion={{
          latitude: trip?.originLatitude ?? 5.6037,
          longitude: trip?.originLongitude ?? -0.187,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
      >
        {trip?.originLatitude && trip?.originLongitude ? (
          <Marker coordinate={{ latitude: trip.originLatitude, longitude: trip.originLongitude }}>
            <View style={styles.carMarker}>
              <Ionicons name="car" size={20} color="#0056B3" />
            </View>
          </Marker>
        ) : null}
        {trip?.destinationLatitude && trip?.destinationLongitude ? (
          <Marker
            coordinate={{ latitude: trip.destinationLatitude, longitude: trip.destinationLongitude }}
          >
            <Ionicons name="location" size={24} color="#FFCC00" />
          </Marker>
        ) : null}
      </MapView>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.routeBlock}>
          <View style={styles.routeRow}>
            <View style={styles.blueMarker} />
            <View>
              <Text style={styles.locLabel}>Pickup location</Text>
              <Text style={styles.locName}>{trip?.originAddress ?? trip?.originCity ?? '--'}</Text>
            </View>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <Ionicons name="location" size={20} color="#FFCC00" />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.locLabel}>Drop off Location</Text>
              <Text style={styles.locName}>{trip?.destinationAddress ?? trip?.destinationCity ?? '--'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.passengerRow}>
          <View style={styles.passengerLeft}>
            <Image source={require('../../assets/lady_profile.png')} style={styles.avatar} />
            <View>
              <Text style={styles.passengerName}>{riderName}</Text>
              <Text style={styles.passengerMeta}>{formatDepartureDate(trip?.departureDate)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.fareRow}>
          <View style={styles.fareIconBg}>
            <MaterialCommunityIcons name="wallet-outline" size={24} color="#0052B4" />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.fareAmount}>{formatCurrency(fare)}</Text>
            <Text style={styles.fareLabel}>Trip fare</Text>
          </View>
        </View>

        <View style={styles.footerBtns}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handlePrimaryAction}
            disabled={isSubmitting || status === 'completed'}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.primaryBtnText}>{statusLabels[status]}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  map: { ...StyleSheet.absoluteFillObject },
  backBtn: { position: 'absolute', top: 55, left: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, elevation: 5 },
  backText: { fontSize: 14, marginLeft: 4, fontFamily: 'Roboto_400Regular', color: '#1A1A1A' },
  carMarker: { width: 44, height: 44, backgroundColor: '#FFF', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  handle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  routeBlock: { marginBottom: 10 },
  routeRow: { flexDirection: 'row', alignItems: 'center' },
  blueMarker: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0056B3', marginRight: 15 },
  routeLine: { width: 2, height: 20, backgroundColor: '#EEF2FF', marginLeft: 4, marginVertical: 4 },
  locLabel: { fontSize: 10, color: '#94A3B8', fontFamily: 'Roboto_400Regular', textTransform: 'uppercase' },
  locName: { fontSize: 15, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 18 },
  passengerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  passengerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, backgroundColor: '#F1F5F9' },
  passengerName: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  passengerMeta: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  fareRow: { flexDirection: 'row', alignItems: 'center' },
  fareIconBg: { width: 48, height: 48, backgroundColor: '#EEF4FF', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  fareAmount: { fontSize: 17, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  fareLabel: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  footerBtns: { marginTop: 20 },
  primaryBtn: { backgroundColor: '#0056B3', height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
});
