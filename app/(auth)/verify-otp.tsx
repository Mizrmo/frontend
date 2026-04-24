import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { verifyOtp, resendOtp as resendOtpApi } from '../../src/api/auth';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyClick = (val: string) => {
    const nextIndex = otp.findIndex(digit => digit === '');
    if (nextIndex !== -1) {
      const newOtp = [...otp];
      newOtp[nextIndex] = val;
      setOtp(newOtp);
    }
  };

  const handleDelete = () => {
    const lastIndex = [...otp].reverse().findIndex(digit => digit !== '');
    if (lastIndex !== -1) {
      const actualIndex = otp.length - 1 - lastIndex;
      const newOtp = [...otp];
      newOtp[actualIndex] = '';
      setOtp(newOtp);
    }
  };

  const handleVerify = async () => {
    if (otp.join('').length < 6) return;
    setIsLoading(true);
    // Simulation mode
    setTimeout(() => {
        setIsLoading(false);
        const userId = 'simulated-uuid-123-456';

        if (params.isPasswordReset === 'true') {
            router.push({
                pathname: '/(auth)/set-new-password',
                params: { ...params, code: otp.join(''), userId }
            });
        } else {
            router.push({
                pathname: '/(auth)/set-password',
                params: { ...params, userId }
            });
        }
    }, 800);
  };

  const handleResend = async () => {
    Alert.alert('Success', 'A new code has been sent to your phone (Simulated)');
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <View style={styles.backRow}>
          <Ionicons name="chevron-back" size={24} color="#000" />
          <Text style={styles.backText}>Back</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>Phone verification</Text>
        <Text style={styles.subtitle}>Enter your OTP code</Text>
        <View style={styles.otpRows}>
          {otp.map((digit, i) => (
            <View key={i} style={[styles.digitBox, digit && styles.digitBoxFilled]}>
              <Text style={styles.digitText}>{digit}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.resendSection}>
           <Text style={styles.resendText}>Didn't receive code? <Text style={styles.resendLink} onPress={handleResend}>Resend again</Text></Text>
        </View>

        <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.verifyBtnText}>Verify</Text>}
        </TouchableOpacity>
      </View>
      <View style={styles.keypad}>
        {keys.map((k) => (
          <TouchableOpacity key={k} style={styles.key} onPress={() => k === 'del' ? handleDelete() : handleKeyClick(k)}>
            {k === 'del' ? (
               <View style={styles.delKey}>
                 <Ionicons name="backspace-outline" size={24} />
               </View>
            ) : (
              <View style={styles.numericKey}>
                <Text style={styles.keyText}>{k}</Text>
                {k !== '.' && <Text style={styles.keySub}>{getSub(k)}</Text>}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function getSub(k: string) {
  const map: any = { '2': 'ABC', '3': 'DEF', '4': 'GHI', '5': 'JKL', '6': 'MNO', '7': 'PQRS', '8': 'TUV', '9': 'WXYZ' };
  return map[k] || '';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 60 },
  backButton: { paddingHorizontal: 20 },
  backRow: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 16, fontFamily: 'Roboto_400Regular', marginLeft: 4 },
  content: { paddingHorizontal: 16, alignItems: 'center' },
  title: { fontSize: 22, fontFamily: 'Montserrat_500Medium', color: '#000', marginTop: 60, marginBottom: 20 },
  subtitle: { fontSize: 16, color: '#A0A0A0', fontFamily: 'Roboto_400Regular', marginBottom: 40 },
  otpRows: { flexDirection: 'row', gap: 12, marginBottom: 40 },
  digitBox: { width: 45, height: 45, borderRadius: 22.5, borderWidth: 1, borderColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
  digitBoxFilled: { borderColor: '#0056B3', borderWidth: 2 },
  digitText: { fontSize: 22, fontFamily: 'Montserrat_600SemiBold' },
  resendSection: { marginBottom: 40 },
  resendText: { fontSize: 14, fontFamily: 'Roboto_400Regular', color: '#414141' },
  resendLink: { fontWeight: '400' },
  verifyBtn: { backgroundColor: '#0056B3', width: '100%', maxWidth: 362, height: 45, borderRadius: 100, justifyContent: 'center', alignItems: 'center' },
  verifyBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Roboto_400Regular' },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', padding: 6, marginTop: 'auto', backgroundColor: '#D1D5DB' },
  key: { width: '33.33%', height: 46, padding: 3 },
  numericKey: { flex: 1, backgroundColor: '#FFF', borderRadius: 5, justifyContent: 'center', alignItems: 'center', elevation: 1, shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 1 } },
  delKey: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  keyText: { fontSize: 24, fontFamily: 'Montserrat_400Regular' },
  keySub: { fontSize: 10, fontFamily: 'Montserrat_600SemiBold', marginTop: -4 }
});
