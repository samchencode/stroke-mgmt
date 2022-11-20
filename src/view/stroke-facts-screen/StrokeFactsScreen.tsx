import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import type { GetStrokeFactsAction } from '@/application/GetStrokeFactsAction';

function factory(getStrokeFactsAction: GetStrokeFactsAction) {
  return function StrokeFactsScreen() {
    const [html, setHtml] = useState('');
    useEffect(() => {
      getStrokeFactsAction
        .execute()
        .then((article) => setHtml(article.getHtml()));
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
