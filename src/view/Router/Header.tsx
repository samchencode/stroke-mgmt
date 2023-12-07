import React, { useCallback, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getHeaderTitle } from '@react-navigation/elements';
import type { StackHeaderProps } from '@react-navigation/stack';
import { NoInternetBanner, useNoInternetBanner } from '@/view/NoInternetBanner';
import { HeaderScrollContext } from '@/view/Router/HeaderScrollContext';
import { StatusBar } from '@/view/StatusBar';
import { IconButton } from '@/view/components';
import { theme } from '@/view/theme';
import {
  useHowToOpenMenuBanner,
  HowToOpenMenuBanner,
} from '@/view/HowToOpenMenuBanner';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = StackHeaderProps;

const HEADER_HEIGHT = 64;

function Header({ navigation, route, options, back }: Props) {
  const title = getHeaderTitle(options, route.name);

  const { top: statusBarHeight } = useSafeAreaInsets();

  const handleMenuPress = useCallback(() => {
    navigation.navigate('HeaderMenuModal', {
      translateY: HEADER_HEIGHT + statusBarHeight,
    });
  }, [navigation, statusBarHeight]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const { shouldShowNoInternetBanner, handleDismissNoInternetBanner } =
    useNoInternetBanner();

  const {
    shouldShowHowToOpenMenuBanner: shouldShowMenuBeforeOr,
    handleDismissHowToOpenMenuBanner,
  } = useHowToOpenMenuBanner();
  const shouldShowHowToOpenMenuBanner =
    shouldShowMenuBeforeOr && !shouldShowNoInternetBanner;

  const { scrolledToTop } = useContext(HeaderScrollContext);
  const headerHasElevation =
    !scrolledToTop ||
    shouldShowNoInternetBanner ||
    shouldShowHowToOpenMenuBanner;

  return (
    <View
      style={[styles.container, headerHasElevation && styles.containerElevated]}
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
      </View>
      <NoInternetBanner
        visible={shouldShowNoInternetBanner}
        onPressDismiss={handleDismissNoInternetBanner}
      />
      <HowToOpenMenuBanner
        visible={shouldShowHowToOpenMenuBanner}
        onPressDismiss={handleDismissHowToOpenMenuBanner}
      />
    </View>
  );
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
    height: HEADER_HEIGHT,
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
});

export { Header };
