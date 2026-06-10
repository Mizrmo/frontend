import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  getDriverEarnings,
  getDriverEarningsSummary,
  getNumericAmount,
  type DriverEarningRecord,
} from '../../src/api/drivers';
import { formatCurrency } from '../../src/api/trips';
function formatEarningDate(value?: string): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatEarningTime(value?: string): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function isDebitRecord(record: DriverEarningRecord): boolean {
  const type = (record.type ?? '').toLowerCase();
  return type.includes('debit') || type.includes('withdraw');
}

export default function DriverEarningsDetails() {
  const router = useRouter();
  const [summary, setSummary] = useState({
    balance: 0,
    weekly: 0,
    monthly: 0,
    activeRides: 0,
    totalRides: 0,
  });
  const [history, setHistory] = useState<DriverEarningRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadEarnings = useCallback(async () => {
    try {
      const [summaryData, earningsData] = await Promise.all([
        getDriverEarningsSummary(),
        getDriverEarnings({ limit: 30 }),
      ]);
      setSummary({
        balance: getNumericAmount(summaryData.currentBalance ?? summaryData.totalEarnings),
        weekly: getNumericAmount(summaryData.weeklyEarnings),
        monthly: getNumericAmount(summaryData.monthlyEarnings ?? summaryData.totalEarnings),
        activeRides: summaryData.activeRides ?? 0,
        totalRides: summaryData.totalRides ?? 0,
      });
      setHistory(earningsData.data ?? []);
    } catch {
      setHistory([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEarnings();
  }, [loadEarnings]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earnings & Payments</Text>
        <TouchableOpacity style={styles.helpBtn} onPress={() => router.push('/(profile)/help-support')}>
          <Ionicons name="help-circle-outline" size={22} color="#1A1A1A" />
        </TouchableOpacity>
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
                loadEarnings();
              }}
            />
          }
        >
          <View style={styles.balanceContainer}>
            <LinearGradient colors={['#0052B4', '#003E88']} style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <Text style={styles.balanceValue}>{formatCurrency(summary.balance)}</Text>

              <View style={styles.cardStats}>
                <View style={styles.cardStatItem}>
                  <Text style={styles.cardStatLabel}>This Week</Text>
                  <Text style={styles.cardStatValue}>{formatCurrency(summary.weekly)}</Text>
                </View>
                <View style={styles.cardVerticalDivider} />
                <View style={styles.cardStatItem}>
                  <Text style={styles.cardStatLabel}>Active Rides</Text>
                  <Text style={styles.cardStatValue}>{summary.activeRides}</Text>
                </View>
              </View>
            </LinearGradient>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.mainActionBtn}
                onPress={() => router.push('/(profile)/add-payment-method')}
              >
                <Text style={styles.mainActionText}>Set up payout account</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secActionBtn}
                onPress={() => router.push('/(profile)/payment')}
              >
                <Ionicons name="settings-outline" size={20} color="#0056B3" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.historySection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Transaction History</Text>
              <Text style={styles.filterText}>Recent</Text>
            </View>

            {history.length === 0 ? (
              <Text style={styles.emptyText}>No transactions yet.</Text>
            ) : (
              history.map((item, index) => {
                const isDebit = isDebitRecord(item);
                const amount = getNumericAmount(item.amount);
                const title =
                  item.title ?? item.description ?? (isDebit ? 'Withdrawal' : 'Ride earnings');
                return (
                  <View key={item.id ?? `earning-${index}`} style={styles.historyItem}>
                    <View
                      style={[
                        styles.iconBox,
                        isDebit ? styles.iconBoxDebit : styles.iconBoxCredit,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={isDebit ? 'arrow-up-right' : 'arrow-down-left'}
                        size={22}
                        color={isDebit ? '#EF4444' : '#10B981'}
                      />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemTitle}>{title}</Text>
                      <Text style={styles.itemMeta}>
                        {formatEarningDate(item.createdAt)}
                        {item.createdAt ? ` • ${formatEarningTime(item.createdAt)}` : ''}
                      </Text>
                    </View>
                    <Text style={[styles.itemAmount, isDebit && styles.debitText]}>
                      {isDebit ? '-' : ''}
                      {formatCurrency(amount)}
                    </Text>
                  </View>
                );
              })
            )}
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="bar-chart-outline" size={20} color="#0056B3" />
              <Text style={styles.summaryTitle}>Monthly Summary</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Earned</Text>
              <Text style={styles.summaryValue}>{formatCurrency(summary.monthly)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Rides</Text>
              <Text style={styles.summaryValue}>{summary.totalRides}</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 55 : 35,
    paddingHorizontal: 16,
    paddingBottom: 15,
    backgroundColor: '#FFF',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  helpBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },

  scrollContent: { paddingBottom: 40 },
  balanceContainer: { padding: 20 },
  balanceCard: {
    borderRadius: 24,
    padding: 25,
    elevation: 10,
    shadowColor: '#0052B4',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  balanceLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: 'Roboto_400Regular' },
  balanceValue: { fontSize: 30, color: '#FFF', fontFamily: 'Montserrat_700Bold', marginTop: 5 },
  cardStats: {
    flexDirection: 'row',
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  cardStatItem: { flex: 1 },
  cardStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'Roboto_400Regular' },
  cardStatValue: { fontSize: 16, color: '#FFF', fontFamily: 'Montserrat_600SemiBold', marginTop: 2 },
  cardVerticalDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 15,
    alignSelf: 'center',
  },

  actionRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  mainActionBtn: {
    flex: 1,
    height: 52,
    backgroundColor: '#0056B3',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  mainActionText: { color: '#FFF', fontSize: 15, fontFamily: 'Montserrat_600SemiBold' },
  secActionBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#0056B3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  historySection: { paddingHorizontal: 20, marginTop: 10 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 16, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  filterText: { fontSize: 13, color: '#0056B3', fontFamily: 'Montserrat_600SemiBold' },
  emptyText: { color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginBottom: 12 },

  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  iconBoxCredit: { backgroundColor: '#ECFDF5' },
  iconBoxDebit: { backgroundColor: '#FEF2F2' },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemTitle: { fontSize: 15, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  itemMeta: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  itemAmount: { fontSize: 15, fontFamily: 'Montserrat_700Bold', color: '#10B981' },
  debitText: { color: '#EF4444' },

  summaryCard: { margin: 20, backgroundColor: '#EEF6FF', borderRadius: 24, padding: 20 },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  summaryTitle: { fontSize: 15, fontFamily: 'Montserrat_700Bold', color: '#0056B3' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 13, color: '#64748B', fontFamily: 'Roboto_400Regular' },
  summaryValue: { fontSize: 14, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
});
