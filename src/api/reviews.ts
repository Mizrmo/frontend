import apiClient from './client.native';
import type { PendingReview, SubmitReviewDto, UserRating } from './trip-types';

export type { PendingReview, SubmitReviewDto, UserRating } from './trip-types';

export const getPendingReviews = async () => {
  const response = await apiClient.get<PendingReview[] | { data: PendingReview[] }>(
    '/reviews/pending'
  );
  const payload = response.data;
  return Array.isArray(payload) ? payload : payload.data ?? [];
};

export const submitReview = async (data: SubmitReviewDto) => {
  const response = await apiClient.post('/reviews', data);
  return response.data;
};

export const skipReview = async (bookingId: string) => {
  const response = await apiClient.post('/reviews/skip', { bookingId });
  return response.data;
};

export const getUserRating = async (userId: string) => {
  const response = await apiClient.get<UserRating>(`/users/${userId}/rating`);
  return response.data;
};
