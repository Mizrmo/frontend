import { storage } from '../api/storage';

export interface LastSearchRoute {
  originCity: string;
  destinationCity: string;
  pickup?: string;
  dropoff?: string;
}

function storageKey(userId: string): string {
  return `mizrmo_last_search_${userId}`;
}

export async function getLastSearchRoute(userId?: string | null): Promise<LastSearchRoute | null> {
  if (!userId) {
    return null;
  }

  const raw = await storage.getItem(storageKey(userId));
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as LastSearchRoute;
    if (parsed?.originCity && parsed?.destinationCity) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export async function saveLastSearchRoute(
  userId: string | null | undefined,
  route: LastSearchRoute
): Promise<void> {
  if (!userId) {
    return;
  }
  await storage.setItem(storageKey(userId), JSON.stringify(route));
}

export const DEFAULT_SEARCH_ROUTE: LastSearchRoute = {
  originCity: 'Tema',
  destinationCity: 'Accra',
};
