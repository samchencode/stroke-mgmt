import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import type { RenderStrokeFactsAction } from '@/application/RenderStrokeFactsAction';
import type { AppNavigationProps } from '@/view/Router';
import { StatusBar } from '@/view/StatusBar';
import { theme } from '@/view/theme';
import { StrokeFactsView } from '@/view/StrokeFactsScreen/StrokeFactsView';
import Spinner from 'react-native-loading-spinner-overlay';

function factory(renderStrokeFactsAction: RenderStrokeFactsAction) {
  return function StrokeFactsScreen({
    navigation,
  }: AppNavigationProps<'StrokeFactsScreen'>) {
    const [html, setHtml] = useState('');
    useEffect(() => {
      renderStrokeFactsAction.execute().then((h) => setHtml(h));
    }, []);

    const { width, height } = useWindowDimensions();

    const handlePressButton = useCallback(() => {
      navigation.navigate('StrokeSignsScreen');
    }, [navigation]);

    return (
      <View style={styles.container}>
        <StatusBar textColor="auto" backgroundColor={theme.colors.background} />
        <Spinner visible={!html} textContent="Loading..." />
        <StrokeFactsView
          height={height}
          width={width}
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
