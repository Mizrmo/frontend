import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ProfileAvatar } from '../../components/ProfileAvatar';
import { useAuth } from '../../src/context/AuthContext';
import { useProfilePhoto } from '../../src/hooks/useProfilePhoto';
import { getMilesBalance, getMizMilesWallet } from '../../src/api/mizMiles';

export default function RiderAccountScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { photoUri, reload: reloadProfilePhoto } = useProfilePhoto();
  const [loggingOut, setLoggingOut] = useState(false);
  const [milesBalance, setMilesBalance] = useState<number | null>(null);

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Rider';
  const email = user?.email ?? user?.phoneNumber ?? '';

  const loadWallet = useCallback(async () => {
    try {
      const wallet = await getMizMilesWallet();
      setMilesBalance(getMilesBalance(wallet));
    } catch {
      setMilesBalance(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWallet();
      reloadProfilePhoto();
    }, [loadWallet, reloadProfilePhoto])
  );

  const menuItems = [
    {
      id: 'profile',
      label: 'Edit Profile',
      sub: 'Change name, photo, and bio',
      icon: 'person-outline',
      route: '/(profile)/edit-profile',
    },
    {
      id: 'trips',
      label: 'My Trips',
      sub: 'View upcoming & completed rides',
      icon: 'time-outline',
      route: '/(rider)/trips',
    },
    {
      id: 'miles',
      label: 'Miz Miles',
      sub:
        milesBalance != null
          ? `You have ${milesBalance.toLocaleString()} points`
          : 'View rewards and redeem miles',
      icon: 'star-outline',
      route: '/(rider)/mizmiles-rewards',
    },
    {
      id: 'docs',
      label: 'Documents',
      sub: 'Manage your ID and verification',
      icon: 'document-outline',
      route: '/(profile)/documents',
    },
    {
      id: 'payments',
      label: 'Payment Methods',
      sub: 'Add or manage cards',
      icon: 'card-outline',
      route: '/(profile)/payment',
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
      sub: 'Privacy and notification options',
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
            setLoggingOut(true);
            await signOut();
            setLoggingOut(false);
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
          {email ? <Text style={styles.profileEmail}>{email}</Text> : null}
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push('/(profile)/edit-profile' as never)}
        >
          <Ionicons name="pencil" size={18} color="#0056B3" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.milesBanner}
        onPress={() => router.push('/(rider)/mizmiles-rewards')}
      >
        <View>
          <Text style={styles.milesLabel}>Your MizMiles Balance</Text>
          <Text style={styles.milesValue}>
            {milesBalance != null ? `${milesBalance.toLocaleString()} pts` : '—'}
          </Text>
        </View>
        <MaterialCommunityIcons name="seal" size={32} color="#FFCC00" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
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

      <Modal visible={loggingOut} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#0056B3" />
            <Text style={styles.loadingText}>Logging out...</Text>
          </View>
        </View>
      </Modal>
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
  profileEmail: { fontSize: 13, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  editBtn: {
    width: 38,
    height: 38,
    backgroundColor: '#EEF4FF',
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  milesBanner: {
    backgroundColor: '#0056B3',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milesLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Roboto_400Regular' },
  milesValue: { color: '#FFF', fontSize: 22, fontFamily: 'Montserrat_500Medium', marginTop: 2 },
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
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontFamily: 'Montserrat_500Medium',
    color: '#1A1A1A',
  },
});
