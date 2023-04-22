import React, { useCallback, useContext, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import type { ViewStyle, StyleProp, TextStyle } from 'react-native';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { getHeaderTitle } from '@react-navigation/elements';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { theme } from '@/view/theme';
import { Menu } from '@/view/Router/Menu';
import { HeaderScrollContext } from '@/view/Router/HeaderScrollContext';

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

type Props = NativeStackHeaderProps;

function Header({ navigation, route, options, back }: Props) {
  const title = getHeaderTitle(options, route.name);

  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuPress = useCallback(() => {
    setMenuOpen(!menuOpen);
  }, [menuOpen]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handlePressDisclaimer = useCallback(
    () => navigation.navigate('DisclaimerModal'),
    [navigation]
  );

  const { scrolledToTop } = useContext(HeaderScrollContext);

  return (
    <View
      style={[styles.container, !scrolledToTop && styles.containerScrolled]}
    >
      <StatusBar translucent />
      <View style={styles.statusBar} />
      <View style={styles.header}>
        {back && (
          <IconButton
            iconName="arrow-left"
            onPress={handleBack}
            style={styles.backButton}
          />
        )}
        <Text style={styles.title}>{title}</Text>
        <View style={styles.trailingIconGroup}>
          <IconButton
            iconName="ellipsis-v"
            onPress={handleMenuPress}
            iconStyle={styles.trailingIcon}
          />
        </View>
        <Menu
          visible={menuOpen}
          style={styles.menu}
          onPressAbout={useCallback(() => alert('about'), [])}
          onPressDisclaimer={handlePressDisclaimer}
          onPressLicense={useCallback(() => alert('license'), [])}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  containerScrolled: {
    backgroundColor: theme.colors.surfaceContainer,
    ...theme.elevations[2],
  },
  statusBar: {
    height: Constants.statusBarHeight,
  },
  header: {
    height: 64,
    paddingRight: theme.spaces.md,
  },
  title: {
    ...theme.fonts.titleLarge,
    color: theme.colors.onSurface,
    position: 'absolute',
    left: 56,
    top: '50%',
    transform: [{ translateY: -14 }],
  },
  icon: {
    color: theme.colors.onSurface,
  },
  iconButton: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 8,
    left: 4,
  },
  trailingIconGroup: {
    position: 'absolute',
    top: 8,
    right: 4,
    display: 'flex',
    flexDirection: 'row',
  },
  trailingIcon: {
    color: theme.colors.onSurfaceVariant,
  },
  menu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    ...theme.elevations[2],
  },
});

export { Header };