import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MapView, Marker, Polyline } from '../../components/Map';
import { Ionicons } from '@expo/vector-icons';
import { extractCityLabel, toApiDate } from '../../src/api/trip-types';
import { getApiErrorMessage } from '../../src/api/errors';
import { useAuth } from '../../src/context/AuthContext';
import { getFavouriteRoutes, isFavouriteRoute, toggleFavouriteRoute } from '../../src/utils/favourites';
import { saveLastSearchRoute } from '../../src/utils/lastSearch';
import type { FavouriteRoute } from '../../src/utils/favourites';
import {
  distanceBetweenKm,
  formatDistanceKm,
  geocodePlace,
  type Coordinates,
} from '../../src/utils/geocode';
import { fetchDrivingRoute } from '../../src/utils/route';
import { getRouteMapRegion, sampleRoutePoints } from '../../src/utils/mapCamera';
import { useDeviceLocation } from '../../src/hooks/useDeviceLocation';
import { reverseGeocodeLabel, resolveDeviceLocation, toMapRegion } from '../../src/utils/userLocation';

const DEFAULT_REGION = {
  latitude: 5.6037,
  longitude: -0.187,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const MAP_EDGE = {
  expanded: { top: 110, right: 44, bottom: 380, left: 44 },
  minimized: { top: 90, right: 44, bottom: 120, left: 44 },
};

const recentPlaces = [
  { id: 1, name: 'Tema', address: 'Community 1, Tema', pickup: 'Tema', dropoff: 'Accra' },
  { id: 2, name: 'Accra', address: 'Independence Avenue', pickup: 'Accra', dropoff: 'Tema' },
  { id: 3, name: 'Ashaiman', address: 'Main station', pickup: 'Ashaiman', dropoff: 'Tema' },
];

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export default function SearchLocationScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const mapRef = useRef<any>(null);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [seats] = useState(1);
  const [isFavourite, setIsFavourite] = useState(false);
  const [savedRoutes, setSavedRoutes] = useState<FavouriteRoute[]>([]);
  const [pickupCoord, setPickupCoord] = useState<Coordinates | null>(null);
  const [dropoffCoord, setDropoffCoord] = useState<Coordinates | null>(null);
  const [routeCoords, setRouteCoords] = useState<Coordinates[]>([]);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [routing, setRouting] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const pickupFromDeviceRef = useRef(false);
  const { location: deviceLocation, hasPermission: hasLocationPermission, refresh: refreshDeviceLocation } =
    useDeviceLocation();

  const applyDevicePickup = useCallback(async () => {
    let activeLocation = deviceLocation;
    if (!activeLocation) {
      await refreshDeviceLocation();
      activeLocation = await resolveDeviceLocation();
    }
    if (!activeLocation) {
      return;
    }

    const label = await reverseGeocodeLabel(activeLocation);
    setPickup(label);
    setPickupCoord({
      latitude: activeLocation.latitude,
      longitude: activeLocation.longitude,
    });
    pickupFromDeviceRef.current = true;

    if (mapRef.current?.animateToRegion) {
      mapRef.current.animateToRegion(toMapRegion(activeLocation, 0.025, 0.025), 500);
    }
  }, [deviceLocation, refreshDeviceLocation]);

  const refreshFavouriteState = useCallback(async () => {
    const favourites = await getFavouriteRoutes(user?.id);
    setSavedRoutes(favourites);
    if (pickup.trim() && dropoff.trim()) {
      setIsFavourite(await isFavouriteRoute(user?.id, pickup, dropoff));
    } else {
      setIsFavourite(false);
    }
  }, [pickup, dropoff, user?.id]);

  useFocusEffect(
    useCallback(() => {
      refreshFavouriteState();
      refreshDeviceLocation();
    }, [refreshFavouriteState, refreshDeviceLocation])
  );

  useEffect(() => {
    if (!deviceLocation || pickup.trim() || pickupFromDeviceRef.current) {
      return;
    }

    void applyDevicePickup();
  }, [deviceLocation, pickup, applyDevicePickup]);

  const fitMapToRoute = useCallback(
    (points: Coordinates[], distance: number | null) => {
      if (!mapRef.current || points.length === 0) {
        return;
      }

      const fitPoints = sampleRoutePoints(points);
      const region = getRouteMapRegion(fitPoints, distance);
      if (!region) {
        return;
      }

      requestAnimationFrame(() => {
        if (mapRef.current?.animateToRegion) {
          mapRef.current.animateToRegion(region, 500);
          return;
        }

        const padding = sheetExpanded ? MAP_EDGE.expanded : MAP_EDGE.minimized;
        if (mapRef.current?.fitToCoordinates) {
          mapRef.current.fitToCoordinates(fitPoints, {
            edgePadding: padding,
            animated: true,
          });
        }
      });
    },
    [sheetExpanded]
  );

  useEffect(() => {
    if (!mapReady) {
      return;
    }

    const mapPoints =
      routeCoords.length > 1
        ? routeCoords
        : ([pickupCoord, dropoffCoord].filter(Boolean) as Coordinates[]);

    if (mapPoints.length > 0) {
      fitMapToRoute(mapPoints, distanceKm);
    }
  }, [mapReady, routeCoords, pickupCoord, dropoffCoord, distanceKm, sheetExpanded, fitMapToRoute]);

  useEffect(() => {
    const pickupTrimmed = pickup.trim();
    const dropoffTrimmed = dropoff.trim();

    if (pickupTrimmed.length < 2 && dropoffTrimmed.length < 2) {
      setPickupCoord(null);
      setDropoffCoord(null);
      setRouteCoords([]);
      setDistanceKm(null);
      setDurationMinutes(null);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setGeocoding(true);
      try {
        const nearPickup = deviceLocation
          ? { latitude: deviceLocation.latitude, longitude: deviceLocation.longitude }
          : null;

        const pickupResult =
          pickupTrimmed.length >= 2
            ? await geocodePlace(pickupTrimmed, {
                contextQuery: dropoffTrimmed,
                nearLocation: nearPickup,
              })
            : null;

        if (cancelled) {
          return;
        }

        setPickupCoord(pickupResult);

        const dropoffResult =
          dropoffTrimmed.length >= 2
            ? await geocodePlace(dropoffTrimmed, {
                contextQuery: pickupTrimmed,
                nearLocation: pickupResult ?? nearPickup,
              })
            : null;

        if (cancelled) {
          return;
        }

        setDropoffCoord(dropoffResult);
        setRouteCoords([]);
        setDurationMinutes(null);

        if (pickupResult && dropoffResult) {
          setRouting(true);
          const straightDistance = distanceBetweenKm(pickupResult, dropoffResult);
          setDistanceKm(straightDistance);

          const drivingRoute = await fetchDrivingRoute(pickupResult, dropoffResult);
          if (cancelled) {
            return;
          }

          if (drivingRoute) {
            setRouteCoords(drivingRoute.coordinates);
            setDistanceKm(drivingRoute.distanceKm);
            setDurationMinutes(drivingRoute.durationMinutes);
          } else {
            setRouteCoords([pickupResult, dropoffResult]);
          }
        } else if (pickupResult || dropoffResult) {
          setDistanceKm(null);
          setRouteCoords([]);
        } else {
          setDistanceKm(null);
        }
      } finally {
        if (!cancelled) {
          setGeocoding(false);
          setRouting(false);
        }
      }
    }, 450);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pickup, dropoff, deviceLocation]);

  const handleToggleFavourite = async () => {
    if (!pickup.trim() || !dropoff.trim()) {
      Alert.alert('Save route', 'Enter pickup and drop-off before saving.');
      return;
    }
    try {
      const result = await toggleFavouriteRoute(user?.id, pickup, dropoff);
      setIsFavourite(result.saved);
      setSavedRoutes(result.favourites);
    } catch (error) {
      Alert.alert('Favourites', getApiErrorMessage(error));
    }
  };

  const onDateChange = (_event: unknown, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDepartureDate(selectedDate);
    }
  };

  const navigateToSearch = (pickupValue: string, dropoffValue: string) => {
    const originCity = extractCityLabel(pickupValue);
    const destinationCity = extractCityLabel(dropoffValue);

    if (!originCity || !destinationCity) {
      Alert.alert('Required', 'Please enter both pickup and drop-off locations.');
      return;
    }

    void saveLastSearchRoute(user?.id, {
      originCity,
      destinationCity,
      pickup: pickupValue.trim(),
      dropoff: dropoffValue.trim(),
    });

    router.push({
      pathname: '/(rider)/available-rides',
      params: {
        originCity,
        destinationCity,
        departureDate: toApiDate(departureDate),
        pickup: pickupValue.trim(),
        dropoff: dropoffValue.trim(),
        seats: String(seats),
      },
    });
  };

  const handleSearch = () => navigateToSearch(pickup, dropoff);

  const collapseSheet = () => {
    Keyboard.dismiss();
    setSheetExpanded(false);
  };

  const expandSheet = () => {
    setSheetExpanded(true);
  };

  const hasRoute = Boolean(pickupCoord && dropoffCoord);
  const mapBusy = geocoding || routing;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={
          deviceLocation ? toMapRegion(deviceLocation) : DEFAULT_REGION
        }
        mapType="standard"
        showsPointsOfInterest
        showsBuildings
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={false}
        showsCompass={false}
        showsTraffic={false}
        pitchEnabled={false}
        rotateEnabled={false}
        onMapReady={() => setMapReady(true)}
      >
        {pickupCoord ? (
          <Marker coordinate={pickupCoord} title="Pickup" description={pickup.trim()}>
            <View style={styles.markerWrap}>
              <View style={styles.pickupPin}>
                <View style={styles.pickupDot} />
              </View>
              <View style={styles.markerStem} />
            </View>
          </Marker>
        ) : null}
        {dropoffCoord ? (
          <Marker coordinate={dropoffCoord} title="Drop-off" description={dropoff.trim()}>
            <View style={styles.markerWrap}>
              <View style={styles.dropoffPin}>
                <Ionicons name="location" size={16} color="#FFF" />
              </View>
              <View style={[styles.markerStem, styles.dropoffStem]} />
            </View>
          </Marker>
        ) : null}
        {routeCoords.length >= 2 ? (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#0056B3"
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        ) : null}
      </MapView>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
      </TouchableOpacity>

      {hasRoute ? (
        <TouchableOpacity
          style={styles.recenterBtn}
          onPress={() => {
            const points =
              routeCoords.length > 1
                ? routeCoords
                : ([pickupCoord, dropoffCoord].filter(Boolean) as Coordinates[]);
            fitMapToRoute(points, distanceKm);
          }}
        >
          <Ionicons name="locate" size={20} color="#0056B3" />
        </TouchableOpacity>
      ) : null}

      {(distanceKm != null || mapBusy) && (
        <View style={[styles.mapOverlay, !sheetExpanded && styles.mapOverlayRaised]}>
          {mapBusy ? (
            <View style={styles.tripBadge}>
              <ActivityIndicator size="small" color="#0056B3" />
              <Text style={styles.tripBadgeText}>Finding route…</Text>
            </View>
          ) : distanceKm != null ? (
            <View style={styles.tripBadge}>
              <Ionicons name="navigate-outline" size={16} color="#0056B3" />
              <Text style={styles.tripBadgeText}>{formatDistanceKm(distanceKm)}</Text>
              {durationMinutes != null ? (
                <>
                  <Text style={styles.tripBadgeDot}>·</Text>
                  <Text style={styles.tripBadgeSub}>{formatDuration(durationMinutes)}</Text>
                </>
              ) : null}
            </View>
          ) : null}
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.sheet, !sheetExpanded && styles.sheetMinimized]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          style={styles.sheetHandleRow}
          onPress={() => (sheetExpanded ? collapseSheet() : expandSheet())}
          activeOpacity={0.8}
        >
          <View style={styles.handle} />
          <Ionicons
            name={sheetExpanded ? 'chevron-down' : 'chevron-up'}
            size={18}
            color="#64748B"
            style={styles.handleChevron}
          />
        </TouchableOpacity>

        {!sheetExpanded ? (
          <View style={styles.minimizedContent}>
            <View style={styles.minimizedInfo}>
              <Text style={styles.minimizedRoute} numberOfLines={1}>
                {pickup.trim() || 'Pickup'} → {dropoff.trim() || 'Drop-off'}
              </Text>
              {distanceKm != null ? (
                <Text style={styles.minimizedMeta}>
                  {formatDistanceKm(distanceKm)}
                  {durationMinutes != null ? ` · ${formatDuration(durationMinutes)}` : ''}
                </Text>
              ) : null}
            </View>
            <TouchableOpacity style={styles.minimizedSearchBtn} onPress={handleSearch}>
              <Text style={styles.minimizedSearchText}>Search</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.sheetHeaderRow}>
              <Text style={styles.title}>Search For A Ride</Text>
              <TouchableOpacity onPress={collapseSheet} style={styles.hideMapBtn}>
                <Ionicons name="map-outline" size={16} color="#0056B3" />
                <Text style={styles.hideMapBtnText}>Map</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />

            <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <Ionicons name="radio-button-on" size={18} color="#0056B3" />
              <TextInput
                style={styles.input}
                placeholder="Pick Up (city or area)"
                placeholderTextColor="#94A3B8"
                value={pickup}
                onChangeText={(value) => {
                  pickupFromDeviceRef.current = Boolean(value.trim());
                  setPickup(value);
                }}
              />
              {hasLocationPermission ? (
                <TouchableOpacity style={styles.locateFieldBtn} onPress={() => void applyDevicePickup()}>
                  <Ionicons name="locate" size={18} color="#0056B3" />
                </TouchableOpacity>
              ) : null}
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

            {distanceKm != null && !mapBusy ? (
              <View style={styles.routeSummary}>
                <Text style={styles.routeSummaryText}>
                  {pickup.trim()} → {dropoff.trim()} · {formatDistanceKm(distanceKm)}
                  {durationMinutes != null ? ` · ~${formatDuration(durationMinutes)} drive` : ''}
                </Text>
              </View>
            ) : null}

            <View style={styles.datetimeRow}>
              <TouchableOpacity style={styles.pill} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.pillLabel}>Date</Text>
                <Text style={styles.pillValue}>
                  {departureDate.toLocaleDateString(undefined, {
                    day: '2-digit',
                    month: 'short',
                    year: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>
              <View style={styles.pill}>
                <Text style={styles.pillLabel}>Seats</Text>
                <Text style={styles.pillValue}>{seats}</Text>
              </View>
            </View>

            {showDatePicker ? (
              <DateTimePicker
                value={departureDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={new Date()}
                onChange={onDateChange}
              />
            ) : null}

            <View style={styles.searchRow}>
              <TouchableOpacity style={[styles.searchBtn, styles.searchBtnFlex]} onPress={handleSearch}>
                <Text style={styles.searchBtnText}>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.favBtn} onPress={handleToggleFavourite}>
                <Ionicons
                  name={isFavourite ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isFavourite ? '#EF4444' : '#0056B3'}
                />
              </TouchableOpacity>
            </View>

            {savedRoutes.length > 0 ? (
              <>
                <Text style={styles.recentTitle}>Saved routes</Text>
                {savedRoutes.slice(0, 5).map((route) => (
                  <TouchableOpacity
                    key={route.id}
                    style={styles.placeRow}
                    onPress={() => {
                      setPickup(route.pickup);
                      setDropoff(route.dropoff);
                      navigateToSearch(route.pickup, route.dropoff);
                    }}
                  >
                    <View style={styles.pinCircle}>
                      <Ionicons name="heart" size={16} color="#EF4444" />
                    </View>
                    <View style={styles.placeInfo}>
                      <Text style={styles.placeName}>{route.label}</Text>
                      <Text style={styles.placeAddr}>
                        {route.pickup} → {route.dropoff}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                ))}
              </>
            ) : null}

            <Text style={styles.recentTitle}>Quick routes</Text>
            {recentPlaces.map((place) => (
              <TouchableOpacity
                key={place.id}
                style={styles.placeRow}
                onPress={() => {
                  setPickup(place.pickup);
                  setDropoff(place.dropoff);
                  navigateToSearch(place.pickup, place.dropoff);
                }}
              >
                <View style={styles.pinCircle}>
                  <Ionicons name="location" size={18} color="#FFCC00" />
                </View>
                <View style={styles.placeInfo}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeAddr}>{place.address}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 36,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 3,
  },
  recenterBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 36,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 3,
  },
  mapOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 108 : 88,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  mapOverlayRaised: {
    top: Platform.OS === 'ios' ? 56 : 36,
  },
  tripBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  tripBadgeText: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#1A1A1A',
  },
  tripBadgeDot: { color: '#CBD5E1', fontSize: 14 },
  tripBadgeSub: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    color: '#64748B',
  },
  markerWrap: { alignItems: 'center' },
  pickupPin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0056B3',
    borderWidth: 3,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pickupDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
  dropoffPin: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFCC00',
    borderWidth: 3,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  markerStem: {
    width: 3,
    height: 10,
    backgroundColor: '#0056B3',
    marginTop: -1,
  },
  dropoffStem: { backgroundColor: '#EAB308' },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 34,
    maxHeight: '62%',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 16,
  },
  sheetMinimized: {
    maxHeight: undefined,
    paddingBottom: Platform.OS === 'ios' ? 28 : 20,
  },
  sheetHandleRow: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },
  handleChevron: { marginTop: 4 },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: { fontSize: 20, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  hideMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  hideMapBtnText: {
    fontSize: 13,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#0056B3',
  },
  minimizedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 4,
  },
  minimizedInfo: { flex: 1 },
  minimizedRoute: {
    fontSize: 15,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#1A1A1A',
  },
  minimizedMeta: {
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
    color: '#64748B',
    marginTop: 2,
  },
  minimizedSearchBtn: {
    backgroundColor: '#0056B3',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  minimizedSearchText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
  },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 16 },
  inputGroup: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 50 },
  inputDivider: { height: 1, backgroundColor: '#E2E8F0', marginLeft: 50 },
  input: { flex: 1, marginLeft: 12, fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  locateFieldBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EEF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeSummary: {
    backgroundColor: '#EEF6FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    marginTop: -8,
  },
  routeSummaryText: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    color: '#0056B3',
  },
  datetimeRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  pill: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  pillLabel: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginBottom: 2 },
  pillValue: { fontSize: 14, color: '#1A1A1A', fontFamily: 'Montserrat_500Medium' },
  searchRow: { flexDirection: 'row', gap: 12, marginBottom: 24, alignItems: 'center' },
  searchBtnFlex: { flex: 1, marginBottom: 0 },
  searchBtn: {
    backgroundColor: '#0056B3',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  searchBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Roboto_400Regular', fontWeight: '600' },
  favBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#0056B3',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  recentTitle: { fontSize: 15, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A', marginBottom: 12 },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  pinCircle: {
    width: 36,
    height: 36,
    backgroundColor: '#FFF9E6',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeInfo: { flex: 1, marginLeft: 14 },
  placeName: { fontSize: 14, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  placeAddr: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
});
