import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getApiErrorMessage } from '../../src/api/errors';
import {
  getMilesBalance,
  getMizMilesTransactions,
  getMizMilesWallet,
  redeemMizMiles,
  type MizMilesTransaction,
} from '../../src/api/mizMiles';

const REWARDS = [
  { id: 'ride-discount', title: '15% off next ride', miles: 150 },
  { id: 'free-seat', title: 'Free seat upgrade', miles: 300 },
  { id: 'referral-bonus', title: 'Referral bonus miles', miles: 500 },
];

export default function MizMilesRewardsScreen() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<MizMilesTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const loadWallet = useCallback(async () => {
    try {
      const [wallet, history] = await Promise.all([
        getMizMilesWallet(),
        getMizMilesTransactions({ limit: 10 }),
      ]);
      setBalance(getMilesBalance(wallet));
      setTransactions(history.data ?? []);
    } catch (error) {
      Alert.alert('Miz Miles', getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  const handleRedeem = async (rewardId: string, miles: number) => {
    if (balance < miles) {
      Alert.alert('Not enough miles', `You need ${miles} miles for this reward.`);
      return;
    }

    setIsRedeeming(true);
    try {
      await redeemMizMiles({ rewardId, miles });
      Alert.alert('Redeemed', 'Your reward has been applied to your wallet.');
      loadWallet();
    } catch (error) {
      Alert.alert('Redeem failed', getApiErrorMessage(error));
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#555" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Miz Miles</Text>
        <View style={{ width: 60 }} />
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0056B3" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                loadWallet();
              }}
            />
          }
        >
          <View style={styles.pointsCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.pointsLabel}>Your MizMiles Balance</Text>
              <MaterialCommunityIcons name="seal" size={32} color="#FFCC00" />
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.cardBody}>
              <Text style={styles.pointsValue}>{balance.toLocaleString()} pts</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rewards</Text>
          </View>

          {REWARDS.map((reward) => (
            <View key={reward.id} style={styles.rewardCard}>
              <View style={styles.rewardIconBg}>
                <MaterialCommunityIcons name="seal" size={24} color="#FFF" />
              </View>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardTitle}>{reward.title}</Text>
                <View style={styles.rewardBottomRow}>
                  <Text style={styles.rewardCost}>{reward.miles} Miz Miles</Text>
                  <TouchableOpacity
                    onPress={() => handleRedeem(reward.id, reward.miles)}
                    disabled={isRedeeming}
                  >
                    <Text style={styles.redeemLink}>Redeem</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <Text style={styles.sectionTitle}>Recent activity</Text>
          </View>

          {transactions.length === 0 ? (
            <Text style={styles.emptyText}>No transactions yet. Complete rides to earn miles.</Text>
          ) : (
            transactions.map((tx, index) => (
              <View key={tx.id ?? `tx-${index}`} style={styles.txRow}>
                <Text style={styles.txTitle}>{tx.description ?? tx.type ?? 'Transaction'}</Text>
                <Text style={styles.txAmount}>
                  {(tx.miles ?? tx.amount ?? 0) > 0 ? '+' : ''}
                  {tx.miles ?? tx.amount ?? 0} pts
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    height: 100,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 16, color: '#1A1A1A', marginLeft: 4, fontFamily: 'Roboto_400Regular' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 },
  pointsCard: {
    backgroundColor: '#0052B4',
    borderRadius: 12,
    padding: 24,
    marginBottom: 35,
    width: '100%',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  pointsLabel: { color: '#FFF', fontSize: 18, fontFamily: 'Montserrat_500Medium' },
  cardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: 20 },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pointsValue: { color: '#FFF', fontSize: 36, fontFamily: 'Montserrat_500Medium' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 16, color: '#A0A0A0', fontFamily: 'Roboto_400Regular' },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  rewardIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0052B4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardInfo: { flex: 1, marginLeft: 16 },
  rewardTitle: { fontSize: 17, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', marginBottom: 6 },
  rewardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rewardCost: { fontSize: 14, color: '#A0A0A0', fontFamily: 'Roboto_400Regular' },
  redeemLink: { color: '#0052B4', fontSize: 15, fontFamily: 'Montserrat_500Medium' },
  emptyText: { color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginBottom: 20 },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  txTitle: { fontSize: 14, fontFamily: 'Roboto_400Regular', color: '#1A1A1A', flex: 1, paddingRight: 12 },
  txAmount: { fontSize: 14, fontFamily: 'Montserrat_600SemiBold', color: '#0056B3' },
});
