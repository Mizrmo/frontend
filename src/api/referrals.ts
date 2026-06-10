import apiClient from './client.native';

export interface ReferralCodeResponse {
  code?: string;
  referralCode?: string;
}

export interface ReferralStats {
  totalReferrals?: number;
  successfulReferrals?: number;
  pendingReferrals?: number;
  milesEarned?: number;
  referredUsers?: Array<{
    id?: string;
    firstName?: string;
    lastName?: string;
    createdAt?: string;
  }>;
}

export const getMyReferralCode = async () => {
  const response = await apiClient.get<ReferralCodeResponse>('/referrals/my-code');
  return response.data;
};

export const getReferralStats = async () => {
  const response = await apiClient.get<ReferralStats>('/referrals/stats');
  return response.data;
};

export const applyReferralCode = async (code: string) => {
  const response = await apiClient.post('/referrals/apply', { code });
  return response.data;
};

export function getReferralCodeValue(data?: ReferralCodeResponse | null): string {
  return data?.code ?? data?.referralCode ?? '';
}
