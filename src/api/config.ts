import apiClient from './client.native';

export type PublicConfigMap = Record<string, string | number | boolean>;

export const getPublicConfig = async () => {
  const response = await apiClient.get<PublicConfigMap | { data: PublicConfigMap }>(
    '/config/public'
  );
  const payload = response.data;
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: PublicConfigMap }).data;
  }
  return (payload as PublicConfigMap) ?? {};
};

export function getConfigString(
  config: PublicConfigMap,
  keys: string[],
  fallback: string
): string {
  for (const key of keys) {
    const value = config[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  return fallback;
}
