import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MapView } from '../../components/Map';

export default function RideConfirmedScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Map Background to maintain context */}
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 5.6037, longitude: -0.1870, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
      />

      {/* Dark Backdrop */}
      <View style={styles.backdrop} />

      {/* Success Popup */}
      <View style={styles.popup}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.replace('/(driver)/home')}>
          <Ionicons name="close" size={24} color="#CBD5E1" />
        </TouchableOpacity>

        {/* Car Illustration */}
        <View style={styles.illustrationFrame}>
          <View style={styles.circleOuter}>
            <View style={styles.circleInner}>
              <MaterialCommunityIcons name="car-side" size={52} color="#0056B3" />
            </View>
          </View>
        </View>

        <Text style={styles.title}>Ride Advertised</Text>
        <Text style={styles.message}>New ride advertise has been created successfully</Text>

        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => router.replace('/(driver)/home')}
        >
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(30, 41, 59, 0.6)' },
  popup: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFF', borderTopLeftRadius: 36, borderTopRightRadius: 36,
    padding: 25, paddingBottom: Platform.OS === 'ios' ? 50 : 30, alignItems: 'center',
    elevation: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10
  },
  closeBtn: { position: 'absolute', top: 20, right: 20 },
  illustrationFrame: { marginBottom: 20, marginTop: 10 },
  circleOuter: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(0, 86, 179, 0.08)', justifyContent: 'center', alignItems: 'center',
  },
  circleInner: {
    width: 86, height: 86, borderRadius: 43,
    backgroundColor: '#EEF6FF', justifyContent: 'center', alignItems: 'center',
  },
  title: { fontSize: 22, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', marginBottom: 8 },
  message: {
    fontSize: 14, color: '#94A3B8', textAlign: 'center',
    lineHeight: 22, marginBottom: 30, fontFamily: 'Roboto_400Regular',
    paddingHorizontal: 20,
  },
  doneBtn: {
    backgroundColor: '#0056B3', width: '100%', height: 56,
    borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#0056B3', shadowOpacity: 0.3
  },
  doneBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
});
