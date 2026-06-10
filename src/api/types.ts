export type UserRole = 'RIDER' | 'DRIVER' | 'ADMIN';

export interface User {
  id: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  avatarUrl?: string;
  profilePhotoUrl?: string;
  bio?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

export interface VerifyOtpResponse {
  userId: string;
}

export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleIntent: 'RIDER' | 'DRIVER';
}

export interface ResendOtpDto {
  phoneNumber: string;
  type: 'PHONE_VERIFICATION' | 'PASSWORD_RESET' | 'EMAIL_VERIFICATION';
}

export interface VerifyOtpDto {
  phoneNumber: string;
  code: string;
}

export interface SetPasswordDto {
  userId: string;
  password: string;
}

export interface LoginDto {
  emailOrPhone: string;
  password: string;
}

export interface ForgotPasswordDto {
  emailOrPhone: string;
}

export interface ResetPasswordDto {
  emailOrPhone: string;
  code: string;
  newPassword: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}
