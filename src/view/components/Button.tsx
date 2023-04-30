import { theme } from '@/view/theme';
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  underlayColor?: string;
  outlined?: boolean;
  outlineColor?: string;
  style?: StyleProp<ViewStyle>;
};

function Button({
  title,
  onPress,
  backgroundColor = theme.colors.primary,
  textColor = theme.colors.onPrimary,
  underlayColor = theme.colors.background,
  outlined = false,
  outlineColor = theme.colors.primary,
  style = {},
}: ButtonProps) {
  return (
    <TouchableHighlight
      onPress={onPress}
      style={[styles.container, { backgroundColor }, style]}
      underlayColor={underlayColor}
    >
      <View
        style={[
          styles.contentContainer,
          { borderColor: outlined ? outlineColor : 'transparent' },
        ]}
      >
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    height: 40,
    paddingLeft: theme.spaces.lg,
    paddingRight: theme.spaces.lg,
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: theme.fonts.labelLarge,
});

export { Button };
