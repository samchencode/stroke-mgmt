import { ComponentErrorView } from '@/view/error-handling';
import { theme } from '@/view/theme';
import React from 'react';
import { StyleSheet } from 'react-native';

type Props = {
  error: unknown;
};

function ArticleListError({ error }: Props) {
  return <ComponentErrorView style={styles.errorView} error={error} />;
}

const styles = StyleSheet.create({
  errorView: {
    height: 350,
    marginTop: theme.spaces.md,
  },
});

export { ArticleListError };
