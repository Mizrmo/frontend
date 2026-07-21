import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { resetPassword } from '../../src/api/auth';
import { getApiErrorMessage } from '../../src/api/errors';
import { isValidPassword } from '../../src/api/utils';

export default function SetNewPasswordScreen() {
  const router = useRouter();
  const { emailOrPhone, code } = useLocalSearchParams<{
    emailOrPhone?: string;
    code?: string;
  }>();
  const [formData, setFormData] = useState({ password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!emailOrPhone || !code) {
      Alert.alert('Error', 'Verification expired. Please request a new OTP.');
      router.replace('/(auth)/send-verification');
      return;
    }

    if (!formData.password || !formData.confirm) {
      Alert.alert('Error', 'Please fill in both password fields.');
      return;
    }

    if (formData.password !== formData.confirm) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (!isValidPassword(formData.password)) {
      Alert.alert(
        'Weak password',
        'Use at least 8 characters with uppercase, lowercase, a number, and a special character.'
      );
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({
        emailOrPhone: String(emailOrPhone),
        code: String(code),
        newPassword: formData.password,
      });

      Alert.alert('Success', 'Password reset successfully.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/signin') },
      ]);
    } catch (error) {
      Alert.alert('Reset failed', getApiErrorMessage(error));
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
        <Text style={styles.title}>Set New password</Text>
        <Text style={styles.subtitle}>Set your password</Text>

        <View style={styles.form}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Enter Your New Password"
              placeholderTextColor="#D0D0D0"
              secureTextEntry={!showPass}
              value={formData.password}
              onChangeText={(t) => setFormData({ ...formData, password: t })}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Image source={require('../../assets/showpass.png')} style={styles.showIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#D0D0D0"
              secureTextEntry={!showConfirm}
              value={formData.confirm}
              onChangeText={(t) => setFormData({ ...formData, confirm: t })}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Image source={require('../../assets/showpass.png')} style={styles.showIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSave} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Save</Text>}
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
  content: { padding: 24, paddingTop: 40, alignItems: 'center' },
  title: { fontSize: 22, color: '#1A1A1A', marginBottom: 6, fontFamily: 'Montserrat_500Medium', lineHeight: 30, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#B8B8B8', fontFamily: 'Roboto_400Regular', marginBottom: 24, textAlign: 'center' },
  form: { gap: 16, width: '100%', alignItems: 'center' },
  inputWrap: { height: 45, width: '100%', maxWidth: 362, backgroundColor: '#FFF', borderRadius: 42, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, fontSize: 14, color: '#000', fontFamily: 'Roboto_400Regular' },
  submitBtn: { backgroundColor: '#0056B3', height: 45, width: '100%', maxWidth: 362, borderRadius: 42, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Roboto_400Regular' },
  showIcon: { width: 22, height: 22, tintColor: '#94A3B8' },
});
