import apiClient from './client.native';
import { appendImageToFormData } from './upload';
import type {
  AuthResponse,
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
  ResendOtpDto,
  SetPasswordDto,
  UpdateProfileDto,
  User,
  VerifyOtpDto,
  VerifyOtpResponse,
} from './types';

export type {
  AuthResponse,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  ResendOtpDto,
  SetPasswordDto,
  UpdateProfileDto,
  User,
  VerifyOtpDto,
} from './types';

export const initiateRegistration = async (data: RegisterDto) => {
  const response = await apiClient.post('/auth/register/initiate', data);
  return response.data;
};

export const resendOtp = async (data: ResendOtpDto) => {
  const response = await apiClient.post('/auth/resend-otp', data);
  return response.data;
};

export const verifyOtp = async (data: VerifyOtpDto) => {
  const response = await apiClient.post<VerifyOtpResponse>('/auth/verify-otp', data);
  return response.data;
};

export const setPassword = async (data: SetPasswordDto) => {
  const response = await apiClient.post<AuthResponse>('/auth/set-password', data);
  return response.data;
};

export const login = async (data: LoginDto) => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const refreshToken = async (data: RefreshTokenDto) => {
  const response = await apiClient.post<Pick<AuthResponse, 'accessToken' | 'refreshToken'>>(
    '/auth/refresh',
    data
  );
  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordDto) => {
  const response = await apiClient.post('/auth/forgot-password', data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordDto) => {
  const response = await apiClient.post('/auth/reset-password', data);
  return response.data;
};

export const getMe = async () => {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
};

export const updateProfile = async (data: UpdateProfileDto) => {
  const response = await apiClient.patch<User>('/auth/me', data);
  return response.data;
};

export const uploadProfilePhoto = async (photoUri: string) => {
  const formData = new FormData();
  await appendImageToFormData(formData, 'file', photoUri);

  const response = await apiClient.patch<User>('/auth/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
