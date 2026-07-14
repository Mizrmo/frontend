import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  Keyboard,
  InputAccessoryView,
  Modal,
  Pressable,
} from 'react-native';
import DateTimePicker from '../../components/DateTimePicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapView } from '../../components/Map';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getApiErrorMessage } from '../../src/api/errors';
import { extractCityLabel, formatCurrency } from '../../src/api/trip-types';
import { createTrip, getFarePreview } from '../../src/api/trips';
import { getCityCoordinates, toApiDateTime } from '../../src/api/upload';
import { getMyVehicles } from '../../src/api/vehicles';

const KEYBOARD_DONE_ID = 'advertise-ride-keyboard-done';
type FieldKey = 'pickup' | 'dropoff' | 'seats';
const FIELD_ORDER: FieldKey[] = ['pickup', 'dropoff', 'seats'];

export default function AdvertiseRideScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ pickup?: string; dropoff?: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const pickupRef = useRef<TextInput>(null);
  const dropoffRef = useRef<TextInput>(null);
  const seatsRef = useRef<TextInput>(null);
  const fieldRefs: Record<FieldKey, React.RefObject<TextInput | null>> = {
    pickup: pickupRef,
    dropoff: dropoffRef,
    seats: seatsRef,
  };

  const [activeField, setActiveField] = useState<FieldKey | null>(null);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [totalSeats, setTotalSeats] = useState('4');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [farePreview, setFarePreview] = useState<string | null>(null);
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const isKeyboardOpen = keyboardHeight > 0;
  const sheetTop = insets.top + 52;

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

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
      setActiveField(null);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const focusField = (key: FieldKey) => {
    fieldRefs[key].current?.focus();
  };

  const focusNextField = () => {
    if (!activeField) {
      return;
    }
    const index = FIELD_ORDER.indexOf(activeField);
    if (index < FIELD_ORDER.length - 1) {
      focusField(FIELD_ORDER[index + 1]);
    }
  };

  const focusPreviousField = () => {
    if (!activeField) {
      return;
    }
    const index = FIELD_ORDER.indexOf(activeField);
    if (index > 0) {
      focusField(FIELD_ORDER[index - 1]);
    }
  };

  const handleFieldFocus = (key: FieldKey) => {
    setActiveField(key);
    if (key === 'seats') {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
    }
  };

  const openDatePicker = () => {
    Keyboard.dismiss();
    setShowDatePicker(true);
  };

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

  const formatDeparture = () =>
    departureDate.toLocaleString(undefined, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  const renderRouteInput = (
    key: FieldKey,
    label: string,
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    icon: React.ReactNode,
    isLast = false
  ) => (
    <View style={[styles.routeRow, !isLast && styles.routeRowBorder]}>
      <View style={styles.routeIconWrap}>{icon}</View>
      <View style={styles.routeField}>
        <Text style={styles.routeLabel}>{label}</Text>
        <TextInput
          ref={fieldRefs[key]}
          style={styles.routeInput}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => handleFieldFocus(key)}
          returnKeyType={isLast ? 'done' : 'next'}
          blurOnSubmit={!isLast}
          onSubmitEditing={() => {
            if (isLast) {
              Keyboard.dismiss();
              return;
            }
            focusField(FIELD_ORDER[FIELD_ORDER.indexOf(key) + 1]);
          }}
          inputAccessoryViewID={Platform.OS === 'ios' ? KEYBOARD_DONE_ID : undefined}
          keyboardType={key === 'seats' ? 'number-pad' : 'default'}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <MapView
        style={[styles.map, isKeyboardOpen && styles.mapCompact]}
        initialRegion={{ latitude: 5.6698, longitude: -0.0167, latitudeDelta: 0.12, longitudeDelta: 0.12 }}
        pointerEvents={isKeyboardOpen ? 'none' : 'auto'}
      />

      {isKeyboardOpen ? <View style={styles.mapOverlay} pointerEvents="none" /> : null}

      {Platform.OS === 'ios' ? (
        <InputAccessoryView nativeID={KEYBOARD_DONE_ID}>
          <View style={styles.keyboardBar}>
            <TouchableOpacity
              onPress={focusPreviousField}
              disabled={activeField === 'pickup' || activeField === null}
            >
              <Text
                style={[
                  styles.keyboardNavText,
                  (activeField === 'pickup' || activeField === null) && styles.keyboardNavTextDisabled,
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={focusNextField}
              disabled={activeField === 'seats' || activeField === null}
            >
              <Text
                style={[
                  styles.keyboardNavText,
                  (activeField === 'seats' || activeField === null) && styles.keyboardNavTextDisabled,
                ]}
              >
                Next
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={Keyboard.dismiss}>
              <Text style={styles.keyboardDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      ) : null}

      <View style={[styles.headerControls, { top: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => {
            Keyboard.dismiss();
            router.back();
          }}
        >
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.sheet,
          isKeyboardOpen
            ? { top: sheetTop, bottom: keyboardHeight }
            : { bottom: 0, maxHeight: '58%' },
        ]}
      >
        {!isKeyboardOpen ? <View style={styles.handle} /> : null}

        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Advertise Ride</Text>
          {isKeyboardOpen ? (
            <TouchableOpacity onPress={Keyboard.dismiss} hitSlop={12}>
              <Text style={styles.collapseText}>Show map</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View
          style={[
            styles.routeCard,
            activeField === 'pickup' || activeField === 'dropoff' ? styles.routeCardFocused : null,
          ]}
        >
          {renderRouteInput(
            'pickup',
            'Pick up',
            'City or area',
            pickup,
            setPickup,
            <View style={[styles.dot, { backgroundColor: '#0056B3' }]} />
          )}
          {renderRouteInput(
            'dropoff',
            'Drop off',
            'City or area',
            dropoff,
            setDropoff,
            <Ionicons name="location" size={18} color="#FFCC00" />,
            true
          )}
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.sheetScroll}
          contentContainerStyle={styles.sheetScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <View style={styles.optionsRow}>
            <TouchableOpacity style={[styles.optionCard, styles.dateCard]} onPress={openDatePicker}>
              <View style={styles.optionIcon}>
                <Ionicons name="calendar-outline" size={18} color="#0056B3" />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionLabel}>Departure</Text>
                <Text style={styles.optionValue} numberOfLines={1}>
                  {formatDeparture()}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
            </TouchableOpacity>

            <View
              style={[
                styles.optionCard,
                styles.seatsCard,
                activeField === 'seats' ? styles.optionCardFocused : null,
              ]}
            >
              <View style={styles.optionIcon}>
                <Ionicons name="people-outline" size={18} color="#0056B3" />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionLabel}>Seats</Text>
                <TextInput
                  ref={seatsRef}
                  style={styles.seatsInput}
                  keyboardType="number-pad"
                  value={totalSeats}
                  onChangeText={setTotalSeats}
                  onFocus={() => handleFieldFocus('seats')}
                  maxLength={2}
                  inputAccessoryViewID={Platform.OS === 'ios' ? KEYBOARD_DONE_ID : undefined}
                />
              </View>
            </View>
          </View>

          {farePreview ? (
            <View style={styles.fareCard}>
              <Text style={styles.fareLabel}>Estimated fare</Text>
              <Text style={styles.fareValue}>{farePreview}</Text>
            </View>
          ) : null}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: isKeyboardOpen ? 12 : Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity
            style={styles.advertiseBtn}
            onPress={() => {
              Keyboard.dismiss();
              void handlePublish();
            }}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.advertiseBtnText}>Publish Ride</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {Platform.OS === 'android' && showDatePicker ? (
        <DateTimePicker
          value={departureDate}
          mode="datetime"
          display="default"
          minimumDate={new Date()}
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (event.type !== 'dismissed' && date) {
              setDepartureDate(date);
            }
          }}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal visible={showDatePicker} transparent animationType="slide" onRequestClose={() => setShowDatePicker(false)}>
          <Pressable style={styles.dateModalBackdrop} onPress={() => setShowDatePicker(false)} />
          <View style={[styles.dateModalSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={styles.dateModalHeader}>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.dateModalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.dateModalTitle}>Departure</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.dateModalDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={departureDate}
              mode="datetime"
              display="spinner"
              minimumDate={new Date()}
              onChange={(_event, date) => {
                if (date) {
                  setDepartureDate(date);
                }
              }}
              style={styles.datePickerWheel}
            />
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  map: { ...StyleSheet.absoluteFillObject },
  mapCompact: { height: 120 },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(248, 250, 252, 0.55)',
  },
  headerControls: { position: 'absolute', left: 20, zIndex: 20 },
  iconBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#FFF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 16,
    elevation: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 20, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  collapseText: { fontSize: 14, fontFamily: 'Montserrat_600SemiBold', color: '#0056B3' },
  sheetScroll: { flex: 1 },
  sheetScrollContent: { paddingBottom: 8 },

  routeCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    overflow: 'hidden',
  },
  routeCardFocused: { borderColor: '#0056B3' },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 64,
  },
  routeRowBorder: { borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  routeIconWrap: { width: 28, alignItems: 'center' },
  routeField: { flex: 1, marginLeft: 10 },
  routeLabel: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'Roboto_400Regular',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  routeInput: {
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'Roboto_400Regular',
    padding: 0,
    margin: 0,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },

  optionsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 72,
  },
  dateCard: { flex: 1.35 },
  optionCardFocused: { borderColor: '#0056B3', backgroundColor: '#F8FBFF' },
  seatsCard: { flex: 1 },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EDF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: { flex: 1 },
  optionLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: 'Roboto_400Regular',
    marginBottom: 2,
  },
  optionValue: { fontSize: 15, color: '#1A1A1A', fontFamily: 'Montserrat_600SemiBold' },
  seatsInput: {
    fontSize: 15,
    color: '#1A1A1A',
    fontFamily: 'Montserrat_600SemiBold',
    padding: 0,
    margin: 0,
  },

  fareCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EDF2FF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  fareLabel: { fontSize: 14, color: '#64748B', fontFamily: 'Roboto_400Regular' },
  fareValue: { fontSize: 18, color: '#0056B3', fontFamily: 'Montserrat_700Bold' },

  footer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFF',
  },
  advertiseBtn: {
    backgroundColor: '#0056B3',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  advertiseBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },

  keyboardBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  keyboardNavText: { color: '#0056B3', fontSize: 15, fontFamily: 'Montserrat_600SemiBold' },
  keyboardNavTextDisabled: { color: '#94A3B8' },
  keyboardDoneText: { color: '#0056B3', fontSize: 15, fontFamily: 'Montserrat_600SemiBold' },

  dateModalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  dateModalSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dateModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dateModalTitle: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  dateModalCancel: { fontSize: 16, fontFamily: 'Roboto_400Regular', color: '#64748B' },
  dateModalDone: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#0056B3' },
  datePickerWheel: { height: 216 },
});
