import type { Coordinates } from './geocode';

export interface DrivingRoute {
  coordinates: Coordinates[];
  distanceKm: number;
  durationMinutes: number;
}

export async function fetchDrivingRoute(
  from: Coordinates,
  to: Coordinates
): Promise<DrivingRoute | null> {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${from.longitude},${from.latitude};${to.longitude},${to.latitude}` +
    '?overview=full&geometries=geojson';

  try {
    const response = await fetch(url);
    const json = await response.json();
    const route = json?.routes?.[0];
    if (json?.code !== 'Ok' || !route?.geometry?.coordinates) {
      return null;
    }

    const coordinates = route.geometry.coordinates.map(([lng, lat]: [number, number]) => ({
      latitude: lat,
      longitude: lng,
    }));

    return {
      coordinates,
      distanceKm: route.distance / 1000,
      durationMinutes: route.duration / 60,
    };
  } catch {
    return null;
  }
}
