import { io, type Socket } from 'socket.io-client';
import { env } from '../config/env';
import { getAccessToken } from '../api/tokens';

export interface DriverLocationPayload {
  tripId: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
}

export interface LocationUpdatedPayload {
  tripId?: string;
  latitude: number;
  longitude: number;
  eta?: number;
  etaMinutes?: number;
}

type TrackingEventHandlers = {
  onLocationUpdated?: (payload: LocationUpdatedPayload) => void;
  onTripStarted?: (payload: { tripId?: string }) => void;
  onTripCompleted?: (payload: { tripId?: string }) => void;
  onEtaUpdated?: (payload: { tripId?: string; eta?: number; etaMinutes?: number }) => void;
};

let socket: Socket | null = null;
let connectPromise: Promise<Socket> | null = null;

export async function connectTrackingSocket(): Promise<Socket> {
  if (socket?.connected) {
    return socket;
  }

  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = (async () => {
    const token = await getAccessToken();
    const instance = io(`${env.wsUrl}/tracking`, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
    });

    await new Promise<void>((resolve, reject) => {
      const onConnect = () => {
        cleanup();
        resolve();
      };
      const onError = (err: Error) => {
        cleanup();
        reject(err);
      };
      const cleanup = () => {
        instance.off('connect', onConnect);
        instance.off('connect_error', onError);
      };
      instance.on('connect', onConnect);
      instance.on('connect_error', onError);
      if (!instance.connected) {
        instance.connect();
      } else {
        resolve();
      }
    });

    socket = instance;
    connectPromise = null;
    return instance;
  })();

  return connectPromise;
}

export function disconnectTrackingSocket() {
  socket?.removeAllListeners();
  socket?.disconnect();
  socket = null;
  connectPromise = null;
}

export function subscribeToTripTracking(tripId: string, handlers: TrackingEventHandlers) {
  const filterByTrip = <T extends { tripId?: string }>(payload: T) =>
    !payload.tripId || payload.tripId === tripId;

  const onLocation = (payload: LocationUpdatedPayload) => {
    if (filterByTrip(payload)) {
      handlers.onLocationUpdated?.(payload);
    }
  };
  const onStarted = (payload: { tripId?: string }) => {
    if (filterByTrip(payload)) {
      handlers.onTripStarted?.(payload);
    }
  };
  const onCompleted = (payload: { tripId?: string }) => {
    if (filterByTrip(payload)) {
      handlers.onTripCompleted?.(payload);
    }
  };
  const onEta = (payload: { tripId?: string; eta?: number; etaMinutes?: number }) => {
    if (filterByTrip(payload)) {
      handlers.onEtaUpdated?.(payload);
    }
  };

  socket?.on('location:updated', onLocation);
  socket?.on('trip:started', onStarted);
  socket?.on('trip:completed', onCompleted);
  socket?.on('eta:updated', onEta);

  return () => {
    socket?.off('location:updated', onLocation);
    socket?.off('trip:started', onStarted);
    socket?.off('trip:completed', onCompleted);
    socket?.off('eta:updated', onEta);
  };
}

export function emitDriverLocationUpdate(payload: DriverLocationPayload) {
  socket?.emit('driver:location:update', payload);
}

export function emitDriverTripStart(tripId: string) {
  socket?.emit('driver:trip:start', { tripId });
}

export function emitDriverTripComplete(tripId: string) {
  socket?.emit('driver:trip:complete', { tripId });
}
