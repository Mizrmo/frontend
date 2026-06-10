import type { Coordinates } from './geocode';

export interface MapRegion extends Coordinates {
  latitudeDelta: number;
  longitudeDelta: number;
}

/** Pick a street/city zoom level based on trip length */
function getDeltaBounds(distanceKm: number | null): { min: number; max: number } {
  if (distanceKm == null || distanceKm <= 0) {
    return { min: 0.014, max: 0.09 };
  }
  if (distanceKm < 1.5) {
    return { min: 0.016, max: 0.035 };
  }
  if (distanceKm < 5) {
    return { min: 0.022, max: 0.055 };
  }
  if (distanceKm < 15) {
    return { min: 0.04, max: 0.085 };
  }
  if (distanceKm < 40) {
    return { min: 0.06, max: 0.11 };
  }
  return { min: 0.08, max: 0.16 };
}

export function getRouteMapRegion(
  points: Coordinates[],
  distanceKm: number | null = null
): MapRegion | null {
  if (points.length === 0) {
    return null;
  }

  const { min, max } = getDeltaBounds(distanceKm);

  if (points.length === 1) {
    return {
      ...points[0],
      latitudeDelta: min,
      longitudeDelta: min,
    };
  }

  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  let latSpan = (maxLat - minLat) * 1.45;
  let lngSpan = (maxLng - minLng) * 1.45;

  latSpan = Math.max(latSpan, min);
  lngSpan = Math.max(lngSpan, min);
  latSpan = Math.min(latSpan, max);
  lngSpan = Math.min(lngSpan, max);

  const span = Math.max(latSpan, lngSpan);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: span,
    longitudeDelta: span,
  };
}

export function sampleRoutePoints(points: Coordinates[], maxPoints = 24): Coordinates[] {
  if (points.length <= maxPoints) {
    return points;
  }

  const step = Math.ceil(points.length / maxPoints);
  const sampled: Coordinates[] = [];
  for (let i = 0; i < points.length; i += step) {
    sampled.push(points[i]);
  }
  const last = points[points.length - 1];
  if (sampled[sampled.length - 1] !== last) {
    sampled.push(last);
  }
  return sampled;
}
