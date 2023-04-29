import React from 'react';
import { StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { NoInternetBanner, useNoInternetBanner } from '@/view/NoInternetBanner';
import { theme } from '@/view/theme';

function NoHeader() {
  const { shouldShowNoInternetBanner, handleDismissNoInternetBanner } =
    useNoInternetBanner();

  const headerHasElevation = shouldShowNoInternetBanner;

  return (
    <View
      style={[styles.container, headerHasElevation && styles.containerElevated]}
    >
      <StatusBar translucent />
      <View style={styles.statusBar} />
      <NoInternetBanner
        onPressDismiss={handleDismissNoInternetBanner}
        visible={shouldShowNoInternetBanner}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  statusBar: {
    height: Constants.statusBarHeight,
  },
  containerElevated: {
    backgroundColor: theme.colors.surfaceContainer,
    ...theme.elevations[2],
  },
});

export { NoHeader };
