import React, { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { RenderDisclaimerAction } from '@/application/RenderDisclaimerAction';

function factory(renderDisclaimerAction: RenderDisclaimerAction) {
  return function DisclaimerModal() {
    const [html, setHtml] = useState('');
    useEffect(() => {
      renderDisclaimerAction.execute().then((h) => setHtml(h));
    }, []);

    const { width } = useWindowDimensions();
    const webViewWidth = width - 32;
    const webViewHeight = 200;

    return (
      <View style={styles.container}>
        <View style={styles.background} />
        <View style={styles.webViewContainer}>
          <WebView
            source={{ html }}
            originWhitelist={['*']}
            style={{ width: webViewWidth, height: webViewHeight }}
          />
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    backgroundColor: 'black',
    opacity: 0.25,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  webViewContainer: {
    height: 200,
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
