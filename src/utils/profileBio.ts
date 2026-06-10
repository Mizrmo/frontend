import { storage } from '../api/storage';

function storageKey(userId: string): string {
  return `mizrmo_profile_bio_${userId}`;
}

export async function saveLocalProfileBio(userId: string, bio: string): Promise<void> {
  await storage.setItem(storageKey(userId), bio);
}

export async function getLocalProfileBio(userId: string): Promise<string> {
  return (await storage.getItem(storageKey(userId))) ?? '';
}

export async function clearLocalProfileBio(userId: string): Promise<void> {
  await storage.removeItem(storageKey(userId));
}

export function getRemoteProfileBio(user?: { bio?: string } | null): string {
  return user?.bio?.trim() ?? '';
}

export async function resolveProfileBio(userId: string, remoteBio?: string | null): Promise<string> {
  const fromApi = remoteBio?.trim() ?? '';
  if (fromApi) {
    return fromApi;
  }
  return getLocalProfileBio(userId);
}
