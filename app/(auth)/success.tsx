import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthFeedbackModal } from '../../components/AuthFeedbackModal';
import { getHomeRouteForUser, useAuth } from '../../src/context/AuthContext';

export default function SuccessScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { user, activeRole } = useAuth();
  const [showApprovalModal, setShowApprovalModal] = useState(true);
  const isDriver = activeRole === 'DRIVER' || user?.role === 'DRIVER';
  const homeRoute = getHomeRouteForUser(user, activeRole);
  const isWideWeb = Platform.OS === 'web' && width >= 768;

  const goToDashboard = () => {
    setShowApprovalModal(false);
    router.replace(homeRoute);
  };

  const contactSupport = () => {
    setShowApprovalModal(false);
    router.replace({
      pathname: '/(profile)/help-support',
      params: { topic: 'driver-approval' },
    });
  };

  if (isDriver) {
    return (
      <View style={[styles.container, styles.driverPage, isWideWeb && styles.driverPageWeb]}>
        <View style={[styles.driverCard, isWideWeb && styles.driverCardWeb]}>
          <Image
            source={require('../../assets/successfulmascot.png')}
            style={styles.driverMascot}
            resizeMode="contain"
          />
          <Text style={styles.driverEyebrow}>Driver application</Text>
          <Text style={styles.driverTitle}>You're almost ready</Text>
          <Text style={styles.driverMessage}>
            Thanks for signing up as a Mizrmo driver. Our team is reviewing your documents — this usually
            takes 24–48 hours. You can explore your dashboard while you wait.
          </Text>

          <View style={styles.driverActions}>
            <TouchableOpacity style={styles.btn} onPress={goToDashboard} accessibilityRole="button">
              <Text style={styles.btnText}>Go to Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={contactSupport}
              accessibilityRole="button"
            >
              <Ionicons name="headset-outline" size={18} color="#0056B3" />
              <Text style={styles.outlineBtnText}>Contact Support if delayed</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sweet-alert style modal on first land; page remains usable if dismissed */}
        <AuthFeedbackModal
          visible={showApprovalModal}
          variant="success"
          title="Application submitted!"
          message={
            "Thanks for signing up as a Mizrmo driver. Our team is reviewing your documents — this usually takes 24–48 hours.\n\nYou can explore your dashboard while you wait. If approval takes longer than expected, contact support and we'll help."
          }
          buttonLabel="Go to Dashboard"
          secondaryButtonLabel="Contact Support"
          onClose={goToDashboard}
          onSecondaryPress={contactSupport}
          autoCloseMs={0}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, isWideWeb && styles.driverPageWeb]}>
      <View style={[styles.content, isWideWeb && styles.driverCardWeb]}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark" size={48} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>Account Created!</Text>

        <Text style={styles.message}>
          Welcome to Mizrmo! Your account has been successfully created. Start booking rides today.
        </Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace('/(rider)/enable-location')}
        >
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>

        {user ? (
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.replace(homeRoute)}>
            <Text style={styles.secondaryBtnText}>Skip to Home</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', justifyContent: 'center' },
  driverPage: {
    backgroundColor: '#F4F8FC',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  driverPageWeb: {
    minHeight: '100%' as unknown as number,
    backgroundColor: '#EAF1F8',
  },
  driverCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFF',
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingVertical: 32,
    alignItems: 'center',
    shadowColor: '#0056B3',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 28,
    elevation: 4,
  },
  driverCardWeb: {
    maxWidth: 440,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  driverMascot: {
    width: 148,
    height: 148,
    marginBottom: 8,
  },
  driverEyebrow: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#0056B3',
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 8,
  },
  driverTitle: {
    fontSize: 26,
    fontFamily: 'Montserrat_700Bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  driverMessage: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 28,
    fontFamily: 'Roboto_400Regular',
  },
  driverActions: {
    width: '100%',
    gap: 12,
  },
  content: { padding: 40, alignItems: 'center', width: '100%', maxWidth: 440, alignSelf: 'center' },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 10,
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    fontFamily: 'Roboto_400Regular',
  },
  btn: {
    backgroundColor: '#0056B3',
    width: '100%',
    height: 55,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: { color: '#FFF', fontSize: 16, fontFamily: 'Roboto_400Regular', fontWeight: '600' },
  outlineBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  outlineBtnText: {
    color: '#0056B3',
    fontSize: 15,
    fontFamily: 'Montserrat_600SemiBold',
  },
  secondaryBtn: { marginTop: 16, paddingVertical: 12 },
  secondaryBtnText: { color: '#0056B3', fontSize: 15, fontFamily: 'Roboto_400Regular' },
});
