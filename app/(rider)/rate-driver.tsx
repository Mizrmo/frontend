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
import { getBookingById, getBookingDriverName } from '../../src/api/bookings';
import { getApiErrorMessage } from '../../src/api/errors';
import { getPendingReviews, skipReview, submitReview } from '../../src/api/reviews';

export default function RateDriverScreen() {
  const router = useRouter();
  const { bookingId: bookingIdParam } = useLocalSearchParams<{ bookingId?: string }>();
  const [bookingId, setBookingId] = useState<string | null>(bookingIdParam ? String(bookingIdParam) : null);
  const [driverName, setDriverName] = useState('Driver');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bootstrap = useCallback(async () => {
    setIsLoading(true);
    try {
      if (bookingIdParam) {
        const booking = await getBookingById(String(bookingIdParam));
        setBookingId(booking.id);
        setDriverName(getBookingDriverName(booking));
        return;
      }

      const pending = await getPendingReviews();
      const first = pending[0];
      if (first?.bookingId) {
        setBookingId(first.bookingId);
        if (first.driverName) {
          setDriverName(first.driverName);
        } else if (first.driver) {
          const name = [first.driver.firstName, first.driver.lastName].filter(Boolean).join(' ');
          setDriverName(name || 'Driver');
        }
      }
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [bookingIdParam]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const handleSkip = async () => {
    if (!bookingId) {
      router.replace('/(rider)/home');
      return;
    }
    try {
      await skipReview(bookingId);
    } catch {
      // Still leave the screen if skip fails (e.g. already reviewed).
    }
    router.replace('/(rider)/home');
  };

  const handleSubmit = async () => {
    if (!bookingId || rating === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview({
        bookingId,
        rating,
        comment: comment.trim() || undefined,
      });
      Alert.alert('Thank you', 'Your rating has been submitted.', [
        { text: 'OK', onPress: () => router.replace('/(rider)/home') },
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

  if (!bookingId) {
    return (
      <View style={[styles.container, styles.centered, styles.modal]}>
        <Text style={styles.title}>No pending reviews</Text>
        <TouchableOpacity style={styles.doneBtn} onPress={() => router.replace('/(rider)/home')}>
          <Text style={styles.doneBtnText}>Go Home</Text>
        </TouchableOpacity>
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
          <Ionicons name="close" size={24} color="#CBD5E1" />
        </TouchableOpacity>

        <View style={styles.avatarFrame}>
          <Image source={require('../../assets/lady_profile.png')} style={styles.avatar} />
        </View>

        <Text style={styles.title}>Rate Your Driver</Text>
        <Text style={styles.driverName}>{driverName}</Text>
        <Text style={styles.subtitle}>How was your ride experience?</Text>

        <View style={styles.starsRow}>
          {[0, 1, 2, 3, 4].map((i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i + 1)} style={styles.starBtn}>
              <Ionicons name={i < rating ? 'star' : 'star-outline'} size={44} color="#FFCC00" />
            </TouchableOpacity>
          ))}
        </View>

        {rating > 0 ? (
          <Text style={styles.ratingLabel}>
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][rating]}
          </Text>
        ) : null}

        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment (optional)"
          placeholderTextColor="#94A3B8"
          value={comment}
          onChangeText={setComment}
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          style={[styles.doneBtn, (rating === 0 || isSubmitting) && styles.doneBtnDisabled]}
          onPress={handleSubmit}
          disabled={rating === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.doneBtnText}>Submit Rating</Text>
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
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(30, 41, 59, 0.7)' },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 30,
    paddingBottom: Platform.OS === 'ios' ? 60 : 40,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  closeBtn: { position: 'absolute', top: 25, right: 25 },
  avatarFrame: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FFF',
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
    marginTop: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  avatar: { width: '100%', height: '100%' },
  title: { fontSize: 24, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', marginBottom: 4 },
  driverName: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#0056B3', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginBottom: 25 },
  starsRow: { flexDirection: 'row', marginBottom: 12 },
  starBtn: { marginHorizontal: 5 },
  ratingLabel: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#FFCC00', marginBottom: 15 },
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
    color: '#1A1A1A',
  },
  doneBtn: {
    backgroundColor: '#0056B3',
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#0056B3',
    shadowOpacity: 0.3,
  },
  doneBtnDisabled: { backgroundColor: '#E2E8F0', elevation: 0 },
  doneBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
});
