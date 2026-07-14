import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '../../components/DateTimePicker';
import * as ImagePicker from 'expo-image-picker';
import { AuthFeedbackModal } from '../../components/AuthFeedbackModal';
import { applyForDriver, addDriverVehicle, uploadDriverDocuments } from '../../src/api/drivers';
import { getApiErrorMessage, isValidationError } from '../../src/api/errors';
import { clearPendingDriverOnboarding, setActiveRole } from '../../src/api/tokens';
import { mapGender, parseDateParam, toApiDateString } from '../../src/api/upload';
import {
  getDefaultDriverDob,
  isValidFormDate,
  validateDriverRegistrationForm,
  validateGhanaCardStep,
  validateLicenceStep,
  validatePersonalStep,
  validateVehicleStep,
} from '../../src/utils/driverFormValidation';

type DateFieldKey = 'dob' | 'dateIssued' | 'expiryDate';

const WIZARD_STEPS = [
  {
    key: 'personal',
    title: 'About you',
    subtitle: 'Basic details we need to set up your driver profile.',
  },
  {
    key: 'licence',
    title: "Driver's licence",
    subtitle: 'Enter your licence information and upload both sides.',
  },
  {
    key: 'ghanaCard',
    title: 'Ghana Card',
    subtitle: 'Your national ID number and card photos.',
  },
  {
    key: 'vehicle',
    title: 'Your vehicle',
    subtitle: 'Tell us about the car you will drive with.',
  },
] as const;

const PICKER_TITLES: Record<DateFieldKey, string> = {
  dob: 'Date of birth',
  dateIssued: 'Licence issued date',
  expiryDate: 'Licence expiry date',
};

function addYears(date: Date, years: number): Date {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + years);
  return next;
}

function createDefaultLicenseDates() {
  const today = new Date();
  return {
    dateIssued: addYears(today, -3),
    expiryDate: addYears(today, 5),
  };
}

function isValidPickerDate(date?: Date): date is Date {
  return isValidFormDate(date);
}

function resolveInitialDob(dobParam?: string): Date {
  const parsed = parseDateParam(dobParam);
  if (parsed && isValidFormDate(parsed) && parsed < new Date()) {
    return parsed;
  }
  return getDefaultDriverDob();
}

export default function VehicleDetailsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const allowLeaveRef = useRef(false);
  const { dob: dobParam } = useLocalSearchParams<{ dob?: string }>();
  const initialDob = useMemo(
    () => resolveInitialDob(typeof dobParam === 'string' ? dobParam : undefined),
    [dobParam]
  );
  const licenseDefaults = useMemo(() => createDefaultLicenseDates(), []);

  const [currentStep, setCurrentStep] = useState(0);
  const [gender, setGender] = useState('Male');
  const [formData, setFormData] = useState({
    dob: initialDob,
    emergencyContact: '',
    licenceNumber: '',
    dateIssued: licenseDefaults.dateIssued,
    expiryDate: licenseDefaults.expiryDate,
    ghanaCardNumber: '',
  });
  const [images, setImages] = useState<Record<string, string | null>>({
    licenceFront: null,
    licenceBack: null,
    ghanaFront: null,
    ghanaBack: null,
  });
  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: '2018',
    color: '',
    licensePlate: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ visible: false, title: '', message: '' });
  const [leaveConfirmVisible, setLeaveConfirmVisible] = useState(false);
  const [showPicker, setShowPicker] = useState<DateFieldKey | null>(null);

  const stepMeta = WIZARD_STEPS[currentStep];
  const isLastStep = currentStep === WIZARD_STEPS.length - 1;
  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  const showError = (title: string, message: string) => {
    setFeedback({ visible: true, title, message });
  };

  const showStepError = (step: string, error: unknown) => {
    const message = getApiErrorMessage(error);
    const hint =
      isValidationError(error)
        ? ''
        : message.toLowerCase().includes('unauthorized')
          ? ' Your session may have expired — sign in and try submitting driver details again.'
          : message.toLowerCase().includes('too large') || message.includes('413')
            ? ' Try photos under 1 MB each, or retake them closer to the document.'
            : message.toLowerCase().includes('server')
              ? ' If this keeps happening, contact support with the details you entered.'
              : '';
    showError(
      isValidationError(error) ? 'Check your details' : 'Registration failed',
      `${step}: ${message}${hint}`
    );
  };

  const leaveScreen = useCallback(() => {
    allowLeaveRef.current = true;
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(driver)/home');
  }, [router]);

  const requestLeaveConfirmation = () => {
    setLeaveConfirmVisible(true);
  };

  const handleConfirmLeave = () => {
    setLeaveConfirmVisible(false);
    setTimeout(() => leaveScreen(), 0);
  };

  const handleHeaderBack = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
      return;
    }
    requestLeaveConfirmation();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (allowLeaveRef.current) {
        return;
      }
      event.preventDefault();
      setLeaveConfirmVisible(true);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const parsed = parseDateParam(typeof dobParam === 'string' ? dobParam : undefined);
    if (parsed && isValidFormDate(parsed) && parsed < new Date()) {
      setFormData((prev) => ({ ...prev, dob: parsed }));
    }
  }, [dobParam]);

  const pickImage = async (key: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showError('Permission denied', 'We need access to your gallery to upload documents.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImages((prev) => ({ ...prev, [key]: result.assets[0].uri }));
    }
  };

  const onDateChange = (event: { type?: string }, selectedDate?: Date, key?: DateFieldKey) => {
    if (Platform.OS === 'android') {
      setShowPicker(null);
      if (event.type === 'dismissed' || !isValidPickerDate(selectedDate) || !key) {
        return;
      }
      setFormData((prev) => ({ ...prev, [key]: selectedDate }));
      return;
    }

    if (isValidPickerDate(selectedDate) && key) {
      setFormData((prev) => ({ ...prev, [key]: selectedDate }));
    }
  };

  const formatDate = (date: Date) => {
    if (!isValidPickerDate(date)) {
      return 'Select date';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
  };

  const activePickerValue =
    showPicker === 'dob'
      ? formData.dob
      : showPicker === 'dateIssued'
        ? formData.dateIssued
        : showPicker === 'expiryDate'
          ? formData.expiryDate
          : new Date();

  const pickerConstraints =
    showPicker === 'dob'
      ? { maximumDate: new Date(), minimumDate: addYears(new Date(), -100) }
      : showPicker === 'dateIssued'
        ? { maximumDate: new Date() }
        : showPicker === 'expiryDate'
          ? { minimumDate: new Date() }
          : {};

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return validatePersonalStep(formData.dob, formData.emergencyContact);
      case 1:
        return validateLicenceStep(
          formData,
          Boolean(images.licenceFront),
          Boolean(images.licenceBack)
        );
      case 2:
        return validateGhanaCardStep(
          formData.ghanaCardNumber,
          Boolean(images.ghanaFront),
          Boolean(images.ghanaBack)
        );
      case 3:
        return validateVehicleStep(vehicleData);
      default:
        return { ok: true as const };
    }
  };

  const handleNext = () => {
    const result = validateCurrentStep();
    if (!result.ok) {
      showError('Check your details', result.message);
      return;
    }
    setCurrentStep((step) => Math.min(step + 1, WIZARD_STEPS.length - 1));
  };

  const handleRegister = async () => {
    const stepResult = validateCurrentStep();
    if (!stepResult.ok) {
      showError('Check your details', stepResult.message);
      return;
    }

    const validation = validateDriverRegistrationForm(
      {
        dob: formData.dob,
        emergencyContact: formData.emergencyContact,
        licenceNumber: formData.licenceNumber,
        dateIssued: formData.dateIssued,
        expiryDate: formData.expiryDate,
        ghanaCardNumber: formData.ghanaCardNumber,
      },
      vehicleData
    );

    if (!validation.ok) {
      showError('Check your details', validation.message);
      return;
    }

    setIsLoading(true);
    try {
      try {
        await applyForDriver({
          dateOfBirth: toApiDateString(formData.dob),
          gender: mapGender(gender),
          emergencyContact: validation.emergencyContact,
          licenseNumber: formData.licenceNumber.trim(),
          licenseIssuedDate: toApiDateString(formData.dateIssued),
          licenseExpiryDate: toApiDateString(formData.expiryDate),
          ghanaCardNumber: validation.ghanaCardNumber,
        });
      } catch (error) {
        showStepError('Driver profile', error);
        return;
      }

      try {
        await addDriverVehicle({
          make: vehicleData.make.trim(),
          model: vehicleData.model.trim(),
          year: Number(vehicleData.year) || 2018,
          color: vehicleData.color.trim() || 'Silver',
          licensePlate: validation.licensePlate,
        });
      } catch (error) {
        showStepError('Vehicle details', error);
        return;
      }

      try {
        await uploadDriverDocuments({
          licenseFront: images.licenceFront,
          licenseBack: images.licenceBack,
          ghanaCardFront: images.ghanaFront,
          ghanaCardBack: images.ghanaBack,
        });
      } catch (error) {
        showStepError('Document upload', error);
        return;
      }

      await clearPendingDriverOnboarding();
      await setActiveRole('DRIVER');

      allowLeaveRef.current = true;
      router.replace('/(auth)/success');
    } finally {
      setIsLoading(false);
    }
  };

  const renderUploadBox = (label: string, key: string) => (
    <View style={styles.uploadGroup}>
      <Text style={styles.formLabel}>
        {label}
        <Text style={styles.required}>*</Text>
      </Text>
      <TouchableOpacity style={styles.uploadContainer} onPress={() => pickImage(key)}>
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
            <Text style={styles.uploadText}>Tap to upload {label.toLowerCase()}</Text>
            <Text style={styles.uploadHint}>(Max. file size: 25 MB)</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderPersonalStep = () => (
    <>
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>
          Date of birth<Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity style={styles.inputField} onPress={() => setShowPicker('dob')}>
          <Text style={[styles.input, !isValidPickerDate(formData.dob) && styles.placeholderText]}>
            {formatDate(formData.dob)}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#D0D0D0" />
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>
          Emergency contact<Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.inputField}>
          <TextInput
            style={styles.input}
            placeholder="024 123 4567"
            placeholderTextColor="#D0D0D0"
            keyboardType="phone-pad"
            value={formData.emergencyContact}
            onChangeText={(text) => setFormData({ ...formData, emergencyContact: text })}
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Gender</Text>
        <View style={styles.genderGroup}>
          {['Male', 'Female', 'Other'].map((option) => (
            <TouchableOpacity key={option} style={styles.radioItem} onPress={() => setGender(option)}>
              <View style={[styles.radioCircle, gender === option && styles.radioActive]}>
                {gender === option ? <View style={styles.radioInner} /> : null}
              </View>
              <Text style={styles.radioLabel}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );

  const renderLicenceStep = () => (
    <>
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>
          Licence number<Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.inputField}>
          <TextInput
            style={styles.input}
            placeholder="Driver's licence number"
            placeholderTextColor="#D0D0D0"
            value={formData.licenceNumber}
            onChangeText={(text) => setFormData({ ...formData, licenceNumber: text })}
          />
        </View>
      </View>

      <View style={styles.dateFieldsColumn}>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>
            Date issued<Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity style={styles.inputField} onPress={() => setShowPicker('dateIssued')}>
            <Text style={[styles.input, !isValidPickerDate(formData.dateIssued) && styles.placeholderText]}>
              {formatDate(formData.dateIssued)}
            </Text>
            <Ionicons name="calendar-outline" size={18} color="#D0D0D0" />
          </TouchableOpacity>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>
            Expiry date<Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity style={styles.inputField} onPress={() => setShowPicker('expiryDate')}>
            <Text style={[styles.input, !isValidPickerDate(formData.expiryDate) && styles.placeholderText]}>
              {formatDate(formData.expiryDate)}
            </Text>
            <Ionicons name="calendar-outline" size={18} color="#D0D0D0" />
          </TouchableOpacity>
        </View>
      </View>

      {renderUploadBox('Front side of licence', 'licenceFront')}
      {renderUploadBox('Back side of licence', 'licenceBack')}
    </>
  );

  const renderGhanaCardStep = () => (
    <>
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>
          Ghana Card number<Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.inputField}>
          <TextInput
            style={styles.input}
            placeholder="GHA-123456789-0"
            placeholderTextColor="#D0D0D0"
            autoCapitalize="characters"
            value={formData.ghanaCardNumber}
            onChangeText={(text) => setFormData({ ...formData, ghanaCardNumber: text })}
          />
        </View>
      </View>

      {renderUploadBox('Front side of card', 'ghanaFront')}
      {renderUploadBox('Back side of card', 'ghanaBack')}
    </>
  );

  const renderVehicleStep = () => (
    <>
      <View style={styles.vehicleFields}>
        <View style={styles.inputField}>
          <TextInput
            style={styles.input}
            placeholder="Make (e.g. Toyota)"
            placeholderTextColor="#D0D0D0"
            value={vehicleData.make}
            onChangeText={(text) => setVehicleData({ ...vehicleData, make: text })}
          />
        </View>
        <View style={styles.inputField}>
          <TextInput
            style={styles.input}
            placeholder="Model (e.g. Corolla)"
            placeholderTextColor="#D0D0D0"
            value={vehicleData.model}
            onChangeText={(text) => setVehicleData({ ...vehicleData, model: text })}
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
                onChangeText={(text) => setVehicleData({ ...vehicleData, year: text })}
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
                onChangeText={(text) => setVehicleData({ ...vehicleData, color: text })}
              />
            </View>
          </View>
        </View>
        <View style={styles.inputField}>
          <TextInput
            style={styles.input}
            placeholder="License plate (GR-4521-20)"
            placeholderTextColor="#D0D0D0"
            autoCapitalize="characters"
            value={vehicleData.licensePlate}
            onChangeText={(text) => setVehicleData({ ...vehicleData, licensePlate: text })}
          />
        </View>
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewTitle}>Almost done</Text>
        <Text style={styles.reviewText}>
          Tap complete registration to submit your driver profile, documents, and vehicle.
        </Text>
      </View>
    </>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalStep();
      case 1:
        return renderLicenceStep();
      case 2:
        return renderGhanaCardStep();
      case 3:
        return renderVehicleStep();
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleHeaderBack} style={styles.backButton}>
          <View style={styles.backRow}>
            <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
            <Text style={styles.backText}>{currentStep > 0 ? 'Previous' : 'Back'}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver setup</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressMeta}>
          <Text style={styles.stepCounter}>
            Step {currentStep + 1} of {WIZARD_STEPS.length}
          </Text>
          <Text style={styles.stepName}>{stepMeta.title}</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.stepDots}>
          {WIZARD_STEPS.map((step, index) => (
            <View
              key={step.key}
              style={[
                styles.stepDot,
                index <= currentStep ? styles.stepDotActive : null,
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.stepSubtitle}>{stepMeta.subtitle}</Text>
        {renderStepContent()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 0 ? (
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => setCurrentStep((step) => step - 1)}
            disabled={isLoading}
          >
            <Text style={styles.secondaryBtnText}>Back</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={[styles.primaryBtn, currentStep === 0 && styles.primaryBtnFull]}
          onPress={isLastStep ? handleRegister : handleNext}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.primaryBtnText}>
              {isLastStep ? 'Complete registration' : 'Continue'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {Platform.OS === 'android' && showPicker ? (
        <DateTimePicker
          value={activePickerValue}
          mode="date"
          display="default"
          {...pickerConstraints}
          onChange={(event, date) => onDateChange(event, date, showPicker)}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal visible={showPicker !== null} transparent animationType="slide" onRequestClose={() => setShowPicker(null)}>
          <View style={styles.pickerModalRoot}>
            <TouchableOpacity style={styles.pickerBackdrop} activeOpacity={1} onPress={() => setShowPicker(null)} />
            <View style={styles.pickerSheet}>
              <View style={styles.pickerSheetHeader}>
                <TouchableOpacity onPress={() => setShowPicker(null)} hitSlop={12}>
                  <Text style={styles.pickerCancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.pickerSheetTitle}>
                  {showPicker ? PICKER_TITLES[showPicker] : ''}
                </Text>
                <TouchableOpacity onPress={() => setShowPicker(null)} hitSlop={12}>
                  <Text style={styles.pickerDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
              {showPicker ? (
                <DateTimePicker
                  value={activePickerValue}
                  mode="date"
                  display="spinner"
                  {...pickerConstraints}
                  onChange={(event, date) => onDateChange(event, date, showPicker)}
                  style={styles.pickerWheel}
                  textColor="#1A1A1A"
                />
              ) : null}
            </View>
          </View>
        </Modal>
      ) : null}

      <AuthFeedbackModal
        visible={feedback.visible}
        variant="error"
        title={feedback.title}
        message={feedback.message}
        onClose={() => setFeedback((prev) => ({ ...prev, visible: false }))}
      />

      <AuthFeedbackModal
        visible={leaveConfirmVisible}
        variant="error"
        mode="confirm"
        title="Leave this page?"
        message="Your driver details haven't been submitted. If you go back now, your changes won't be saved."
        cancelLabel="Stay"
        confirmLabel="Leave"
        onClose={() => setLeaveConfirmVisible(false)}
        onConfirm={handleConfirmLeave}
        showButton={false}
      />
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
  backButton: { width: 90 },
  backRow: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 16, color: '#1A1A1A', marginLeft: 4, fontFamily: 'Roboto_400Regular' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', fontFamily: 'Montserrat_600SemiBold' },
  headerSpacer: { width: 90 },

  progressSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  progressMeta: { marginBottom: 10 },
  stepCounter: {
    fontSize: 12,
    color: '#0056B3',
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 4,
  },
  stepName: { fontSize: 20, color: '#1A1A1A', fontFamily: 'Montserrat_700Bold' },
  progressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: { height: '100%', backgroundColor: '#0056B3', borderRadius: 3 },
  stepDots: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  stepDotActive: { backgroundColor: '#0056B3' },

  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
  stepSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#64748B',
    fontFamily: 'Roboto_400Regular',
    marginBottom: 20,
  },

  formGroup: { marginBottom: 16 },
  formLabel: { fontSize: 14, color: '#1A1A1A', marginBottom: 8, fontFamily: 'Roboto_400Regular', fontWeight: '500' },
  required: { color: '#EA4335' },

  inputField: {
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
  },
  input: { flex: 1, fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  placeholderText: { color: '#D0D0D0' },

  genderGroup: { flexDirection: 'row', gap: 20, marginTop: 4 },
  radioItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: { borderColor: '#0052B4' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0052B4' },
  radioLabel: { fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },

  dateFieldsColumn: { gap: 4, marginBottom: 8 },

  uploadGroup: { marginBottom: 16 },
  uploadContainer: {
    height: 140,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },
  previewImage: { width: '100%', height: '100%' },
  uploadIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  plusOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0052B4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F8FAFC',
  },
  uploadText: { fontSize: 14, color: '#0052B4', fontWeight: '500', marginBottom: 2, fontFamily: 'Roboto_400Regular' },
  uploadHint: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },

  vehicleFields: { gap: 14, marginBottom: 8 },
  vehicleRow: { flexDirection: 'row', gap: 12 },
  vehicleRowField: { flex: 1 },

  reviewCard: {
    marginTop: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  reviewTitle: {
    fontSize: 15,
    color: '#1A1A1A',
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 6,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748B',
    fontFamily: 'Roboto_400Regular',
  },

  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  secondaryBtn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  secondaryBtnText: { color: '#1A1A1A', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
  primaryBtn: {
    flex: 1.4,
    backgroundColor: '#0052B4',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnFull: { flex: 1 },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600', fontFamily: 'Roboto_400Regular' },

  pickerModalRoot: { flex: 1, justifyContent: 'flex-end' },
  pickerBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  pickerSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
  },
  pickerSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pickerSheetTitle: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  pickerCancelText: { fontSize: 16, fontFamily: 'Roboto_400Regular', color: '#64748B' },
  pickerDoneText: { color: '#0056B3', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
  pickerWheel: { height: 216, width: '100%' },
});
