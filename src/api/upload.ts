import * as ImageManipulator from 'expo-image-manipulator';

export function toApiDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function parseDateParam(value?: string): Date | null {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

export function toApiDateTime(date: Date): string {
  return date.toISOString();
}

export function mapGender(value: string): 'MALE' | 'FEMALE' | 'OTHER' {
  const normalized = value.toUpperCase();
  if (normalized === 'MALE' || normalized === 'FEMALE' || normalized === 'OTHER') {
    return normalized;
  }
  if (normalized.startsWith('M')) {
    return 'MALE';
  }
  if (normalized.startsWith('F')) {
    return 'FEMALE';
  }
  return 'OTHER';
}

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  tema: { lat: 5.6698, lng: -0.0167 },
  accra: { lat: 5.6037, lng: -0.187 },
  ashaiman: { lat: 5.6948, lng: -0.0353 },
  kumasi: { lat: 6.6885, lng: -1.6244 },
  spintex: { lat: 5.634, lng: -0.12 },
};

export function getCityCoordinates(city: string): { lat: number; lng: number } {
  const key = city.trim().toLowerCase();
  if (CITY_COORDINATES[key]) {
    return CITY_COORDINATES[key];
  }

  const partial = Object.entries(CITY_COORDINATES).find(([name]) => key.includes(name));
  if (partial) {
    return partial[1];
  }

  return CITY_COORDINATES.accra;
}

export async function compressImageForUpload(
  uri: string,
  maxWidth = 1024
): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: maxWidth } }],
    { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}

export function appendImageToFormData(
  formData: FormData,
  fieldName: string,
  uri?: string | null
) {
  if (!uri) {
    return;
  }

  const filename = uri.split('/').pop() ?? `${fieldName}.jpg`;
  const extension = filename.split('.').pop()?.toLowerCase();
  const mimeType =
    extension === 'png' ? 'image/png' : extension === 'webp' ? 'image/webp' : 'image/jpeg';

  formData.append(fieldName, {
    uri,
    name: filename,
    type: mimeType,
  } as unknown as Blob);
}
