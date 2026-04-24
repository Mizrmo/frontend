import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MapView } from '../../components/Map';

export default function IncomingRequestModal() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Map Background for context */}
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 5.6037, longitude: -0.1870, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
      />
      
      {/* Overlay Backdrop */}
      <View style={styles.backdrop} />

      <View style={styles.modal}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#CBD5E1" />
        </TouchableOpacity>
        
        <View style={styles.iconCircle}>
          <Image source={require('../../assets/cars/ToyotaVitz.png')} style={styles.carImg} resizeMode="contain" />
        </View>

        <Text style={styles.title}>New Ride Request</Text>
        <Text style={styles.subtitle}>A rider is looking for a shared ride from <Text style={styles.boldText}>Ashaiman</Text> to <Text style={styles.boldText}>Community One</Text>.</Text>
        
        <View style={styles.infoRow}>
            <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Distance</Text>
                <Text style={styles.infoValue}>2.7 km</Text>
            </View>
            <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Earn</Text>
                <Text style={styles.infoValue}>GH¢ 22.00</Text>
            </View>
        </View>

        <TouchableOpacity style={styles.viewBtn} onPress={() => {
            router.replace('/(driver)/home');
        }}>
          <Text style={styles.viewBtnText}>Accept Request</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.declineBtn} onPress={() => router.back()}>
          <Text style={styles.declineText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(30, 41, 59, 0.7)' },
  modal: { 
    margin: 20, 
    marginTop: Platform.OS === 'ios' ? 160 : 120, 
    backgroundColor: '#FFF', 
    borderRadius: 32, 
    padding: 25, 
    alignItems: 'center', 
    elevation: 20, 
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowRadius: 15 
  },
  closeBtn: { position: 'absolute', top: 20, right: 20 },
  iconCircle: { width: 100, height: 100, backgroundColor: '#EEF6FF', borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  carImg: { width: 70, height: 50 },
  title: { fontSize: 20, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', marginBottom: 10 },
  subtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 20, fontFamily: 'Roboto_400Regular' },
  boldText: { color: '#0056B3', fontFamily: 'Montserrat_700Bold' },
  
  infoRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginBottom: 25, backgroundColor: '#F8FAFC', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  infoItem: { alignItems: 'center' },
  infoLabel: { fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'Montserrat_700Bold', letterSpacing: 1 },
  infoValue: { fontSize: 16, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },

  viewBtn: { backgroundColor: '#0056B3', width: '100%', height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 10, elevation: 4, shadowColor: '#0056B3', shadowOpacity: 0.3 },
  viewBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
  declineBtn: { padding: 8 },
  declineText: { color: '#94A3B8', fontSize: 14, fontFamily: 'Roboto_400Regular' }
});
