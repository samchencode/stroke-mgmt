import { theme } from '@/view/theme';
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type TextButtonProps = {
  title: string;
  onPress: () => void;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
};

function TextButton({
  title,
  onPress,
  textColor = theme.colors.onBackground,
  style = {},
}: TextButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    paddingLeft: theme.spaces.md,
    paddingRight: theme.spaces.md,
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: theme.fonts.labelLarge,
});

export { TextButton };
