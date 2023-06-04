import { theme } from '@/view/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function AlgorithmListEmpty() {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        There are no algorithms available at this moment. Please try again
        later.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 246,
    marginTop: theme.spaces.md,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spaces.md,
  },
  message: {
    ...theme.fonts.bodyMedium,
  },
});

export { AlgorithmListEmpty };
