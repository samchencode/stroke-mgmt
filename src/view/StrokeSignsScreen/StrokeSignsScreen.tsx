import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import type { RenderStrokeSignsAction } from '@/application/RenderStrokeSignsAction';

function factory(renderStrokeSignsAction: RenderStrokeSignsAction) {
  return function StrokeSignsScreen() {
    const [html, setHtml] = useState('');
    useEffect(() => {
      renderStrokeSignsAction.execute().then((h) => setHtml(h));
    }, []);

    const { width, height } = useWindowDimensions();

    return (
      <View style={styles.container}>
        <WebView
          source={{ html }}
          originWhitelist={['*']}
          style={{ width, height }}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
