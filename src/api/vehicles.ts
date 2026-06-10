import apiClient from './client.native';

export interface Vehicle {
  id: string;
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  licensePlate?: string;
  capacity?: number;
  status?: string;
}

export interface RegisterVehicleDto {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  capacity: number;
  roadworthinessExpiry: string;
  insuranceExpiry: string;
}

export const getMyVehicles = async () => {
  const response = await apiClient.get<Vehicle[] | { data: Vehicle[] }>('/vehicles/my-vehicles');
  const payload = response.data;
  return Array.isArray(payload) ? payload : payload.data ?? [];
};

export const registerVehicle = async (data: RegisterVehicleDto) => {
  const response = await apiClient.post<Vehicle>('/vehicles', data);
  return response.data;
};

export const getVehicleById = async (vehicleId: string) => {
  const response = await apiClient.get<Vehicle>(`/vehicles/${vehicleId}`);
  return response.data;
};

export function getVehicleLabel(vehicle?: Vehicle | null): string {
  if (!vehicle) {
    return 'Vehicle';
  }
  const label = [vehicle.make, vehicle.model].filter(Boolean).join(' ');
  return label || vehicle.licensePlate || 'Vehicle';
}
