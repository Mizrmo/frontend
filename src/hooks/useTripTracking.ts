import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import {
  connectTrackingSocket,
  disconnectTrackingSocket,
  emitDriverLocationUpdate,
  subscribeToTripTracking,
  type LocationUpdatedPayload,
} from '../services/tracking';

export interface TrackingCoordinate {
  latitude: number;
  longitude: number;
}

interface UseRiderTripTrackingOptions {
  tripId?: string;
  enabled?: boolean;
}

export function useRiderTripTracking({ tripId, enabled = true }: UseRiderTripTrackingOptions) {
  const [driverLocation, setDriverLocation] = useState<TrackingCoordinate | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled || !tripId) {
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    const setup = async () => {
      try {
        const sock = await connectTrackingSocket();
        if (cancelled) {
          return;
        }
        setIsConnected(sock.connected);
        unsubscribe = subscribeToTripTracking(tripId, {
          onLocationUpdated: (payload: LocationUpdatedPayload) => {
            setDriverLocation({ latitude: payload.latitude, longitude: payload.longitude });
            const eta = payload.etaMinutes ?? payload.eta;
            if (typeof eta === 'number') {
              setEtaMinutes(eta);
            }
          },
          onEtaUpdated: (payload) => {
            const eta = payload.etaMinutes ?? payload.eta;
            if (typeof eta === 'number') {
              setEtaMinutes(eta);
            }
          },
        });
      } catch {
        setIsConnected(false);
      }
    };

    setup();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [tripId, enabled]);

  return { driverLocation, etaMinutes, isConnected };
}

interface UseDriverLocationPublisherOptions {
  tripId?: string;
  enabled?: boolean;
  intervalMs?: number;
}

export function useDriverLocationPublisher({
  tripId,
  enabled = true,
  intervalMs = 8000,
}: UseDriverLocationPublisherOptions) {
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  const publishCurrentLocation = useCallback(async () => {
    if (!tripId) {
      return;
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    emitDriverLocationUpdate({
      tripId,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      heading: position.coords.heading ?? undefined,
      speed: position.coords.speed ?? undefined,
    });
  }, [tripId]);

  useEffect(() => {
    if (!enabled || !tripId) {
      return;
    }

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const start = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted' || cancelled) {
        return;
      }

      await connectTrackingSocket();
      await publishCurrentLocation();

      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 25,
          timeInterval: intervalMs,
        },
        (position) => {
          emitDriverLocationUpdate({
            tripId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            heading: position.coords.heading ?? undefined,
            speed: position.coords.speed ?? undefined,
          });
        }
      );

      intervalId = setInterval(publishCurrentLocation, intervalMs);
    };

    start();

    return () => {
      cancelled = true;
      watchRef.current?.remove();
      watchRef.current = null;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [tripId, enabled, intervalMs, publishCurrentLocation]);

  useEffect(() => {
    return () => {
      if (!tripId) {
        disconnectTrackingSocket();
      }
    };
  }, [tripId]);
}
