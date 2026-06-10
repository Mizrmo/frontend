import apiClient from './client.native';

export type DisputeType =
  | 'DRIVER_NEVER_ARRIVED'
  | 'WRONG_ROUTE_TAKEN'
  | 'TRIP_ENDED_EARLY'
  | 'OTHER';

export interface RaiseDisputeDto {
  bookingId: string;
  disputeType: DisputeType;
  description: string;
}

export interface Dispute {
  id: string;
  bookingId?: string;
  disputeType?: DisputeType;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const DISPUTE_TYPE_LABELS: Record<DisputeType, string> = {
  DRIVER_NEVER_ARRIVED: 'Driver never arrived',
  WRONG_ROUTE_TAKEN: 'Wrong route taken',
  TRIP_ENDED_EARLY: 'Trip ended early',
  OTHER: 'Other issue',
};

export const raiseDispute = async (data: RaiseDisputeDto) => {
  const response = await apiClient.post<Dispute>('/disputes', data);
  return response.data;
};

export const getDisputeById = async (disputeId: string) => {
  const response = await apiClient.get<Dispute>(`/disputes/${disputeId}`);
  return response.data;
};
