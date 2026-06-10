import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert, Image, Dimensions, ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { applyForDriver, addDriverVehicle, uploadDriverDocuments } from '../../src/api/drivers';
import { getApiErrorMessage } from '../../src/api/errors';
import { clearPendingDriverOnboarding, setActiveRole } from '../../src/api/tokens';
import { mapGender, parseDateParam, toApiDateString } from '../../src/api/upload';

const { width } = Dimensions.get('window');

export default function VehicleDetailsScreen() {
  const router = useRouter();
  const { dob: dobParam } = useLocalSearchParams<{ dob?: string }>();
  const initialDob = useMemo(
    () => parseDateParam(typeof dobParam === 'string' ? dobParam : undefined) ?? new Date(),
    [dobParam]
  );
  const [gender, setGender] = useState('Male');
  const [formData, setFormData] = useState({
    dob: initialDob,
    emergencyContact: '',
    licenceNumber: '',
    dateIssued: new Date(),
    expiryDate: new Date(),
    ghanaCardNumber: '',
    organisationType: '',
  });

  const [images, setImages] = useState<Record<string, string | null>>({
    licenceFront: null,
    licenceBack: null,
    ghanaFront: null,
    ghanaBack: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: '2018',
    color: '',
    licensePlate: '',
  });

  const pickImage = async (key: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your gallery to upload documents.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImages({ ...images, [key]: result.assets[0].uri });
    }
  };

  const onDateChange = (event: any, selectedDate?: Date, key?: string) => {
    setShowPicker(null);
    if (selectedDate && key) {
      setFormData({ ...formData, [key]: selectedDate });
    }
  };

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const [showPicker, setShowPicker] = useState<string | null>(null);

  useEffect(() => {
    const parsed = parseDateParam(typeof dobParam === 'string' ? dobParam : undefined);
    if (parsed) {
      setFormData((prev) => ({ ...prev, dob: parsed }));
    }
  }, [dobParam]);

  const handleRegister = async () => {
    if (!formData.emergencyContact.trim() || !formData.licenceNumber.trim() || !formData.ghanaCardNumber.trim()) {
      Alert.alert('Required', 'Please complete all required driver fields.');
      return;
    }
    if (!vehicleData.make.trim() || !vehicleData.model.trim() || !vehicleData.licensePlate.trim()) {
      Alert.alert('Required', 'Please enter your vehicle make, model, and license plate.');
      return;
    }

    setIsLoading(true);
    try {
      await applyForDriver({
        dateOfBirth: toApiDateString(formData.dob),
        gender: mapGender(gender),
        emergencyContact: formData.emergencyContact.trim(),
        licenseNumber: formData.licenceNumber.trim(),
        licenseIssuedDate: toApiDateString(formData.dateIssued),
        licenseExpiryDate: toApiDateString(formData.expiryDate),
        ghanaCardNumber: formData.ghanaCardNumber.trim(),
      });

      await addDriverVehicle({
        make: vehicleData.make.trim(),
        model: vehicleData.model.trim(),
        year: Number(vehicleData.year) || 2018,
        color: vehicleData.color.trim() || 'Silver',
        licensePlate: vehicleData.licensePlate.trim(),
      });

      await uploadDriverDocuments({
        licenseFront: images.licenceFront,
        licenseBack: images.licenceBack,
        ghanaCardFront: images.ghanaFront,
        ghanaCardBack: images.ghanaBack,
      });

      await clearPendingDriverOnboarding();
      await setActiveRole('DRIVER');

      router.replace('/(auth)/success');
    } catch (error) {
      const message = getApiErrorMessage(error);
      const hint =
        message.toLowerCase().includes('unauthorized')
          ? ' Your session may have expired — sign in and try submitting driver details again.'
          : message.toLowerCase().includes('too large') || message.includes('413')
            ? ' Try photos under 1 MB each, or skip optional uploads if you added extra images.'
            : '';
      Alert.alert('Registration failed', `${message}${hint}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderUploadBox = (label: string, key: string) => (
    <View style={styles.uploadGroup}>
      <Text style={styles.formLabel}>{label}<Text style={styles.required}>*</Text></Text>
      <TouchableOpacity 
        style={styles.uploadContainer} 
        onPress={() => pickImage(key)}
      >
        {images[key] ? (
          <Image source={{ uri: images[key] }} style={styles.previewImage} resizeMode="cover" />
        ) : (
          <>
            <View style={styles.uploadIconCircle}>
              <Ionicons name="image-outline" size={24} color="#0052B4" />
              <View style={styles.plusOverlay}>
                <Ionicons name="add" size={12} color="#FFF" />
              </View>
            </View>
            <Text style={styles.uploadText}>Click to Upload {label}</Text>
            <Text style={styles.uploadHint}>(Max. File size: 25 MB)</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <View style={styles.backRow}>
            <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
            <Text style={styles.backText}>Back</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver Details</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        
        {/* Date of Birth */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Date Of Birth<Text style={styles.required}>*</Text></Text>
          <TouchableOpacity 
            style={styles.inputField} 
            onPress={() => setShowPicker('dob')}
          >
            <Text style={[styles.input, !formData.dob && { color: '#D0D0D0' }]}>
              {formatDate(formData.dob)}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#D0D0D0" />
          </TouchableOpacity>
          {showPicker === 'dob' && (
            <DateTimePicker
              value={formData.dob}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, d) => onDateChange(e, d, 'dob')}
            />
          )}
        </View>

        {/* Emergency Contact */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Emergency Contact<Text style={styles.required}>*</Text></Text>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Emergency Contact"
              placeholderTextColor="#D0D0D0"
              value={formData.emergencyContact}
              onChangeText={(t) => setFormData({...formData, emergencyContact: t})}
            />
          </View>
        </View>

        {/* Gender Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Select Gender</Text>
          <View style={styles.genderGroup}>
            {['Male', 'Female', 'Other'].map((option) => (
              <TouchableOpacity 
                key={option} 
                style={styles.radioItem} 
                onPress={() => setGender(option)}
              >
                <View style={[styles.radioCircle, gender === option && styles.radioActive]}>
                  {gender === option && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Licence Details Section */}
        <View style={styles.sectionFrame}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Driver's Licence<Text style={styles.required}>*</Text></Text>
            <View style={styles.inputField}>
              <TextInput
                style={styles.input}
                placeholder="Driver's Licence Number"
                placeholderTextColor="#D0D0D0"
                value={formData.licenceNumber}
                onChangeText={(t) => setFormData({...formData, licenceNumber: t})}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.formLabel}>Date Issued<Text style={styles.required}>*</Text></Text>
              <TouchableOpacity 
                style={styles.inputField} 
                onPress={() => setShowPicker('dateIssued')}
              >
                <Text style={[styles.input, { fontSize: 13 }, !formData.dateIssued && { color: '#D0D0D0' }]}>
                  {formatDate(formData.dateIssued)}
                </Text>
                <Ionicons name="calendar-outline" size={18} color="#D0D0D0" />
              </TouchableOpacity>
              {showPicker === 'dateIssued' && (
                <DateTimePicker
                  value={formData.dateIssued}
                  mode="date"
                  display="default"
                  onChange={(e, d) => onDateChange(e, d, 'dateIssued')}
                />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.formLabel}>Expiry Date<Text style={styles.required}>*</Text></Text>
              <TouchableOpacity 
                style={styles.inputField} 
                onPress={() => setShowPicker('expiryDate')}
              >
                <Text style={[styles.input, { fontSize: 13 }, !formData.expiryDate && { color: '#D0D0D0' }]}>
                  {formatDate(formData.expiryDate)}
                </Text>
                <Ionicons name="calendar-outline" size={18} color="#D0D0D0" />
              </TouchableOpacity>
              {showPicker === 'expiryDate' && (
                <DateTimePicker
                  value={formData.expiryDate}
                  mode="date"
                  display="default"
                  onChange={(e, d) => onDateChange(e, d, 'expiryDate')}
                />
              )}
            </View>
          </View>

          {renderUploadBox('Front Side of Card', 'licenceFront')}
          {renderUploadBox('Back Side of Card', 'licenceBack')}
        </View>

        {/* Ghana Card Section */}
        <View style={[styles.formGroup, { marginTop: 20 }]}>
          <View style={styles.inputFieldPill}>
            <TextInput
              style={styles.input}
              placeholder="Enter Ghana Card Number"
              placeholderTextColor="#94A3B8"
              value={formData.ghanaCardNumber}
              onChangeText={(t) => setFormData({...formData, ghanaCardNumber: t})}
            />
          </View>
        </View>

        {renderUploadBox('Front Side of Card', 'ghanaFront')}
        <View style={{ marginBottom: 20 }}>
          {renderUploadBox('Back Side of Card', 'ghanaBack')}
        </View>

        <Text style={styles.vehicleSectionTitle}>Vehicle Details</Text>
        <View style={styles.vehicleFields}>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Make (e.g. Toyota)"
              placeholderTextColor="#D0D0D0"
              value={vehicleData.make}
              onChangeText={(t) => setVehicleData({ ...vehicleData, make: t })}
            />
          </View>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Model (e.g. Corolla)"
              placeholderTextColor="#D0D0D0"
              value={vehicleData.model}
              onChangeText={(t) => setVehicleData({ ...vehicleData, model: t })}
            />
          </View>
          <View style={styles.vehicleRow}>
            <View style={styles.vehicleRowField}>
              <View style={styles.inputField}>
                <TextInput
                  style={styles.input}
                  placeholder="Year"
                  keyboardType="number-pad"
                  value={vehicleData.year}
                  onChangeText={(t) => setVehicleData({ ...vehicleData, year: t })}
                />
              </View>
            </View>
            <View style={styles.vehicleRowField}>
              <View style={styles.inputField}>
                <TextInput
                  style={styles.input}
                  placeholder="Color"
                  placeholderTextColor="#D0D0D0"
                  value={vehicleData.color}
                  onChangeText={(t) => setVehicleData({ ...vehicleData, color: t })}
                />
              </View>
            </View>
          </View>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="License Plate (GR-1234-20)"
              autoCapitalize="characters"
              value={vehicleData.licensePlate}
              onChangeText={(t) => setVehicleData({ ...vehicleData, licensePlate: t })}
            />
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.registerBtnText}>Register</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    height: 100,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  backButton: { width: 80 },
  backRow: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 16, color: '#1A1A1A', marginLeft: 4, fontFamily: 'Roboto_400Regular' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', fontFamily: 'Montserrat_600SemiBold' },
  
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
  
  formGroup: { marginBottom: 16 },
  formLabel: { fontSize: 14, color: '#1A1A1A', marginBottom: 8, fontFamily: 'Roboto_400Regular', fontWeight: '500' },
  required: { color: '#EA4335' },
  
  inputField: {
    height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#E2E8F0',
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#FFF'
  },
  inputFieldPill: {
    height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#E2E8F0',
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#FFF',
    marginTop: 10
  },
  input: { flex: 1, fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  
  genderGroup: { flexDirection: 'row', gap: 20, marginTop: 4 },
  radioItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radioCircle: { 
    width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#D0D0D0',
    justifyContent: 'center', alignItems: 'center'
  },
  radioActive: { borderColor: '#0052B4' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0052B4' },
  radioLabel: { fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  
  sectionFrame: { marginTop: 10 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  
  uploadGroup: { marginBottom: 16 },
  uploadContainer: {
    height: 140, borderRadius: 12, borderWidth: 1, borderColor: '#D0D0D0', borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', overflow: 'hidden'
  },
  previewImage: { width: '100%', height: '100%' },
  uploadIconCircle: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#EDF2FF',
    justifyContent: 'center', alignItems: 'center', marginBottom: 8
  },
  plusOverlay: {
    position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#0052B4', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#F8FAFC'
  },
  uploadText: { fontSize: 14, color: '#0052B4', fontWeight: '500', marginBottom: 2 },
  uploadHint: { fontSize: 12, color: '#94A3B8' },

  vehicleSectionTitle: {
    fontSize: 14,
    color: '#1A1A1A',
    marginTop: 24,
    marginBottom: 12,
    fontFamily: 'Roboto_400Regular',
    fontWeight: '500',
  },
  vehicleFields: { gap: 14, marginBottom: 8 },
  vehicleRow: { flexDirection: 'row', gap: 12 },
  vehicleRowField: { flex: 1 },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  registerBtn: {
    backgroundColor: '#0052B4', height: 50, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center',
  },
  registerBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600', fontFamily: 'Roboto_400Regular' }
});
