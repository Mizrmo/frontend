import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Modal, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const rides = [
  { id: 1, driver: 'Daniel Asante', price: 'GH¢22', car: 'Toyota Vitz', seats: '3 seats', location: 'Community one', time: '5mins away' },
  { id: 2, driver: 'Joseph Mensah', price: 'GH¢18', car: 'Honda Civic', seats: '4 seats', location: 'Community two', time: '8mins away' },
  { id: 3, driver: 'Bernard Ofori', price: 'GH¢25', car: 'Toyota Corolla', seats: '4 seats', location: 'Community one', time: '3mins away' },
  { id: 4, driver: 'Victoria Ama', price: 'GH¢20', car: 'Hyundai Tucson', seats: '5 seats', location: 'Community four', time: '10mins away' },
  { id: 5, driver: 'Adjoa Asiedu', price: 'GH¢15', car: 'Kia Picanto', seats: '4 seats', location: 'Community one', time: '6mins away' },
];

export default function AvailableRideListScreen() {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handlePay = () => {
    setPaymentOpen(false);
    setConfirmOpen(false);
    setSuccessOpen(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Available rides</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.subtitle}>18 cars found for your route</Text>
      </View>

      {/* Ride List */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {rides.map(ride => (
          <TouchableOpacity key={ride.id} style={styles.rideCard} onPress={() => setConfirmOpen(true)}>
            <View style={styles.rideIcon}>
              <MaterialCommunityIcons name="routes" size={26} color="#0056B3" />
            </View>
            <View style={styles.rideInfo}>
              <View style={styles.rideHeader}>
                <Text style={styles.driverName}>{ride.driver}</Text>
                <Text style={styles.price}>{ride.price}</Text>
              </View>
              <Text style={styles.rideSpecs}>{ride.car} · {ride.seats} · {ride.location}</Text>
              <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={13} color="#94A3B8" />
                <Text style={styles.timeText}>{ride.time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* CONFIRM RIDE BOTTOM SHEET */}
      <Modal visible={confirmOpen} transparent animationType="slide">
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setConfirmOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Confirm Your Ride</Text>

          {/* Route Display */}
          <View style={styles.routeBlock}>
            <View style={styles.routeRow}>
              <View style={[styles.markerDot, { backgroundColor: '#0056B3' }]} />
              <View>
                <Text style={styles.routeLabel}>Pick up</Text>
                <Text style={styles.routeName}>Ashaiman, main station</Text>
              </View>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routeRow}>
              <Ionicons name="location" size={20} color="#FFCC00" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.routeLabel}>Drop off</Text>
                <Text style={styles.routeName}>Community One, Tema</Text>
              </View>
              <Text style={styles.distance}>2.2km</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Driver Section */}
          <View style={styles.driverCard}>
            <Image source={require('../../assets/Ellipse 1192.png')} style={styles.avatar} />
            <View style={styles.driverInfoText}>
              <Text style={styles.driverNameBig}>Daniel Asante</Text>
              <Text style={styles.driverMeta}>Toyota Vitz · 3 Seats · 4.8 ★</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Fare Summary */}
          <View style={styles.fareRow}>
            <View>
              <Text style={styles.fareLabel}>Total Fare</Text>
              <Text style={styles.fareSub}>Estimated cost for this trip</Text>
            </View>
            <Text style={styles.fareAmount}>GH¢22.00</Text>
          </View>

          <TouchableOpacity style={styles.confirmBtn} onPress={() => { setConfirmOpen(false); setPaymentOpen(true); }}>
            <Text style={styles.confirmBtnText}>Confirm Booking</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* PAYMENT METHOD MODAL */}
      <Modal visible={paymentOpen} transparent animationType="slide">
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setPaymentOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Payment Method</Text>
          <View style={styles.fareSummarySmall}>
             <Text style={styles.fareLabelSmall}>Total Amount</Text>
             <Text style={styles.fareAmountSmall}>GH¢22.00</Text>
          </View>

          {/* Visa Card */}
          <TouchableOpacity style={styles.visaCard} onPress={handlePay}>
            <View style={styles.cardTop}>
              <Image source={require('../../assets/visa-logo.png')} style={styles.cardLogo} resizeMode="contain" />
              <Text style={styles.cardNumber}>•••• •••• •••• 8970</Text>
            </View>
            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.cardLabel}>Card Holder</Text>
                <Text style={styles.cardVal}>DANIEL ASANTE</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.cardLabel}>Expires</Text>
                <Text style={styles.cardVal}>12/26</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Mobile Money */}
          <TouchableOpacity style={styles.mtnCard} onPress={handlePay}>
            <View style={styles.cardTop}>
              <Image source={require('../../assets/mtn-logo-img.png')} style={styles.cardLogoMtn} resizeMode="contain" />
              <View style={styles.activePill}><View style={styles.activeDot} /><Text style={styles.activeText}>Active</Text></View>
            </View>
            <Text style={styles.momoNumber}>024 ••• ••• 4567</Text>
            <View style={styles.cardBottom}>
               <Text style={styles.cardLabel}>Network  <Text style={styles.cardVal}>MTN MOMO</Text></Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal visible={successOpen} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successDialog}>
            <View style={styles.successIconBg}>
                <Ionicons name="checkmark" size={40} color="#FFF" />
            </View>
            <Text style={styles.successTitle}>Booking Confirmed!</Text>
            <Text style={styles.successSubText}>Your payment has been processed. Your driver is on the way.</Text>
            
            <TouchableOpacity 
                style={styles.doneBtn} 
                onPress={() => { setSuccessOpen(false); router.replace('/(rider)/home'); }}
            >
              <Text style={styles.doneBtnText}>Track My Ride</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 16, paddingBottom: 15,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  titleRow: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#FFF' },
  subtitle: { fontSize: 13, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  list: { padding: 16, paddingBottom: 40 },
  rideCard: { 
    flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, padding: 16, 
    marginBottom: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, 
    shadowOffset: { width: 0, height: 2 }, borderWidth: 1, borderColor: '#F1F5F9' 
  },
  rideIcon: { width: 48, height: 48, backgroundColor: '#EEF6FF', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  rideInfo: { flex: 1, marginLeft: 15 },
  rideHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  driverName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 15, color: '#1A1A1A' },
  price: { fontFamily: 'Montserrat_700Bold', color: '#0056B3', fontSize: 16 },
  rideSpecs: { fontSize: 12, color: '#64748B', marginBottom: 8, fontFamily: 'Roboto_400Regular' },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 12, color: '#94A3B8', marginLeft: 4, fontFamily: 'Roboto_400Regular' },
  
  backdrop: { flex: 1, backgroundColor: 'rgba(30, 41, 59, 0.6)' },
  sheet: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: Platform.OS === 'ios' ? 50 : 30 },
  handle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 20, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', textAlign: 'center', marginBottom: 25 },
  routeBlock: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 20 },
  routeRow: { flexDirection: 'row', alignItems: 'center' },
  markerDot: { width: 10, height: 10, borderRadius: 5, marginRight: 15 },
  routeLabel: { fontSize: 11, color: '#94A3B8', fontFamily: 'Montserrat_700Bold', letterSpacing: 0.5 },
  routeName: { fontSize: 14, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', marginTop: 2 },
  routeLine: { width: 1, height: 20, backgroundColor: '#E2E8F0', marginLeft: 4.5, marginVertical: 4 },
  distance: { fontSize: 13, color: '#0056B3', fontFamily: 'Montserrat_600SemiBold' },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 20 },
  driverCard: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  avatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: '#F1F5F9' },
  driverInfoText: { flex: 1 },
  driverNameBig: { fontSize: 16, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  driverMeta: { fontSize: 13, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fareLabel: { fontSize: 14, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  fareSub: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  fareAmount: { fontSize: 24, fontFamily: 'Montserrat_700Bold', color: '#0056B3' },
  
  confirmBtn: { backgroundColor: '#0056B3', height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 30, elevation: 4, shadowColor: '#0056B3', shadowOpacity: 0.3 },
  confirmBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
  
  fareSummarySmall: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, backgroundColor: '#F8FAFC', padding: 15, borderRadius: 16 },
  fareLabelSmall: { fontSize: 14, color: '#64748B', fontFamily: 'Roboto_400Regular' },
  fareAmountSmall: { fontSize: 16, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  
  visaCard: { backgroundColor: '#1A3C6E', borderRadius: 20, padding: 20, marginBottom: 15, elevation: 4 },
  mtnCard: { backgroundColor: '#FFCC00', borderRadius: 20, padding: 20, elevation: 4 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardLogo: { width: 50, height: 16 },
  cardLogoMtn: { width: 45, height: 35 },
  cardNumber: { color: '#FFF', fontSize: 15, fontFamily: 'Roboto_400Regular', letterSpacing: 2 },
  momoNumber: { color: '#1A1A1A', fontSize: 16, fontFamily: 'Montserrat_700Bold', letterSpacing: 1, marginBottom: 15 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontFamily: 'Montserrat_700Bold', letterSpacing: 0.5, marginBottom: 2 },
  cardVal: { color: '#FFF', fontSize: 13, fontFamily: 'Montserrat_600SemiBold' },
  activePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  activeDot: { width: 6, height: 6, backgroundColor: '#22C55E', borderRadius: 3 },
  activeText: { fontSize: 11, color: '#1A1A1A', fontFamily: 'Montserrat_700Bold' },
  
  successOverlay: { flex: 1, backgroundColor: 'rgba(30, 41, 59, 0.7)', justifyContent: 'center', padding: 25 },
  successDialog: { backgroundColor: '#FFF', borderRadius: 32, padding: 40, alignItems: 'center' },
  successIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  successTitle: { fontSize: 22, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', marginBottom: 12 },
  successSubText: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22, marginBottom: 35, fontFamily: 'Roboto_400Regular' },
  doneBtn: { backgroundColor: '#0056B3', width: '100%', height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  doneBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' }
});
