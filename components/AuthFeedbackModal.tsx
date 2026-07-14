import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Asset } from 'expo-asset';

type FeedbackVariant = 'success' | 'error';

interface AuthFeedbackModalProps {
  visible: boolean;
  variant: FeedbackVariant;
  title: string;
  message: string;
  onClose: () => void;
  buttonLabel?: string;
  showButton?: boolean;
  mode?: 'alert' | 'confirm';
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

const MASCOT_IMAGES = {
  success: require('../assets/successfulmascot.png'),
  error: require('../assets/notsucess.png'),
} as const;

const mascotPreloadPromise = Asset.loadAsync([
  MASCOT_IMAGES.success,
  MASCOT_IMAGES.error,
]);

export function preloadAuthFeedbackMascots() {
  return mascotPreloadPromise;
}

export function AuthFeedbackModal({
  visible,
  variant,
  title,
  message,
  onClose,
  buttonLabel = 'OK',
  showButton = true,
  mode = 'alert',
  confirmLabel = 'Leave',
  cancelLabel = 'Stay',
  onConfirm,
}: AuthFeedbackModalProps) {
  const [isReady, setIsReady] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    if (!visible) {
      setIsReady(false);
      overlayOpacity.setValue(0);
      cardOpacity.setValue(0);
      cardScale.setValue(0.94);
      return;
    }

    let cancelled = false;

    void mascotPreloadPromise.then(() => {
      if (cancelled) {
        return;
      }

      setIsReady(true);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 7,
          tension: 90,
          useNativeDriver: true,
        }),
      ]).start();
    });

    return () => {
      cancelled = true;
    };
  }, [visible, overlayOpacity, cardOpacity, cardScale]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        {isReady ? (
          <Animated.View
            style={[
              styles.card,
              {
                opacity: cardOpacity,
                transform: [{ scale: cardScale }],
              },
            ]}
          >
            <View style={styles.mascotFrame}>
              <Image
                source={MASCOT_IMAGES[variant]}
                style={styles.mascot}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={[styles.message, !showButton && mode === 'alert' && styles.messageNoButton]}>
              {message}
            </Text>
            {mode === 'confirm' ? (
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.errorButton} onPress={onConfirm}>
                  <Text style={styles.buttonText}>{confirmLabel}</Text>
                </TouchableOpacity>
              </View>
            ) : showButton ? (
              <TouchableOpacity
                style={[styles.button, variant === 'error' ? styles.errorButton : styles.successButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>{buttonLabel}</Text>
              </TouchableOpacity>
            ) : null}
          </Animated.View>
        ) : null}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFF',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
  },
  mascotFrame: {
    width: 140,
    height: 140,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascot: {
    width: 140,
    height: 140,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Montserrat_700Bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    fontFamily: 'Roboto_400Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  messageNoButton: {
    marginBottom: 0,
  },
  button: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
  },
  successButton: { backgroundColor: '#0056B3' },
  errorButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
  },
});
