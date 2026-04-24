import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DriverDetailsScreen() {
  const router = useRouter();

  const details = [
    { label: 'Vehicle', value: 'Toyota Corolla · GR-1234-22' },
    { label: 'Phone', value: '+233 20 000 0000' },
    { label: 'Trips completed', value: '531' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver Details</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarCircle}>
          <Ionicons name="person-outline" size={48} color="#94A3B8" />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.name}>Daniel Asante</Text>
          <Text style={styles.meta}>Professional Driver · 4.9 ★</Text>
        </View>

        {/* Details card */}
        <View style={styles.card}>
          {details.map((item, idx) => (
            <View key={item.label} style={[styles.row, idx === details.length - 1 && styles.noBorder]}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => router.push('/(rider)/driver-on-way')}
        >
          <Text style={styles.confirmBtnText}>Confirm Ride</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  content: { padding: 24, alignItems: 'center' },
  avatarCircle: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: '#F8FAFC',
    borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center',
    marginBottom: 20, marginTop: 20,
  },
  infoBox: { alignItems: 'center', marginBottom: 30 },
  name: { fontSize: 22, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', marginBottom: 4 },
  meta: { fontSize: 14, color: '#64748B', fontFamily: 'Roboto_400Regular' },
  card: {
    width: '100%', backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 20,
    borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 40,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  noBorder: { borderBottomWidth: 0 },
  label: { fontSize: 13, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  value: { fontSize: 14, color: '#1A1A1A', fontFamily: 'Montserrat_500Medium' },
  confirmBtn: { backgroundColor: '#0056B3', width: '100%', height: 55, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  confirmBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Roboto_400Regular', fontWeight: '600' },
});
