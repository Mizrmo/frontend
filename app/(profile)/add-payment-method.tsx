import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPaystackBanks, type PaystackBank } from '../../src/api/payments';
import { getApiErrorMessage } from '../../src/api/errors';
import {
  registerPayoutAccount,
  type MomoProvider,
  type PayoutAccountType,
} from '../../src/api/payouts';

const MOMO_PROVIDERS: MomoProvider[] = ['MTN', 'VODAFONE', 'AIRTELTIGO'];

export default function AddPaymentMethodScreen() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<PayoutAccountType>('MOBILE_MONEY');
  const [banks, setBanks] = useState<PaystackBank[]>([]);
  const [selectedBankCode, setSelectedBankCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    accountName: '',
    momoNumber: '',
    momoProvider: 'MTN' as MomoProvider,
    bankName: '',
    accountNumber: '',
  });

  useEffect(() => {
    getPaystackBanks()
      .then((list) => {
        setBanks(list);
        if (list[0]?.code) {
          setSelectedBankCode(list[0].code);
          setForm((prev) => ({ ...prev, bankName: list[0].name ?? '' }));
        }
      })
      .catch(() => setBanks([]));
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (accountType === 'MOBILE_MONEY') {
        if (!form.momoNumber.trim()) {
          Alert.alert('Required', 'Enter your Mobile Money number.');
          return;
        }
        await registerPayoutAccount({
          accountType: 'MOBILE_MONEY',
          momoNumber: form.momoNumber.trim(),
          momoProvider: form.momoProvider,
        });
      } else {
        if (!form.accountName.trim() || !form.accountNumber.trim() || !selectedBankCode) {
          Alert.alert('Required', 'Fill in all bank account fields.');
          return;
        }
        await registerPayoutAccount({
          accountType: 'BANK_ACCOUNT',
          bankAccountName: form.accountName.trim(),
          bankAccountNumber: form.accountNumber.trim(),
          bankName: form.bankName,
          bankCode: selectedBankCode,
        });
      }

      Alert.alert('Success', 'Payout account saved successfully.');
      router.back();
    } catch (error) {
      Alert.alert('Save failed', getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtnCircle}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payout account</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeBtn, accountType === 'MOBILE_MONEY' && styles.typeBtnActive]}
            onPress={() => setAccountType('MOBILE_MONEY')}
          >
            <Text style={[styles.typeBtnText, accountType === 'MOBILE_MONEY' && styles.typeBtnTextActive]}>
              Mobile Money
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, accountType === 'BANK_ACCOUNT' && styles.typeBtnActive]}
            onPress={() => setAccountType('BANK_ACCOUNT')}
          >
            <Text style={[styles.typeBtnText, accountType === 'BANK_ACCOUNT' && styles.typeBtnTextActive]}>
              Bank
            </Text>
          </TouchableOpacity>
        </View>

        {accountType === 'MOBILE_MONEY' ? (
          <>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>MoMo number</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={form.momoNumber}
                  onChangeText={(t) => setForm({ ...form, momoNumber: t })}
                  placeholder="0551234567"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            <Text style={styles.label}>Provider</Text>
            <View style={styles.providerRow}>
              {MOMO_PROVIDERS.map((provider) => (
                <TouchableOpacity
                  key={provider}
                  style={[
                    styles.providerChip,
                    form.momoProvider === provider && styles.providerChipActive,
                  ]}
                  onPress={() => setForm({ ...form, momoProvider: provider })}
                >
                  <Text
                    style={[
                      styles.providerChipText,
                      form.momoProvider === provider && styles.providerChipTextActive,
                    ]}
                  >
                    {provider}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Account name</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={form.accountName}
                  onChangeText={(t) => setForm({ ...form, accountName: t })}
                  placeholder="Name on account"
                />
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Account number</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={form.accountNumber}
                  onChangeText={(t) => setForm({ ...form, accountNumber: t })}
                  placeholder="Account number"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <Text style={styles.label}>Bank</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bankScroll}>
              {banks.map((bank) => (
                <TouchableOpacity
                  key={bank.code ?? bank.slug ?? bank.name}
                  style={[
                    styles.bankChip,
                    selectedBankCode === bank.code && styles.bankChipActive,
                  ]}
                  onPress={() => {
                    setSelectedBankCode(bank.code ?? '');
                    setForm((prev) => ({ ...prev, bankName: bank.name ?? '' }));
                  }}
                >
                  <Text
                    style={[
                      styles.bankChipText,
                      selectedBankCode === bank.code && styles.bankChipTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {bank.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitBtnText}>Save payout account</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backBtnCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  content: { padding: 24, paddingBottom: 40 },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  typeBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeBtnActive: { backgroundColor: '#0056B3', borderColor: '#0056B3' },
  typeBtnText: { fontFamily: 'Montserrat_600SemiBold', color: '#64748B', fontSize: 14 },
  typeBtnTextActive: { color: '#FFF' },
  form: { gap: 24, marginTop: 20 },
  fieldGroup: { gap: 8, marginBottom: 16 },
  label: { fontSize: 14, color: '#64748B', fontFamily: 'Roboto_400Regular', marginLeft: 4, marginBottom: 8 },
  inputWrap: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: { fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  providerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  providerChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  providerChipActive: { backgroundColor: '#EEF6FF', borderColor: '#0056B3' },
  providerChipText: { fontSize: 12, fontFamily: 'Montserrat_600SemiBold', color: '#64748B' },
  providerChipTextActive: { color: '#0056B3' },
  bankScroll: { marginBottom: 24 },
  bankChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
    maxWidth: 160,
  },
  bankChipActive: { backgroundColor: '#EEF6FF', borderColor: '#0056B3' },
  bankChipText: { fontSize: 12, fontFamily: 'Roboto_400Regular', color: '#64748B' },
  bankChipTextActive: { color: '#0056B3', fontFamily: 'Montserrat_600SemiBold' },
  submitBtn: {
    backgroundColor: '#0056B3',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Roboto_400Regular', fontWeight: '600' },
});
