import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NoInternetBanner, useNoInternetBanner } from '@/view/NoInternetBanner';
import { theme } from '@/view/theme';
import { StatusBar } from '@/view/StatusBar';

function NoHeader() {
  const { shouldShowNoInternetBanner, handleDismissNoInternetBanner } =
    useNoInternetBanner();

  const headerHasElevation = shouldShowNoInternetBanner;

  return (
    <View
      style={[styles.container, headerHasElevation && styles.containerElevated]}
    >
      <StatusBar textColor="auto" />
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
  containerElevated: {
    backgroundColor: theme.colors.surfaceContainer,
    ...theme.elevations[2],
  },
});

export { NoHeader };
