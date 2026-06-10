import { storage } from './storage';
import type { AuthTokens, User, UserRole } from './types';

const KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  userRole: 'userRole',
  activeRole: 'activeRole',
  pendingDriverOnboarding: 'pendingDriverOnboarding',
  legacyToken: 'token',
} as const;

export async function getAccessToken(): Promise<string | null> {
  const accessToken = await storage.getItem(KEYS.accessToken);
  if (accessToken) {
    return accessToken;
  }

  return storage.getItem(KEYS.legacyToken);
}

export async function getRefreshToken(): Promise<string | null> {
  return storage.getItem(KEYS.refreshToken);
}

export async function getStoredUserRole(): Promise<UserRole | null> {
  const role = await storage.getItem(KEYS.userRole);
  if (role === 'RIDER' || role === 'DRIVER' || role === 'ADMIN') {
    return role;
  }
  return null;
}

export async function getActiveRole(): Promise<UserRole | null> {
  const role = await storage.getItem(KEYS.activeRole);
  if (role === 'RIDER' || role === 'DRIVER') {
    return role;
  }
  return null;
}

export async function setActiveRole(role: UserRole): Promise<void> {
  if (role === 'RIDER' || role === 'DRIVER') {
    await storage.setItem(KEYS.activeRole, role);
  }
}

export async function clearActiveRole(): Promise<void> {
  await storage.removeItem(KEYS.activeRole);
}

export async function getPendingDriverOnboarding(): Promise<boolean> {
  return (await storage.getItem(KEYS.pendingDriverOnboarding)) === '1';
}

export async function setPendingDriverOnboarding(pending: boolean): Promise<void> {
  if (pending) {
    await storage.setItem(KEYS.pendingDriverOnboarding, '1');
    return;
  }
  await storage.removeItem(KEYS.pendingDriverOnboarding);
}

export async function clearPendingDriverOnboarding(): Promise<void> {
  await storage.removeItem(KEYS.pendingDriverOnboarding);
}

export async function saveAuthSession(
  tokens: AuthTokens,
  user?: Pick<User, 'role'>
): Promise<void> {
  await storage.setItem(KEYS.accessToken, tokens.accessToken);
  await storage.setItem(KEYS.refreshToken, tokens.refreshToken);

  if (user?.role) {
    await storage.setItem(KEYS.userRole, user.role);
  }

  await storage.removeItem(KEYS.legacyToken);
}

export async function clearAuthSession(): Promise<void> {
  await Promise.all([
    storage.removeItem(KEYS.accessToken),
    storage.removeItem(KEYS.refreshToken),
    storage.removeItem(KEYS.userRole),
    storage.removeItem(KEYS.activeRole),
    storage.removeItem(KEYS.legacyToken),
  ]);
}

export async function clearAllAuthStorage(): Promise<void> {
  await Promise.all([clearAuthSession(), clearPendingDriverOnboarding()]);
}

export async function hasAuthSession(): Promise<boolean> {
  const accessToken = await getAccessToken();
  return Boolean(accessToken);
}
