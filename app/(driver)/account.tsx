import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProfileAvatar } from '../../components/ProfileAvatar';
import { useAuth } from '../../src/context/AuthContext';
import { useProfilePhoto } from '../../src/hooks/useProfilePhoto';
import { getDriverEarningsSummary, getNumericAmount } from '../../src/api/drivers';
import { formatCurrency } from '../../src/api/trips';
import { getUserRating } from '../../src/api/reviews';

export default function DriverAccountScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { photoUri, reload: reloadProfilePhoto } = useProfilePhoto();
  const [totalEarnings, setTotalEarnings] = useState<number | null>(null);
  const [driverRating, setDriverRating] = useState<number | null>(null);

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Driver';

  const loadStats = useCallback(async () => {
    try {
      const summary = await getDriverEarningsSummary();
      const amount =
        getNumericAmount(summary.currentBalance) || getNumericAmount(summary.totalEarnings);
      setTotalEarnings(amount);
    } catch {
      setTotalEarnings(null);
    }

    if (user?.id) {
      try {
        const rating = await getUserRating(user.id);
        setDriverRating(rating.averageRating ?? rating.rating ?? null);
      } catch {
        setDriverRating(null);
      }
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadStats();
      reloadProfilePhoto();
    }, [loadStats, reloadProfilePhoto])
  );

  const menuItems = [
    {
      id: 'profile',
      label: 'My Profile',
      sub: 'Update photo, name and bio',
      icon: 'person-outline',
      route: '/(profile)/edit-profile',
    },
    {
      id: 'trips',
      label: 'My Trips',
      sub: 'View all your ride history',
      icon: 'time-outline',
      route: '/(driver)/trips',
    },
    {
      id: 'docs',
      label: 'Documents',
      sub: 'License and verification docs',
      icon: 'document-outline',
      route: '/(profile)/documents',
    },
    {
      id: 'payment',
      label: 'Payments & Earnings',
      sub: 'Manage your earnings',
      icon: 'card-outline',
      route: '/(driver)/earnings-detail',
    },
    {
      id: 'miles',
      label: 'Miz Miles',
      sub: 'View rewards and redeem miles',
      icon: 'star-outline',
      route: '/(profile)/mizmiles-rewards',
    },
    {
      id: 'help',
      label: 'Help & Support',
      sub: 'FAQs and contact support',
      icon: 'help-circle-outline',
      route: '/(profile)/help-support',
    },
    {
      id: 'settings',
      label: 'Settings',
      sub: 'Privacy and notifications',
      icon: 'settings-outline',
      route: '/(profile)/settings',
    },
    { id: 'logout', label: 'Log Out', sub: 'Sign out of your account', icon: 'log-out-outline', danger: true },
  ];

  const handlePress = async (item: (typeof menuItems)[0]) => {
    if (item.id === 'logout') {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/signin');
          },
        },
      ]);
      return;
    }
    if ('route' in item && item.route) {
      router.push(item.route as never);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <ProfileAvatar size={64} uri={photoUri} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileRole}>Driver</Text>
          {driverRating != null ? (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFCC00" />
              <Text style={styles.ratingText}>{driverRating.toFixed(1)} Rating</Text>
            </View>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push('/(profile)/edit-profile' as never)}
        >
          <Ionicons name="pencil" size={18} color="#0056B3" />
        </TouchableOpacity>
      </View>

      <View style={styles.earningsBanner}>
        <View>
          <Text style={styles.earningsLabel}>Available balance</Text>
          <Text style={styles.earningsValue}>
            {totalEarnings != null ? formatCurrency(totalEarnings) : '—'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.withdrawBtn}
          onPress={() => router.push('/(driver)/earnings-detail')}
        >
          <Text style={styles.withdrawBtnText}>Withdraw</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {menuItems.map((item, i) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuItem, i < menuItems.length - 1 && styles.menuBorder]}
            onPress={() => handlePress(item)}
          >
            <View style={[styles.iconBox, item.danger && styles.iconBoxDanger]}>
              <Ionicons
                name={item.icon as keyof typeof Ionicons.glyphMap}
                size={22}
                color={item.danger ? '#EA4335' : '#0056B3'}
              />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>
                {item.label}
              </Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>
            {!item.danger && <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 14,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  profileRole: { fontSize: 13, color: '#0056B3', fontFamily: 'Roboto_400Regular', marginTop: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingText: { fontSize: 12, color: '#64748B', fontFamily: 'Roboto_400Regular' },
  editBtn: {
    width: 38,
    height: 38,
    backgroundColor: '#EEF4FF',
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningsBanner: {
    backgroundColor: '#0056B3',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Roboto_400Regular' },
  earningsValue: { color: '#FFF', fontSize: 22, fontFamily: 'Montserrat_500Medium', marginTop: 2 },
  withdrawBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  withdrawBtnText: { color: '#FFF', fontSize: 13, fontFamily: 'Roboto_400Regular' },
  content: { padding: 20, paddingBottom: 40 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 2,
  },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  iconBox: {
    width: 42,
    height: 42,
    backgroundColor: '#EEF4FF',
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxDanger: { backgroundColor: '#FEF2F2' },
  menuText: { flex: 1, marginLeft: 14 },
  menuLabel: { fontSize: 15, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  menuLabelDanger: { color: '#EA4335' },
  menuSub: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 1 },
});
