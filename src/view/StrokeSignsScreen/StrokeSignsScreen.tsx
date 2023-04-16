import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import type { RenderStrokeSignsAction } from '@/application/RenderStrokeSignsAction';
import type { AppNavigationProps } from '@/view/Router';
import { StatusBar } from '@/view/StatusBar';
import { theme } from '@/view/theme';
import { StrokeSignsView } from '@/view/StrokeSignsScreen/StrokeSignsView';
import { useQuery } from '@tanstack/react-query';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { StrokeSignsError } from '@/view/StrokeSignsScreen/StrokeSignsError';
import { LoadingSpinnerView } from '@/view/components';
import { StrokeSignsBottomBar } from '@/view/StrokeSignsScreen/StrokeSignsBottomBar';

function factory(renderStrokeSignsAction: RenderStrokeSignsAction) {
  const getHtml = renderStrokeSignsAction.execute();

  return function StrokeSignsScreen({
    navigation,
  }: AppNavigationProps<'StrokeSignsScreen'>) {
    const query = useQuery({
      queryKey: ['stroke-signs'],
      queryFn: () => getHtml,
    });

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
        <StrokeSignsBottomBar onPressButton={handlePressButton} />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export { factory };
export type Type = ReturnType<typeof factory>;
