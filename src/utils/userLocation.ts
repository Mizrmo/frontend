import * as Location from 'expo-location';
import { storage } from '../api/storage';

const LAST_LOCATION_KEY = 'mizrmo_last_location';

export interface StoredLocation {
  latitude: number;
  longitude: number;
  updatedAt: string;
}

export interface MapRegion extends StoredLocation {
  latitudeDelta: number;
  longitudeDelta: number;
}

export async function hasLocationPermission(): Promise<boolean> {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentDeviceLocation(): Promise<StoredLocation | null> {
  const granted = await hasLocationPermission();
  if (!granted) {
    return null;
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const location: StoredLocation = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    updatedAt: new Date().toISOString(),
  };

  await storage.setItem(LAST_LOCATION_KEY, JSON.stringify(location));
  return location;
}

export async function getLastKnownLocation(): Promise<StoredLocation | null> {
  const raw = await storage.getItem(LAST_LOCATION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredLocation;
    if (typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export async function resolveDeviceLocation(): Promise<StoredLocation | null> {
  if (await hasLocationPermission()) {
    try {
      return await getCurrentDeviceLocation();
    } catch {
      return getLastKnownLocation();
    }
  }
  return getLastKnownLocation();
}

export function toMapRegion(
  location: StoredLocation,
  latitudeDelta = 0.035,
  longitudeDelta = 0.035
): MapRegion {
  return {
    ...location,
    latitudeDelta,
    longitudeDelta,
  };
}

export async function reverseGeocodeLabel(location: StoredLocation): Promise<string> {
  try {
    const results = await Location.reverseGeocodeAsync(location);
    if (results.length > 0) {
      const place = results[0];
      const parts = [place.name, place.street, place.district, place.city, place.subregion]
        .filter(Boolean)
        .map((part) => String(part).trim());

      const unique = [...new Set(parts)];
      if (unique.length > 0) {
        return unique.slice(0, 2).join(', ');
      }

      if (place.city) {
        return String(place.city);
      }
      if (place.region) {
        return String(place.region);
      }
    }
  } catch {
    // fall through
  }

  return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
}
