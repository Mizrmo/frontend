import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { MapView, Marker } from '../../components/Map';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Status = 'initial' | 'arrived' | 'in-progress';

export default function DriverStartRideScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('initial');

  const handleAccept = () => setStatus('arrived');
  const handleAtPickup = () => setStatus('in-progress');
  const handleFinishRide = () => router.replace('/(driver)/rate-rider');
  const handleCancel = () => {
    Alert.alert('Cancel Ride', 'Are you sure you want to cancel this ride?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => router.replace('/(driver)/home') }
    ]);
  };

  const statusLabels: Record<Status, string> = {
    initial: 'Accept Ride',
    arrived: 'At Pickup',
    'in-progress': 'Finish Ride',
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 5.6037, longitude: -0.1870, latitudeDelta: 0.04, longitudeDelta: 0.04 }}
      >
        <Marker coordinate={{ latitude: 5.6037, longitude: -0.1870 }}>
          <View style={styles.carMarker}>
            <Ionicons name="car" size={20} color="#0056B3" />
          </View>
        </Marker>
        <Marker coordinate={{ latitude: 5.620, longitude: -0.200 }}>
          <View style={styles.destMarker}>
            <Ionicons name="location" size={24} color="#FFCC00" />
          </View>
        </Marker>
      </MapView>

      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <View style={styles.sheet}>
        <View style={styles.handle} />

        {/* ETA + Start Button */}
        <View style={styles.topActionRow}>
          <View>
            <Text style={styles.etaValue}>00: 01: 24</Text>
            <Text style={styles.etaLabel}>Estimated Arrival time</Text>
          </View>
          <TouchableOpacity style={styles.navBtn}>
            <Ionicons name="navigate" size={18} color="#FFF" />
            <Text style={styles.navBtnText}>Start Navigation</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Route */}
        <View style={styles.routeBlock}>
          <View style={styles.routeRow}>
            <View style={styles.blueMarker} />
            <View>
              <Text style={styles.locLabel}>Pickup location</Text>
              <Text style={styles.locName}>Ashaiman, main station</Text>
            </View>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <Ionicons name="location" size={20} color="#FFCC00" />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.locLabel}>Drop off Location</Text>
              <Text style={styles.locName}>Community One, Tema</Text>
            </View>
            <Text style={styles.distance}>2.2km</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Passenger */}
        <View style={styles.passengerRow}>
          <View style={styles.passengerLeft}>
            <Image source={require('../../assets/lady_profile.png')} style={styles.avatar} />
            <View>
                <Text style={styles.passengerName}>Jane Asantewa</Text>
                <Text style={styles.passengerMeta}>Verified Rider</Text>
            </View>
          </View>
          <View style={styles.passengerActions}>
            <TouchableOpacity style={styles.actionCircle}>
              <Ionicons name="call" size={20} color="#0056B3" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCircle, styles.msgBtn]} onPress={() => router.push('/(driver)/chat')}>
              <Ionicons name="chatbubble" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Fare */}
        <View style={styles.fareRow}>
          <View style={styles.fareIconBg}>
            <MaterialCommunityIcons name="wallet-outline" size={24} color="#0052B4" />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.fareAmount}>GH¢22.00</Text>
            <Text style={styles.fareLabel}>Estimated Fare</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.footerBtns}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={status === 'initial' ? handleAccept : status === 'arrived' ? handleAtPickup : handleFinishRide}
          >
            <Text style={styles.primaryBtnText}>{statusLabels[status]}</Text>
          </TouchableOpacity>
          {status !== 'in-progress' && (
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>Cancel Ride</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  map: { ...StyleSheet.absoluteFillObject },
  backBtn: { position: 'absolute', top: 55, left: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1 },
  backText: { fontSize: 14, marginLeft: 4, fontFamily: 'Roboto_400Regular', color: '#1A1A1A' },
  carMarker: { width: 44, height: 44, backgroundColor: '#FFF', borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#0056B3', shadowOpacity: 0.2 },
  destMarker: { alignItems: 'center' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, elevation: 15, shadowColor: '#000', shadowOpacity: 0.1 },
  handle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  topActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  etaValue: { fontSize: 20, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  etaLabel: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 4 },
  navBtn: { flexDirection: 'row', backgroundColor: '#0056B3', paddingHorizontal: 16, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', gap: 8 },
  navBtnText: { color: '#FFF', fontSize: 13, fontFamily: 'Montserrat_600SemiBold' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 18 },
  routeBlock: { marginBottom: 10 },
  routeRow: { flexDirection: 'row', alignItems: 'center' },
  blueMarker: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0056B3', marginRight: 15 },
  routeLine: { width: 2, height: 20, backgroundColor: '#EEF2FF', marginLeft: 4, marginVertical: 4 },
  locLabel: { fontSize: 10, color: '#94A3B8', fontFamily: 'Roboto_400Regular', textTransform: 'uppercase' },
  locName: { fontSize: 15, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A', marginTop: 2 },
  distance: { fontSize: 13, fontFamily: 'Montserrat_600SemiBold', color: '#64748B' },
  passengerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  passengerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, backgroundColor: '#F1F5F9' },
  passengerName: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  passengerMeta: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  passengerActions: { flexDirection: 'row', gap: 12 },
  actionCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF4FF', justifyContent: 'center', alignItems: 'center' },
  msgBtn: { backgroundColor: '#0056B3' },
  fareRow: { flexDirection: 'row', alignItems: 'center' },
  fareIconBg: { width: 48, height: 48, backgroundColor: '#EEF4FF', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  fareAmount: { fontSize: 17, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  fareLabel: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  footerBtns: { marginTop: 20, gap: 12 },
  primaryBtn: { backgroundColor: '#0056B3', height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
  cancelBtn: { height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  cancelBtnText: { color: '#EF4444', fontSize: 15, fontFamily: 'Montserrat_600SemiBold' }
});
