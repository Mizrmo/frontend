import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getApiErrorMessage } from '../../src/api/errors';
import { getUserRating } from '../../src/api/reviews';
import {
  formatCurrency,
  formatDepartureDate,
  getTripById,
  getTripDriverId,
  getTripDriverName,
  getTripDriverRating,
  getTripPrice,
  getTripVehicleLabel,
} from '../../src/api/trips';
import type { Trip } from '../../src/api/trip-types';

export default function DriverDetailsScreen() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId?: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [rating, setRating] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const loadTrip = useCallback(async () => {
    if (!tripId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getTripById(String(tripId));
      setTrip(data);

      const driverId = getTripDriverId(data);
      if (driverId) {
        try {
          const ratingData = await getUserRating(driverId);
          setRating(ratingData.averageRating ?? ratingData.rating ?? getTripDriverRating(data));
        } catch {
          setRating(getTripDriverRating(data));
        }
      } else {
        setRating(getTripDriverRating(data));
      }
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadTrip();
  }, [loadTrip]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0056B3" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Trip not found.</Text>
      </View>
    );
  }

  const driver = trip.driver ?? trip.driverProfile?.user ?? trip.driverUser;
  const details = [
    { label: 'Vehicle', value: getTripVehicleLabel(trip) },
    { label: 'Phone', value: driver?.phoneNumber ?? 'Not available' },
    { label: 'Route', value: `${trip.originCity} → ${trip.destinationCity}` },
    { label: 'Departure', value: formatDepartureDate(trip.departureDate) },
    { label: 'Fare per seat', value: formatCurrency(getTripPrice(trip)) },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver Details</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person-outline" size={48} color="#94A3B8" />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.name}>{getTripDriverName(trip)}</Text>
          <Text style={styles.meta}>
            Professional Driver{rating ? ` · ${rating.toFixed(1)} ★` : ''}
          </Text>
        </View>

        <View style={styles.card}>
          {details.map((item, idx) => (
            <View key={item.label} style={[styles.row, idx === details.length - 1 && styles.noBorder]}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.confirmBtn} onPress={() => router.back()}>
          <Text style={styles.confirmBtnText}>Back to Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#64748B', fontFamily: 'Roboto_400Regular' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  content: { padding: 24, alignItems: 'center' },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  infoBox: { alignItems: 'center', marginBottom: 30 },
  name: { fontSize: 22, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', marginBottom: 4 },
  meta: { fontSize: 14, color: '#64748B', fontFamily: 'Roboto_400Regular' },
  card: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 40,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 12 },
  noBorder: { borderBottomWidth: 0 },
  label: { fontSize: 13, color: '#94A3B8', fontFamily: 'Roboto_400Regular', flex: 1 },
  value: { fontSize: 14, color: '#1A1A1A', fontFamily: 'Montserrat_500Medium', flex: 1, textAlign: 'right' },
  confirmBtn: { backgroundColor: '#0056B3', width: '100%', height: 55, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  confirmBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Roboto_400Regular', fontWeight: '600' },
});
