import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MapView } from '../../components/Map';
import {
  acceptBooking,
  declineBooking,
  getBookingAmount,
  getBookingById,
  getRiderName,
  type DriverBookingRequest,
} from '../../src/api/bookings';
import { getApiErrorMessage } from '../../src/api/errors';
import { formatCurrency } from '../../src/api/trips';
import type { Booking } from '../../src/api/trip-types';

export default function IncomingRequestModal() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadBooking = useCallback(async () => {
    if (!bookingId) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await getBookingById(String(bookingId));
      setBooking(data);
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  const handleAccept = async () => {
    if (!bookingId) {
      return;
    }

    setIsSubmitting(true);
    try {
      await acceptBooking(String(bookingId));
      router.replace({
        pathname: '/(driver)/start-ride',
        params: { tripId: booking?.tripId ?? '', bookingId: String(bookingId) },
      });
    } catch (error) {
      Alert.alert('Accept failed', getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (!bookingId) {
      router.back();
      return;
    }

    setIsSubmitting(true);
    try {
      await declineBooking(String(bookingId));
      router.replace('/(driver)/home');
    } catch (error) {
      Alert.alert('Decline failed', getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const trip = booking?.trip;
  const riderBooking = booking as DriverBookingRequest | null;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 5.6037, longitude: -0.187, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
      />

      <View style={styles.backdrop} />

      <View style={styles.modal}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#CBD5E1" />
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0056B3" style={{ marginVertical: 40 }} />
        ) : (
          <>
            <View style={styles.iconCircle}>
              <Image
                source={require('../../assets/cars/ToyotaVitz.png')}
                style={styles.carImg}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>New Ride Request</Text>
            <Text style={styles.subtitle}>
              {getRiderName(riderBooking)} wants a ride from{' '}
              <Text style={styles.boldText}>{trip?.originCity ?? 'pickup'}</Text> to{' '}
              <Text style={styles.boldText}>{trip?.destinationCity ?? 'destination'}</Text>.
            </Text>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Seats</Text>
                <Text style={styles.infoValue}>{booking?.seatsBooked ?? 1}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Earn</Text>
                <Text style={styles.infoValue}>{formatCurrency(getBookingAmount(booking))}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.viewBtn} onPress={handleAccept} disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.viewBtnText}>Accept Request</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.declineBtn} onPress={handleDecline} disabled={isSubmitting}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(30, 41, 59, 0.7)' },
  modal: {
    margin: 20,
    marginTop: Platform.OS === 'ios' ? 160 : 120,
    backgroundColor: '#FFF',
    borderRadius: 32,
    padding: 25,
    alignItems: 'center',
    elevation: 20,
  },
  closeBtn: { position: 'absolute', top: 20, right: 20 },
  iconCircle: {
    width: 100,
    height: 100,
    backgroundColor: '#EEF6FF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  carImg: { width: 70, height: 50 },
  title: { fontSize: 20, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', marginBottom: 10 },
  subtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 20, fontFamily: 'Roboto_400Regular' },
  boldText: { color: '#0056B3', fontFamily: 'Montserrat_700Bold' },
  infoRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 25,
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoItem: { alignItems: 'center' },
  infoLabel: { fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'Montserrat_700Bold' },
  infoValue: { fontSize: 16, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  viewBtn: {
    backgroundColor: '#0056B3',
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
  declineBtn: { padding: 8 },
  declineText: { color: '#94A3B8', fontSize: 14, fontFamily: 'Roboto_400Regular' },
});
