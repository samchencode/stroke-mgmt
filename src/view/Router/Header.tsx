import React, { useCallback, useContext, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import type { ViewStyle, StyleProp, TextStyle } from 'react-native';
import { StatusBar } from '@/view/StatusBar';
import type { StackHeaderProps } from '@react-navigation/stack';
import { getHeaderTitle } from '@react-navigation/elements';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { theme } from '@/view/theme';
import { Menu } from '@/view/Router/Menu';
import { NoInternetBanner, useNoInternetBanner } from '@/view/NoInternetBanner';
import { HeaderScrollContext } from '@/view/Router/HeaderScrollContext';
import type { ClearCacheAction } from '@/application/ClearCacheAction';
import { useShowSnack } from '@/view/Snackbar/useShowSnack';
import { useQueryClient } from '@tanstack/react-query';

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

type Props = StackHeaderProps;

function factory(clearCacheAction: ClearCacheAction) {
  return function Header({ navigation, route, options, back }: Props) {
    const title = getHeaderTitle(options, route.name);

    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuPress = useCallback(() => {
      setMenuOpen(!menuOpen);
    }, [menuOpen]);

    const handleBack = useCallback(() => navigation.goBack(), [navigation]);

    const handlePressDisclaimer = useCallback(() => {
      setMenuOpen(false);
      navigation.navigate('DisclaimerModal');
    }, [navigation]);

    const showSnack = useShowSnack();

    const queryClient = useQueryClient();
    const refreshQueries = useCallback(() => {
      setMenuOpen(false);
      queryClient.invalidateQueries({
        refetchType: 'all',
      });
    }, [queryClient]);

    const handlePressClearCache = useCallback(() => {
      setMenuOpen(false);
      clearCacheAction.execute().then(() =>
        showSnack({
          message: 'Cleared. Please refresh or restart.',
          dwellMilliseconds: 3000,
          action: {
            label: 'Refresh',
            onPress: refreshQueries,
          },
        })
      );
    }, [refreshQueries, showSnack]);

    const handlePressAbout = useCallback(() => {
      setMenuOpen(false);
      navigation.navigate('AboutUsScreen');
    }, [navigation]);

    const { shouldShowNoInternetBanner, handleDismissNoInternetBanner } =
      useNoInternetBanner();

    const { scrolledToTop } = useContext(HeaderScrollContext);
    const headerHasElevation = !scrolledToTop || shouldShowNoInternetBanner;

    return (
      <View
        style={[
          styles.container,
          headerHasElevation && styles.containerElevated,
        ]}
      >
        <StatusBar textColor="auto" />
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
            onPressAbout={handlePressAbout}
            onPressDisclaimer={handlePressDisclaimer}
            onPressLicense={useCallback(() => alert('license'), [])}
            onPressClearCache={handlePressClearCache}
            onPressRefresh={refreshQueries}
          />
        </View>
        <NoInternetBanner
          visible={shouldShowNoInternetBanner}
          onPressDismiss={handleDismissNoInternetBanner}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  containerElevated: {
    backgroundColor: theme.colors.surfaceContainer,
    ...theme.elevations[2],
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
    zIndex: 2,
    ...theme.elevations[2],
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
