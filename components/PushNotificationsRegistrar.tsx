import { useAuth } from '../src/context/AuthContext';
import { usePushNotifications } from '../src/hooks/usePushNotifications';

export function PushNotificationsRegistrar() {
  const { isAuthenticated, isLoading } = useAuth();
  usePushNotifications(isAuthenticated && !isLoading);
  return null;
}
