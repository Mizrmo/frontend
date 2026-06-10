import { deregisterDeviceToken } from '../api/notifications';
import { clearStoredPushToken, getStoredPushToken } from './pushToken';

export async function cleanupPushTokenOnSignOut(): Promise<void> {
  const token = await getStoredPushToken();
  if (!token) {
    return;
  }
  try {
    await deregisterDeviceToken(token);
  } catch {
    // Best-effort; session is cleared regardless.
  } finally {
    await clearStoredPushToken();
  }
}
