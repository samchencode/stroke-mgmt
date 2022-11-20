import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import type { RenderStrokeFactsAction } from '@/application/RenderStrokeFactsAction';

function factory(renderStrokeFactsAction: RenderStrokeFactsAction) {
  return function StrokeFactsScreen() {
    const [html, setHtml] = useState('');
    useEffect(() => {
      renderStrokeFactsAction.execute().then((h) => setHtml(h));
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
