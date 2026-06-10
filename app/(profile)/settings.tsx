import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { getMilesBalance, getMizMilesWallet } from '../../src/api/mizMiles';
import { getConfigString, getPublicConfig } from '../../src/api/config';

interface SettingItem {
  id: string;
  label: string;
  sub: string;
  icon: string;
  danger?: boolean;
  route?: string;
}

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { signOut, activeRole } = useAuth();
  const [milesBalance, setMilesBalance] = useState<number | null>(null);
  const [termsUrl, setTermsUrl] = useState('https://mizrmo.com/terms');
  const [privacyUrl, setPrivacyUrl] = useState('https://mizrmo.com/privacy');

  useEffect(() => {
    getPublicConfig()
      .then((config) => {
        setTermsUrl(
          getConfigString(config, ['TERMS_URL', 'termsUrl', 'terms_url'], termsUrl)
        );
        setPrivacyUrl(
          getConfigString(config, ['PRIVACY_URL', 'privacyUrl', 'privacy_url'], privacyUrl)
        );
      })
      .catch(() => {});

    getMizMilesWallet()
      .then((wallet) => setMilesBalance(getMilesBalance(wallet)))
      .catch(() => setMilesBalance(null));
  }, []);

  const mizMilesRoute =
    activeRole === 'DRIVER' ? '/(driver)/mizmiles-rewards' : '/(rider)/mizmiles-rewards';

  const sections: { title: string; items: SettingItem[] }[] = [
    {
      title: 'ACCOUNT',
      items: [
        {
          id: 'edit',
          label: 'Edit Profile',
          sub: 'Change name, photo, and contact info',
          icon: 'person-outline',
          route: '/(profile)/edit-profile',
        },
        {
          id: 'miles',
          label: 'Miz Miles',
          sub:
            milesBalance != null
              ? `You have ${milesBalance.toLocaleString()} points`
              : 'View rewards and redeem miles',
          icon: 'card-giftcard',
          route: mizMilesRoute,
        },
        {
          id: 'referral',
          label: 'Referrals',
          sub: 'Invite friends and earn bonus miles',
          icon: 'people-outline',
          route: '/(profile)/referrals',
        },
        {
          id: 'document',
          label: 'Documents',
          sub: 'Manage licenses and verification',
          icon: 'description',
          route: '/(profile)/documents',
        },
        {
          id: 'payment',
          label: 'Payment Methods',
          sub: activeRole === 'DRIVER' ? 'Payout account for earnings' : 'How you pay for rides',
          icon: 'credit-card',
          route: '/(profile)/payment',
        },
      ],
    },
    {
      title: 'SUPPORT',
      items: [
        {
          id: 'help',
          label: 'Help & Support',
          sub: 'FAQs and contact support',
          icon: 'help-outline',
          route: '/(profile)/help-support',
        },
        { id: 'terms', label: 'Terms and Policies', sub: 'Our legal agreements', icon: 'article' },
        { id: 'privacy', label: 'Privacy Settings', sub: 'Manage your data', icon: 'lock-outline' },
      ],
    },
    {
      title: 'SESSION',
      items: [
        { id: 'logout', label: 'Log Out', sub: 'Sign out of your account', icon: 'logout', danger: true },
      ],
    },
  ];

  const handleItemPress = async (item: SettingItem) => {
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
    if (item.id === 'terms') {
      Linking.openURL(termsUrl).catch(() =>
        Alert.alert('Link unavailable', 'Could not open terms and policies.')
      );
      return;
    }
    if (item.id === 'privacy') {
      Linking.openURL(privacyUrl).catch(() =>
        Alert.alert('Link unavailable', 'Could not open privacy settings.')
      );
      return;
    }
    if (item.route) {
      router.push(item.route as never);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {sections.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.item}
                onPress={() => handleItemPress(item)}
              >
                <View style={[styles.iconBox, item.danger && styles.iconBoxDanger]}>
                  <MaterialIcons name={item.icon as any} size={22} color={item.danger ? '#EF4444' : '#0056B3'} />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemLabel, item.danger && styles.dangerText]}>{item.label}</Text>
                  <Text style={styles.itemSub}>{item.sub}</Text>
                </View>
                {!item.danger && <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  content: { padding: 20, paddingBottom: 40 },
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: '#94A3B8',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginLeft: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxDanger: { backgroundColor: '#FEF2F2' },
  itemInfo: { flex: 1, marginLeft: 14 },
  itemLabel: { fontSize: 15, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  itemSub: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  dangerText: { color: '#EF4444' },
});
