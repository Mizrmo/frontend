import apiClient from './client.native';

export interface InitiatePaymentDto {
  bookingId: string;
}

export interface VerifyPaymentDto {
  reference: string;
}

export interface PaymentInitResponse {
  accessCode?: string;
  authorizationUrl?: string;
  authorization_url?: string;
  reference?: string;
  amount?: number | string;
  currency?: string;
  status?: string;
}

export interface PaymentVerifyResponse {
  status?: string;
  message?: string;
  reference?: string;
  bookingId?: string;
}

export interface BookingPaymentDetails {
  bookingId?: string;
  reference?: string;
  status?: string;
  amount?: number | string;
  currency?: string;
  paidAt?: string;
}

export interface PaystackBank {
  name?: string;
  code?: string;
  slug?: string;
}

export const initiatePayment = async (data: InitiatePaymentDto) => {
  const response = await apiClient.post<PaymentInitResponse>('/payments/initiate', data);
  return response.data;
};

export const verifyPayment = async (data: VerifyPaymentDto) => {
  const response = await apiClient.post<PaymentVerifyResponse>('/payments/verify', data);
  return response.data;
};

export const getBookingPayment = async (bookingId: string) => {
  const response = await apiClient.get<BookingPaymentDetails>(`/payments/booking/${bookingId}`);
  return response.data;
};

export const getPaystackBanks = async () => {
  const response = await apiClient.get<PaystackBank[] | { data: PaystackBank[] }>('/payments/banks');
  const payload = response.data;
  return Array.isArray(payload) ? payload : payload.data ?? [];
};

export function getPaystackCheckoutUrl(init: PaymentInitResponse): string | null {
  if (init.authorizationUrl) {
    return init.authorizationUrl;
  }
  if (init.authorization_url) {
    return init.authorization_url;
  }
  if (init.accessCode) {
    return `https://checkout.paystack.com/${init.accessCode}`;
  }
  return null;
}
