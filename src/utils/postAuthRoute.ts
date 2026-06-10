import type { User } from '../api/types';
import { resolveActiveRoleForUser } from './roleSwitch';

export type PostAuthRoute =
  | '/(rider)/home'
  | '/(driver)/home'
  | '/(auth)/vehicle-details';

export async function resolvePostAuthRoute(
  user?: Pick<User, 'role'> | null
): Promise<PostAuthRoute> {
  const activeRole = await resolveActiveRoleForUser(user ?? null);

  if (activeRole === 'DRIVER' || user?.role === 'DRIVER') {
    return '/(driver)/home';
  }

  return '/(rider)/home';
}
