import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import type { RenderStrokeSignsAction } from '@/application/RenderStrokeSignsAction';
import type { AppNavigationProps } from '@/view/Router';
import { StatusBar } from '@/view/StatusBar';
import { theme } from '@/view/theme';
import { StrokeSignsView } from '@/view/StrokeSignsScreen/StrokeSignsView';
import Spinner from 'react-native-loading-spinner-overlay';

function factory(renderStrokeSignsAction: RenderStrokeSignsAction) {
  return function StrokeSignsScreen({
    navigation,
  }: AppNavigationProps<'StrokeSignsScreen'>) {
    const [html, setHtml] = useState('');
    useEffect(() => {
      renderStrokeSignsAction.execute().then((h) => setHtml(h));
    }, []);

    const { width, height } = useWindowDimensions();

    const handlePressButton = useCallback(() => {
      navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
    }, [navigation]);

    return (
      <View style={styles.container}>
        <StatusBar textColor="auto" backgroundColor={theme.colors.background} />
        <Spinner visible={!html} textContent="Loading..." />
        <StrokeSignsView
          width={width}
          height={height}
          onPressButton={handlePressButton}
          html={html}
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
