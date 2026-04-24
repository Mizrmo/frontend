import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MapView, Marker } from '../../components/Map';

export default function DriverOnWayScreen() {
  const router = useRouter();

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

      {/* Back */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <View style={styles.sheet}>
        <View style={styles.handle} />

        {/* ETA Row */}
        <View style={styles.etaRow}>
          <View>
            <Text style={styles.etaValue}>00: 04: 32</Text>
            <Text style={styles.etaLabel}>Driver arriving in</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>On the way</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Route */}
        <View style={styles.routeBlock}>
          <View style={styles.routeRow}>
            <View style={styles.blueDot} />
            <View>
              <Text style={styles.routeLabel}>Pickup location</Text>
              <Text style={styles.routeName}>Ashaiman, main station</Text>
            </View>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <Ionicons name="location" size={20} color="#FFCC00" />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.routeLabel}>Drop off Location</Text>
              <Text style={styles.routeName}>Community One</Text>
            </View>
            <Text style={styles.distance}>2.2km</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Driver Info */}
        <View style={styles.driverRow}>
          <View style={styles.driverAvatar}>
            <Ionicons name="person-circle" size={46} color="#CBD5E1" />
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Daniel Asante</Text>
            <Text style={styles.driverMeta}>Toyota Vitz  •  GW-1234-22</Text>
          </View>
          <View style={styles.driverActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="call" size={20} color="#0056B3" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.chatBtn]}
              onPress={() => router.push('/(rider)/chat')}
            >
              <Ionicons name="chatbubble" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Fare */}
        <View style={styles.fareRow}>
          <View style={styles.fareIconBg}>
            <Ionicons name="card" size={22} color="#0056B3" />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.fareAmount}>GH¢22.00</Text>
            <Text style={styles.fareLabel}>Fare for Trip</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  backBtn: { position: 'absolute', top: 55, left: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, elevation: 4 },
  backText: { fontSize: 15, marginLeft: 4, fontFamily: 'Roboto_400Regular' },
  carMarker: { width: 44, height: 44, backgroundColor: '#EEF4FF', borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#0056B3' },
  destMarker: { alignItems: 'center' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, paddingBottom: 36 },
  handle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 18 },
  etaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  etaValue: { fontSize: 22, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  etaLabel: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusDot: { width: 8, height: 8, backgroundColor: '#10B981', borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, color: '#059669', fontFamily: 'Roboto_400Regular' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },
  routeBlock: { marginBottom: 4 },
  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  blueDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#0056B3', marginRight: 12 },
  routeLine: { width: 2, height: 16, backgroundColor: '#CBD5E1', marginLeft: 5, marginBottom: 4 },
  routeLabel: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  routeName: { fontSize: 14, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  distance: { fontSize: 13, color: '#64748B', fontFamily: 'Roboto_400Regular' },
  driverRow: { flexDirection: 'row', alignItems: 'center' },
  driverAvatar: { marginRight: 12 },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 15, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  driverMeta: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  driverActions: { flexDirection: 'row', gap: 10 },
  actionBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF4FF', justifyContent: 'center', alignItems: 'center' },
  chatBtn: { backgroundColor: '#0056B3' },
  fareRow: { flexDirection: 'row', alignItems: 'center' },
  fareIconBg: { width: 46, height: 46, backgroundColor: '#EEF4FF', borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
  fareAmount: { fontSize: 16, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  fareLabel: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
});
