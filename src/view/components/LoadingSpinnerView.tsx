import { theme } from '@/view/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

function LoadingSpinnerView() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export { LoadingSpinnerView };
