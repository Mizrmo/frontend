import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MapView } from '../../components/Map';

export default function RateDriverScreen() {
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
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.replace('/(rider)/home')}>
          <Ionicons name="close" size={24} color="#CBD5E1" />
        </TouchableOpacity>

        {/* Driver Avatar */}
        <View style={styles.avatarFrame}>
          <Image 
            source={require('../../assets/lady_profile.png')} 
            style={styles.avatar}
          />
        </View>

        <Text style={styles.title}>Rate Your Driver</Text>
        <Text style={styles.driverName}>Daniel Asante</Text>
        <Text style={styles.subtitle}>How was your ride experience?</Text>

        {/* Stars */}
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

        {rating > 0 && (
          <Text style={styles.ratingLabel}>
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][rating]}
          </Text>
        )}

        <Text style={styles.message}>
          Your ride has ended successfully.{'\n'}Thank you for riding with Mizrmo.
        </Text>

        <TouchableOpacity
          style={[styles.doneBtn, rating === 0 && styles.doneBtnDisabled]}
          onPress={() => rating > 0 && router.replace('/(rider)/home')}
        >
          <Text style={styles.doneBtnText}>Submit Rating</Text>
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
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFF', borderTopLeftRadius: 36, borderTopRightRadius: 36,
    padding: 30, paddingBottom: Platform.OS === 'ios' ? 60 : 40, alignItems: 'center',
    elevation: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15
  },
  closeBtn: { position: 'absolute', top: 25, right: 25 },
  avatarFrame: { 
    width: 96, height: 96, borderRadius: 48, overflow: 'hidden',
    borderWidth: 4, borderColor: '#FFF', backgroundColor: '#F1F5F9',
    marginBottom: 16, marginTop: 10, elevation: 6, shadowColor: '#000', shadowOpacity: 0.1
  },
  avatar: { width: '100%', height: '100%' },
  title: { fontSize: 24, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', marginBottom: 4 },
  driverName: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#0056B3', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginBottom: 25 },
  starsRow: { flexDirection: 'row', marginBottom: 12 },
  starBtn: { marginHorizontal: 5 },
  ratingLabel: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#FFCC00', marginBottom: 15 },
  message: { 
    fontSize: 15, color: '#64748B', textAlign: 'center', 
    lineHeight: 24, marginBottom: 35, fontFamily: 'Roboto_400Regular', paddingHorizontal: 15 
  },
  doneBtn: { 
    backgroundColor: '#0056B3', width: '100%', height: 56, 
    borderRadius: 28, justifyContent: 'center', alignItems: 'center', 
    elevation: 4, shadowColor: '#0056B3', shadowOpacity: 0.3 
  },
  doneBtnDisabled: { backgroundColor: '#E2E8F0', elevation: 0 },
  doneBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
});
