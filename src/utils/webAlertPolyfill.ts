import { Alert, Platform } from 'react-native';

// react-native-web's Alert.alert() is a no-op, so every confirmation/error
// dialog in the app silently does nothing on web. Alert is a module-level
// singleton, so patching it once here fixes every call site.
if (Platform.OS === 'web') {
  Alert.alert = (title, message, buttons) => {
    const text = [title, message].filter(Boolean).join('\n\n');

    if ((buttons?.length ?? 0) > 1) {
      const confirmed = window.confirm(text);
      const button = confirmed
        ? buttons!.find((b) => b.style !== 'cancel')
        : buttons!.find((b) => b.style === 'cancel');
      button?.onPress?.();
      return;
    }

    window.alert(text);
    buttons?.[0]?.onPress?.();
  };
}
