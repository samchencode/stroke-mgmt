import React, { useCallback } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import type { WebViewMessageEvent } from 'react-native-webview';
import WebView from 'react-native-webview';
import type {
  WebViewEvent,
  WebViewEventHandler,
} from '@/infrastructure/rendering/WebViewEvent';
import type { WebViewScrollEvent } from 'react-native-webview/lib/WebViewTypes';
import { useHeaderScrollResponder } from '@/view/Router/HeaderScrollContext';
import { theme } from '@/view/theme';

type Props = {
  html: string;
  eventHandler: WebViewEventHandler;
};

function ArticleView({ html, eventHandler }: Props) {
  const handleMessage = useCallback(
    ({ nativeEvent }: WebViewMessageEvent) => {
      const event = JSON.parse(nativeEvent.data) as WebViewEvent;
      eventHandler.handle(event);
    },
    [eventHandler]
  );

  const { width } = useWindowDimensions();

  const handleScroll = useHeaderScrollResponder<WebViewScrollEvent>(
    useCallback((e: WebViewScrollEvent) => e.nativeEvent.contentOffset.y, [])
  );

  return (
    <WebView
      source={{ html }}
      originWhitelist={['*']}
      style={[styles.webView, { width }]}
      onMessage={handleMessage}
      onScroll={handleScroll}
    />
  );
}

const styles = StyleSheet.create({
  webView: {
    backgroundColor: theme.colors.background,
  },
});

export { ArticleView };
