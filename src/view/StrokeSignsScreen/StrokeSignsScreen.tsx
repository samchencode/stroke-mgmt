import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { RenderStrokeSignsAction } from '@/application/RenderStrokeSignsAction';
import type { AppNavigationProps } from '@/view/Router';
import { StrokeSignsView } from '@/view/StrokeSignsScreen/StrokeSignsView';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { StrokeSignsError } from '@/view/StrokeSignsScreen/StrokeSignsError';
import { LoadingSpinnerView } from '@/view/components';
import { StrokeSignsBottomBar } from '@/view/StrokeSignsScreen/StrokeSignsBottomBar';
import { hideStrokeFactsAndSigns } from '@/view/lib/shouldShowStrokeFactsAndSigns';

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

    const [dontShow, setDontShow] = useState(false);

    const handlePressButton = useCallback(() => {
      if (dontShow) hideStrokeFactsAndSigns();
      navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
    }, [dontShow, navigation]);

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
          checkboxValue={dontShow}
          onChangeCheckbox={setDontShow}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export { factory };
export type Type = ReturnType<typeof factory>;
