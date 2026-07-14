import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// expo-secure-store has no web implementation; fall back to localStorage there.
export const storage = Platform.OS === 'web'
  ? {
      setItem: async (key: string, value: string) => {
        window.localStorage.setItem(key, value);
      },
      getItem: async (key: string) => {
        return window.localStorage.getItem(key);
      },
      removeItem: async (key: string) => {
        window.localStorage.removeItem(key);
      }
    }
  : {
      setItem: async (key: string, value: string) => {
        await SecureStore.setItemAsync(key, value);
      },
      getItem: async (key: string) => {
        return await SecureStore.getItemAsync(key);
      },
      removeItem: async (key: string) => {
        await SecureStore.deleteItemAsync(key);
      }
    };
