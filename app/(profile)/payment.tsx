import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  formatPayoutAccountLabel,
  getDriverPayoutAccount,
  getDriverPayouts,
  type DriverPayoutAccount,
  type DriverPayoutRecord,
} from '../../src/api/payouts';
import { useAuth } from '../../src/context/AuthContext';
import { formatCurrency } from '../../src/api/trips';
import { getNumericAmount } from '../../src/api/drivers';

export default function PaymentScreen() {
  const router = useRouter();
  const { activeRole, user } = useAuth();
  const isDriver = activeRole === 'DRIVER' || user?.role === 'DRIVER';
  const [account, setAccount] = useState<DriverPayoutAccount | null>(null);
  const [payouts, setPayouts] = useState<DriverPayoutRecord[]>([]);
  const [isLoading, setIsLoading] = useState(isDriver);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadPayoutData = useCallback(async () => {
    if (!isDriver) {
      return;
    }
    try {
      const [accountData, payoutHistory] = await Promise.all([
        getDriverPayoutAccount().catch(() => null),
        getDriverPayouts().catch(() => []),
      ]);
      setAccount(accountData);
      setPayouts(payoutHistory);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isDriver]);

  useEffect(() => {
    loadPayoutData();
  }, [loadPayoutData]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          isDriver ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                loadPayoutData();
              }}
            />
          ) : undefined
        }
      >
        {!isDriver ? (
          <>
            <Text style={styles.sectionTitle}>Ride payments</Text>
            <View style={styles.infoCard}>
              <Ionicons name="phone-portrait-outline" size={28} color="#0056B3" />
              <Text style={styles.infoTitle}>MTN Mobile Money via Paystack</Text>
              <Text style={styles.infoText}>
                You pay for rides at booking time using Mobile Money. No saved cards are required.
              </Text>
            </View>
          </>
        ) : isLoading ? (
          <ActivityIndicator size="large" color="#0056B3" style={{ marginTop: 40 }} />
        ) : (
          <>
            <Text style={styles.sectionTitle}>Payout account</Text>
            <View style={styles.payoutCard}>
              <Ionicons
                name={account?.accountType === 'BANK_ACCOUNT' ? 'business-outline' : 'wallet-outline'}
                size={24}
                color="#0056B3"
              />
              <View style={styles.payoutInfo}>
                <Text style={styles.payoutLabel}>{formatPayoutAccountLabel(account)}</Text>
                <Text style={styles.payoutSub}>
                  {account?.isVerified ? 'Verified' : 'Earnings are sent to this account'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => router.push('/(profile)/add-payment-method')}
            >
              <Text style={styles.addBtnText}>
                {account ? 'Update payout account' : 'Add payout account'}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recent payouts</Text>
            {payouts.length === 0 ? (
              <Text style={styles.emptyText}>No payouts yet.</Text>
            ) : (
              payouts.slice(0, 10).map((payout, index) => (
                <View key={payout.id ?? `payout-${index}`} style={styles.payoutRow}>
                  <View>
                    <Text style={styles.payoutRowTitle}>{payout.status ?? 'Payout'}</Text>
                    <Text style={styles.payoutRowDate}>{payout.createdAt ?? ''}</Text>
                  </View>
                  <Text style={styles.payoutRowAmount}>
                    {formatCurrency(getNumericAmount(payout.amount))}
                  </Text>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 16, color: '#1A1A1A', marginLeft: 4, fontFamily: 'Roboto_400Regular' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', marginBottom: 16 },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  payoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
  },
  payoutInfo: { flex: 1, marginLeft: 14 },
  payoutLabel: { fontSize: 15, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  payoutSub: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 4 },
  addBtn: {
    backgroundColor: '#0056B3',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: { color: '#FFF', fontSize: 15, fontFamily: 'Montserrat_600SemiBold' },
  emptyText: { color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  payoutRowTitle: { fontSize: 14, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', textTransform: 'capitalize' },
  payoutRowDate: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  payoutRowAmount: { fontSize: 14, fontFamily: 'Montserrat_700Bold', color: '#10B981' },
});
