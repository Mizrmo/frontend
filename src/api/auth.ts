import apiClient from './client.native';

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

export const initiateRegistration = async (data: RegisterDto) => {
    const response = await apiClient.post('/auth/register/initiate', data);
    return response.data;
};

export const resendOtp = async (data: ResendOtpDto) => {
    const response = await apiClient.post('/auth/resend-otp', data);
    return response.data;
};

export const verifyOtp = async (data: VerifyOtpDto) => {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
};

export const setPassword = async (data: SetPasswordDto) => {
    const response = await apiClient.post('/auth/set-password', data);
    return response.data;
};

export const login = async (data: LoginDto) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
};

export const getMe = async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
};
