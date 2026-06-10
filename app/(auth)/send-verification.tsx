import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { forgotPassword } from '../../src/api/auth';
import { getApiErrorMessage } from '../../src/api/errors';

export default function SendVerificationScreen() {
  const router = useRouter();
  const [contact, setContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!contact.trim()) {
      Alert.alert('Error', 'Please enter your email or phone number.');
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword({ emailOrPhone: contact.trim() });
      router.push({
        pathname: '/(auth)/verify-otp',
        params: {
          identifier: contact.trim(),
          isPasswordReset: 'true',
        },
      });
    } catch (error) {
      Alert.alert('Request failed', getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <View style={styles.backRow}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          <Text style={styles.backText}>Back</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Verify email or phone number</Text>

        <View style={styles.form}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Enter Email or Phone Number"
              placeholderTextColor="#ABABAB"
              value={contact}
              onChangeText={setContact}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSendOTP} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Send OTP</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 60 },
  backButton: { paddingHorizontal: 16 },
  backRow: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 16, color: '#1A1A1A', marginLeft: 4, fontFamily: 'Roboto_400Regular' },
  content: { padding: 24, paddingTop: 40 },
  title: { fontSize: 22, color: '#1A1A1A', marginBottom: 50, fontFamily: 'Montserrat_500Medium', lineHeight: 30 },
  form: { gap: 40 },
  inputWrap: { height: 45, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 100, paddingHorizontal: 20, justifyContent: 'center' },
  input: { fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  submitBtn: { backgroundColor: '#0056B3', height: 45, borderRadius: 100, justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: 362, alignSelf: 'center' },
  submitBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Roboto_400Regular' },
});
