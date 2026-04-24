import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { storage } from '../../src/api/storage';

interface SettingItem {
  id: string;
  label: string;
  sub: string;
  icon: string;
  danger?: boolean;
  route?: string;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

const sections: SettingSection[] = [
  {
    title: 'ACCOUNT',
    items: [
      { id: 'edit', label: 'Edit Profile', sub: 'Change name, photo, and bio', icon: 'person-outline', route: '/(profile)/edit-profile' },
      { id: 'miles', label: 'Miz Miles', sub: 'You have 1,240 points', icon: 'card-giftcard', route: '/(rider)/mizmiles-rewards' },
      { id: 'document', label: 'Documents', sub: 'Manage licenses and verification', icon: 'description', route: '/(profile)/documents' },
      { id: 'payment', label: 'Payment Methods', sub: 'Add or manage cards', icon: 'credit-card', route: '/(profile)/payment' },
    ]
  },
  {
    title: 'SUPPORT',
    items: [
      { id: 'help', label: 'Help & Support', sub: 'FAQs and contact support', icon: 'help-outline', route: '/(profile)/help-support' },
      { id: 'terms', label: 'Terms and Policies', sub: 'Our legal agreements', icon: 'article' },
      { id: 'privacy', label: 'Privacy Settings', sub: 'Manage your data', icon: 'lock-outline' },
    ]
  },
  {
    title: 'SESSION',
    items: [
      { id: 'logout', label: 'Log Out', sub: 'Sign out of your account', icon: 'logout', danger: true },
    ]
  }
];

export default function AccountSettingsScreen() {
  const router = useRouter();

  const handleItemPress = async (item: SettingItem) => {
    if (item.id === 'logout') {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out', style: 'destructive', onPress: async () => {
            await storage.removeItem('token');
            router.replace('/(auth)/signin');
          }
        }
      ]);
      return;
    }
    if (item.route) router.push(item.route as any);
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
            <View style={styles.card}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.item, i < section.items.length - 1 && styles.itemBorder]}
                  onPress={() => handleItemPress(item)}
                >
                  <View style={[styles.iconBox, item.danger && styles.iconBoxDanger]}>
                    <MaterialIcons
                      name={item.icon as any}
                      size={22}
                      color={item.danger ? '#EF4444' : '#0056B3'}
                    />
                  </View>
                  <View style={styles.labelContainer}>
                    <Text style={[styles.label, item.danger && styles.labelDanger]}>{item.label}</Text>
                    <Text style={styles.sublabel}>{item.sub}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <Text style={styles.footerVersion}>Mizrmo v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 16, paddingBottom: 20, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  content: { padding: 20, paddingBottom: 40 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 11, fontFamily: 'Montserrat_700Bold', color: '#94A3B8', letterSpacing: 1.2, marginBottom: 12, marginLeft: 4 },
  card: { backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9' },
  item: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  iconBox: { width: 42, height: 42, backgroundColor: '#EEF6FF', borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  iconBoxDanger: { backgroundColor: '#FEF2F2' },
  labelContainer: { flex: 1, marginLeft: 14 },
  label: { fontSize: 15, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  labelDanger: { color: '#EF4444' },
  sublabel: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  footerVersion: { textAlign: 'center', fontSize: 12, color: '#CBD5E1', fontFamily: 'Roboto_400Regular', marginTop: 20 }
});
