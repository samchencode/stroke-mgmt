import React, { useCallback } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import type { RenderStrokeSignsAction } from '@/application/RenderStrokeSignsAction';
import type { AppNavigationProps } from '@/view/Router';
import { StatusBar } from '@/view/StatusBar';
import { theme } from '@/view/theme';
import { StrokeSignsView } from '@/view/StrokeSignsScreen/StrokeSignsView';
import { useQuery } from '@tanstack/react-query';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { StrokeSignsError } from '@/view/StrokeSignsScreen/StrokeSignsError';
import { LoadingSpinnerView } from '@/view/components';

function factory(renderStrokeSignsAction: RenderStrokeSignsAction) {
  const getHtml = renderStrokeSignsAction.execute();

  return function StrokeSignsScreen({
    navigation,
  }: AppNavigationProps<'StrokeSignsScreen'>) {
    const query = useQuery({
      queryKey: ['stroke-signs'],
      queryFn: () => getHtml,
    });

    const { width, height } = useWindowDimensions();

    const handlePressButton = useCallback(() => {
      navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
    }, [navigation]);

    return (
      <View style={styles.container}>
        <StatusBar textColor="auto" backgroundColor={theme.colors.background} />
        <UseQueryResultView
          query={query}
          renderData={useCallback(
            (html: string) => (
              <StrokeSignsView
                width={width}
                height={height}
                onPressButton={handlePressButton}
                html={html}
              />
            ),
            [handlePressButton, height, width]
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
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export { factory };
export type Type = ReturnType<typeof factory>;
