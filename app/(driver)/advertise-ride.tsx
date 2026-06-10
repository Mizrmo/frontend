import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MapView } from '../../components/Map';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getApiErrorMessage } from '../../src/api/errors';
import { extractCityLabel, formatCurrency } from '../../src/api/trip-types';
import { createTrip, getFarePreview } from '../../src/api/trips';
import { getCityCoordinates, toApiDateTime } from '../../src/api/upload';
import { getMyVehicles } from '../../src/api/vehicles';

export default function AdvertiseRideScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ pickup?: string; dropoff?: string }>();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [totalSeats, setTotalSeats] = useState('4');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [farePreview, setFarePreview] = useState<string | null>(null);
  const [vehicleId, setVehicleId] = useState<string | null>(null);

  const loadVehicle = useCallback(async () => {
    try {
      const vehicles = await getMyVehicles();
      if (vehicles[0]?.id) {
        setVehicleId(vehicles[0].id);
      }
    } catch {
      setVehicleId(null);
    }
  }, []);

  useEffect(() => {
    loadVehicle();
  }, [loadVehicle]);

  useEffect(() => {
    if (typeof params.pickup === 'string' && params.pickup) {
      setPickup(params.pickup);
    }
    if (typeof params.dropoff === 'string' && params.dropoff) {
      setDropoff(params.dropoff);
    }
  }, [params.pickup, params.dropoff]);

  const updateFarePreview = useCallback(async () => {
    const originCity = extractCityLabel(pickup);
    const destinationCity = extractCityLabel(dropoff);
    if (!originCity || !destinationCity) {
      setFarePreview(null);
      return;
    }

    try {
      const origin = getCityCoordinates(originCity);
      const dest = getCityCoordinates(destinationCity);
      const preview = await getFarePreview({
        originLat: origin.lat,
        originLng: origin.lng,
        destLat: dest.lat,
        destLng: dest.lng,
        seats: Number(totalSeats) || 1,
      });
      const amount =
        preview.totalFare ?? preview.estimatedFare ?? preview.farePerSeat ?? null;
      setFarePreview(amount != null ? formatCurrency(amount) : null);
    } catch {
      setFarePreview(null);
    }
  }, [pickup, dropoff, totalSeats]);

  useEffect(() => {
    updateFarePreview();
  }, [updateFarePreview]);

  const handlePublish = async () => {
    if (!vehicleId) {
      Alert.alert('Vehicle required', 'Complete driver registration with a vehicle first.');
      router.push('/(auth)/vehicle-details');
      return;
    }

    const originCity = extractCityLabel(pickup);
    const destinationCity = extractCityLabel(dropoff);
    if (!originCity || !destinationCity) {
      Alert.alert('Required', 'Enter pickup and drop-off locations.');
      return;
    }

    const origin = getCityCoordinates(originCity);
    const dest = getCityCoordinates(destinationCity);

    setIsPublishing(true);
    try {
      const trip = await createTrip({
        vehicleId,
        originCity,
        originAddress: pickup.trim() || originCity,
        originLatitude: origin.lat,
        originLongitude: origin.lng,
        destinationCity,
        destinationAddress: dropoff.trim() || destinationCity,
        destinationLatitude: dest.lat,
        destinationLongitude: dest.lng,
        departureDate: toApiDateTime(departureDate),
        totalSeats: Number(totalSeats) || 1,
      });

      router.replace({
        pathname: '/(driver)/ride-confirmed',
        params: { tripId: trip.id },
      });
    } catch (error) {
      Alert.alert('Publish failed', getApiErrorMessage(error));
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 5.6698, longitude: -0.0167, latitudeDelta: 0.12, longitudeDelta: 0.12 }}
      />

      <View style={styles.headerControls}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.sheetTitle}>Advertise Ride</Text>
        <View style={styles.divider} />

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <View style={[styles.dot, { backgroundColor: '#0056B3' }]} />
              <TextInput
                style={styles.input}
                placeholder="Pick Up (city or area)"
                placeholderTextColor="#94A3B8"
                value={pickup}
                onChangeText={setPickup}
              />
            </View>
            <View style={styles.inputDivider} />
            <View style={styles.inputRow}>
              <Ionicons name="location" size={18} color="#FFCC00" />
              <TextInput
                style={styles.input}
                placeholder="Drop Off (city or area)"
                placeholderTextColor="#94A3B8"
                value={dropoff}
                onChangeText={setDropoff}
              />
            </View>
          </View>

          <View style={styles.datetimeRow}>
            <TouchableOpacity style={styles.pill} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.pillLabel}>Date</Text>
              <Text style={styles.pillValue}>
                {departureDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
              </Text>
            </TouchableOpacity>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>Seats</Text>
              <TextInput
                style={styles.seatInput}
                keyboardType="number-pad"
                value={totalSeats}
                onChangeText={setTotalSeats}
              />
            </View>
          </View>

          {showDatePicker ? (
            <DateTimePicker
              value={departureDate}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={new Date()}
              onChange={(_event, date) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (date) {
                  setDepartureDate(date);
                }
              }}
            />
          ) : null}

          {farePreview ? (
            <Text style={styles.fareHint}>Estimated fare: {farePreview}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.advertiseBtn}
            onPress={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.advertiseBtnText}>Publish Ride</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  headerControls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
  },
  iconBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#FFF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '58%',
  },
  handle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 20, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 18 },
  inputGroup: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 54 },
  dot: { width: 10, height: 10, borderRadius: 5, marginLeft: 4 },
  inputDivider: { height: 1, backgroundColor: '#E2E8F0', marginLeft: 50 },
  input: { flex: 1, marginLeft: 14, fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  datetimeRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  pill: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pillLabel: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginBottom: 4 },
  pillValue: { fontSize: 15, color: '#1A1A1A', fontFamily: 'Montserrat_600SemiBold' },
  seatInput: { fontSize: 15, color: '#1A1A1A', fontFamily: 'Montserrat_600SemiBold', padding: 0 },
  fareHint: { textAlign: 'center', color: '#0056B3', marginBottom: 12, fontFamily: 'Roboto_400Regular' },
  advertiseBtn: {
    backgroundColor: '#0056B3',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  advertiseBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
});
