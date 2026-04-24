import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MapView } from '../../components/Map';

export default function DriverRateRiderScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(0);

  return (
    <View style={styles.container}>
      {/* Background Map */}
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 5.6037, longitude: -0.1870, latitudeDelta: 0.02, longitudeDelta: 0.02 }}
        scrollEnabled={false}
        zoomEnabled={false}
      />

      {/* Dark Backdrop */}
      <View style={styles.backdrop} />

      {/* Rating Modal */}
      <View style={styles.modal}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.replace('/(driver)/home')}>
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>

        {/* Rider Avatar */}
        <View style={styles.avatarCircle}>
          <Image
            source={require('../../assets/lady_profile.png')}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.title}>Ride Completed</Text>
        <Text style={styles.subtitle}>Rate your experience with Jane</Text>

        {/* Star Rating */}
        <View style={styles.starsRow}>
          {[0, 1, 2, 3, 4].map((i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i + 1)} style={styles.starBtn}>
              <Ionicons
                name={i < rating ? 'star' : 'star-outline'}
                size={44}
                color="#FFCC00"
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.message}>
          Your ride has ended successfully.{'\n'}The fare has been added to your wallet.
        </Text>

        <TouchableOpacity
          style={[styles.doneBtn, rating === 0 && styles.doneBtnDisabled]}
          onPress={() => rating > 0 && router.replace('/(driver)/home')}
        >
          <Text style={styles.doneBtnText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(38, 38, 38, 0.75)' },
  modal: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 30, paddingBottom: 50, alignItems: 'center',
    elevation: 20, shadowColor: '#000', shadowOpacity: 0.2
  },
  closeBtn: { position: 'absolute', top: 22, right: 22 },
  avatarCircle: {
    width: 96, height: 96, borderRadius: 48, overflow: 'hidden',
    borderWidth: 4, borderColor: '#FFF', marginBottom: 16, marginTop: 10,
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.1
  },
  avatar: { width: '100%', height: '100%' },
  title: { fontSize: 24, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginBottom: 25 },
  starsRow: { flexDirection: 'row', marginBottom: 25 },
  starBtn: { marginHorizontal: 5 },
  message: { fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 24, marginBottom: 35, fontFamily: 'Roboto_400Regular', paddingHorizontal: 10 },
  doneBtn: { backgroundColor: '#0056B3', width: '100%', height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  doneBtnDisabled: { backgroundColor: '#E2E8F0' },
  doneBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' }
});
