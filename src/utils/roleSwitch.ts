import { getMyVehicles } from '../api/vehicles';
import { getActiveRole, getPendingDriverOnboarding } from '../api/tokens';
import type { User, UserRole } from '../api/types';

export type SwitchRoleResult =
  | { ok: true; role: UserRole }
  | { ok: false; message: string; actionRoute?: string };

export async function validateDriverAccess(user: User | null): Promise<SwitchRoleResult> {
  if (user?.role === 'DRIVER') {
    return { ok: true, role: 'DRIVER' };
  }

  try {
    const vehicles = await getMyVehicles();
    if (vehicles.length > 0) {
      return { ok: true, role: 'DRIVER' };
    }
  } catch {
    // Fall through to onboarding message.
  }

  return {
    ok: false,
    message: 'Complete driver onboarding and add a vehicle before switching to driver mode.',
    actionRoute: '/(auth)/vehicle-details',
  };
}

export async function resolveActiveRoleForUser(user: Pick<User, 'role'> | null): Promise<UserRole> {
  const stored = await getActiveRole();
  if (stored === 'RIDER' || stored === 'DRIVER') {
    return stored;
  }
  if (await getPendingDriverOnboarding()) {
    return 'DRIVER';
  }
  return user?.role === 'DRIVER' ? 'DRIVER' : 'RIDER';
}

export async function validateRoleSwitch(
  target: UserRole,
  user: User | null
): Promise<SwitchRoleResult> {
  if (target === 'RIDER') {
    return { ok: true, role: 'RIDER' };
  }

  if (target === 'DRIVER') {
    return validateDriverAccess(user);
  }

  return { ok: false, message: 'Unsupported role.' };
}
