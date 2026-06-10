const sandboxApiUrl = "https://sandbox-api.mizrmo.com/api/v1";
const sandboxWsUrl = "https://sandbox-api.mizrmo.com";

export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? sandboxApiUrl,
  wsUrl: process.env.EXPO_PUBLIC_WS_URL ?? sandboxWsUrl,
  paystackPublicKey: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
  googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
};
