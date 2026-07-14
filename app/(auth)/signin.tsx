import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthFeedbackModal } from '../../components/AuthFeedbackModal';
import { login } from '../../src/api/auth';
import { getApiErrorMessage } from '../../src/api/errors';
import { useAuth } from '../../src/context/AuthContext';
import { resolvePostAuthRoute } from '../../src/utils/postAuthRoute';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({ visible: false, title: '', message: '' });

  const showLoginError = (title: string, message: string) => {
    setFeedback({ visible: true, title, message });
  };

  const handleSignIn = async () => {
    if (!formData.identifier.trim() || !formData.password) {
      showLoginError('Unable to log in', 'Please enter your email or phone number and password.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await login({
        emailOrPhone: formData.identifier.trim(),
        password: formData.password,
      });
      await signIn(
        { accessToken: data.accessToken, refreshToken: data.refreshToken },
        data.user
      );
      const route = await resolvePostAuthRoute(data.user);
      if (route === '/(rider)/home' || route === '/(driver)/home') {
        router.replace({
          pathname: route,
          params: { welcomeBack: '1' },
        });
      } else {
        router.replace(route);
      }
    } catch (error) {
      showLoginError('Unable to log in', getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Sign in with your email or phone number</Text>

        <View style={styles.form}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Email or Phone Number"
              value={formData.identifier}
              onChangeText={(t) => setFormData({ ...formData, identifier: t })}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#ABABAB"
            />
          </View>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(t) => setFormData({ ...formData, password: t })}
              placeholderTextColor="#ABABAB"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image source={require('../../assets/showpass.png')} style={styles.socialIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotRow} onPress={() => router.push('/(auth)/send-verification')}>
            <Text style={styles.forgotText}>Forget Password ?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSignIn} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Sign In</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

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

        <TouchableOpacity style={styles.signupFooter} onPress={() => router.push('/(auth)/register')}>
           <Text style={styles.footerText}>
             Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
           </Text>
        </TouchableOpacity>
      </ScrollView>

      <AuthFeedbackModal
        visible={feedback.visible}
        variant="error"
        title={feedback.title}
        message={feedback.message}
        onClose={() => setFeedback((prev) => ({ ...prev, visible: false }))}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  backText: { fontSize: 16, color: '#1A1A1A', marginLeft: 4, fontFamily: 'Roboto_400Regular' },
  title: { fontSize: 22, color: '#1A1A1A', marginBottom: 50, fontFamily: 'Montserrat_500Medium', lineHeight: 30 },
  form: { marginBottom: 20 },
  inputWrap: { height: 45, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 100, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 30 },
  input: { flex: 1, fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  forgotRow: { alignSelf: 'flex-end', marginTop: -15, marginBottom: 25 },
  forgotText: { fontSize: 14, color: '#E53E3E', fontFamily: 'Roboto_400Regular', fontWeight: '500' },
  submitBtn: { backgroundColor: '#0056B3', height: 45, borderRadius: 100, justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: 362, alignSelf: 'center' },
  submitBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Roboto_400Regular' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { marginHorizontal: 12, fontSize: 14, color: '#ABABAB', fontFamily: 'Roboto_400Regular' },
  socialGroup: { gap: 14, alignItems: 'center' },
  socialBtn: { width: '100%', maxWidth: 360, height: 45, borderRadius: 39, borderWidth: 1.5, borderColor: '#D0D0D0', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FFF' },
  socialBtnText: { fontSize: 16, color: '#1A1A1A', fontFamily: 'Montserrat_500Medium' },
  signupFooter: { marginTop: 25, alignItems: 'center' },
  footerText: { fontSize: 14, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  signupLink: { color: '#0056B3', fontFamily: 'Montserrat_600SemiBold' },
  socialIcon: { width: 22, height: 22 }
});
