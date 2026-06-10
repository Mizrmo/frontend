import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { getConfigString, getPublicConfig } from '../../src/api/config';

export default function AboutUsScreen() {
  const router = useRouter();
  const [websiteUrl, setWebsiteUrl] = useState('https://mizrmo.com');
  const [termsUrl, setTermsUrl] = useState('https://mizrmo.com/terms');
  const [privacyUrl, setPrivacyUrl] = useState('https://mizrmo.com/privacy');
  const [supportEmail, setSupportEmail] = useState('support@mizrmo.com');

  useEffect(() => {
    getPublicConfig()
      .then((config) => {
        setWebsiteUrl(getConfigString(config, ['WEBSITE_URL', 'websiteUrl', 'website_url'], websiteUrl));
        setTermsUrl(getConfigString(config, ['TERMS_URL', 'termsUrl', 'terms_url'], termsUrl));
        setPrivacyUrl(getConfigString(config, ['PRIVACY_URL', 'privacyUrl', 'privacy_url'], privacyUrl));
        setSupportEmail(
          getConfigString(config, ['SUPPORT_EMAIL', 'supportEmail', 'support_email'], supportEmail)
        );
      })
      .catch(() => {});
  }, []);

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  const openLink = (url: string, label: string) => {
    Linking.openURL(url).catch(() => Alert.alert('Link unavailable', `Could not open ${label}.`));
  };

  const links = [
    {
      id: 'website',
      label: 'Visit our website',
      sub: 'mizrmo.com',
      icon: 'globe-outline' as const,
      onPress: () => openLink(websiteUrl, 'website'),
    },
    {
      id: 'terms',
      label: 'Terms & Policies',
      sub: 'Read our terms of service',
      icon: 'document-text-outline' as const,
      onPress: () => openLink(termsUrl, 'terms'),
    },
    {
      id: 'privacy',
      label: 'Privacy Policy',
      sub: 'How we protect your data',
      icon: 'shield-checkmark-outline' as const,
      onPress: () => openLink(privacyUrl, 'privacy'),
    },
    {
      id: 'support',
      label: 'Contact support',
      sub: supportEmail,
      icon: 'mail-outline' as const,
      onPress: () => Linking.openURL(`mailto:${supportEmail}`).catch(() =>
        Alert.alert('Email unavailable', 'Could not open your mail app.')
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Ionicons name="car-sport" size={36} color="#FFF" />
          </View>
          <Text style={styles.brand}>Mizrmo</Text>
          <Text style={styles.tagline}>Share rides. Save money. Move together.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Who we are</Text>
          <Text style={styles.body}>
            Mizrmo is a community built on respect and shared experiences. We connect riders and
            drivers across Ghana so everyday travel is more affordable, reliable, and sustainable.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Our mission</Text>
          <Text style={styles.body}>
            Cut down on commuting costs through carpooling, reduce emissions by putting fewer cars
            on the road, and make every trip feel safe and straightforward.
          </Text>
        </View>

        <View style={styles.linksSection}>
          {links.map((link) => (
            <TouchableOpacity key={link.id} style={styles.linkRow} onPress={link.onPress}>
              <View style={styles.linkIcon}>
                <Ionicons name={link.icon} size={22} color="#0056B3" />
              </View>
              <View style={styles.linkInfo}>
                <Text style={styles.linkLabel}>{link.label}</Text>
                <Text style={styles.linkSub}>{link.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.version}>Mizrmo Mobile v{appVersion}</Text>
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
  hero: { alignItems: 'center', marginBottom: 28, marginTop: 8 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0056B3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  brand: { fontSize: 26, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', marginBottom: 6 },
  tagline: {
    fontSize: 15,
    fontFamily: 'Roboto_400Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    fontFamily: 'Roboto_400Regular',
    color: '#64748B',
    lineHeight: 23,
  },
  linksSection: { marginTop: 8, marginBottom: 24 },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  linkIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkInfo: { flex: 1, marginLeft: 14 },
  linkLabel: { fontSize: 15, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  linkSub: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'Roboto_400Regular',
  },
});
