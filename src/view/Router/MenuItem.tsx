import { theme } from '@/view/theme';
import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet } from 'react-native';

type Props = {
  children: string;
  onPress: () => void;
};

function MenuItem({ children, onPress }: Props) {
  return (
    <TouchableHighlight onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.label}>{children}</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 112,
    maxWidth: 280,
  },
  label: {
    ...theme.fonts.labelLarge,
    color: theme.colors.onSurface,
  },
});

export { MenuItem };
