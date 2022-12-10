import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import type { RenderStrokeSignsAction } from '@/application/RenderStrokeSignsAction';
import type { AppNavigationProps } from '@/view/Router';
import { StatusBar } from '@/view/StatusBar';
import { Button } from '@/view/components';
import { theme } from '@/view/theme';

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
        <StatusBar textColor="auto" backgroundColor={theme.colors.background} />
        <View style={{ height: webViewHeight }}>
          <WebView
            source={{ html }}
            originWhitelist={['*']}
            style={{ width }}
          />
        </View>
        <Button
          title="No, I'm here to learn"
          onPress={handlePressButton}
          style={styles.button}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  button: { alignSelf: 'flex-start', marginLeft: theme.spaces.md },
});

export { factory };
export type Type = ReturnType<typeof factory>;
