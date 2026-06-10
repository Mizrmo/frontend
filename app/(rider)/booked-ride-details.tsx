import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MapView, Marker } from '../../components/Map';
import {
  cancelBooking,
  getBookingAmount,
  getBookingById,
  getBookingDriverName,
} from '../../src/api/bookings';
import { getApiErrorMessage } from '../../src/api/errors';
import {
  applyVoucherToBooking,
  getMyVouchers,
  getVoucherCode,
  type MizMilesVoucher,
} from '../../src/api/mizMiles';
import { getBookingPayment } from '../../src/api/payments';
import { PaystackCheckoutModal } from '../../components/PaystackCheckoutModal';
import { formatCurrency, formatDepartureDate, getTripDriverId } from '../../src/api/trips';
import { getUserRating } from '../../src/api/reviews';
import type { Booking } from '../../src/api/trip-types';

export default function BookedRideDetailsScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [driverRating, setDriverRating] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [vouchers, setVouchers] = useState<MizMilesVoucher[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const loadBooking = useCallback(async () => {
    if (!bookingId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getBookingById(String(bookingId));
      setBooking(data);

      try {
        const payment = await getBookingPayment(String(bookingId));
        setPaymentStatus(payment.status ?? null);
      } catch {
        setPaymentStatus(null);
      }

      const driverId = getTripDriverId(data.trip);
      if (driverId) {
        try {
          const rating = await getUserRating(driverId);
          setDriverRating(rating.averageRating ?? rating.rating);
        } catch {
          setDriverRating(undefined);
        }
      }
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  useEffect(() => {
    if (!bookingId) {
      return;
    }
    getMyVouchers()
      .then(setVouchers)
      .catch(() => setVouchers([]));
  }, [bookingId]);

  const handleCancel = () => {
    if (!bookingId) {
      return;
    }

    Alert.alert('Cancel booking', 'Are you sure you want to cancel this booking?', [
      { text: 'Keep booking', style: 'cancel' },
      {
        text: 'Cancel booking',
        style: 'destructive',
        onPress: async () => {
          setIsCancelling(true);
          try {
            await cancelBooking(String(bookingId), { reason: 'Cancelled by rider' });
            Alert.alert('Cancelled', 'Your booking has been cancelled.', [
              { text: 'OK', onPress: () => router.replace('/(rider)/trips') },
            ]);
          } catch (error) {
            Alert.alert('Cancel failed', getApiErrorMessage(error));
          } finally {
            setIsCancelling(false);
          }
        },
      },
    ]);
  };

  const trip = booking?.trip;
  const needsPayment =
    booking?.status === 'AWAITING_PAYMENT' || booking?.status === 'PENDING';
  const canCancel = booking?.status === 'PENDING' || booking?.status === 'AWAITING_PAYMENT' || booking?.status === 'CONFIRMED';
  const canTrack =
    booking?.status === 'IN_PROGRESS' || booking?.status === 'CONFIRMED';
  const canReportIssue =
    booking?.status === 'COMPLETED' ||
    booking?.status === 'CANCELLED' ||
    booking?.status === 'IN_PROGRESS' ||
    booking?.status === 'CONFIRMED';

  const handleApplyVoucher = async () => {
    if (!bookingId || !voucherCode.trim()) {
      return;
    }

    setIsApplyingVoucher(true);
    try {
      await applyVoucherToBooking(voucherCode.trim(), String(bookingId));
      Alert.alert('Voucher applied', 'Discount has been applied to this booking.');
      setVoucherCode('');
      loadBooking();
    } catch (error) {
      Alert.alert('Voucher failed', getApiErrorMessage(error));
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0056B3" />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Booking not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.linkText}>Go back</Text>
        </TouchableOpacity>
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
            <View style={styles.markerCircle}>
              <View style={styles.markerInner} />
            </View>
          </Marker>
        ) : null}
        {trip?.destinationLatitude && trip?.destinationLongitude ? (
          <Marker coordinate={{ latitude: trip.destinationLatitude, longitude: trip.destinationLongitude }}>
            <Ionicons name="location" size={28} color="#FFCC00" />
          </Marker>
        ) : null}
      </MapView>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.sheetTitle}>Ride Details</Text>
        <Text style={styles.statusBadge}>
          {booking.status.replace('_', ' ')}
          {paymentStatus ? ` · Payment ${paymentStatus.toLowerCase()}` : ''}
        </Text>

        <View style={styles.divider} />

        <View style={styles.driverRow}>
          <View style={styles.driverAvatar}>
            <Ionicons name="person-circle" size={46} color="#CBD5E1" />
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{getBookingDriverName(booking)}</Text>
            <Text style={styles.driverMeta}>
              {trip?.originCity ?? '--'} → {trip?.destinationCity ?? '--'}
            </Text>
          </View>
          {driverRating ? (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FFCC00" />
              <Text style={styles.ratingText}>{driverRating.toFixed(1)}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.divider} />

        <View style={styles.routeBlock}>
          <View style={styles.routeRow}>
            <View style={styles.blueDot} />
            <View>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeName}>{trip?.originAddress ?? trip?.originCity ?? '--'}</Text>
            </View>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <Ionicons name="location" size={20} color="#FFCC00" />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.routeLabel}>Drop off</Text>
              <Text style={styles.routeName}>{trip?.destinationAddress ?? trip?.destinationCity ?? '--'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="card-outline" size={20} color="#0056B3" />
            <Text style={styles.metaValue}>{formatCurrency(getBookingAmount(booking))}</Text>
            <Text style={styles.metaLabel}>Fare</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={20} color="#0056B3" />
            <Text style={styles.metaValue}>{formatDepartureDate(trip?.departureDate)}</Text>
            <Text style={styles.metaLabel}>Departure</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={20} color="#0056B3" />
            <Text style={styles.metaValue}>{booking.seatsBooked ?? 1}</Text>
            <Text style={styles.metaLabel}>Seats</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {needsPayment ? (
          <>
            <Text style={styles.voucherLabel}>Have a voucher code?</Text>
            {vouchers.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.voucherChipsScroll}
                contentContainerStyle={styles.voucherChips}
              >
                {vouchers.map((voucher) => {
                  const code = getVoucherCode(voucher);
                  if (!code) {
                    return null;
                  }
                  return (
                    <TouchableOpacity
                      key={voucher.id ?? code}
                      style={[
                        styles.voucherChip,
                        voucherCode === code && styles.voucherChipActive,
                      ]}
                      onPress={() => setVoucherCode(code)}
                    >
                      <Text
                        style={[
                          styles.voucherChipText,
                          voucherCode === code && styles.voucherChipTextActive,
                        ]}
                      >
                        {code}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : null}
            <View style={styles.voucherRow}>
              <TextInput
                style={styles.voucherInput}
                placeholder="MZR-XXXX"
                placeholderTextColor="#94A3B8"
                value={voucherCode}
                onChangeText={setVoucherCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.voucherBtn}
                onPress={handleApplyVoucher}
                disabled={isApplyingVoucher}
              >
                {isApplyingVoucher ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.voucherBtnText}>Apply</Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
          </>
        ) : null}

        {canReportIssue ? (
          <TouchableOpacity
            style={styles.disputeLink}
            onPress={() =>
              router.push({
                pathname: '/(rider)/raise-dispute',
                params: { bookingId: booking.id },
              })
            }
          >
            <Ionicons name="flag-outline" size={16} color="#64748B" />
            <Text style={styles.disputeLinkText}>Report an issue with this ride</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.chatBtn}
            onPress={() =>
              router.push({
                pathname: '/(rider)/chat',
                params: { bookingId: booking.id },
              })
            }
          >
            <Ionicons name="chatbubble-outline" size={18} color="#0056B3" />
            <Text style={styles.chatBtnText}>Support</Text>
          </TouchableOpacity>
          {needsPayment ? (
            <TouchableOpacity style={styles.trackBtn} onPress={() => setPaymentOpen(true)}>
              <Text style={styles.trackBtnText}>Pay Now</Text>
            </TouchableOpacity>
          ) : canTrack ? (
            <TouchableOpacity
              style={styles.trackBtn}
              onPress={() =>
                router.push({
                  pathname: '/(rider)/driver-on-way',
                  params: { bookingId: booking.id, tripId: booking.tripId },
                })
              }
            >
              <Text style={styles.trackBtnText}>Track Driver</Text>
            </TouchableOpacity>
          ) : canCancel ? (
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} disabled={isCancelling}>
              {isCancelling ? (
                <ActivityIndicator color="#EF4444" />
              ) : (
                <Text style={styles.cancelBtnText}>Cancel</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.trackBtn}
              onPress={() =>
                router.push({
                  pathname: '/(rider)/driver-details',
                  params: { tripId: booking.tripId },
                })
              }
            >
              <Text style={styles.trackBtnText}>Driver Info</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <PaystackCheckoutModal
        visible={paymentOpen}
        bookingId={booking.id}
        amount={getBookingAmount(booking)}
        onClose={() => setPaymentOpen(false)}
        onSuccess={() => {
          setPaymentOpen(false);
          loadBooking();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontFamily: 'Roboto_400Regular', color: '#64748B', marginBottom: 12 },
  linkText: { color: '#0056B3', fontFamily: 'Roboto_400Regular' },
  map: { ...StyleSheet.absoluteFillObject },
  backBtn: { position: 'absolute', top: 55, left: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, elevation: 4 },
  backText: { fontSize: 15, marginLeft: 4, fontFamily: 'Roboto_400Regular' },
  markerCircle: { width: 40, height: 40, backgroundColor: 'rgba(0,86,179,0.2)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  markerInner: { width: 14, height: 14, backgroundColor: '#0056B3', borderRadius: 7, borderWidth: 2, borderColor: '#FFF' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, paddingBottom: 36 },
  handle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 20, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A', textAlign: 'center', marginBottom: 6 },
  statusBadge: { alignSelf: 'center', fontSize: 12, color: '#0056B3', fontFamily: 'Montserrat_600SemiBold', textTransform: 'capitalize' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },
  driverRow: { flexDirection: 'row', alignItems: 'center' },
  driverAvatar: { marginRight: 12 },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 15, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  driverMeta: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9E6', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, gap: 4 },
  ratingText: { fontSize: 13, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  routeBlock: {},
  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  blueDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#0056B3', marginRight: 12 },
  routeLine: { width: 2, height: 16, backgroundColor: '#CBD5E1', marginLeft: 5, marginBottom: 4 },
  routeLabel: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  routeName: { fontSize: 14, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  metaItem: { alignItems: 'center', gap: 4 },
  metaValue: { fontSize: 13, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A', textAlign: 'center' },
  metaLabel: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  metaDivider: { width: 1, height: 40, backgroundColor: '#F1F5F9' },
  disputeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 12,
  },
  disputeLinkText: { fontSize: 13, color: '#64748B', fontFamily: 'Roboto_400Regular' },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  chatBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 25, borderWidth: 1.5, borderColor: '#0056B3', gap: 8 },
  chatBtnText: { color: '#0056B3', fontFamily: 'Montserrat_500Medium', fontSize: 15 },
  trackBtn: { flex: 2, height: 50, borderRadius: 25, backgroundColor: '#0056B3', justifyContent: 'center', alignItems: 'center' },
  trackBtnText: { color: '#FFF', fontFamily: 'Montserrat_500Medium', fontSize: 15 },
  cancelBtn: { flex: 2, height: 50, borderRadius: 25, borderWidth: 1.5, borderColor: '#EF4444', justifyContent: 'center', alignItems: 'center' },
  cancelBtnText: { color: '#EF4444', fontFamily: 'Montserrat_500Medium', fontSize: 15 },
  voucherLabel: { fontSize: 13, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', marginBottom: 10 },
  voucherChipsScroll: { marginBottom: 10, maxHeight: 40 },
  voucherChips: { gap: 8, paddingRight: 8 },
  voucherChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  voucherChipActive: { borderColor: '#0056B3', backgroundColor: '#EEF4FF' },
  voucherChipText: { fontSize: 13, fontFamily: 'Roboto_400Regular', color: '#64748B' },
  voucherChipTextActive: { color: '#0056B3', fontFamily: 'Montserrat_600SemiBold' },
  voucherRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  voucherInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#1A1A1A',
    backgroundColor: '#F8FAFC',
  },
  voucherBtn: {
    backgroundColor: '#0056B3',
    paddingHorizontal: 18,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voucherBtnText: { color: '#FFF', fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
});
