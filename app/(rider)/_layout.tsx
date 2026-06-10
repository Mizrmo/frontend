import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RiderLayout() {
  return (
    <Tabs screenOptions={{ 
        tabBarActiveTintColor: '#0052B4', 
        tabBarInactiveTintColor: '#1A1A1A',
        headerShown: false,
        tabBarStyle: { height: 75, paddingBottom: 12, backgroundColor: '#F8F9FB', borderTopWidth: 0 },
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
      <Tabs.Screen name="notifications" options={{ href: null }} />
      {/* Stack screens hidden from tab bar */}
      <Tabs.Screen name="available-rides" options={{ href: null }} />
      <Tabs.Screen name="search-location" options={{ href: null }} />
      <Tabs.Screen name="driver-on-way" options={{ href: null }} />
      <Tabs.Screen name="booked-ride-details" options={{ href: null }} />
      <Tabs.Screen name="chat" options={{ href: null }} />
      <Tabs.Screen name="rate-driver" options={{ href: null }} />
      <Tabs.Screen name="enable-location" options={{ href: null }} />
      <Tabs.Screen name="raise-dispute" options={{ href: null }} />
      <Tabs.Screen name="driver-details" options={{ href: null }} />
      <Tabs.Screen name="mizmiles-rewards" options={{ href: null }} />
    </Tabs>
  );
}
