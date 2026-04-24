import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Saved Methods</Text>

        {/* Visa Card */}
        <TouchableOpacity style={[styles.paymentCard, styles.visaCard]}>
          <View style={styles.cardGlass} />
          <View style={styles.cardTop}>
            <Image source={require('../../assets/visa-logo.png')} style={styles.cardLogo} resizeMode="contain" />
            <View style={styles.chip} />
          </View>
          <Text style={styles.cardNumber}>•••• •••• •••• 8970</Text>
          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.cardLabel}>Card Holder</Text>
              <Text style={styles.cardValue}>Jane Doe</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.cardLabel}>Expires</Text>
              <Text style={styles.cardValue}>12/26</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* MTN Momo Card */}
        <TouchableOpacity style={[styles.paymentCard, styles.mtnCard]}>
          <View style={styles.cardGlass} />
          <View style={styles.cardTop}>
            <Image source={require('../../assets/mtn-logo-img.png')} style={styles.cardLogoMtn} resizeMode="contain" />
            <Text style={styles.momoText}>Mobile Money</Text>
          </View>
          <Text style={styles.cardNumber}>••• ••• ••• 1234</Text>
          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.cardLabel}>Name</Text>
              <Text style={styles.cardValue}>Jane Doe</Text>
            </View>
            <View style={styles.statusRow}>
              <View style={styles.activeDot} />
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Other Methods</Text>

        {[
          { id: 'bank', name: 'Bank Transfer', sub: 'Direct from your account', icon: 'business-outline' },
          { id: 'cash', name: 'Cash', sub: 'Pay when you arrive', icon: 'cash-outline' },
        ].map(method => (
          <TouchableOpacity key={method.id} style={styles.methodItem}>
            <View style={styles.methodIconBox}>
              <Ionicons name={method.icon as any} size={24} color="#0056B3" />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>{method.name}</Text>
              <Text style={styles.methodSub}>{method.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>Add Payment Method</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 16, color: '#1A1A1A', marginLeft: 4, fontFamily: 'Roboto_400Regular' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A', marginBottom: 16 },
  paymentCard: {
    height: 180, borderRadius: 24, padding: 24, marginBottom: 16, overflow: 'hidden',
    justifyContent: 'space-between', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }
  },
  cardGlass: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.05)' },
  visaCard: { backgroundColor: '#1E293B' },
  mtnCard: { backgroundColor: '#FACC15' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLogo: { width: 50, height: 16 },
  cardLogoMtn: { width: 34, height: 34 },
  chip: { width: 36, height: 26, backgroundColor: '#FFD700', borderRadius: 6, opacity: 0.8 },
  momoText: { fontSize: 12, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  cardNumber: { fontSize: 18, fontFamily: 'Montserrat_500Medium', color: '#FFF', letterSpacing: 2 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 2 },
  cardValue: { fontSize: 13, color: '#FFF', fontFamily: 'Montserrat_500Medium' },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 6 },
  statusText: { fontSize: 12, color: '#1A1A1A', fontFamily: 'Montserrat_500Medium' },
  methodItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    padding: 16, borderRadius: 16, marginBottom: 10,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }
  },
  methodIconBox: { width: 44, height: 44, backgroundColor: '#EEF4FF', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  methodInfo: { flex: 1, marginLeft: 14 },
  methodName: { fontSize: 15, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  methodSub: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  addBtn: {
    backgroundColor: '#0056B3', height: 55, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', marginTop: 30,
  },
  addBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Roboto_400Regular', fontWeight: '600' },
});
