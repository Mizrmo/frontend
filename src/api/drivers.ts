import apiClient from './client.native';
import { appendImageToFormData, compressImageForUpload } from './upload';

export interface ApplyForDriverDto {
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  emergencyContact: string;
  licenseNumber: string;
  licenseIssuedDate: string;
  licenseExpiryDate: string;
  ghanaCardNumber: string;
}

export interface AddVehicleDto {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
}

export interface DriverDocumentsUpload {
  licenseFront?: string | null;
  licenseBack?: string | null;
  ghanaCardFront?: string | null;
  ghanaCardBack?: string | null;
  selfie?: string | null;
  roadWorthiness?: string | null;
  insurance?: string | null;
}

export interface DriverEarningsSummary {
  totalEarnings?: number | string;
  currentBalance?: number | string;
  weeklyEarnings?: number | string;
  monthlyEarnings?: number | string;
  totalRides?: number;
  activeRides?: number;
}

export interface DriverEarningRecord {
  id?: string;
  amount?: number | string;
  title?: string;
  description?: string;
  createdAt?: string;
  type?: string;
}

export interface DriverEarningsResponse {
  data?: DriverEarningRecord[];
  summary?: DriverEarningsSummary;
  meta?: {
    totalCount?: number;
  };
}

export const applyForDriver = async (data: ApplyForDriverDto) => {
  const response = await apiClient.post('/drivers/apply', data);
  return response.data;
};

export const addDriverVehicle = async (data: AddVehicleDto) => {
  const response = await apiClient.post('/drivers/vehicle', data);
  return response.data;
};

export const uploadDriverDocuments = async (files: DriverDocumentsUpload) => {
  const formData = new FormData();
  const entries: Array<[string, string | null | undefined]> = [
    ['licenseFront', files.licenseFront],
    ['licenseBack', files.licenseBack],
    ['ghanaCardFront', files.ghanaCardFront],
    ['ghanaCardBack', files.ghanaCardBack],
    ['selfie', files.selfie],
    ['roadWorthiness', files.roadWorthiness],
    ['insurance', files.insurance],
  ];

  for (const [fieldName, uri] of entries) {
    if (!uri) {
      continue;
    }
    const compressedUri = await compressImageForUpload(uri);
    await appendImageToFormData(formData, fieldName, compressedUri);
  }

  const response = await apiClient.post('/drivers/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getDriverEarnings = async (params?: { page?: number; limit?: number }) => {
  const response = await apiClient.get<DriverEarningsResponse>('/drivers/earnings', { params });
  return response.data;
};

export const getDriverEarningsSummary = async () => {
  const response = await apiClient.get<DriverEarningsSummary>('/drivers/earnings/summary');
  return response.data;
};

export function getNumericAmount(value?: number | string): number {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    return parseFloat(value) || 0;
  }
  return 0;
}
