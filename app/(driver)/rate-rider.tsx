import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MapView } from '../../components/Map';
import { getBookingById, getRiderName } from '../../src/api/bookings';
import { getApiErrorMessage } from '../../src/api/errors';
import { skipReview, submitReview } from '../../src/api/reviews';

export default function DriverRateRiderScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const [riderName, setRiderName] = useState('Rider');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!bookingId) {
        setIsLoading(false);
        return;
      }
      try {
        const booking = await getBookingById(String(bookingId));
        setRiderName(getRiderName(booking as any));
      } catch (error) {
        Alert.alert('Error', getApiErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [bookingId]);

  const handleSkip = async () => {
    if (!bookingId) {
      router.replace('/(driver)/home');
      return;
    }
    try {
      await skipReview(String(bookingId));
    } catch {
      // Allow exit even if skip endpoint fails.
    }
    router.replace('/(driver)/home');
  };

  const handleSubmit = async () => {
    if (!bookingId || rating === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview({
        bookingId: String(bookingId),
        rating,
        comment: comment.trim() || undefined,
      });
      Alert.alert('Thank you', 'Your feedback has been submitted.', [
        { text: 'OK', onPress: () => router.replace('/(driver)/home') },
      ]);
    } catch (error) {
      Alert.alert('Submit failed', getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0056B3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 5.6037, longitude: -0.187, latitudeDelta: 0.02, longitudeDelta: 0.02 }}
        scrollEnabled={false}
        zoomEnabled={false}
      />

      <View style={styles.backdrop} />

      <View style={styles.modal}>
        <TouchableOpacity style={styles.closeBtn} onPress={handleSkip}>
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>

        <View style={styles.avatarCircle}>
          <Image source={require('../../assets/lady_profile.png')} style={styles.avatar} resizeMode="cover" />
        </View>

        <Text style={styles.title}>Ride Completed</Text>
        <Text style={styles.subtitle}>Rate your experience with {riderName}</Text>

        <View style={styles.starsRow}>
          {[0, 1, 2, 3, 4].map((i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i + 1)} style={styles.starBtn}>
              <Ionicons name={i < rating ? 'star' : 'star-outline'} size={44} color="#FFCC00" />
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment (optional)"
          placeholderTextColor="#94A3B8"
          value={comment}
          onChangeText={setComment}
          multiline
        />

        <TouchableOpacity
          style={[styles.doneBtn, (rating === 0 || isSubmitting) && styles.doneBtnDisabled]}
          onPress={handleSubmit}
          disabled={rating === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.doneBtnText}>Submit Feedback</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  map: { ...StyleSheet.absoluteFillObject },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(38, 38, 38, 0.75)' },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 30,
    paddingBottom: Platform.OS === 'ios' ? 60 : 40,
    alignItems: 'center',
  },
  closeBtn: { position: 'absolute', top: 22, right: 22 },
  avatarCircle: { width: 96, height: 96, borderRadius: 48, overflow: 'hidden', marginBottom: 16, marginTop: 10 },
  avatar: { width: '100%', height: '100%' },
  title: { fontSize: 24, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginBottom: 25 },
  starsRow: { flexDirection: 'row', marginBottom: 20 },
  starBtn: { marginHorizontal: 5 },
  commentInput: {
    width: '100%',
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    textAlignVertical: 'top',
    fontFamily: 'Roboto_400Regular',
  },
  doneBtn: { backgroundColor: '#0056B3', width: '100%', height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  doneBtnDisabled: { backgroundColor: '#E2E8F0' },
  doneBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
});
