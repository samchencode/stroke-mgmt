import { ComponentErrorView } from '@/view/error-handling';
import { theme } from '@/view/theme';
import React from 'react';
import { StyleSheet } from 'react-native';

type Props = {
  error: unknown;
};

function AlgorithmListError({ error }: Props) {
  return <ComponentErrorView error={error} style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    height: 246,
    marginTop: theme.spaces.md,
  },
});

export { AlgorithmListError };
