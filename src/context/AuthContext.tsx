import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getMe } from '../api/auth';
import { getApiErrorMessage } from '../api/errors';
import {
  clearActiveRole,
  clearAllAuthStorage,
  clearAuthSession,
  clearPendingDriverOnboarding,
  getAccessToken,
  getActiveRole,
  getRefreshToken,
  getStoredUserRole,
  hasAuthSession,
  saveAuthSession,
  setActiveRole as persistActiveRole,
  setPendingDriverOnboarding,
} from '../api/tokens';
import type { AuthTokens, User, UserRole } from '../api/types';
import { resolveActiveRoleForUser, validateRoleSwitch } from '../utils/roleSwitch';
import { cleanupPushTokenOnSignOut } from '../utils/signOutCleanup';

interface AuthContextValue {
  user: User | null;
  activeRole: UserRole;
  isLoading: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  signIn: (
    tokens: AuthTokens,
    user?: User,
    options?: { activeRole?: 'RIDER' | 'DRIVER'; pendingDriverOnboarding?: boolean }
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  switchRole: (target: 'RIDER' | 'DRIVER') => Promise<{ ok: boolean; message?: string; actionRoute?: string }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getHomeRoute(role: UserRole): '/(rider)/home' | '/(driver)/home' {
  return role === 'DRIVER' ? '/(driver)/home' : '/(rider)/home';
}

export function getHomeRouteForRole(role: UserRole): '/(rider)/home' | '/(driver)/home' {
  return getHomeRoute(role);
}

export function getHomeRouteForUser(
  user?: Pick<User, 'role'> | null,
  activeRole?: UserRole | null
): '/(rider)/home' | '/(driver)/home' {
  const role = activeRole ?? (user?.role === 'DRIVER' ? 'DRIVER' : 'RIDER');
  return getHomeRoute(role);
}

async function resolveActiveRole(user: User | null): Promise<UserRole> {
  return resolveActiveRoleForUser(user);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRoleState] = useState<UserRole>('RIDER');
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const syncActiveRole = useCallback(async (profile: User | null) => {
    const role = await resolveActiveRole(profile);
    setActiveRoleState(role);
    return role;
  }, []);

  const refreshUser = useCallback(async () => {
    const sessionExists = await hasAuthSession();
    if (!sessionExists) {
      setUser(null);
      return null;
    }

    try {
      const profile = await getMe();
      setUser(profile);

      const accessToken = await getAccessToken();
      const refreshTokenValue = await getRefreshToken();
      if (accessToken && refreshTokenValue) {
        await saveAuthSession(
          { accessToken, refreshToken: refreshTokenValue },
          profile
        );
      }

      await syncActiveRole(profile);
      setAuthError(null);
      return profile;
    } catch (error) {
      setAuthError(getApiErrorMessage(error));
      setUser(null);
      return null;
    }
  }, [syncActiveRole]);

  const bootstrapAuth = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const sessionExists = await hasAuthSession();
      if (!sessionExists) {
        setUser(null);
        setActiveRoleState('RIDER');
        return;
      }

      const profile = await getMe();
      setUser(profile);
      await syncActiveRole(profile);
    } catch {
      await clearAuthSession();
      setUser(null);
      setActiveRoleState('RIDER');
    } finally {
      setIsLoading(false);
    }
  }, [syncActiveRole]);

  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  const signIn = useCallback(
    async (
      tokens: AuthTokens,
      nextUser?: User,
      options?: { activeRole?: 'RIDER' | 'DRIVER'; pendingDriverOnboarding?: boolean }
    ) => {
      if (options?.pendingDriverOnboarding === true) {
        await setPendingDriverOnboarding(true);
      } else if (options?.pendingDriverOnboarding === false) {
        await clearPendingDriverOnboarding();
      }

      if (options?.activeRole) {
        await persistActiveRole(options.activeRole);
        setActiveRoleState(options.activeRole);
      }

      await saveAuthSession(tokens, nextUser);
      if (nextUser) {
        setUser(nextUser);
        if (!options?.activeRole) {
          await syncActiveRole(nextUser);
        }
        setAuthError(null);
        return;
      }
      await bootstrapAuth();
    },
    [bootstrapAuth, syncActiveRole]
  );

  const signOut = useCallback(async () => {
    await cleanupPushTokenOnSignOut();
    await clearAllAuthStorage();
    await clearActiveRole();
    setUser(null);
    setActiveRoleState('RIDER');
    setAuthError(null);
  }, []);

  const switchRole = useCallback(
    async (target: 'RIDER' | 'DRIVER') => {
      const profile = user ?? (await refreshUser());
      const validation = await validateRoleSwitch(target, profile);

      if (validation.ok === false) {
        return {
          ok: false as const,
          message: validation.message,
          actionRoute: validation.actionRoute,
        };
      }

      await persistActiveRole(validation.role);
      setActiveRoleState(validation.role);
      return { ok: true as const };
    },
    [user, refreshUser]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      activeRole,
      isLoading,
      isAuthenticated: Boolean(user),
      authError,
      signIn,
      signOut,
      refreshUser,
      switchRole,
    }),
    [user, activeRole, isLoading, authError, signIn, signOut, refreshUser, switchRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export async function resolveInitialRoute(): Promise<'/(auth)/signin' | '/(rider)/home' | '/(driver)/home' | null> {
  const sessionExists = await hasAuthSession();
  if (!sessionExists) {
    return null;
  }

  try {
    const profile = await getMe();
    const role = await resolveActiveRole(profile);
    return getHomeRouteForRole(role);
  } catch {
    const role = (await getActiveRole()) ?? (await getStoredUserRole());
    if (role === 'RIDER' || role === 'DRIVER') {
      return getHomeRouteForRole(role);
    }
    await clearAuthSession();
    return null;
  }
}
