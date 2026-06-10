import { storage } from '../api/storage';

function storageKey(userId: string): string {
  return `mizrmo_profile_photo_${userId}`;
}

export async function saveLocalProfilePhoto(userId: string, uri: string): Promise<void> {
  await storage.setItem(storageKey(userId), uri);
}

export async function getLocalProfilePhoto(userId: string): Promise<string | null> {
  return storage.getItem(storageKey(userId));
}

export async function clearLocalProfilePhoto(userId: string): Promise<void> {
  await storage.removeItem(storageKey(userId));
}

export function getRemoteProfilePhotoUrl(user?: {
  avatarUrl?: string;
  profilePhotoUrl?: string;
} | null): string | null {
  return user?.avatarUrl ?? user?.profilePhotoUrl ?? null;
}

export async function resolveProfilePhotoUri(
  userId: string,
  remoteUrl?: string | null
): Promise<string | null> {
  const local = await getLocalProfilePhoto(userId);
  if (local) {
    return local;
  }
  return remoteUrl ?? null;
}
