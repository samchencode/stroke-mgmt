import { LoadingSpinnerView } from '@/view/components';
import { theme } from '@/view/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

function AlgorithmListLoading() {
  return (
    <View style={styles.container}>
      <LoadingSpinnerView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 246,
    marginTop: theme.spaces.md,
  },
});

export { AlgorithmListLoading };
