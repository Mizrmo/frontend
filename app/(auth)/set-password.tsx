import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { setPassword } from '../../src/api/auth';

export default function SetPasswordScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [formData, setFormData] = useState({ password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingRole, setLoadingRole] = useState<'RIDER' | 'DRIVER' | null>(null);

  const handleAction = async (role: 'RIDER' | 'DRIVER') => {
    setLoadingRole(role);
    // Simulation mode
    setTimeout(() => {
        setLoadingRole(null);
        router.push(role === 'DRIVER' ? '/(auth)/vehicle-details' : '/(auth)/success');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>Set password</Text>
        <Text style={styles.subtitle}>Create a strong password for your account</Text>
        <View style={styles.inputGroup}>
          <View style={styles.passwordWrap}>
            <TextInput 
              style={styles.input} 
              placeholder="Enter Password" 
              secureTextEntry={!showPass} 
              value={formData.password} 
              onChangeText={(t) => setFormData({...formData, password: t})} 
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}>
              <Image source={require('../../assets/showpass.png')} style={styles.eyeIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordWrap}>
            <TextInput 
              style={styles.input} 
              placeholder="Confirm Password" 
              secureTextEntry={!showConfirm} 
              value={formData.confirm} 
              onChangeText={(t) => setFormData({...formData, confirm: t})} 
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm(!showConfirm)}>
              <Image source={require('../../assets/showpass.png')} style={styles.eyeIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => handleAction('RIDER')} disabled={!!loadingRole}>
          {loadingRole === 'RIDER' ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Continue As Rider</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => handleAction('DRIVER')} disabled={!!loadingRole}>
          {loadingRole === 'DRIVER' ? <ActivityIndicator color="#000" /> : <Text style={styles.secondaryBtnText}>Continue As Driver</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 60 },
  backButton: { paddingHorizontal: 16 },
  content: { paddingHorizontal: 16, alignItems: 'center', marginTop: 70 },
  title: { fontSize: 22, fontFamily: 'Montserrat_500Medium', color: '#000', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#B8B8B8', fontFamily: 'Roboto_400Regular', marginBottom: 24, textAlign: 'center' },
  inputGroup: { gap: 16, marginBottom: 24, width: '100%', alignItems: 'center' },
  passwordWrap: { position: 'relative', width: 362, justifyContent: 'center' },
  input: { height: 45, width: '100%', backgroundColor: '#FFF', borderRadius: 42, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 20, fontSize: 14, fontFamily: 'Roboto_400Regular' },
  eyeBtn: { position: 'absolute', right: 20, height: '100%', justifyContent: 'center' },
  eyeIcon: { width: 20, height: 20, tintColor: '#94A3B8' },
  primaryBtn: { backgroundColor: '#0056B3', height: 45, width: 362, borderRadius: 42, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  btnText: { color: '#FFF', fontFamily: 'Roboto_400Regular', fontSize: 16 },
  secondaryBtn: { borderWidth: 1, borderColor: '#000000', height: 45, width: 362, borderRadius: 42, justifyContent: 'center', alignItems: 'center' },
  secondaryBtnText: { color: '#1A1A1B', fontFamily: 'Roboto_400Regular', fontSize: 16 }
});
