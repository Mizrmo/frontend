import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getHomeRouteForUser, useAuth } from '../../src/context/AuthContext';

export default function SuccessScreen() {
  const router = useRouter();
  const { user, activeRole } = useAuth();
  const isDriver = activeRole === 'DRIVER' || user?.role === 'DRIVER';
  const homeRoute = getHomeRouteForUser(user, activeRole);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark" size={48} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>Account Created!</Text>

        <Text style={styles.message}>
          {isDriver
            ? 'Welcome to Mizrmo! Your driver account is ready. Head to your dashboard to advertise rides.'
            : 'Welcome to Mizrmo! Your account has been successfully created. Start booking rides today.'}
        </Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            router.replace(isDriver ? homeRoute : '/(rider)/enable-location');
          }}
        >
          <Text style={styles.btnText}>{isDriver ? 'Go to Dashboard' : 'Get Started'}</Text>
        </TouchableOpacity>

        {user ? (
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.replace(homeRoute)}
          >
            <Text style={styles.secondaryBtnText}>Skip to Home</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', justifyContent: 'center' },
  content: { padding: 40, alignItems: 'center' },
  iconWrap: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: '#10B981',
    justifyContent: 'center', alignItems: 'center', marginBottom: 30,
    elevation: 10, shadowColor: '#10B981', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }
  },
  title: { fontSize: 28, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', marginBottom: 16, textAlign: 'center' },
  message: { fontSize: 16, color: '#64748B', textAlign: 'center', lineHeight: 24, marginBottom: 40, fontFamily: 'Roboto_400Regular' },
  btn: { backgroundColor: '#0056B3', width: '100%', height: 55, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 16, fontFamily: 'Roboto_400Regular', fontWeight: '600' },
  secondaryBtn: { marginTop: 16, paddingVertical: 12 },
  secondaryBtnText: { color: '#0056B3', fontSize: 15, fontFamily: 'Roboto_400Regular' },
});
