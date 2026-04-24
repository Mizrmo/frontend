import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AddPaymentMethodScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: 'Jane Doe',
    number: '123236',
    bank: 'CalBank',
  });

  const handleSubmit = () => {
    Alert.alert('Success', 'Payment method added successfully.');
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtnCircle}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Method</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Account Name</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={t => setForm({ ...form, name: t })}
                placeholder="Enter account name"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Account Number</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={form.number}
                onChangeText={t => setForm({ ...form, number: t })}
                placeholder="Enter account number"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Bank</Text>
            <TouchableOpacity style={styles.selectWrap}>
              <Text style={styles.selectText}>{form.bank}</Text>
              <Ionicons name="chevron-down" size={20} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20,
  },
  backBtnCircle: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#F8FAFC',
    borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  content: { padding: 24, flex: 1 },
  form: { gap: 24, marginTop: 20 },
  fieldGroup: { gap: 8 },
  label: { fontSize: 14, color: '#64748B', fontFamily: 'Roboto_400Regular', marginLeft: 4 },
  inputWrap: {
    height: 52, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC', paddingHorizontal: 16, justifyContent: 'center',
  },
  input: { fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  selectWrap: {
    height: 52, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC', paddingHorizontal: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  selectText: { fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  submitBtn: {
    backgroundColor: '#0056B3', height: 54, borderRadius: 27,
    justifyContent: 'center', alignItems: 'center', marginTop: 10,
  },
  submitBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Roboto_400Regular', fontWeight: '600' },
});
