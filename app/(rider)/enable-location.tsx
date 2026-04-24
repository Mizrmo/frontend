import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MapView } from '../../components/Map';

const { width } = Dimensions.get('window');

export default function EnableLocationScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 5.6037, longitude: -0.1870, latitudeDelta: 0.1, longitudeDelta: 0.1 }}
      />
      <View style={styles.overlay} />

      <View style={styles.popupContainer}>
        <View style={styles.popup}>
          {/* Illustration with ripples */}
          <View style={styles.illustration}>
            <View style={[styles.ripple, styles.ripple1]} />
            <View style={[styles.ripple, styles.ripple2]} />
            <View style={styles.pinCenter}>
              <Ionicons name="location" size={32} color="#FFCC00" />
            </View>
          </View>

          <Text style={styles.title}>Enable Your Location</Text>
          <Text style={styles.subtitle}>Allow Mizrmo to access your location for a better ride booking experience.</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.useBtn}
              onPress={() => router.replace('/(rider)/home')}
            >
              <Text style={styles.useBtnText}>Use My Location</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => router.replace('/(rider)/home')}
            >
              <Text style={styles.skipBtnText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  popupContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  popup: {
    width: width - 40, backgroundColor: '#FFF', borderRadius: 28,
    padding: 30, alignItems: 'center', elevation: 20, shadowColor: '#000',
    shadowOpacity: 0.2, shadowOffset: { width: 0, height: 10 }
  },
  illustration: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  pinCenter: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 5, zIndex: 10 },
  ripple: { position: 'absolute', borderRadius: 100, borderWidth: 1, borderColor: 'rgba(255, 204, 0, 0.3)' },
  ripple1: { width: 90, height: 90 },
  ripple2: { width: 120, height: 120 },
  title: { fontSize: 22, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22, marginBottom: 30, fontFamily: 'Roboto_400Regular' },
  actions: { width: '100%', gap: 12 },
  useBtn: { backgroundColor: '#0056B3', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  useBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Roboto_400Regular', fontWeight: '600' },
  skipBtn: { height: 50, justifyContent: 'center', alignItems: 'center' },
  skipBtnText: { color: '#94A3B8', fontSize: 15, fontFamily: 'Roboto_400Regular' },
});
