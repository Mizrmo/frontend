import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DriverLayout() {
  return (
    <Tabs screenOptions={{ 
        tabBarActiveTintColor: '#0052B4', 
        tabBarInactiveTintColor: '#1A1A1A',
        headerShown: false,
        tabBarStyle: { height: 75, paddingBottom: 12, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
        tabBarLabelStyle: { fontFamily: 'Roboto_400Regular', fontSize: 11, marginBottom: 8 }
    }}>
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: "Home",
          tabBarIcon: ({ color }) => <Ionicons name="location" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="trips" 
        options={{ 
          title: "Trips",
          tabBarIcon: ({ color }) => <Ionicons name="car-sport" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="favourites" 
        options={{ 
          title: "Favorites",
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="account" 
        options={{ 
          title: "Profile",
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> 
        }} 
      />
      {/* Hidden screens - set href to null to hide from bottom bar */}
      <Tabs.Screen name="advertise-ride" options={{ href: null }} />
      <Tabs.Screen name="ride-confirmed" options={{ href: null }} />
      <Tabs.Screen name="start-ride" options={{ href: null }} />
      <Tabs.Screen name="incoming-request" options={{ href: null }} />
      <Tabs.Screen name="rate-rider" options={{ href: null }} />
      <Tabs.Screen name="chat" options={{ href: null }} />
      <Tabs.Screen name="mizmiles-rewards" options={{ href: null }} />
      <Tabs.Screen name="ride-details" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="earnings-detail" options={{ href: null }} />
    </Tabs>
  );
}
