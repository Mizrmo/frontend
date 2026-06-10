import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getHomeRouteForRole, useAuth } from '../src/context/AuthContext';
import { verifyPayment } from '../src/api/payments';
import { verifyPaymentWithRetry } from '../src/utils/payment';

export default function PaymentReturnScreen() {
  const router = useRouter();
  const { activeRole } = useAuth();
  const params = useLocalSearchParams<{ reference?: string; trxref?: string }>();
  const [statusText, setStatusText] = useState('Confirming payment...');

  useEffect(() => {
    let cancelled = false;

    const finish = () => {
      if (!cancelled) {
        router.replace(getHomeRouteForRole(activeRole));
      }
    };

    const reference =
      (typeof params.reference === 'string' && params.reference) ||
      (typeof params.trxref === 'string' && params.trxref) ||
      null;

    if (!reference) {
      const timer = setTimeout(finish, 400);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }

    (async () => {
      try {
        await verifyPaymentWithRetry(
          (ref) => verifyPayment({ reference: ref }),
          reference,
          3,
          2000
        );
        if (!cancelled) {
          setStatusText('Payment confirmed');
        }
      } catch {
        if (!cancelled) {
          setStatusText('Payment pending — check your trips');
        }
      } finally {
        setTimeout(finish, 600);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, activeRole, params.reference, params.trxref]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0056B3" />
      <Text style={styles.statusText}>{statusText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  statusText: {
    marginTop: 16,
    fontSize: 15,
    color: '#64748B',
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
