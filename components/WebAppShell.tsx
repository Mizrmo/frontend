import React, { useEffect } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

const PHONE_MAX_WIDTH = 430;

/**
 * Web-only phone frame so every screen renders like a mobile app in the browser.
 * Native platforms pass children through unchanged.
 */
export function WebAppShell({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    const styleId = 'mizrmo-web-shell-css';
    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      html, body, #root {
        height: 100%;
        margin: 0;
        padding: 0;
        background: #dbe7f3;
        overscroll-behavior: none;
      }
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      #root {
        display: flex;
        min-height: 100%;
      }
      * {
        -webkit-tap-highlight-color: transparent;
        box-sizing: border-box;
      }
      input, textarea, select, button {
        font-family: inherit;
      }
    `;
    document.head.appendChild(style);
  }, []);

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  const isDesktop = width > PHONE_MAX_WIDTH + 48;
  const phoneWidth = Math.min(PHONE_MAX_WIDTH, width);
  const phoneHeight = isDesktop ? Math.min(900, height - 48) : height;

  return (
    <View style={styles.outer} accessibilityLabel="Mizrmo mobile web shell">
      <View
        style={[
          styles.phone,
          isDesktop && styles.phoneDesktop,
          {
            width: phoneWidth,
            height: phoneHeight,
            maxWidth: phoneWidth,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#DBE7F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phone: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  phoneDesktop: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#C5D6E8',
    shadowColor: '#0F172A',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 40,
  },
});
