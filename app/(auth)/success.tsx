import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark" size={48} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>Account Created!</Text>

        <Text style={styles.message}>
          Welcome to Mizrmo! Your account has been successfully created. Start booking rides today.
        </Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            // In a real app we'd check the user role here
            router.replace('/(rider)/enable-location');
          }}
        >
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
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
});
