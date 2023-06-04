import { ScreenErrorView } from '@/view/error-handling';
import React from 'react';
import { StyleSheet } from 'react-native';

type Props = {
  error: unknown;
};

function DisclaimerErrorView({ error }: Props) {
  return (
    <ScreenErrorView
      error={error}
      showRestartButton
      message="Please restart the app and try again."
      transparentBackground
      style={styles.errorView}
    />
  );
}

const styles = StyleSheet.create({
  errorView: {
    minHeight: 280,
  },
});

export { DisclaimerErrorView };
