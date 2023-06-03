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
};

function IconButton({
  iconName,
  onPress,
  style = {},
  iconStyle = {},
}: IconButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.iconButton, style]}>
      <FontAwesome5
        name={iconName}
        size={24}
        style={[styles.icon, iconStyle]}
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
});

export { IconButton };
