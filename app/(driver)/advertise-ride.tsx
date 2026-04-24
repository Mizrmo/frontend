import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform
} from 'react-native';
import { MapView } from '../../components/Map';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const recentPlaces = [
  { id: 1, name: 'Office', sub: 'Community one', dist: '2.7km' },
  { id: 2, name: 'Coffee shop', sub: 'Somewhere, Tema', dist: '1.1km' },
  { id: 3, name: 'Shopping center', sub: 'Tema Community 4', dist: '4.9km' },
];

export default function AdvertiseRideScreen() {
  const router = useRouter();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date] = useState('17-10-24');
  const [time] = useState('6:00 PM');

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 5.6037, longitude: -0.1870, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
      />

      {/* Header Controls */}
      <View style={styles.headerControls}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.sheetTitle}>Advertise Ride</Text>
        <View style={styles.divider} />

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Inputs */}
          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <View style={[styles.dot, { backgroundColor: '#0056B3' }]} />
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
            <TouchableOpacity style={styles.pill}>
              <Text style={styles.pillLabel}>Date</Text>
              <Text style={styles.pillValue}>{date}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pill}>
              <Text style={styles.pillLabel}>Pickup Time</Text>
              <Text style={styles.pillValue}>{time}</Text>
            </TouchableOpacity>
          </View>

          {/* Advertise Button */}
          <TouchableOpacity
            style={styles.advertiseBtn}
            onPress={() => router.push('/(driver)/ride-confirmed')}
          >
            <Text style={styles.advertiseBtnText}>Publish Ride</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Recent Places */}
          <Text style={styles.recentTitle}>Recent Search</Text>
          {recentPlaces.map(place => (
            <TouchableOpacity key={place.id} style={styles.placeRow}>
              <View style={styles.pinCircle}>
                <Ionicons name="time-outline" size={18} color="#1A1A1A" />
              </View>
              <View style={styles.placeInfo}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeAddr}>{place.sub}</Text>
              </View>
              <Text style={styles.placeDist}>{place.dist}</Text>
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
  headerControls: {
    position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20,
  },
  iconBtn: {
    width: 44, height: 44, backgroundColor: '#FFF', borderRadius: 22,
    justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5
  },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 20, paddingBottom: 40, maxHeight: '50%', elevation: 20, shadowColor: '#000', shadowOpacity: 0.1
  },
  handle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 20, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 18 },
  inputGroup: {
    backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 1,
    borderColor: '#E2E8F0', marginBottom: 18,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 54 },
  dot: { width: 10, height: 10, borderRadius: 5, marginLeft: 4 },
  inputDivider: { height: 1, backgroundColor: '#E2E8F0', marginLeft: 50 },
  input: { flex: 1, marginLeft: 14, fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  datetimeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  pill: {
    flex: 1, backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1,
    borderColor: '#F1F5F9', paddingHorizontal: 16, paddingVertical: 12,
  },
  pillLabel: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginBottom: 4 },
  pillValue: { fontSize: 15, color: '#1A1A1A', fontFamily: 'Montserrat_600SemiBold' },
  advertiseBtn: {
    backgroundColor: '#0056B3', height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 3
  },
  advertiseBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
  recentTitle: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', marginBottom: 15 },
  placeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  pinCircle: { width: 40, height: 40, backgroundColor: '#F1F5F9', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  placeInfo: { flex: 1, marginLeft: 14 },
  placeName: { fontSize: 15, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  placeAddr: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  placeDist: { fontSize: 12, color: '#64748B', fontFamily: 'Roboto_400Regular' },
});
