import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import type { RenderStrokeFactsAction } from '@/application/RenderStrokeFactsAction';
import type { AppNavigationProps } from '@/view/Router';
import { StatusBar } from '@/view/StatusBar';
import { Button } from '@/view/components';
import { theme } from '@/view/theme';

function factory(renderStrokeFactsAction: RenderStrokeFactsAction) {
  return function StrokeFactsScreen({
    navigation,
  }: AppNavigationProps<'StrokeFactsScreen'>) {
    const [html, setHtml] = useState('');
    useEffect(() => {
      renderStrokeFactsAction.execute().then((h) => setHtml(h));
    }, []);

    const { width, height } = useWindowDimensions();
    const webViewHeight = height * 0.6;

    const handlePressButton = useCallback(() => {
      navigation.navigate('StrokeSignsScreen');
    }, [navigation]);

    return (
      <View style={styles.container}>
        <StatusBar textColor="auto" backgroundColor={theme.colors.background} />
        <View style={{ height: webViewHeight }}>
          <WebView
            source={{ html }}
            originWhitelist={['*']}
            style={{ width }}
            scrollEnabled={false}
          />
        </View>
        <Button
          title="Got it!"
          onPress={handlePressButton}
          style={styles.button}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  button: {
    alignSelf: 'flex-start',
    marginLeft: theme.spaces.md,
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
