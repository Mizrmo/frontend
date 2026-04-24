import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  Dimensions, Modal, Image, Platform, ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { storage } from '../../src/api/storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function DriverDashboardScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const menuItems = [
    { id: '1', title: 'Earnings', icon: 'cash-outline', route: '/(driver)/earnings-detail' },
    { id: '2', title: 'Miz Miles', icon: 'pricetag-outline', route: '/(driver)/mizmiles-rewards' },
    { id: '3', title: 'Trips', icon: 'car-sport-outline', route: '/(driver)/trips' },
    { id: '4', title: 'Referral', icon: 'people-outline', route: '/(profile)/edit-profile' },
    { id: '5', title: 'Payment', icon: 'wallet-outline', route: '/(profile)/payment' },
    { id: '6', title: 'Support', icon: 'headset-outline', route: '/(profile)/help-support' },
    { id: '7', title: 'About Us', icon: 'information-circle-outline', route: '/(profile)/settings' },
  ];

  const navigateTo = (route: string) => {
    setMenuVisible(false);
    router.push(route as any);
  };

  const handleLogout = () => {
    setMenuVisible(false);
    setLoadingText('Logging out...');
    setLoading(true);
    setTimeout(async () => {
        await storage.removeItem('token');
        router.replace('/(auth)/signin');
    }, 1500);
  };

  const handleSwitchProfile = () => {
    setMenuVisible(false);
    setLoadingText('Switching roles...');
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        setShowSuccessModal(true);
        setTimeout(() => {
            setShowSuccessModal(false);
            router.replace('/(rider)/home');
        }, 2000);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Side Menu Modal */}
      <Modal visible={menuVisible} transparent animationType="none">
        <View style={styles.menuOverlay}>
            <TouchableOpacity 
                style={styles.menuBackdrop} 
                activeOpacity={1} 
                onPress={() => setMenuVisible(false)} 
            />
            <View style={styles.menuPanel}>
                <View style={styles.menuHeader}>
                    <TouchableOpacity onPress={() => setMenuVisible(false)}>
                        <Ionicons name="close" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Image source={require('../../assets/lady_profile.png')} style={styles.avatar} />
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>Daniel Asante</Text>
                        <TouchableOpacity onPress={() => navigateTo('/(profile)/edit-profile')}>
                            <Text style={styles.profileLink}>Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Switch Profile pill */}
                <TouchableOpacity style={styles.switchPill} onPress={() => handleSwitchProfile()}>
                    <View style={styles.yellowCircle}>
                        <Ionicons name="chevron-down" size={14} color="#FFF" />
                    </View>
                    <Text style={styles.switchText}>Switch to Rider</Text>
                </TouchableOpacity>

                <View style={styles.menuDivider} />

                {/* Nav Links */}
                <ScrollView style={styles.menuLinks} showsVerticalScrollIndicator={false}>
                    {menuItems.map(item => (
                        <TouchableOpacity 
                            key={item.id} 
                            style={styles.menuItem} 
                            onPress={() => navigateTo(item.route)}
                        >
                            <Ionicons name={item.icon as any} size={22} color="#1A1A1A" />
                            <Text style={styles.menuItemText}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      {/* Global Loading Overlay */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#0056B3" />
            <Text style={styles.loadingText}>{loadingText}</Text>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.successBox}>
            <View style={styles.successIconBg}>
                <Ionicons name="checkmark" size={40} color="#FFF" />
            </View>
            <Text style={styles.successTitle}>Role Switched!</Text>
            <Text style={styles.successSub}>You are now in Rider mode.</Text>
          </View>
        </View>
      </Modal>

      {/* Header Area */}
      <View style={styles.header}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setMenuVisible(true)}>
            <Ionicons name="menu" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(driver)/notifications')}>
            <Ionicons name="notifications-outline" size={24} color="#1A1A1A" />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeRow}>
            <View>
                <Text style={styles.greeting}>Hello, Daniel 👋</Text>
                <Text style={styles.subGreeting}>Ready for today's rides?</Text>
            </View>
            <TouchableOpacity style={styles.onlineBadge}>
                <View style={styles.pulse} />
                <Text style={styles.onlineText}>Online</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={() => router.push('/(driver)/earnings-detail')}
          >
            <LinearGradient
              colors={['#0052B4', '#003E88']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.earningsCard}
            >
              <View style={styles.cardTop}>
                  <View>
                      <Text style={styles.earningsLabel}>Total Earnings</Text>
                      <Text style={styles.earningsValue}>GH¢1,000.00</Text>
                  </View>
                  <View style={styles.walletIconBg}>
                      <MaterialCommunityIcons name="wallet-outline" size={28} color="#FFF" />
                  </View>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.cardBottom}>
                  <Text style={styles.cardBottomText}>+12.5% from last week</Text>
                  <TouchableOpacity onPress={() => router.push('/(driver)/earnings-detail')}>
                    <Text style={styles.withdrawLink}>Withdraw Cash</Text>
                  </TouchableOpacity>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Secondary Stats */}
          <View style={styles.smallStatsRow}>
            <View style={[styles.smallStatsCard, { backgroundColor: '#0056B3' }]}>
              <View style={[styles.statIconBg, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                 <Ionicons name="car-outline" size={20} color="#FFF" />
              </View>
              <Text style={[styles.statsLabelSmall, { color: 'rgba(255,255,255,0.8)' }]}>Rides Today</Text>
              <Text style={[styles.statsValueSmall, { color: '#FFF' }]}>34</Text>
            </View>
            <View style={[styles.smallStatsCard, { backgroundColor: '#FFCC00' }]}>
              <View style={[styles.statIconBg, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                 <Ionicons name="star-outline" size={20} color="#1A1A1A" />
              </View>
              <Text style={[styles.statsLabelSmall, { color: 'rgba(0,0,0,0.6)' }]}>Miz Miles</Text>
              <Text style={[styles.statsValueSmall, { color: '#1A1A1A' }]}>1.2k <Text style={{ fontSize: 13 }}>pts</Text></Text>
            </View>
          </View>

          {/* Active Ride Card */}
          <View style={styles.sectionHeaderLine}>
            <Text style={styles.sectionTitle}>Active Ride</Text>
            <TouchableOpacity style={styles.liveTracking}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Live Tracking</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activeRideCard}>
            <View style={styles.activeRideBody}>
              <Image source={require('../../assets/lady_profile.png')} style={styles.riderAvatar} />
              <View style={styles.riderInfo}>
                 <View style={styles.riderHeader}>
                    <Text style={styles.riderName}>Jane Asantewa</Text>
                    <Text style={styles.rideTime}>10:10 AM</Text>
                 </View>
                 <Text style={styles.rideRoute}>Ashaiman Main → Tema Comm. 1</Text>
                 <Text style={styles.pickupTime}>Pickup in: <Text style={{ color: '#0056B3', fontFamily: 'Montserrat_700Bold' }}>12 mins</Text></Text>
              </View>
              <TouchableOpacity style={styles.chatIconBtn} onPress={() => router.push('/(driver)/chat')}>
                  <MaterialCommunityIcons name="chat-processing" size={24} color="#0056B3" />
                  <View style={styles.chatBadge} />
              </TouchableOpacity>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" style={{ marginLeft: 5 }} />
            </View>
          </View>

          {/* Upcoming Schedule */}
          <View style={styles.sectionHeaderLine}>
            <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
            <TouchableOpacity onPress={() => router.push('/(driver)/trips')}>
                <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.upcomingCard}>
            <View style={styles.upcomingTop}>
               <View style={styles.typeTag}>
                  <Ionicons name="swap-horizontal" size={14} color="#0056B3" />
                  <Text style={styles.typeTagText}>Inter-City</Text>
               </View>
               <Text style={styles.upcomingPrice}>GH¢ 22.00</Text>
            </View>
            
            <View style={styles.routeDisplay}>
              <View style={styles.routeLineContainer}>
                <View style={[styles.routeDot, { backgroundColor: '#0056B3' }]} />
                <View style={styles.routeDashedLine} />
                <View style={[styles.routeDot, { backgroundColor: '#FFCC00' }]} />
              </View>
              <View style={styles.routeTexts}>
                <Text style={styles.routePoint} numberOfLines={1}>Ashaiman, main station</Text>
                <Text style={[styles.routePoint, { marginTop: 18 }]} numberOfLines={1}>Community One, Tema</Text>
              </View>
            </View>

            <View style={styles.upcomingFooter}>
              <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="#94A3B8" />
                  <Text style={styles.metaText}>5 Hrs Usage</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.metaItem}>
                  <Ionicons name="map-outline" size={14} color="#94A3B8" />
                  <Text style={styles.metaText}>85 km dist.</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/(driver)/advertise-ride')}
      >
        <LinearGradient
            colors={['#0052B4', '#003E88']}
            style={styles.fabGradient}
        >
            <Ionicons name="add" size={30} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#FFF',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  headerTitle: { fontSize: 17, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  iconBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 22 },
  dot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, backgroundColor: '#EF4444', borderRadius: 4, borderWidth: 2, borderColor: '#FFF' },
  
  scrollContent: { paddingBottom: 100 },
  welcomeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  greeting: { fontSize: 24, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  subGreeting: { fontSize: 14, fontFamily: 'Roboto_400Regular', color: '#94A3B8', marginTop: 4 },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  pulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 6 },
  onlineText: { fontSize: 13, fontFamily: 'Montserrat_600SemiBold', color: '#10B981' },

  contentContainer: { paddingHorizontal: 20 },
  earningsCard: { borderRadius: 24, padding: 20, marginBottom: 20, elevation: 5, shadowColor: '#0052B4', shadowOpacity: 0.2 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  earningsLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: 'Roboto_400Regular' },
  earningsValue: { color: '#FFF', fontSize: 28, fontFamily: 'Montserrat_700Bold', marginTop: 5 },
  walletIconBg: { width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 15 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBottomText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: 'Roboto_400Regular' },
  withdrawLink: { color: '#FFCC00', fontSize: 14, fontFamily: 'Montserrat_600SemiBold' },

  smallStatsRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  smallStatsCard: { flex: 1, borderRadius: 24, padding: 15, elevation: 2 },
  statIconBg: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statsLabelSmall: { fontSize: 12, fontFamily: 'Montserrat_500Medium' },
  statsValueSmall: { fontSize: 18, fontFamily: 'Montserrat_700Bold', marginTop: 4 },

  sectionHeaderLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  liveTracking: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  liveText: { fontSize: 12, fontFamily: 'Montserrat_600SemiBold', color: '#EF4444' },
  viewAll: { fontSize: 14, color: '#0056B3', fontFamily: 'Montserrat_600SemiBold' },

  activeRideCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 15, borderWidth: 1, borderColor: '#F1F5F9', elevation: 2 },
  activeRideBody: { flexDirection: 'row', alignItems: 'center' },
  riderAvatar: { width: 56, height: 56, borderRadius: 28 },
  riderInfo: { flex: 1, marginLeft: 12 },
  riderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  riderName: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  rideTime: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  rideRoute: { fontSize: 12, color: '#64748B', fontFamily: 'Roboto_400Regular', marginBottom: 4 },
  pickupTime: { fontSize: 12, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  chatIconBtn: { width: 44, height: 44, backgroundColor: '#EEF6FF', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  chatBadge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, backgroundColor: '#EF4444', borderRadius: 4, borderWidth: 1, borderColor: '#FFF' },

  upcomingCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 20 },
  upcomingTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  typeTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EEF6FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  typeTagText: { fontSize: 12, fontFamily: 'Montserrat_600SemiBold', color: '#0056B3' },
  upcomingPrice: { fontSize: 16, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  routeDisplay: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  routeLineContainer: { alignItems: 'center', paddingVertical: 5 },
  routeDot: { width: 8, height: 8, borderRadius: 4 },
  routeDashedLine: { width: 1, height: 30, backgroundColor: '#E2E8F0', marginVertical: 4 },
  routeTexts: { flex: 1 },
  routePoint: { fontSize: 14, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  upcomingFooter: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F8FAFC', paddingTop: 15, gap: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  verticalDivider: { width: 1, height: 15, backgroundColor: '#F1F5F9' },

  fab: { position: 'absolute', bottom: 30, right: 20, elevation: 10 },
  fabGradient: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },

  menuOverlay: { flex: 1, flexDirection: 'row' },
  menuBackdrop: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' },
  menuPanel: { width: '82%', height: '100%', backgroundColor: '#FFF', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  menuHeader: { marginBottom: 30 },
  profileSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F1F5F9' },
  profileInfo: { marginLeft: 15 },
  userName: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  profileLink: { fontSize: 14, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  switchPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 25, alignSelf: 'flex-start', marginBottom: 30, borderWidth: 1, borderColor: '#F1F5F9' },
  yellowCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFCC00', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  switchText: { fontSize: 14, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  menuDivider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 15 },
  menuLinks: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  menuItemText: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', marginLeft: 16 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  logoutText: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#EF4444', marginLeft: 16 },

  loadingOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  loadingBox: { backgroundColor: '#FFF', padding: 30, borderRadius: 24, alignItems: 'center', elevation: 8 },
  loadingText: { marginTop: 15, fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  
  successBox: { backgroundColor: '#FFF', padding: 40, borderRadius: 32, alignItems: 'center', elevation: 12, width: '80%' },
  successIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successTitle: { fontSize: 22, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', marginBottom: 10 },
  successSub: { fontSize: 14, fontFamily: 'Roboto_400Regular', color: '#94A3B8', textAlign: 'center' }
});
