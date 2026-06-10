import { useCallback, useEffect, useState } from 'react';
import {
  getCurrentDeviceLocation,
  hasLocationPermission,
  resolveDeviceLocation,
  type StoredLocation,
} from '../utils/userLocation';

export function useDeviceLocation() {
  const [location, setLocation] = useState<StoredLocation | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const granted = await hasLocationPermission();
      setHasPermission(granted);
      const resolved = granted ? await getCurrentDeviceLocation().catch(() => resolveDeviceLocation()) : await resolveDeviceLocation();
      setLocation(resolved);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { location, hasPermission, isLoading, refresh };
}
