import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' }
      }}
    >
      <Stack.Screen name="signin" />
      <Stack.Screen name="register" />
      <Stack.Screen name="success" />
      <Stack.Screen name="verify-otp" />
      <Stack.Screen name="set-password" />
      <Stack.Screen name="vehicle-details" />
      <Stack.Screen name="send-verification" />
      <Stack.Screen name="set-new-password" />
    </Stack>
  );
}
