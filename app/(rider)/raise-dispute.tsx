import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  DISPUTE_TYPE_LABELS,
  raiseDispute,
  type DisputeType,
} from '../../src/api/disputes';
import { getApiErrorMessage } from '../../src/api/errors';

const DISPUTE_TYPES = Object.keys(DISPUTE_TYPE_LABELS) as DisputeType[];

export default function RaiseDisputeScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const [disputeType, setDisputeType] = useState<DisputeType>('OTHER');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!bookingId) {
      Alert.alert('Error', 'Booking reference is missing.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Required', 'Please describe what went wrong.');
      return;
    }

    setIsSubmitting(true);
    try {
      await raiseDispute({
        bookingId: String(bookingId),
        disputeType,
        description: description.trim(),
      });
      Alert.alert(
        'Dispute submitted',
        'Our team will review your report and follow up by email or in-app notification.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Could not submit dispute', getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report an issue</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>What happened?</Text>
        {DISPUTE_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeRow, disputeType === type && styles.typeRowActive]}
            onPress={() => setDisputeType(type)}
          >
            <Ionicons
              name={disputeType === type ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={disputeType === type ? '#0056B3' : '#94A3B8'}
            />
            <Text style={[styles.typeText, disputeType === type && styles.typeTextActive]}>
              {DISPUTE_TYPE_LABELS[type]}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={[styles.label, { marginTop: 20 }]}>Details</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe the issue (max 1000 characters)"
          placeholderTextColor="#94A3B8"
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={1000}
        />

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitText}>Submit dispute</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  content: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 13, fontFamily: 'Montserrat_600SemiBold', color: '#64748B', marginBottom: 12 },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  typeRowActive: { borderColor: '#0056B3', backgroundColor: '#F8FAFF' },
  typeText: { flex: 1, fontSize: 15, fontFamily: 'Roboto_400Regular', color: '#1A1A1A' },
  typeTextActive: { color: '#0056B3', fontFamily: 'Montserrat_500Medium' },
  textArea: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 140,
    padding: 16,
    fontSize: 15,
    fontFamily: 'Roboto_400Regular',
    color: '#1A1A1A',
    textAlignVertical: 'top',
  },
  submitBtn: {
    marginTop: 24,
    backgroundColor: '#0056B3',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: { color: '#FFF', fontFamily: 'Montserrat_600SemiBold', fontSize: 15 },
});
