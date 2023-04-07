import React, { useCallback } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import type { RenderStrokeFactsAction } from '@/application/RenderStrokeFactsAction';
import type { AppNavigationProps } from '@/view/Router';
import { StatusBar } from '@/view/StatusBar';
import { theme } from '@/view/theme';
import { StrokeFactsView } from '@/view/StrokeFactsScreen/StrokeFactsView';
import { useQuery } from '@tanstack/react-query';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { LoadingSpinnerView } from '@/view/components';
import { StrokeFactsError } from '@/view/StrokeFactsScreen/StrokeFactsError';

function factory(renderStrokeFactsAction: RenderStrokeFactsAction) {
  const getHtml = renderStrokeFactsAction.execute();

  return function StrokeFactsScreen({
    navigation,
  }: AppNavigationProps<'StrokeFactsScreen'>) {
    const query = useQuery({
      queryKey: ['stroke-facts'],
      queryFn: () => getHtml,
    });

    const { width, height } = useWindowDimensions();

    const handlePressButton = useCallback(() => {
      navigation.navigate('StrokeSignsScreen');
    }, [navigation]);

    return (
      <View style={styles.container}>
        <StatusBar textColor="auto" backgroundColor={theme.colors.background} />
        <UseQueryResultView
          query={query}
          renderData={useCallback(
            (html: string) => (
              <StrokeFactsView
                height={height}
                width={width}
                onPressButton={handlePressButton}
                html={html}
              />
            ),
            [handlePressButton, height, width]
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
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export { factory };
export type Type = ReturnType<typeof factory>;
