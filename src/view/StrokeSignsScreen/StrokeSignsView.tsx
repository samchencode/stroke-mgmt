import React, { useCallback, useMemo } from 'react';
import type { WebViewMessageEvent } from 'react-native-webview';
import WebView from 'react-native-webview';
import { WebViewEventHandler } from '@/infrastructure/rendering/WebViewEvent';
import type { WebViewEvent } from '@/infrastructure/rendering/WebViewEvent';
import { StyleSheet } from 'react-native';
import { theme } from '@/view/theme';

type StrokeSignsViewProps = {
  html: string;
};

function StrokeSignsView({ html }: StrokeSignsViewProps) {
  const eventHandler = useMemo(() => new WebViewEventHandler({}), []);

  const handleMessage = useCallback(
    ({ nativeEvent }: WebViewMessageEvent) => {
      const event = JSON.parse(nativeEvent.data) as WebViewEvent;
      eventHandler.handle(event);
    },
    [eventHandler]
  );

  return (
    <WebView
      source={{ html }}
      originWhitelist={['*']}
      onMessage={handleMessage}
      style={styles.webView}
    />
  );
}

const styles = StyleSheet.create({
  webView: {
    backgroundColor: theme.colors.background,
  },
});

export { StrokeSignsView };
