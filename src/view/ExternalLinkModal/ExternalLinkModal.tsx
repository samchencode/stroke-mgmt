import React, { useCallback, useEffect, useRef } from 'react';
import type { AppStateStatus } from 'react-native';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  AppState,
} from 'react-native';
import { openURL as expoLinkingOpenUrl } from 'expo-linking';
import type { RootNavigationProps } from '@/view/Router';
import { theme } from '@/view/theme';
import { TextButton } from '@/view/components';

function openUrl(urlInput: string) {
  let url = urlInput;
  if (!url.match(/^https?:/)) url = `https://${url}`;
  expoLinkingOpenUrl(url);
}

function isFocusing(oldAppState: AppStateStatus, newAppState: AppStateStatus) {
  const isNowActive = newAppState === 'active';
  const wasBackgrounded =
    oldAppState === 'inactive' || oldAppState === 'background';
  return wasBackgrounded && isNowActive;
}

function ExternalLinkModal({
  route,
  navigation,
}: RootNavigationProps<'ExternalLinkModal'>) {
  const handleDismiss = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const { url } = route.params;

  const handleOpenLink = useCallback(() => {
    openUrl(url);
  }, [url]);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (newAppState) => {
      const oldAppState = appState.current;
      if (isFocusing(oldAppState, newAppState)) {
        handleDismiss();
      }
      appState.current = newAppState;
    });
    return () => subscription.remove();
  }, [handleDismiss]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>External Link</Text>
        <Text style={styles.subtitle}>
          You are navigating to an external webpage. You may have to open the
          app again to come back! ({url})
        </Text>
        <View style={styles.buttonGroup}>
          <TextButton title="Cancel" onPress={handleDismiss} />
          <TextButton title="Open Link" onPress={handleOpenLink} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    backgroundColor: 'black',
    opacity: 0.25,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  contentContainer: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    ...theme.elevations[3],
    padding: theme.spaces.lg,
    minWidth: 280,
    maxWidth: 560,
    borderRadius: 28,
  },
  buttonGroup: {
    marginTop: theme.spaces.lg,
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  title: {
    ...theme.fonts.headlineSmall,
    color: theme.colors.onSurface,
  },
  subtitle: {
    ...theme.fonts.bodyMedium,
    color: theme.colors.onSurfaceVariant,
    marginTop: theme.spaces.md,
  },
});

export { ExternalLinkModal };
