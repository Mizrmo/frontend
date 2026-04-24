import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MapView } from '../../components/Map';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const recentPlaces = [
  { id: 1, name: 'Office', address: 'Community one', distance: '2.7km' },
  { id: 2, name: 'Coffee shop', address: 'Somewhere, Tema', distance: '1.1km' },
  { id: 3, name: 'Shopping center', address: 'Tema Community 4', distance: '4.9km' },
];

export default function SearchLocationScreen() {
  const router = useRouter();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 5.6037, longitude: -0.1870, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
      />

      {/* Bottom Sheet */}
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Search For A Ride</Text>
          <View style={styles.divider} />

          {/* Inputs */}
          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <Ionicons name="radio-button-on" size={18} color="#0056B3" />
              <TextInput
                style={styles.input}
                placeholder="Pick Up"
                placeholderTextColor="#94A3B8"
                value={pickup}
                onChangeText={setPickup}
              />
            </View>
            <View style={styles.inputDivider} />
            <View style={styles.inputRow}>
              <Ionicons name="location" size={18} color="#FFCC00" />
              <TextInput
                style={styles.input}
                placeholder="Drop Off"
                placeholderTextColor="#94A3B8"
                value={dropoff}
                onChangeText={setDropoff}
              />
            </View>
          </View>

          {/* Date & Time Pills */}
          <View style={styles.datetimeRow}>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>Date</Text>
              <Text style={styles.pillValue}>17-10-24</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>Pickup Time</Text>
              <Text style={styles.pillValue}>6:00 PM</Text>
            </View>
          </View>

          {/* Search Button */}
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => router.push('/(rider)/available-rides')}
          >
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>

          {/* Recent Places */}
          <Text style={styles.recentTitle}>Recent places</Text>
          {recentPlaces.map(place => (
            <TouchableOpacity
              key={place.id}
              style={styles.placeRow}
              onPress={() => router.push('/(rider)/available-rides')}
            >
              <View style={styles.pinCircle}>
                <Ionicons name="location" size={18} color="#FFCC00" />
              </View>
              <View style={styles.placeInfo}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeAddr}>{place.address}</Text>
              </View>
              <Text style={styles.placeDist}>{place.distance}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 20, paddingBottom: 40, maxHeight: '55%',
  },
  handle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A', marginBottom: 14 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 16 },
  inputGroup: { backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 50 },
  inputDivider: { height: 1, backgroundColor: '#E2E8F0', marginLeft: 50 },
  input: { flex: 1, marginLeft: 12, fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  datetimeRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  pill: {
    flex: 1, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1,
    borderColor: '#E2E8F0', paddingHorizontal: 14, paddingVertical: 10,
  },
  pillLabel: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginBottom: 2 },
  pillValue: { fontSize: 14, color: '#1A1A1A', fontFamily: 'Montserrat_500Medium' },
  searchBtn: {
    backgroundColor: '#0056B3', height: 50, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  searchBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Roboto_400Regular', fontWeight: '600' },
  recentTitle: { fontSize: 15, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A', marginBottom: 12 },
  placeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  pinCircle: { width: 36, height: 36, backgroundColor: '#FFF9E6', borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  placeInfo: { flex: 1, marginLeft: 14 },
  placeName: { fontSize: 14, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  placeAddr: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  placeDist: { fontSize: 12, color: '#64748B', fontFamily: 'Roboto_400Regular' },
});
