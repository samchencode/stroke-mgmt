import React, { useCallback } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import * as Updates from 'expo-updates';
import { thrownToString } from '@/view/error-handling/thrownToString';
import { theme } from '@/view/theme';
import { Button } from '@/view/components';

type Props = {
  error: unknown;
  showRestartButton?: boolean;
  message?: string;
  transparentBackground?: boolean;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_MESSAGE =
  'Please restart the app and try again. Clearing the cache may help.';

function ScreenErrorView({
  error,
  showRestartButton = false,
  message = DEFAULT_MESSAGE,
  transparentBackground = false,
  style = {},
}: Props) {
  const handleRestart = useCallback(() => {
    Updates.reloadAsync();
  }, []);

  return (
    <View
      style={[
        styles.container,
        !transparentBackground && styles.containerSolidBackground,
        !transparentBackground && style,
      ]}
    >
      <View style={[styles.content, transparentBackground && style]}>
        <Text style={styles.subheading}>Something went wrong...</Text>
        <ScrollView style={styles.errorTextContainer}>
          <Text style={styles.errorText}>{thrownToString(error)}</Text>
        </ScrollView>
        <Text style={styles.message}>{message}</Text>
        {showRestartButton && (
          <Button
            title="Restart"
            onPress={handleRestart}
            backgroundColor={theme.colors.error}
            underlayColor="#d12b20"
            style={styles.button}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  containerSolidBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spaces.md,
  },
  content: {
    backgroundColor: theme.colors.errorContainer,
    padding: theme.spaces.lg,
    borderRadius: 28,
    minWidth: 280,
    maxWidth: 560,
  },
  subheading: {
    ...theme.fonts.titleLarge,
    marginBottom: theme.spaces.sm,
    color: theme.colors.onErrorContainer,
  },
  message: {
    ...theme.fonts.bodyLarge,
    marginBottom: theme.spaces.md,
    color: theme.colors.onErrorContainer,
  },
  errorText: {
    ...theme.fonts.bodyLarge,
    marginBottom: theme.spaces.sm,
    color: theme.colors.onErrorContainer,
    marginHorizontal: theme.spaces.lg,
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier New',
  },
  errorTextContainer: {
    maxHeight: 200,
  },
  button: {
    alignSelf: 'flex-end',
  },
});

export { ScreenErrorView };
