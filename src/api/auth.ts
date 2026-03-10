import apiClient from './client';

// ──────────────────────────────────────────────────────────
// DTOs that match exactly what the Mizrmo API expects
// Source: https://sandbox-api.mizrmo.com/swagger-ui
// ──────────────────────────────────────────────────────────

// POST /api/v1/auth/register/initiate
export interface RegisterDto {
    firstName: string;
    lastName: string;
    email: string;           // required by API
    phoneNumber: string;     // e.g. "0551234567"
    roleIntent: 'RIDER' | 'DRIVER';
}

// POST /api/v1/auth/resend-otp
export interface ResendOtpDto {
    phoneNumber: string;
    type: 'PHONE_VERIFICATION' | 'PASSWORD_RESET' | 'EMAIL_VERIFICATION';
}

// POST /api/v1/auth/verify-otp
export interface VerifyOtpDto {
    phoneNumber: string;
    code: string;  // 6-digit OTP
}

// POST /api/v1/auth/set-password  (returns userId from verify-otp step)
export interface SetPasswordDto {
    userId: string;         // UUID returned from /verify-otp
    password: string;       // min 8 chars, 1 upper, 1 lower, 1 number, 1 special
}

// POST /api/v1/auth/login
export interface LoginDto {
    emailOrPhone: string;
    password: string;
}

// POST /api/v1/auth/forgot-password
export interface ForgotPasswordDto {
    email: string;
}

// POST /api/v1/auth/reset-password
export interface ResetPasswordDto {
    email: string;
    code: string;           // 6-digit OTP
    newPassword: string;    // min 8 chars, 1 upper, 1 lower, 1 number, 1 special
}

// ──────────────────────────────────────────────────────────
// API Functions
// ──────────────────────────────────────────────────────────

/** Step 1: Initiate registration — sends OTP to phone */
export const initiateRegistration = async (data: RegisterDto) => {
    const response = await apiClient.post('/auth/register/initiate', data);
    return response.data;
};

/** Step 2: Resend OTP to a phone number */
export const resendOtp = async (data: ResendOtpDto) => {
    const response = await apiClient.post('/auth/resend-otp', data);
    return response.data;
};

/** Step 3: Verify OTP — returns userId needed for set-password */
export const verifyOtp = async (data: VerifyOtpDto) => {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
};

/** Step 4: Set password using userId returned from verifyOtp */
export const setPassword = async (data: SetPasswordDto) => {
    const response = await apiClient.post('/auth/set-password', data);
    return response.data;
};

/** Login */
export const login = async (data: LoginDto) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
};

/** Forgot password — sends OTP to email */
export const forgotPassword = async (data: ForgotPasswordDto) => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
};

/** Reset password with OTP received by email */
export const resetPassword = async (data: ResetPasswordDto) => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
};

/** Get current authenticated user profile */
export const getMe = async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
};
