import apiClient from './client';

export interface DriverIdentityData {
    licenseFront: string; // Base64 or URL
    licenseBack: string;
    ghanaCardFront: string;
    ghanaCardBack: string;
}

export interface DriverIdentityParams {
    licenseNumber: string;
    licenseExpiryDate: string; // YYYY-MM-DD
    ghanaCardNumber: string;
}

/**
 * Updates driver identity documents and information.
 */
export const updateDriverIdentity = async (
    driverId: string,
    params: DriverIdentityParams,
    data: DriverIdentityData
) => {
    try {
        const response = await apiClient.post(`/drivers/${driverId}/identity`, data, {
            params: params,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
