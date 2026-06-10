import * as Location from 'expo-location';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeocodeOptions {
  contextQuery?: string;
  nearLocation?: Coordinates | null;
}

/** Fallback coordinates for common Ghana place names */
const KNOWN_PLACES: Record<string, Coordinates> = {
  tema: { latitude: 5.6698, longitude: -0.0167 },
  accra: { latitude: 5.6037, longitude: -0.187 },
  ashaiman: { latitude: 5.6953, longitude: -0.0247 },
  anaji: { latitude: 5.5789, longitude: -1.8534 },
  apollo: { latitude: 5.5912, longitude: -1.8315 },
  apremdo: { latitude: 5.6123, longitude: -1.8765 },
  takoradi: { latitude: 5.6037, longitude: -1.9896 },
  sekondi: { latitude: 5.934, longitude: -1.7137 },
  kumasi: { latitude: 6.6885, longitude: -1.6244 },
  cape: { latitude: 5.1053, longitude: -1.2466 },
  'cape coast': { latitude: 5.1053, longitude: -1.2466 },
};

/** Only trust a hardcoded place if it is reasonably close to the user */
const MAX_KNOWN_PLACE_KM = 45;

function normalizePlaceKey(query: string): string {
  return query.trim().toLowerCase().split(',')[0]?.trim() ?? '';
}

function toCoordinate(result: Location.LocationGeocodedLocation): Coordinates {
  return {
    latitude: result.latitude,
    longitude: result.longitude,
  };
}

async function getLocalityHint(nearLocation: Coordinates): Promise<{ city?: string; region?: string }> {
  try {
    const results = await Location.reverseGeocodeAsync(nearLocation);
    const place = results[0];
    if (!place) {
      return {};
    }
    return {
      city: place.city ?? place.subregion ?? place.district ?? undefined,
      region: place.region ?? undefined,
    };
  } catch {
    return {};
  }
}

function pickClosestResult(
  results: Coordinates[],
  nearLocation?: Coordinates | null
): Coordinates | null {
  if (results.length === 0) {
    return null;
  }
  if (!nearLocation) {
    return results[0];
  }

  let best = results[0];
  let bestDistance = distanceBetweenKm(nearLocation, best);

  for (const candidate of results.slice(1)) {
    const distance = distanceBetweenKm(nearLocation, candidate);
    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }

  return best;
}

async function geocodeCandidates(
  candidates: string[],
  nearLocation?: Coordinates | null
): Promise<Coordinates | null> {
  const collected: Coordinates[] = [];

  for (const address of candidates) {
    try {
      const results = await Location.geocodeAsync(address);
      for (const result of results) {
        collected.push(toCoordinate(result));
      }
    } catch {
      // try next candidate
    }
  }

  return pickClosestResult(collected, nearLocation);
}

export async function geocodePlace(
  query: string,
  options: GeocodeOptions = {}
): Promise<Coordinates | null> {
  const trimmed = query.trim();
  if (!trimmed) {
    return null;
  }

  const { contextQuery, nearLocation } = options;
  const queryKey = normalizePlaceKey(trimmed);
  const known = KNOWN_PLACES[queryKey];

  if (known) {
    if (!nearLocation || distanceBetweenKm(nearLocation, known) <= MAX_KNOWN_PLACE_KM) {
      return known;
    }
  }

  const contextLabel = contextQuery?.trim().split(',')[0]?.trim();
  const contextKey = contextLabel ? normalizePlaceKey(contextLabel) : '';
  const localityHint = nearLocation ? await getLocalityHint(nearLocation) : {};

  const candidates = [
    localityHint.city ? `${trimmed}, ${localityHint.city}, Ghana` : null,
    localityHint.region ? `${trimmed}, ${localityHint.region}, Ghana` : null,
    contextLabel && contextKey !== queryKey ? `${trimmed}, ${contextLabel}, Ghana` : null,
    `${trimmed}, Ghana`,
    trimmed,
  ].filter((value): value is string => Boolean(value));

  const uniqueCandidates = [...new Set(candidates)];
  return geocodeCandidates(uniqueCandidates, nearLocation);
}

export function distanceBetweenKm(from: Coordinates, to: Coordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const lat1 = toRad(from.latitude);
  const lat2 = toRad(to.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export function regionForCoordinates(
  points: Coordinates[],
  paddingFactor = 1.4
): Coordinates & { latitudeDelta: number; longitudeDelta: number } {
  if (points.length === 0) {
    return {
      latitude: 5.6037,
      longitude: -0.187,
      latitudeDelta: 0.12,
      longitudeDelta: 0.12,
    };
  }

  if (points.length === 1) {
    return {
      ...points[0],
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }

  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latitudeDelta = Math.max((maxLat - minLat) * paddingFactor, 0.02);
  const longitudeDelta = Math.max((maxLng - minLng) * paddingFactor, 0.02);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta,
    longitudeDelta,
  };
}

export function formatDistanceKm(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}
