import apiClient from './client.native';
import type {
  FarePreview,
  FarePreviewParams,
  PaginatedResponse,
  SearchTripsParams,
  Trip,
} from './trip-types';

export interface CreateTripDto {
  vehicleId: string;
  originCity: string;
  originAddress: string;
  originLatitude: number;
  originLongitude: number;
  destinationCity: string;
  destinationAddress: string;
  destinationLatitude: number;
  destinationLongitude: number;
  departureDate: string;
  estimatedArrivalTime?: string;
  totalSeats: number;
  notes?: string;
}

export interface TripStats {
  totalTrips?: number;
  completedTrips?: number;
  upcomingTrips?: number;
  totalEarnings?: number | string;
}

export type {
  FarePreview,
  SearchTripsParams,
  Trip,
} from './trip-types';

export {
  formatCurrency,
  formatDepartureDate,
  getTripDriverId,
  getTripDriverName,
  getTripDriverRating,
  getTripPrice,
  getTripSeatsAvailable,
  getTripVehicleLabel,
} from './trip-types';

export const searchTrips = async (params: SearchTripsParams) => {
  const response = await apiClient.get<PaginatedResponse<Trip>>('/trips/search', { params });
  return response.data;
};

export const getFarePreview = async (params: FarePreviewParams) => {
  const response = await apiClient.get<FarePreview>('/trips/fare-preview', { params });
  return response.data;
};

export const getTripById = async (tripId: string) => {
  const response = await apiClient.get<Trip>(`/trips/${tripId}`);
  return response.data;
};

export const createTrip = async (data: CreateTripDto) => {
  const response = await apiClient.post<Trip>('/trips', data);
  return response.data;
};

export const getMyTrips = async (params?: { page?: number; limit?: number }) => {
  const response = await apiClient.get<PaginatedResponse<Trip>>('/trips/my-trips', { params });
  return response.data;
};

export const getMyUpcomingTrips = async (params?: { page?: number; limit?: number }) => {
  const response = await apiClient.get<PaginatedResponse<Trip>>('/trips/my-trips/upcoming', {
    params,
  });
  return response.data;
};

export const getMyTripStats = async () => {
  const response = await apiClient.get<TripStats>('/trips/my-trips/stats');
  return response.data;
};

export const getTripBookings = async (tripId: string) => {
  const response = await apiClient.get(`/trips/${tripId}/bookings`);
  return response.data;
};

export const startTrip = async (tripId: string) => {
  const response = await apiClient.post<Trip>(`/trips/${tripId}/start`);
  return response.data;
};

export const completeTrip = async (tripId: string) => {
  const response = await apiClient.post<Trip>(`/trips/${tripId}/complete`);
  return response.data;
};
