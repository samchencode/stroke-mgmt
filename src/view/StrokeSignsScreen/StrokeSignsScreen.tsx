import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import type { RenderStrokeSignsAction } from '@/application/RenderStrokeSignsAction';
import type { AppNavigationProps } from '@/view/Router';

function factory(renderStrokeSignsAction: RenderStrokeSignsAction) {
  return function StrokeSignsScreen({
    navigation,
  }: AppNavigationProps<'StrokeSignsScreen'>) {
    const [html, setHtml] = useState('');
    useEffect(() => {
      renderStrokeSignsAction.execute().then((h) => setHtml(h));
    }, []);

    const { width, height } = useWindowDimensions();
    const webViewHeight = height * 0.6;

    const handlePressButton = useCallback(() => {
      navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
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
        <Button title="No, I'm here to learn" onPress={handlePressButton} />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
