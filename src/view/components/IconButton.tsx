import React from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '@/view/theme';

type IconButtonProps = {
  iconName: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle | TextStyle>;
  disabled?: boolean;
};

function IconButton({
  iconName,
  onPress,
  style = {},
  iconStyle = {},
  disabled = false,
}: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.iconButton, style]}
      disabled={disabled}
    >
      <FontAwesome5
        name={iconName}
        size={24}
        style={[styles.icon, disabled && styles.disabled, iconStyle]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  icon: {
    color: theme.colors.onSurface,
  },
  iconButton: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    color: theme.colors.opacity(0.2).onSurface,
  },
});

export { IconButton };
