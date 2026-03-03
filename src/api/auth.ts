import apiClient from './client';

export interface InitiateRequest {
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    identifier: string;
    phoneNumber: string;
    password?: string;
    role: 'RIDER' | 'DRIVER' | 'ADMIN';
    otp: string;
}

export interface LoginRequest {
    identifier: string;
    password?: string;
}

export interface ForgotPasswordRequest {
    identifier: string;
}

export interface ResetPasswordRequest {
    identifier: string;
    otp: string;
    newPassword?: string;
}

/**
 * Initiates the registration process by sending an OTP.
 */
export const initiateRegistration = async (data: InitiateRequest) => {
    try {
        const response = await apiClient.post('/auth/register/initiate', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Completes the registration process using the OTP.
 */
export const completeRegistration = async (data: RegisterRequest) => {
    try {
        const response = await apiClient.post('/auth/register/complete', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Authenticates a user.
 */
export const login = async (data: LoginRequest) => {
    try {
        const response = await apiClient.post('/auth/login', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Requests a password reset OTP.
 */
export const forgotPassword = async (data: ForgotPasswordRequest) => {
    try {
        const response = await apiClient.post('/auth/forgot-password', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Resets the password using an OTP.
 */
export const resetPassword = async (data: ResetPasswordRequest) => {
    try {
        const response = await apiClient.post('/auth/reset-password', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Fetches the current authenticated user's profile.
 */
export const getMe = async () => {
    try {
        const response = await apiClient.get('/auth/me');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Keeping for backward compatibility if needed, but redirects to the new flow
// or can be removed once UI is updated.
export const registerUser = completeRegistration;

