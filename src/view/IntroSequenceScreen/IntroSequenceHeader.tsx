import React, { useCallback, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import type { StackHeaderProps } from '@react-navigation/stack';
import type { Route } from '@react-navigation/native';
import { NoInternetBanner, useNoInternetBanner } from '@/view/NoInternetBanner';
import { theme } from '@/view/theme';
import { StatusBar } from '@/view/StatusBar';
import { IconButton, TextButton } from '@/view/components';
import { HeaderScrollContext } from '@/view/Router/HeaderScrollContext';

type IntroSequenceParams = {
  cursor: number;
};

type IntroSequenceRoute = Route<string, IntroSequenceParams>;

function IntroSequenceHeader({ route, navigation }: StackHeaderProps) {
  const { shouldShowNoInternetBanner, handleDismissNoInternetBanner } =
    useNoInternetBanner();

  const { scrolledToTop } = useContext(HeaderScrollContext);
  const headerHasElevation = !scrolledToTop || shouldShowNoInternetBanner;

  if (!route || !route.params)
    throw Error('No Intro Sequence cursor provided to header');

  const sequenceCursor = (route as IntroSequenceRoute).params.cursor;
  const setSequenceCursor = useCallback(
    (cursor: number) => navigation.setParams({ cursor }),
    [navigation]
  );

  // initial start = no, hasBack is true once nav to modal...
  const { index, routes } = navigation.getState();
  const prevRouteName: string | undefined = routes?.[index - 1]?.name;
  const shouldShowBack = prevRouteName === 'HomeScreen' || sequenceCursor !== 0;

  const handlePressBack = useCallback(() => {
    if (sequenceCursor > 0) {
      setSequenceCursor(sequenceCursor - 1);
      return;
    }
    if (prevRouteName === 'HomeScreen') {
      // if cursor is at first article and came from home screen
      navigation.goBack();
    }
  }, [navigation, prevRouteName, sequenceCursor, setSequenceCursor]);

  const handlePressSkip = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
  }, [navigation]);

  return (
    <View
      style={[styles.container, headerHasElevation && styles.containerElevated]}
    >
      <StatusBar textColor="auto" />
      <View style={styles.header}>
        {shouldShowBack && (
          <IconButton
            iconName="arrow-left"
            onPress={handlePressBack}
            style={styles.backButton}
          />
        )}
        <Text style={styles.title}>Introduction</Text>
        <TextButton
          title="Skip Intro"
          onPress={handlePressSkip}
          style={styles.skipButton}
        />
      </View>
      <NoInternetBanner
        onPressDismiss={handleDismissNoInternetBanner}
        visible={shouldShowNoInternetBanner}
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
    height: 56,
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
    top: theme.spaces.xs,
    left: theme.spaces.xs,
  },
  skipButton: {
    position: 'absolute',
    top: theme.spaces.sm,
    right: theme.spaces.xs,
    color: theme.colors.onSurfaceVariant,
  },
});

export { IntroSequenceHeader };
