import { theme } from '@/view/theme';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import type { Action } from '@/view/Snackbar/Snack';

type Props = {
  message: string;
  dismiss: () => void;
  action?: Action;
};

function doBoth(f1: () => void, f2: () => void) {
  return function f() {
    f1();
    f2();
  };
}

function Snackbar({ message, dismiss, action = undefined }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.message}>{message}</Text>
        {action && (
          <TouchableOpacity
            onPress={doBoth(action.onPress, dismiss)}
            style={styles.buttonContainer}
          >
            <Text style={styles.buttonLabel}>{action.label}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spaces.lg,
    marginBottom: theme.spaces.lg,
  },
  contentContainer: {
    minHeight: 48,
    paddingLeft: theme.spaces.md,
    paddingRight: theme.spaces.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.inverseSurface,
    borderRadius: 4,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
  },
  message: {
    ...theme.fonts.bodyMedium,
    color: theme.colors.inverseOnSurface,
  },
  buttonContainer: {
    height: 40,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    ...theme.fonts.labelLarge,
    color: theme.colors.inversePrimary,
  },
});

export { Snackbar };
