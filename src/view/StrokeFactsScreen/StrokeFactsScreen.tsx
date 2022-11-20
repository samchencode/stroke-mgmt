import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import type { RenderStrokeFactsAction } from '@/application/RenderStrokeFactsAction';
import type { AppNavigationProps } from '@/view/Router';

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
        <View style={{ height: webViewHeight }}>
          <WebView
            source={{ html }}
            originWhitelist={['*']}
            style={{ width }}
          />
        </View>
        <Button title="Got it!" onPress={handlePressButton} />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export { factory };
export type Type = ReturnType<typeof factory>;
