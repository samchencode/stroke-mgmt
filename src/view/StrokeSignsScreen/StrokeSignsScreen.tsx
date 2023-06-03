import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { RenderStrokeSignsAction } from '@/application/RenderStrokeSignsAction';
import type { AppNavigationProps } from '@/view/Router';
import { StrokeSignsView } from '@/view/StrokeSignsScreen/StrokeSignsView';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { StrokeSignsError } from '@/view/StrokeSignsScreen/StrokeSignsError';
import { LoadingSpinnerView, IconButton } from '@/view/components';
import { StrokeSignsBottomBar } from '@/view/StrokeSignsScreen/StrokeSignsBottomBar';
import {
  hideStrokeFactsAndSigns,
  showStrokeFactsAndSigns,
  useShouldShowStrokeFactsAndSigns,
} from '@/view/lib/shouldShowStrokeFactsAndSigns';
import { theme } from '@/view/theme';

const reconcileDontShowValue = (
  dontShowCheckboxValue: boolean,
  dontShowStoredValue: boolean
) => {
  if (dontShowCheckboxValue && !dontShowStoredValue) {
    hideStrokeFactsAndSigns();
  }
  if (!dontShowCheckboxValue && dontShowStoredValue) {
    showStrokeFactsAndSigns();
  }
};

function factory(renderStrokeSignsAction: RenderStrokeSignsAction) {
  return function StrokeSignsScreen({
    navigation,
  }: AppNavigationProps<'StrokeSignsScreen'>) {
    const queryClient = useQueryClient();
    const onStale = (html: string) =>
      queryClient.setQueryData(['stroke-signs'], html);

    const query = useQuery({
      queryKey: ['stroke-signs'],
      queryFn: () => renderStrokeSignsAction.execute(onStale),
      retry: false,
    });

    const shouldShowValueFromStorage = useShouldShowStrokeFactsAndSigns();
    const [dontShowCheckbox, setDontShowCheckbox] = useState(false);
    useEffect(() => {
      // set initial state to stated state
      if (shouldShowValueFromStorage !== 'loading')
        setDontShowCheckbox(shouldShowValueFromStorage === 'no');
    }, [shouldShowValueFromStorage]);

    const handlePressButton = useCallback(() => {
      if (shouldShowValueFromStorage !== 'loading') {
        reconcileDontShowValue(
          dontShowCheckbox,
          shouldShowValueFromStorage === 'no'
        );
      }
      navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
    }, [dontShowCheckbox, navigation, shouldShowValueFromStorage]);

    const handlePressBack = useCallback(() => {
      navigation.goBack();
    }, [navigation]);

    return (
      <View style={styles.container}>
        <UseQueryResultView
          query={query}
          renderData={useCallback(
            (html: string) => (
              <StrokeSignsView html={html} />
            ),
            []
          )}
          renderError={useCallback(
            () => (
              <StrokeSignsError />
            ),
            []
          )}
          renderLoading={useCallback(
            () => (
              <LoadingSpinnerView />
            ),
            []
          )}
        />
        <StrokeSignsBottomBar
          onPressButton={handlePressButton}
          checkboxValue={dontShowCheckbox}
          onChangeCheckbox={setDontShowCheckbox}
        />
        <IconButton
          iconName="arrow-left"
          onPress={handlePressBack}
          style={styles.backButton}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: theme.spaces.sm,
    left: theme.spaces.xs,
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
