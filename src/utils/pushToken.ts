import { storage } from '../api/storage';

const PUSH_TOKEN_KEY = 'mizrmo_push_token';

export async function getStoredPushToken(): Promise<string | null> {
  return storage.getItem(PUSH_TOKEN_KEY);
}

export async function setStoredPushToken(token: string): Promise<void> {
  await storage.setItem(PUSH_TOKEN_KEY, token);
}

export async function clearStoredPushToken(): Promise<void> {
  await storage.removeItem(PUSH_TOKEN_KEY);
}
