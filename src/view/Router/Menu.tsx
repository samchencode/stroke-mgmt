import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { theme } from '@/view/theme';
import { MenuItem } from '@/view/Router/MenuItem';

type Props = {
  visible: boolean;
  style?: StyleProp<ViewStyle>;
  onPressDisclaimer: () => void;
  onPressLicense: () => void;
  onPressAbout: () => void;
};

function Menu({
  visible,
  onPressAbout,
  onPressDisclaimer,
  onPressLicense,
  style = {},
}: Props) {
  return (
    <View style={[styles.menu, visible && styles.menuVisible, style]}>
      <View style={styles.content}>
        <MenuItem onPress={onPressDisclaimer}>Disclaimer</MenuItem>
        <MenuItem onPress={onPressLicense}>License</MenuItem>
        <MenuItem onPress={onPressAbout}>About</MenuItem>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    display: 'none',
    borderRadius: 4,
    backgroundColor: theme.colors.surface,
  },
  menuVisible: { display: 'flex' },
  content: {
    paddingTop: theme.spaces.sm,
    paddingBottom: theme.spaces.sm,
  },
});

export { Menu };