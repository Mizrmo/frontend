import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import {
  getPaystackCheckoutUrl,
  initiatePayment,
  verifyPayment,
} from '../src/api/payments';
import { getApiErrorMessage } from '../src/api/errors';
import { formatCurrency } from '../src/api/trips';
import { extractPaymentReference, verifyPaymentWithRetry } from '../src/utils/payment';

WebBrowser.maybeCompleteAuthSession();

interface PaystackCheckoutModalProps {
  visible: boolean;
  bookingId: string | null;
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaystackCheckoutModal({
  visible,
  bookingId,
  amount,
  onClose,
  onSuccess,
}: PaystackCheckoutModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const deepLinkRef = useRef<{ remove: () => void } | null>(null);

  const resetState = () => {
    setIsProcessing(false);
    setPaymentReference(null);
    setStatusMessage(null);
  };

  const handleClose = () => {
    deepLinkRef.current?.remove();
    deepLinkRef.current = null;
    resetState();
    onClose();
  };

  const runVerify = useCallback(
    async (reference: string, silent = false) => {
      setIsProcessing(true);
      setStatusMessage('Confirming payment...');
      try {
        await verifyPaymentWithRetry(
          (ref) => verifyPayment({ reference: ref }),
          reference,
          3,
          2000
        );
        deepLinkRef.current?.remove();
        deepLinkRef.current = null;
        resetState();
        onSuccess();
        if (!silent) {
          Alert.alert('Payment successful', 'Your booking is confirmed.');
        }
      } catch (error) {
        setStatusMessage('Payment not confirmed yet. You can retry verification.');
        if (!silent) {
          Alert.alert('Verification pending', getApiErrorMessage(error));
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [onSuccess]
  );

  useEffect(() => {
    if (!visible || !paymentReference) {
      return;
    }

    const subscription = Linking.addEventListener('url', ({ url }) => {
      if (!url.includes('payment-return')) {
        return;
      }
      const ref = extractPaymentReference(url) ?? paymentReference;
      runVerify(ref, true);
    });

    deepLinkRef.current = subscription;

    return () => {
      subscription.remove();
    };
  }, [visible, paymentReference, runVerify]);

  const openCheckout = async (reference: string, checkoutUrl: string) => {
    const redirectUrl = Linking.createURL('payment-return');

    try {
      const authResult = await WebBrowser.openAuthSessionAsync(checkoutUrl, redirectUrl);
      if (authResult.type === 'success' && authResult.url) {
        const ref = extractPaymentReference(authResult.url) ?? reference;
        await runVerify(ref, true);
        return;
      }
    } catch {
      // Fall back to standard in-app browser.
    }

    await WebBrowser.openBrowserAsync(checkoutUrl, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
    });

    await runVerify(reference, true);
  };

  const handleStartPayment = async () => {
    if (!bookingId) {
      return;
    }

    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const init = await initiatePayment({ bookingId });
      const reference = init.reference;
      if (!reference) {
        throw new Error('Payment reference was not returned by the server.');
      }

      setPaymentReference(reference);

      const checkoutUrl = getPaystackCheckoutUrl(init);
      if (!checkoutUrl) {
        throw new Error('Paystack checkout URL was not returned.');
      }

      await openCheckout(reference, checkoutUrl);
    } catch (error) {
      Alert.alert('Payment failed', getApiErrorMessage(error));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetryVerify = async () => {
    if (!paymentReference) {
      Alert.alert('Payment', 'Start payment first.');
      return;
    }
    await runVerify(paymentReference);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Complete Payment</Text>
        <Text style={styles.subtitle}>
          Pay {formatCurrency(amount)} with MTN Mobile Money via Paystack.
        </Text>

        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Amount due</Text>
          <Text style={styles.amountValue}>{formatCurrency(amount)}</Text>
        </View>

        {statusMessage ? <Text style={styles.statusMessage}>{statusMessage}</Text> : null}

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleStartPayment}
          disabled={isProcessing || !bookingId}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.primaryBtnText}>Pay with Mobile Money</Text>
          )}
        </TouchableOpacity>

        {paymentReference ? (
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={handleRetryVerify}
            disabled={isProcessing}
          >
            <Text style={styles.secondaryBtnText}>Retry confirmation</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(30, 41, 59, 0.6)' },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 48 : 32,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', textAlign: 'center' },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 20,
  },
  amountBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountLabel: { fontSize: 14, color: '#64748B', fontFamily: 'Roboto_400Regular' },
  amountValue: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#0056B3' },
  statusMessage: {
    fontSize: 13,
    color: '#0056B3',
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: '#0056B3',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
  secondaryBtn: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#0056B3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryBtnText: { color: '#0056B3', fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
  cancelBtn: { alignItems: 'center', paddingVertical: 8 },
  cancelBtnText: { color: '#94A3B8', fontFamily: 'Roboto_400Regular', fontSize: 14 },
});
