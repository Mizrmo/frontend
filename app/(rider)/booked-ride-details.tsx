import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MapView, Marker } from '../../components/Map';

export default function BookedRideDetailsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 5.6037, longitude: -0.1870, latitudeDelta: 0.04, longitudeDelta: 0.04 }}
      >
        <Marker coordinate={{ latitude: 5.6037, longitude: -0.1870 }}>
          <View style={styles.markerCircle}>
            <View style={styles.markerInner} />
          </View>
        </Marker>
        <Marker coordinate={{ latitude: 5.620, longitude: -0.200 }}>
          <Ionicons name="location" size={28} color="#FFCC00" />
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
        <Text style={styles.sheetTitle}>Ride Details</Text>

        <View style={styles.divider} />

        {/* Driver Info */}
        <View style={styles.driverRow}>
          <View style={styles.driverAvatar}>
            <Ionicons name="person-circle" size={46} color="#CBD5E1" />
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Daniel Asante</Text>
            <Text style={styles.driverMeta}>Toyota Vitz  •  3 seats  •  26yrs</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#FFCC00" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Route */}
        <View style={styles.routeBlock}>
          <View style={styles.routeRow}>
            <View style={styles.blueDot} />
            <View>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeName}>Ashaiman, main station</Text>
            </View>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <Ionicons name="location" size={20} color="#FFCC00" />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.routeLabel}>Drop off</Text>
              <Text style={styles.routeName}>Community One, Tema</Text>
            </View>
            <Text style={styles.distance}>2.2km</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Fare & Time */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="card-outline" size={20} color="#0056B3" />
            <Text style={styles.metaValue}>GH¢22.00</Text>
            <Text style={styles.metaLabel}>Fare</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={20} color="#0056B3" />
            <Text style={styles.metaValue}>28 Feb</Text>
            <Text style={styles.metaLabel}>Date</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Ionicons name="navigate-outline" size={20} color="#0056B3" />
            <Text style={styles.metaValue}>5 mins</Text>
            <Text style={styles.metaLabel}>ETA</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* CTA Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.chatBtn}
            onPress={() => router.push('/(rider)/chat')}
          >
            <Ionicons name="chatbubble-outline" size={18} color="#0056B3" />
            <Text style={styles.chatBtnText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() => router.push('/(rider)/driver-on-way')}
          >
            <Text style={styles.trackBtnText}>Track Driver</Text>
          </TouchableOpacity>
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
  markerCircle: { width: 40, height: 40, backgroundColor: 'rgba(0,86,179,0.2)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  markerInner: { width: 14, height: 14, backgroundColor: '#0056B3', borderRadius: 7, borderWidth: 2, borderColor: '#FFF' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, paddingBottom: 36 },
  handle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 20, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A', textAlign: 'center', marginBottom: 14 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },
  driverRow: { flexDirection: 'row', alignItems: 'center' },
  driverAvatar: { marginRight: 12 },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 15, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  driverMeta: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9E6', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, gap: 4 },
  ratingText: { fontSize: 13, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  routeBlock: {},
  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  blueDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#0056B3', marginRight: 12 },
  routeLine: { width: 2, height: 16, backgroundColor: '#CBD5E1', marginLeft: 5, marginBottom: 4 },
  routeLabel: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  routeName: { fontSize: 14, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  distance: { fontSize: 13, color: '#64748B', fontFamily: 'Roboto_400Regular' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  metaItem: { alignItems: 'center', gap: 4 },
  metaValue: { fontSize: 15, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  metaLabel: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  metaDivider: { width: 1, height: 40, backgroundColor: '#F1F5F9' },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  chatBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 25, borderWidth: 1.5, borderColor: '#0056B3', gap: 8 },
  chatBtnText: { color: '#0056B3', fontFamily: 'Montserrat_500Medium', fontSize: 15 },
  trackBtn: { flex: 2, height: 50, borderRadius: 25, backgroundColor: '#0056B3', justifyContent: 'center', alignItems: 'center' },
  trackBtnText: { color: '#FFF', fontFamily: 'Montserrat_500Medium', fontSize: 15 },
});
