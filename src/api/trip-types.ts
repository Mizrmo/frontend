export interface PaginationMeta {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  suggestions?: unknown[];
}

export interface TripDriver {
  id?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  rating?: number;
}

export interface TripVehicle {
  make?: string;
  model?: string;
  color?: string;
  registrationNumber?: string;
  capacity?: number;
}

export interface Trip {
  id: string;
  originCity: string;
  destinationCity: string;
  originAddress?: string;
  destinationAddress?: string;
  originLatitude?: number;
  originLongitude?: number;
  destinationLatitude?: number;
  destinationLongitude?: number;
  departureDate: string;
  estimatedArrivalTime?: string;
  pricePerSeat?: number | string;
  farePerSeat?: number | string;
  estimatedFare?: number | string;
  availableSeats?: number;
  totalSeats?: number;
  seatsAvailable?: number;
  driver?: TripDriver;
  driverProfile?: { user?: TripDriver; rating?: number };
  driverUser?: TripDriver;
  vehicle?: TripVehicle;
  status?: string;
  distanceKm?: number | string;
}

export interface FarePreview {
  estimatedFare?: number | string;
  farePerSeat?: number | string;
  totalFare?: number | string;
  distanceKm?: number | string;
  currency?: string;
}

export interface SearchTripsParams {
  originCity: string;
  destinationCity: string;
  departureDate: string;
  seats?: number;
  page?: number;
  limit?: number;
  sortBy?: 'DEPARTURE_TIME' | 'PRICE_ASC' | 'PRICE_DESC';
}

export interface FarePreviewParams {
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  seats: number;
}

export type BookingStatus =
  | 'PENDING'
  | 'AWAITING_PAYMENT'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'DECLINED';

export interface Booking {
  id: string;
  tripId: string;
  status: BookingStatus;
  seatsBooked?: number;
  totalAmount?: number | string;
  fareAmount?: number | string;
  pickupNote?: string;
  paymentMethod?: string;
  createdAt?: string;
  trip?: Trip;
  driver?: TripDriver;
}

export interface CreateBookingDto {
  tripId: string;
  seatsBooked: number;
  pickupNote?: string;
  paymentMethod: 'MOBILE_MONEY';
}

export interface CancelBookingDto {
  reason?: string;
}

export interface UserRating {
  averageRating?: number;
  totalReviews?: number;
  rating?: number;
}

export interface PendingReview {
  id?: string;
  bookingId: string;
  tripId?: string;
  driverName?: string;
  driver?: TripDriver;
  trip?: Trip;
}

export interface SubmitReviewDto {
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface MyBookingsParams {
  status?: BookingStatus;
  page?: number;
  limit?: number;
}

export function getTripDriverName(trip?: Trip | null): string {
  const driver = trip?.driver ?? trip?.driverProfile?.user ?? trip?.driverUser;
  if (!driver) {
    return 'Driver';
  }
  const name = [driver.firstName, driver.lastName].filter(Boolean).join(' ');
  return name || 'Driver';
}

export function getTripDriverId(trip?: Trip | null): string | undefined {
  const driver = trip?.driver ?? trip?.driverProfile?.user ?? trip?.driverUser;
  return driver?.id;
}

export function getTripDriverRating(trip?: Trip | null): number | undefined {
  return trip?.driver?.rating ?? trip?.driverProfile?.rating;
}

export function getTripVehicleLabel(trip?: Trip | null): string {
  const vehicle = trip?.vehicle;
  if (!vehicle) {
    return 'Vehicle';
  }
  const label = [vehicle.make, vehicle.model].filter(Boolean).join(' ');
  return label || 'Vehicle';
}

export function getTripPrice(trip?: Trip | null): number {
  if (!trip) {
    return 0;
  }
  const raw = trip.pricePerSeat ?? trip.farePerSeat ?? trip.estimatedFare ?? 0;
  return typeof raw === 'string' ? parseFloat(raw) || 0 : raw;
}

export function getTripSeatsAvailable(trip?: Trip | null): number {
  if (!trip) {
    return 0;
  }
  return trip.availableSeats ?? trip.seatsAvailable ?? trip.totalSeats ?? 0;
}

export function formatCurrency(amount: number | string | undefined): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount ?? 0;
  return `GH¢${(Number.isFinite(value) ? value : 0).toFixed(2)}`;
}

export function formatDepartureDate(isoDate?: string): string {
  if (!isoDate) {
    return '--';
  }
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function toApiDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function extractCityLabel(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }
  return trimmed.split(',')[0]?.trim() || trimmed;
}
