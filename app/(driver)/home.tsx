import React, { useCallback, useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  Dimensions, Modal, Image, Platform, ActivityIndicator, Alert
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { getDriverBookingRequests, getRiderName } from '../../src/api/bookings';
import { getDriverEarningsSummary, getNumericAmount } from '../../src/api/drivers';
import { formatCurrency, formatDepartureDate, getMyUpcomingTrips, getTripPrice } from '../../src/api/trips';
import { getMyVehicles } from '../../src/api/vehicles';
import { getMilesBalance, getMizMilesWallet } from '../../src/api/mizMiles';
import type { Trip } from '../../src/api/trip-types';
import type { DriverBookingRequest } from '../../src/api/bookings';
import { LinearGradient } from 'expo-linear-gradient';
import { ProfileAvatar } from '../../components/ProfileAvatar';
import { useProfilePhoto } from '../../src/hooks/useProfilePhoto';

const { width } = Dimensions.get('window');

export default function DriverDashboardScreen() {
  const router = useRouter();
  const { signOut, user, switchRole } = useAuth();
  const { photoUri, reload: reloadProfilePhoto } = useProfilePhoto();
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [earningsSummary, setEarningsSummary] = useState({ balance: 0, weekly: 0, ridesToday: 0 });
  const [upcomingTrip, setUpcomingTrip] = useState<Trip | null>(null);
  const [pendingRequests, setPendingRequests] = useState<DriverBookingRequest[]>([]);
  const [needsVehicleSetup, setNeedsVehicleSetup] = useState(false);
  const [mizMilesBalance, setMizMilesBalance] = useState(0);

  const displayName = user?.firstName
    ? [user.firstName, user.lastName].filter(Boolean).join(' ')
    : 'Driver';

  const loadDashboard = useCallback(async () => {
    // Loaded independently (not Promise.all) so one failing card — e.g. a rider
    // account that hasn't finished driver onboarding hitting a driver-only
    // endpoint — doesn't block the rest of the dashboard from populating.
    const [summaryResult, upcomingResult, requestsResult, vehiclesResult, walletResult] =
      await Promise.allSettled([
        getDriverEarningsSummary(),
        getMyUpcomingTrips({ limit: 1 }),
        getDriverBookingRequests(),
        getMyVehicles(),
        getMizMilesWallet(),
      ]);

    if (summaryResult.status === 'fulfilled') {
      const summary = summaryResult.value;
      setEarningsSummary({
        balance: getNumericAmount(summary.currentBalance ?? summary.totalEarnings),
        weekly: getNumericAmount(summary.weeklyEarnings ?? summary.monthlyEarnings),
        ridesToday: summary.totalRides ?? summary.activeRides ?? 0,
      });
    }

    setUpcomingTrip(upcomingResult.status === 'fulfilled' ? upcomingResult.value.data[0] ?? null : null);
    setPendingRequests(requestsResult.status === 'fulfilled' ? requestsResult.value : []);
    setNeedsVehicleSetup(vehiclesResult.status === 'fulfilled' ? vehiclesResult.value.length === 0 : false);
    setMizMilesBalance(walletResult.status === 'fulfilled' ? getMilesBalance(walletResult.value) : 0);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (menuVisible) {
      reloadProfilePhoto();
    }
  }, [menuVisible, reloadProfilePhoto]);

  useFocusEffect(
    useCallback(() => {
      reloadProfilePhoto();
    }, [reloadProfilePhoto])
  );

  const menuItems = [
    { id: '1', title: 'Earnings', icon: 'cash-outline', route: '/(driver)/earnings-detail' },
    { id: '2', title: 'Miz Miles', icon: 'pricetag-outline', route: '/(driver)/mizmiles-rewards' },
    { id: '3', title: 'Trips', icon: 'car-sport-outline', route: '/(driver)/trips' },
    { id: '4', title: 'Referral', icon: 'people-outline', route: '/(profile)/referrals' },
    { id: '5', title: 'Payment', icon: 'wallet-outline', route: '/(profile)/payment' },
    { id: '6', title: 'Support', icon: 'headset-outline', route: '/(profile)/help-support' },
    { id: '7', title: 'About Us', icon: 'information-circle-outline', route: '/(profile)/about-us' },
  ];

  const navigateTo = (route: string) => {
    setMenuVisible(false);
    router.push(route as any);
  };

  const handleLogout = () => {
    setMenuVisible(false);
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          setLoadingText('Logging out...');
          setLoading(true);
          try {
            await signOut();
            router.replace('/(auth)/signin');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const performSwitchToRider = async () => {
    setLoadingText('Switching roles...');
    setLoading(true);

    const result = await switchRole('RIDER');
    setLoading(false);

    if (!result.ok) {
      Alert.alert('Switch failed', result.message ?? 'Unable to switch role.');
      return;
    }

    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      router.replace('/(rider)/home');
    }, 1200);
  };

  const handleSwitchProfile = () => {
    setMenuVisible(false);
    Alert.alert(
      'Switch to Rider',
      'Are you sure you want to switch to rider mode?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Switch', onPress: () => void performSwitchToRider() },
      ]
    );
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
                    <ProfileAvatar size={64} uri={photoUri} />
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>{displayName}</Text>
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
                <Text style={styles.greeting}>Hello, {user?.firstName ?? 'Driver'} 👋</Text>
                <Text style={styles.subGreeting}>Ready for today's rides?</Text>
            </View>
            <TouchableOpacity style={styles.onlineBadge}>
                <View style={styles.pulse} />
                <Text style={styles.onlineText}>Online</Text>
            </TouchableOpacity>
        </View>

        {needsVehicleSetup ? (
          <TouchableOpacity
            style={styles.onboardingBanner}
            onPress={() => router.push('/(auth)/vehicle-details')}
          >
            <View style={styles.onboardingBannerIcon}>
              <Ionicons name="car-outline" size={22} color="#0056B3" />
            </View>
            <View style={styles.onboardingBannerText}>
              <Text style={styles.onboardingBannerTitle}>Complete driver setup</Text>
              <Text style={styles.onboardingBannerSub}>
                Add your licence, Ghana Card, and vehicle details to start accepting rides.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#0056B3" />
          </TouchableOpacity>
        ) : null}

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
                      <Text style={styles.earningsValue}>{formatCurrency(earningsSummary.balance)}</Text>
                  </View>
                  <View style={styles.walletIconBg}>
                      <MaterialCommunityIcons name="wallet-outline" size={28} color="#FFF" />
                  </View>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.cardBottom}>
                  <Text style={styles.cardBottomText}>
                    This week: {formatCurrency(earningsSummary.weekly)}
                  </Text>
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
              <Text style={[styles.statsValueSmall, { color: '#FFF' }]}>{earningsSummary.ridesToday}</Text>
            </View>
            <View style={[styles.smallStatsCard, { backgroundColor: '#FFCC00' }]}>
              <View style={[styles.statIconBg, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                 <Ionicons name="star-outline" size={20} color="#1A1A1A" />
              </View>
              <Text style={[styles.statsLabelSmall, { color: 'rgba(0,0,0,0.6)' }]}>Miz Miles</Text>
              <Text style={[styles.statsValueSmall, { color: '#1A1A1A' }]}>{mizMilesBalance} <Text style={{ fontSize: 13 }}>pts</Text></Text>
            </View>
          </View>

          {/* Active Ride Card */}
          <View style={styles.sectionHeaderLine}>
            <Text style={styles.sectionTitle}>Active Ride</Text>
            <TouchableOpacity
              style={styles.liveTracking}
              onPress={() => {
                if (upcomingTrip?.status === 'IN_PROGRESS') {
                  router.push({
                    pathname: '/(driver)/start-ride',
                    params: { tripId: upcomingTrip.id },
                  });
                  return;
                }
                if (pendingRequests[0]?.tripId) {
                  router.push({
                    pathname: '/(driver)/start-ride',
                    params: {
                      tripId: pendingRequests[0].tripId,
                      bookingId: pendingRequests[0].id,
                    },
                  });
                  return;
                }
                router.push('/(driver)/trips');
              }}
            >
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Live Tracking</Text>
            </TouchableOpacity>
          </View>

          {pendingRequests.length > 0 ? (
            <TouchableOpacity
              style={styles.activeRideCard}
              onPress={() =>
                router.push({
                  pathname: '/(driver)/incoming-request',
                  params: { bookingId: pendingRequests[0].id },
                })
              }
            >
              <View style={styles.activeRideBody}>
                <Image source={require('../../assets/lady_profile.png')} style={styles.riderAvatar} />
                <View style={styles.riderInfo}>
                  <View style={styles.riderHeader}>
                    <Text style={styles.riderName}>{getRiderName(pendingRequests[0])}</Text>
                    <Text style={styles.rideTime}>New request</Text>
                  </View>
                  <Text style={styles.rideRoute}>
                    {pendingRequests[0].trip?.originCity} → {pendingRequests[0].trip?.destinationCity}
                  </Text>
                  <Text style={styles.pickupTime}>
                    Tap to review booking request
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <Text style={styles.emptyHint}>No active requests right now.</Text>
          )}

          {/* Upcoming Schedule */}
          <View style={styles.sectionHeaderLine}>
            <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
            <TouchableOpacity onPress={() => router.push('/(driver)/trips')}>
                <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {upcomingTrip ? (
            <TouchableOpacity
              style={styles.upcomingCard}
              onPress={() =>
                router.push({
                  pathname: '/(driver)/start-ride',
                  params: { tripId: upcomingTrip.id },
                })
              }
            >
              <View style={styles.upcomingTop}>
                <View style={styles.typeTag}>
                  <Ionicons name="swap-horizontal" size={14} color="#0056B3" />
                  <Text style={styles.typeTagText}>Upcoming</Text>
                </View>
                <Text style={styles.upcomingPrice}>{formatCurrency(getTripPrice(upcomingTrip))}</Text>
              </View>

              <View style={styles.routeDisplay}>
                <View style={styles.routeLineContainer}>
                  <View style={[styles.routeDot, { backgroundColor: '#0056B3' }]} />
                  <View style={styles.routeDashedLine} />
                  <View style={[styles.routeDot, { backgroundColor: '#FFCC00' }]} />
                </View>
                <View style={styles.routeTexts}>
                  <Text style={styles.routePoint} numberOfLines={1}>
                    {upcomingTrip.originAddress ?? upcomingTrip.originCity}
                  </Text>
                  <Text style={[styles.routePoint, { marginTop: 18 }]} numberOfLines={1}>
                    {upcomingTrip.destinationAddress ?? upcomingTrip.destinationCity}
                  </Text>
                </View>
              </View>

              <View style={styles.upcomingFooter}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="#94A3B8" />
                  <Text style={styles.metaText}>{formatDepartureDate(upcomingTrip.departureDate)}</Text>
                </View>
                {upcomingTrip.distanceKm != null && (
                  <>
                    <View style={styles.verticalDivider} />
                    <View style={styles.metaItem}>
                      <Ionicons name="map-outline" size={14} color="#94A3B8" />
                      <Text style={styles.metaText}>{upcomingTrip.distanceKm} km</Text>
                    </View>
                  </>
                )}
              </View>
            </TouchableOpacity>
          ) : (
            <Text style={styles.emptyHint}>No upcoming trips scheduled.</Text>
          )}
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

  onboardingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  onboardingBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  onboardingBannerText: { flex: 1, marginRight: 8 },
  onboardingBannerTitle: { fontSize: 15, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  onboardingBannerSub: { fontSize: 13, fontFamily: 'Roboto_400Regular', color: '#64748B', marginTop: 4, lineHeight: 18 },

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
  emptyHint: { color: '#94A3B8', fontFamily: 'Roboto_400Regular', fontSize: 13, marginBottom: 12 },
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
