import apiClient from './client.native';

export interface MizMilesWallet {
  balance?: number;
  milesBalance?: number;
  points?: number;
  lifetimeEarned?: number;
}

export interface MizMilesTransaction {
  id?: string;
  amount?: number;
  miles?: number;
  type?: string;
  description?: string;
  createdAt?: string;
}

export interface MizMilesTransactionsResponse {
  data?: MizMilesTransaction[];
  meta?: { totalCount?: number };
}

export interface RedeemMilesDto {
  rewardId?: string;
  miles?: number;
  promotionCode?: string;
}

export const getMizMilesWallet = async () => {
  const response = await apiClient.get<MizMilesWallet>('/miz-miles/wallet');
  return response.data;
};

export const getMizMilesTransactions = async (params?: { page?: number; limit?: number }) => {
  const response = await apiClient.get<MizMilesTransactionsResponse>('/miz-miles/transactions', {
    params,
  });
  return response.data;
};

export const redeemMizMiles = async (data: RedeemMilesDto) => {
  const response = await apiClient.post('/miz-miles/redeem', data);
  return response.data;
};

export interface MizMilesVoucher {
  id?: string;
  code?: string;
  voucherCode?: string;
  type?: string;
  status?: string;
  discountPercent?: number;
  expiresAt?: string;
}

export const getMyVouchers = async () => {
  const response = await apiClient.get<MizMilesVoucher[] | { data: MizMilesVoucher[] }>(
    '/miz-miles/vouchers'
  );
  const payload = response.data;
  return Array.isArray(payload) ? payload : payload.data ?? [];
};

export const applyVoucherToBooking = async (voucherCode: string, bookingId: string) => {
  const response = await apiClient.post('/miz-miles/vouchers/apply', {
    voucherCode: voucherCode.trim().toUpperCase(),
    bookingId,
  });
  return response.data;
};

export function getVoucherCode(voucher: MizMilesVoucher): string {
  return voucher.code ?? voucher.voucherCode ?? '';
}

export function getMilesBalance(wallet?: MizMilesWallet | null): number {
  if (!wallet) {
    return 0;
  }
  return wallet.milesBalance ?? wallet.balance ?? wallet.points ?? 0;
}
