import apiClient from './client.native';

export type PayoutAccountType = 'MOBILE_MONEY' | 'BANK_ACCOUNT';
export type MomoProvider = 'MTN' | 'VODAFONE' | 'AIRTELTIGO';

export interface RegisterPayoutAccountDto {
  accountType: PayoutAccountType;
  momoNumber?: string;
  momoProvider?: MomoProvider;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  bankCode?: string;
}

export interface DriverPayoutAccount {
  accountType?: PayoutAccountType;
  momoNumber?: string;
  momoProvider?: MomoProvider;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  bankCode?: string;
  isVerified?: boolean;
  maskedAccount?: string;
}

export interface DriverPayoutRecord {
  id?: string;
  amount?: number | string;
  status?: string;
  createdAt?: string;
  processedAt?: string;
}

export const registerPayoutAccount = async (data: RegisterPayoutAccountDto) => {
  const response = await apiClient.post<DriverPayoutAccount>('/drivers/payout-account', data);
  return response.data;
};

export const getDriverPayoutAccount = async () => {
  const response = await apiClient.get<DriverPayoutAccount>('/drivers/payout-account');
  return response.data;
};

export const getDriverPayouts = async () => {
  const response = await apiClient.get<DriverPayoutRecord[] | { data: DriverPayoutRecord[] }>(
    '/drivers/payouts'
  );
  const payload = response.data;
  return Array.isArray(payload) ? payload : payload.data ?? [];
};

export function formatPayoutAccountLabel(account?: DriverPayoutAccount | null): string {
  if (!account) {
    return 'No payout account';
  }
  if (account.maskedAccount) {
    return account.maskedAccount;
  }
  if (account.accountType === 'MOBILE_MONEY') {
    const provider = account.momoProvider ?? 'MoMo';
    const number = account.momoNumber ?? '••••';
    return `${provider} · ${number}`;
  }
  if (account.accountType === 'BANK_ACCOUNT') {
    return `${account.bankName ?? 'Bank'} · ${account.bankAccountNumber ?? '••••'}`;
  }
  return 'Payout account';
}
