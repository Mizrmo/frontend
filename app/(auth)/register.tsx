import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert, Image, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '../../components/DateTimePicker';
import { initiateRegistration } from '../../src/api/auth';
import { getApiErrorMessage } from '../../src/api/errors';
import { clearAuthSession } from '../../src/api/tokens';
import { formatGhanaPhoneNumber, splitFullName } from '../../src/api/utils';

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    referralCode: '',
    dob: new Date(),
  });
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setFormData({ ...formData, dob: selectedDate });
    }
  };

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleSignUp = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      Alert.alert('Required', 'Please fill in your name and phone number.');
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert('Required', 'Please enter your email address.');
      return;
    }
    if (!agreed) {
      Alert.alert('Terms', 'Please agree to the Terms of service and Privacy policy.');
      return;
    }

    const { firstName, lastName } = splitFullName(formData.name);
    const phoneNumber = formatGhanaPhoneNumber(formData.phone);

    setIsLoading(true);
    try {
      await clearAuthSession();
      await initiateRegistration({
        firstName,
        lastName,
        email: formData.email.trim(),
        phoneNumber,
        roleIntent: 'RIDER',
      });

      router.push({
        pathname: '/(auth)/verify-otp',
        params: {
          phone: phoneNumber,
          email: formData.email.trim(),
          name: formData.name.trim(),
          referralCode: formData.referralCode.trim(),
          dob: formData.dob.toISOString(),
        },
      });
    } catch (error) {
      Alert.alert('Registration failed', getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Sign up with your email and{'\n'}phone number</Text>

        {/* Inputs */}
        <View style={styles.inputGroup}>
          <View style={styles.inputPill}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#C0C0C0"
              value={formData.name}
              onChangeText={(t) => setFormData({ ...formData, name: t })}
            />
          </View>

          <View style={styles.inputPill}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#C0C0C0"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(t) => setFormData({ ...formData, email: t })}
            />
          </View>

          {/* Date of Birth */}
          <View style={styles.inputGroupContainer}>
            <Text style={styles.dobLabel}>Date Of Birth<Text style={styles.required}>*</Text></Text>
            <TouchableOpacity 
              style={styles.inputPill} 
              onPress={() => setShowPicker(true)}
            >
              <Text style={[styles.input, { lineHeight: 42 }, !formData.dob && { color: '#C0C0C0' }]}>
                {formatDate(formData.dob)}
              </Text>
              <Ionicons name="calendar-outline" size={18} color="#C0C0C0" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputPill}>
            <TextInput
              style={styles.input}
              placeholder="Referral code (optional)"
              placeholderTextColor="#C0C0C0"
              autoCapitalize="characters"
              value={formData.referralCode}
              onChangeText={(t) => setFormData({ ...formData, referralCode: t })}
            />
          </View>

          {/* Phone with flag */}
          <View style={styles.inputPill}>
            <TouchableOpacity style={styles.flagRow}>
              <Text style={styles.flagEmoji}>🇬🇭</Text>
              <Ionicons name="chevron-down" size={14} color="#888" />
              <Text style={styles.countryCode}>+233</Text>
              <View style={styles.phoneDivider} />
            </TouchableOpacity>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Your mobile number"
              placeholderTextColor="#C0C0C0"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(t) => setFormData({ ...formData, phone: t })}
            />
          </View>
        </View>

        {showPicker && (
          <DateTimePicker
            value={formData.dob}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
          />
        )}

        {/* Terms */}
        <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(!agreed)}>
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Ionicons name="checkmark" size={14} color="#FFF" />}
          </View>
          <Text style={styles.termsText}>
            By signing up, you agree to the{' '}
            <Text style={styles.termsLink}>Terms of service</Text>
            {' '}and{'\n'}
            <Text style={styles.termsLink}>Privacy policy</Text>.
          </Text>
        </TouchableOpacity>

        {/* Create Account Button */}
        <TouchableOpacity style={styles.primaryBtn} onPress={handleSignUp} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryBtnText}>Create An Account</Text>}
        </TouchableOpacity>

        {/* OR Divider */}
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.orLine} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialGroup}>
          <TouchableOpacity style={styles.socialBtn}>
            <Image source={require('../../assets/gmail.png')} style={styles.socialIcon} resizeMode="contain" />
            <Text style={styles.socialBtnText}>Sign up with Gmail</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn}>
            <Ionicons name="logo-apple" size={22} color="#000" />
            <Text style={styles.socialBtnText}>Sign up with Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Link */}
        <TouchableOpacity style={styles.signinRow} onPress={() => router.push('/(auth)/signin')}>
          <Text style={styles.signinText}>
            Already have an account?{' '}
            <Text style={styles.signinLink}>Sign in</Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },

  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  backText: { fontSize: 16, color: '#414141', marginLeft: 8, fontFamily: 'Roboto_400Regular' },

  title: { fontSize: 24, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A', lineHeight: 32, marginBottom: 30 },

  inputGroup: { gap: 12, marginBottom: 20 },
  inputPill: {
    flexDirection: 'row', alignItems: 'center',
    height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#DDD',
    paddingHorizontal: 20, backgroundColor: '#FFF'
  },
  inputGroupContainer: { marginBottom: 5 },
  input: { flex: 1, fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },

  flagRow: { flexDirection: 'row', alignItems: 'center' },
  flagEmoji: { fontSize: 18 },
  countryCode: { fontSize: 15, color: '#262626', marginLeft: 4, fontFamily: 'Montserrat_500Medium' },
  phoneDivider: { width: 1, height: 20, backgroundColor: '#DDD', marginLeft: 12, marginRight: 12 },

  termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 15, paddingRight: 15 },
  checkbox: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: '#1A1A1A',
    justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 1, flexShrink: 0
  },
  checkboxChecked: { backgroundColor: '#0056B3', borderColor: '#0056B3' },
  termsText: { flex: 1, fontSize: 13, color: '#B8B8B8', lineHeight: 18, fontFamily: 'Roboto_400Regular' },
  termsLink: { color: '#414141', fontWeight: 'bold' },

  primaryBtn: {
    backgroundColor: '#0056B3', height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginTop: 10, width: '100%'
  },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_500Medium' },

  orRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  orLine: { flex: 1, height: 1, backgroundColor: '#DDD' },
  orText: { marginHorizontal: 16, fontSize: 14, color: '#A0A0A0', fontFamily: 'Roboto_400Regular' },

  dobLabel: { fontSize: 13, color: '#414141', marginBottom: 8, marginLeft: 5, fontFamily: 'Montserrat_500Medium' },
  required: { color: '#EF4444' },

  socialGroup: { gap: 12 },
  socialBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#DDD',
    gap: 10, backgroundColor: '#FFF'
  },
  socialBtnText: { fontSize: 15, color: '#1A1A1A', fontFamily: 'Montserrat_500Medium' },

  signinRow: { alignItems: 'center', marginTop: 25 },
  signinText: { fontSize: 14, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  signinLink: { fontWeight: 'bold', color: '#0056B3' },
  socialIcon: { width: 20, height: 20 }
});
