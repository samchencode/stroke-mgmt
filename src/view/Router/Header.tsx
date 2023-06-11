import type { ClearCacheAction } from '@/application/ClearCacheAction';
import { NoInternetBanner, useNoInternetBanner } from '@/view/NoInternetBanner';
import { HeaderScrollContext } from '@/view/Router/HeaderScrollContext';
import { Menu } from '@/view/Router/Menu';
import { useShowSnack } from '@/view/Snackbar/useShowSnack';
import { StatusBar } from '@/view/StatusBar';
import { IconButton } from '@/view/components';
import { theme } from '@/view/theme';
import { getHeaderTitle } from '@react-navigation/elements';
import type { StackHeaderProps } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

    const handlePressLicense = useCallback(
      () => navigation.navigate('LicenseScreen'),
      [navigation]
    );

    const handlePressIntro = useCallback(
      () => navigation.navigate('IntroSequenceScreen'),
      [navigation]
    );

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
            onPressIntro={handlePressIntro}
            onPressAbout={handlePressAbout}
            onPressDisclaimer={handlePressDisclaimer}
            onPressLicense={handlePressLicense}
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
