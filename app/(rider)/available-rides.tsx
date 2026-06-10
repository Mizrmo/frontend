import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBooking, getBookingAmount } from '../../src/api/bookings';
import { getApiErrorMessage } from '../../src/api/errors';
import { PaystackCheckoutModal } from '../../components/PaystackCheckoutModal';
import {
  formatCurrency,
  formatDepartureDate,
  getTripDriverName,
  getTripDriverRating,
  getTripPrice,
  getTripSeatsAvailable,
  getTripVehicleLabel,
  searchTrips,
  type Trip,
} from '../../src/api/trips';

export default function AvailableRideListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    originCity?: string;
    destinationCity?: string;
    departureDate?: string;
    pickup?: string;
    dropoff?: string;
    seats?: string;
  }>();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  const originCity = params.originCity ?? 'Tema';
  const destinationCity = params.destinationCity ?? 'Accra';
  const departureDate = params.departureDate ?? new Date().toISOString().split('T')[0];
  const pickupLabel = params.pickup ?? originCity;
  const dropoffLabel = params.dropoff ?? destinationCity;
  const seats = Number(params.seats ?? 1) || 1;

  const loadTrips = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await searchTrips({
        originCity,
        destinationCity,
        departureDate,
        seats,
        limit: 20,
        sortBy: 'DEPARTURE_TIME',
      });
      setTrips(result.data ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  }, [originCity, destinationCity, departureDate, seats]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const openConfirm = (trip: Trip) => {
    setSelectedTrip(trip);
    setConfirmOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedTrip) {
      return;
    }

    setIsBooking(true);
    try {
      const booking = await createBooking({
        tripId: selectedTrip.id,
        seatsBooked: seats,
        paymentMethod: 'MOBILE_MONEY',
      });
      setCreatedBookingId(booking.id);
      setConfirmOpen(false);
      setPaymentOpen(true);
    } catch (err) {
      Alert.alert('Booking failed', getApiErrorMessage(err));
    } finally {
      setIsBooking(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentOpen(false);
    setSuccessOpen(true);
  };

  const selectedPrice = selectedTrip ? getTripPrice(selectedTrip) * seats : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Available rides</Text>
        <TouchableOpacity onPress={loadTrips} style={styles.backBtn}>
          <Ionicons name="refresh" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.subtitle}>
          {isLoading ? 'Searching...' : `${trips.length} rides found · ${originCity} → ${destinationCity}`}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0056B3" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadTrips}>
            <Text style={styles.retryBtnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : trips.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>No rides found</Text>
          <Text style={styles.emptyText}>Try a different date or route.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {trips.map((trip) => (
            <TouchableOpacity key={trip.id} style={styles.rideCard} onPress={() => openConfirm(trip)}>
              <View style={styles.rideIcon}>
                <MaterialCommunityIcons name="routes" size={26} color="#0056B3" />
              </View>
              <View style={styles.rideInfo}>
                <View style={styles.rideHeader}>
                  <Text style={styles.driverName}>{getTripDriverName(trip)}</Text>
                  <Text style={styles.price}>{formatCurrency(getTripPrice(trip))}</Text>
                </View>
                <Text style={styles.rideSpecs}>
                  {getTripVehicleLabel(trip)} · {getTripSeatsAvailable(trip)} seats · {trip.originCity}
                </Text>
                <View style={styles.timeRow}>
                  <Ionicons name="time-outline" size={13} color="#94A3B8" />
                  <Text style={styles.timeText}>{formatDepartureDate(trip.departureDate)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Modal visible={confirmOpen} transparent animationType="slide">
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setConfirmOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Confirm Your Ride</Text>

          <View style={styles.routeBlock}>
            <View style={styles.routeRow}>
              <View style={[styles.markerDot, { backgroundColor: '#0056B3' }]} />
              <View>
                <Text style={styles.routeLabel}>Pick up</Text>
                <Text style={styles.routeName}>{selectedTrip?.originAddress ?? pickupLabel}</Text>
              </View>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routeRow}>
              <Ionicons name="location" size={20} color="#FFCC00" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.routeLabel}>Drop off</Text>
                <Text style={styles.routeName}>{selectedTrip?.destinationAddress ?? dropoffLabel}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.driverCard}>
            <Image source={require('../../assets/Ellipse 1192.png')} style={styles.avatar} />
            <View style={styles.driverInfoText}>
              <Text style={styles.driverNameBig}>{getTripDriverName(selectedTrip)}</Text>
              <Text style={styles.driverMeta}>
                {getTripVehicleLabel(selectedTrip)} · {getTripSeatsAvailable(selectedTrip)} seats
                {getTripDriverRating(selectedTrip) ? ` · ${getTripDriverRating(selectedTrip)?.toFixed(1)} ★` : ''}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.fareRow}>
            <View>
              <Text style={styles.fareLabel}>Total Fare</Text>
              <Text style={styles.fareSub}>{seats} seat{seats > 1 ? 's' : ''} · estimated cost</Text>
            </View>
            <Text style={styles.fareAmount}>{formatCurrency(selectedPrice)}</Text>
          </View>

          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={handleConfirmBooking}
            disabled={isBooking}
          >
            {isBooking ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.confirmBtnText}>Confirm Booking</Text>
            )}
          </TouchableOpacity>
        </View>
      </Modal>

      <PaystackCheckoutModal
        visible={paymentOpen}
        bookingId={createdBookingId}
        amount={selectedPrice}
        onClose={() => setPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      <Modal visible={successOpen} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successDialog}>
            <View style={styles.successIconBg}>
              <Ionicons name="checkmark" size={40} color="#FFF" />
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successSubText}>
              Your seat is confirmed. You can view trip details anytime from My Trips.
            </Text>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => {
                setSuccessOpen(false);
                if (createdBookingId) {
                  router.replace({
                    pathname: '/(rider)/booked-ride-details',
                    params: { bookingId: createdBookingId },
                  });
                  return;
                }
                router.replace('/(rider)/trips');
              }}
            >
              <Text style={styles.doneBtnText}>View Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 16,
    paddingBottom: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  titleRow: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#FFF' },
  subtitle: { fontSize: 13, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  errorText: { color: '#EF4444', textAlign: 'center', marginBottom: 16, fontFamily: 'Roboto_400Regular' },
  retryBtn: { backgroundColor: '#0056B3', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  retryBtnText: { color: '#FFF', fontFamily: 'Roboto_400Regular' },
  emptyTitle: { fontSize: 18, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', marginBottom: 8 },
  emptyText: { color: '#94A3B8', fontFamily: 'Roboto_400Regular', textAlign: 'center' },
  list: { padding: 16, paddingBottom: 40 },
  rideCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  rideIcon: { width: 48, height: 48, backgroundColor: '#EEF6FF', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  rideInfo: { flex: 1, marginLeft: 15 },
  rideHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  driverName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 15, color: '#1A1A1A' },
  price: { fontFamily: 'Montserrat_700Bold', color: '#0056B3', fontSize: 16 },
  rideSpecs: { fontSize: 12, color: '#64748B', marginBottom: 8, fontFamily: 'Roboto_400Regular' },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 12, color: '#94A3B8', marginLeft: 4, fontFamily: 'Roboto_400Regular' },
  backdrop: { flex: 1, backgroundColor: 'rgba(30, 41, 59, 0.6)' },
  sheet: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: Platform.OS === 'ios' ? 50 : 30 },
  handle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 20, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', textAlign: 'center', marginBottom: 25 },
  routeBlock: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 20 },
  routeRow: { flexDirection: 'row', alignItems: 'center' },
  markerDot: { width: 10, height: 10, borderRadius: 5, marginRight: 15 },
  routeLabel: { fontSize: 11, color: '#94A3B8', fontFamily: 'Montserrat_700Bold', letterSpacing: 0.5 },
  routeName: { fontSize: 14, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', marginTop: 2 },
  routeLine: { width: 1, height: 20, backgroundColor: '#E2E8F0', marginLeft: 4.5, marginVertical: 4 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 20 },
  driverCard: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  avatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: '#F1F5F9' },
  driverInfoText: { flex: 1 },
  driverNameBig: { fontSize: 16, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  driverMeta: { fontSize: 13, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fareLabel: { fontSize: 14, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  fareSub: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  fareAmount: { fontSize: 24, fontFamily: 'Montserrat_700Bold', color: '#0056B3' },
  confirmBtn: { backgroundColor: '#0056B3', height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 30, elevation: 4, shadowColor: '#0056B3', shadowOpacity: 0.3 },
  confirmBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
  fareSummarySmall: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, backgroundColor: '#F8FAFC', padding: 15, borderRadius: 16 },
  fareLabelSmall: { fontSize: 14, color: '#64748B', fontFamily: 'Roboto_400Regular' },
  fareAmountSmall: { fontSize: 16, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  mtnCard: { backgroundColor: '#FFCC00', borderRadius: 20, padding: 20, elevation: 4 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardLogoMtn: { width: 45, height: 35 },
  momoHint: { color: '#1A1A1A', fontSize: 14, fontFamily: 'Roboto_400Regular' },
  activePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  activeDot: { width: 6, height: 6, backgroundColor: '#22C55E', borderRadius: 3 },
  activeText: { fontSize: 11, color: '#1A1A1A', fontFamily: 'Montserrat_700Bold' },
  successOverlay: { flex: 1, backgroundColor: 'rgba(30, 41, 59, 0.7)', justifyContent: 'center', padding: 25 },
  successDialog: { backgroundColor: '#FFF', borderRadius: 32, padding: 40, alignItems: 'center' },
  successIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  successTitle: { fontSize: 22, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', marginBottom: 12 },
  successSubText: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22, marginBottom: 35, fontFamily: 'Roboto_400Regular' },
  doneBtn: { backgroundColor: '#0056B3', width: '100%', height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  doneBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
});
