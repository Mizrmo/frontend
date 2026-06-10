import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getApiErrorMessage } from '../../src/api/errors';
import {
  getMyReferralCode,
  getReferralCodeValue,
  getReferralStats,
  type ReferralStats,
} from '../../src/api/referrals';

export default function ReferralsScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadReferrals = useCallback(async () => {
    try {
      const [codeData, statsData] = await Promise.all([getMyReferralCode(), getReferralStats()]);
      setCode(getReferralCodeValue(codeData));
      setStats(statsData);
    } catch (error) {
      Alert.alert('Referrals', getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReferrals();
  }, [loadReferrals]);

  const shareCode = async () => {
    if (!code) {
      return;
    }
    await Share.share({
      message: `Join me on Mizrmo! Use my referral code ${code} when you sign up.`,
    });
  };

  const copyCode = () => {
    if (!code) {
      return;
    }
    Alert.alert('Your code', code);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Referrals</Text>
        <View style={{ width: 44 }} />
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0056B3" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>Your referral code</Text>
            <Text style={styles.codeValue}>{code || '—'}</Text>
            <View style={styles.codeActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={copyCode}>
                <Ionicons name="copy-outline" size={18} color="#0056B3" />
                <Text style={styles.actionBtnText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtnPrimary} onPress={shareCode}>
                <Ionicons name="share-social-outline" size={18} color="#FFF" />
                <Text style={styles.actionBtnPrimaryText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats?.totalReferrals ?? 0}</Text>
              <Text style={styles.statLabel}>Total referrals</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats?.successfulReferrals ?? 0}</Text>
              <Text style={styles.statLabel}>Successful</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats?.milesEarned ?? 0}</Text>
              <Text style={styles.statLabel}>Miles earned</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Referred friends</Text>
          {(stats?.referredUsers ?? []).length === 0 ? (
            <Text style={styles.emptyText}>No referrals yet. Share your code to earn Miz Miles.</Text>
          ) : (
            (stats?.referredUsers ?? []).map((person, index) => (
              <View key={person.id ?? `ref-${index}`} style={styles.personRow}>
                <Ionicons name="person-circle-outline" size={32} color="#CBD5E1" />
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>
                    {[person.firstName, person.lastName].filter(Boolean).join(' ') || 'User'}
                  </Text>
                  {person.createdAt ? (
                    <Text style={styles.personDate}>{person.createdAt}</Text>
                  ) : null}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingBottom: 40 },
  codeCard: {
    backgroundColor: '#0056B3',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  codeLabel: { color: 'rgba(255,255,255,0.8)', fontFamily: 'Roboto_400Regular', fontSize: 14 },
  codeValue: {
    color: '#FFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 28,
    marginVertical: 12,
    letterSpacing: 2,
  },
  codeActions: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 10,
  },
  actionBtnText: { color: '#0056B3', fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFCC00',
    borderRadius: 12,
    paddingVertical: 10,
  },
  actionBtnPrimaryText: { color: '#1A1A1A', fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statValue: { fontSize: 20, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  statLabel: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 4, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', marginBottom: 12 },
  emptyText: { color: '#94A3B8', fontFamily: 'Roboto_400Regular', lineHeight: 20 },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  personInfo: { marginLeft: 12, flex: 1 },
  personName: { fontSize: 15, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  personDate: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
});
