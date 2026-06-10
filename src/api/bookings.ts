import apiClient from './client.native';
import type {
  Booking,
  CancelBookingDto,
  CreateBookingDto,
  MyBookingsParams,
  PaginatedResponse,
} from './trip-types';

export interface DriverBookingRequest extends Booking {
  rider?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  };
}

export function getRiderName(booking?: DriverBookingRequest | null): string {
  const rider = booking?.rider;
  if (!rider) {
    return 'Rider';
  }
  const name = [rider.firstName, rider.lastName].filter(Boolean).join(' ');
  return name || 'Rider';
}

export type {
  Booking,
  BookingStatus,
  CreateBookingDto,
  MyBookingsParams,
} from './trip-types';

export { formatCurrency, formatDepartureDate } from './trip-types';

export const createBooking = async (data: CreateBookingDto) => {
  const response = await apiClient.post<Booking>('/bookings', data);
  return response.data;
};

export const getMyBookings = async (params?: MyBookingsParams) => {
  const response = await apiClient.get<PaginatedResponse<Booking>>('/bookings/my-bookings', {
    params,
  });
  return response.data;
};

export const getBookingById = async (bookingId: string) => {
  const response = await apiClient.get<Booking>(`/bookings/${bookingId}`);
  return response.data;
};

export const cancelBooking = async (bookingId: string, data?: CancelBookingDto) => {
  const response = await apiClient.post<Booking>(`/bookings/${bookingId}/cancel`, data ?? {});
  return response.data;
};

export const getDriverBookingRequests = async () => {
  const response = await apiClient.get<DriverBookingRequest[] | { data: DriverBookingRequest[] }>(
    '/bookings/driver/requests'
  );
  const payload = response.data;
  return Array.isArray(payload) ? payload : payload.data ?? [];
};

export const getDriverBookingHistory = async (params?: { page?: number; limit?: number }) => {
  const response = await apiClient.get<PaginatedResponse<Booking>>('/bookings/driver/history', {
    params,
  });
  return response.data;
};

export const acceptBooking = async (bookingId: string) => {
  const response = await apiClient.post<Booking>(`/bookings/${bookingId}/accept`);
  return response.data;
};

export const declineBooking = async (bookingId: string, reason?: string) => {
  const response = await apiClient.post<Booking>(`/bookings/${bookingId}/decline`, {
    reason: reason ?? 'Declined by driver',
  });
  return response.data;
};

export function getBookingAmount(booking?: Booking | null): number {
  if (!booking) {
    return 0;
  }
  const raw = booking.totalAmount ?? booking.fareAmount ?? getTripPriceFromBooking(booking);
  return typeof raw === 'string' ? parseFloat(raw) || 0 : raw ?? 0;
}

function getTripPriceFromBooking(booking: Booking): number {
  const trip = booking.trip;
  if (!trip) {
    return 0;
  }
  const seats = booking.seatsBooked ?? 1;
  const perSeat = trip.pricePerSeat ?? trip.farePerSeat ?? trip.estimatedFare ?? 0;
  const seatPrice = typeof perSeat === 'string' ? parseFloat(perSeat) || 0 : perSeat;
  return seatPrice * seats;
}

export function getBookingDriverName(booking?: Booking | null): string {
  if (!booking) {
    return 'Driver';
  }
  const driver = booking.driver ?? booking.trip?.driver ?? booking.trip?.driverProfile?.user;
  if (!driver) {
    return 'Driver';
  }
  const name = [driver.firstName, driver.lastName].filter(Boolean).join(' ');
  return name || 'Driver';
}
