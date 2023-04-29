import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import type { RenderStrokeFactsAction } from '@/application/RenderStrokeFactsAction';
import type { AppNavigationProps } from '@/view/Router';
import { StrokeFactsView } from '@/view/StrokeFactsScreen/StrokeFactsView';
import { useQuery } from '@tanstack/react-query';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { LoadingSpinnerView } from '@/view/components';
import { StrokeFactsError } from '@/view/StrokeFactsScreen/StrokeFactsError';
import { StrokeFactsBottomBar } from '@/view/StrokeFactsScreen/StrokeFactsBottomBar';

function factory(renderStrokeFactsAction: RenderStrokeFactsAction) {
  const getHtml = renderStrokeFactsAction.execute();

  return function StrokeFactsScreen({
    navigation,
  }: AppNavigationProps<'StrokeFactsScreen'>) {
    const query = useQuery({
      queryKey: ['stroke-facts'],
      queryFn: () => getHtml,
    });

    const handlePressButton = useCallback(() => {
      navigation.navigate('StrokeSignsScreen');
    }, [navigation]);

    return (
      <View style={styles.container}>
        <UseQueryResultView
          query={query}
          renderData={useCallback(
            (html: string) => (
              <StrokeFactsView html={html} />
            ),
            []
          )}
          renderError={useCallback(
            () => (
              <StrokeFactsError />
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
        <StrokeFactsBottomBar onPressButton={handlePressButton} />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export { factory };
export type Type = ReturnType<typeof factory>;
