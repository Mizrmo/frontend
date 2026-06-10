import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MapView } from '../../components/Map';
import { formatDepartureDate, getTripById } from '../../src/api/trips';
import type { Trip } from '../../src/api/trip-types';

export default function RideConfirmedScreen() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId?: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(tripId));

  useEffect(() => {
    if (!tripId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    getTripById(String(tripId))
      .then((data) => {
        if (!cancelled) {
          setTrip(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTrip(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [tripId]);

  const routeLabel =
    trip?.originCity && trip?.destinationCity
      ? `${trip.originCity} → ${trip.destinationCity}`
      : null;

  const goHome = () => router.replace('/(driver)/home');

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: trip?.originLatitude ?? 5.6037,
          longitude: trip?.originLongitude ?? -0.187,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      />

      <View style={styles.backdrop} />

      <View style={styles.popup}>
        <TouchableOpacity style={styles.closeBtn} onPress={goHome}>
          <Ionicons name="close" size={24} color="#CBD5E1" />
        </TouchableOpacity>

        <View style={styles.illustrationFrame}>
          <View style={styles.circleOuter}>
            <View style={styles.circleInner}>
              <MaterialCommunityIcons name="car-side" size={52} color="#0056B3" />
            </View>
          </View>
        </View>

        <Text style={styles.title}>Ride Advertised</Text>
        {isLoading ? (
          <ActivityIndicator color="#0056B3" style={{ marginVertical: 16 }} />
        ) : (
          <Text style={styles.message}>
            {routeLabel
              ? `Your trip ${routeLabel} is live${trip?.departureDate ? ` · ${formatDepartureDate(trip.departureDate)}` : ''}.`
              : 'New ride advertise has been created successfully'}
          </Text>
        )}

        <TouchableOpacity style={styles.doneBtn} onPress={goHome}>
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(30, 41, 59, 0.6)' },
  popup: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 25,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  closeBtn: { position: 'absolute', top: 20, right: 20 },
  illustrationFrame: { marginBottom: 20, marginTop: 10 },
  circleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 86, 179, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInner: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#EEF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 22, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', marginBottom: 8 },
  message: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    fontFamily: 'Roboto_400Regular',
    paddingHorizontal: 20,
  },
  doneBtn: {
    backgroundColor: '#0056B3',
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#0056B3',
    shadowOpacity: 0.3,
  },
  doneBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
});
