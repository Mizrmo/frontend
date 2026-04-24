import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F8FAFC' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="settings" />
      <Stack.Screen name="documents" />
      <Stack.Screen name="ghana-card" />
      <Stack.Screen name="mizmiles-rewards" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="help-support" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="add-payment-method" />
    </Stack>
  );
}
