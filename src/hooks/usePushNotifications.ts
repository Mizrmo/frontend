import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { registerDeviceToken, type DevicePlatform } from '../api/notifications';
import { setStoredPushToken } from '../utils/pushToken';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function getDevicePlatform(): DevicePlatform {
  if (Platform.OS === 'ios') {
    return 'IOS';
  }
  if (Platform.OS === 'android') {
    return 'ANDROID';
  }
  return 'WEB';
}

export async function registerPushTokenIfPossible(): Promise<void> {
  if (!Device.isDevice) {
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;

  const tokenResponse = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined
  );

  const token = tokenResponse.data;
  await registerDeviceToken({
    token,
    platform: getDevicePlatform(),
  });
  await setStoredPushToken(token);
}

export function usePushNotifications(enabled: boolean) {
  const registeredRef = useRef(false);

  useEffect(() => {
    if (!enabled || registeredRef.current) {
      return;
    }

    registerPushTokenIfPossible()
      .then(() => {
        registeredRef.current = true;
      })
      .catch(() => {
        registeredRef.current = false;
      });
  }, [enabled]);
}
