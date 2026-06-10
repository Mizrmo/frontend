import { extractCityLabel } from '../api/trip-types';
import { storage } from '../api/storage';

export interface FavouriteRoute {
  id: string;
  pickup: string;
  dropoff: string;
  originCity: string;
  destinationCity: string;
  label: string;
  createdAt: string;
}

function storageKey(userId: string): string {
  return `mizrmo_favourite_routes_${userId}`;
}

export async function getFavouriteRoutes(userId?: string | null): Promise<FavouriteRoute[]> {
  if (!userId) {
    return [];
  }

  const raw = await storage.getItem(storageKey(userId));

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as FavouriteRoute[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function isFavouriteRoute(
  userId: string | null | undefined,
  pickup: string,
  dropoff: string
): Promise<boolean> {
  const originCity = extractCityLabel(pickup);
  const destinationCity = extractCityLabel(dropoff);
  if (!originCity || !destinationCity || !userId) {
    return false;
  }
  const favourites = await getFavouriteRoutes(userId);
  return favourites.some(
    (route) =>
      route.originCity === originCity && route.destinationCity === destinationCity
  );
}

export async function toggleFavouriteRoute(
  userId: string | null | undefined,
  pickup: string,
  dropoff: string
): Promise<{ saved: boolean; favourites: FavouriteRoute[] }> {
  if (!userId) {
    throw new Error('Sign in to save favourite routes.');
  }

  const originCity = extractCityLabel(pickup);
  const destinationCity = extractCityLabel(dropoff);
  if (!originCity || !destinationCity) {
    throw new Error('Enter valid pickup and drop-off locations.');
  }

  const favourites = await getFavouriteRoutes(userId);
  const existingIndex = favourites.findIndex(
    (route) =>
      route.originCity === originCity && route.destinationCity === destinationCity
  );

  if (existingIndex >= 0) {
    favourites.splice(existingIndex, 1);
    await storage.setItem(storageKey(userId), JSON.stringify(favourites));
    return { saved: false, favourites };
  }

  const label = `${originCity} → ${destinationCity}`;
  favourites.unshift({
    id: `${Date.now()}-${originCity}-${destinationCity}`,
    pickup: pickup.trim(),
    dropoff: dropoff.trim(),
    originCity,
    destinationCity,
    label,
    createdAt: new Date().toISOString(),
  });

  await storage.setItem(storageKey(userId), JSON.stringify(favourites));
  return { saved: true, favourites };
}

export async function removeFavouriteRoute(
  userId: string | null | undefined,
  id: string
): Promise<FavouriteRoute[]> {
  if (!userId) {
    return [];
  }
  const favourites = (await getFavouriteRoutes(userId)).filter((route) => route.id !== id);
  await storage.setItem(storageKey(userId), JSON.stringify(favourites));
  return favourites;
}
