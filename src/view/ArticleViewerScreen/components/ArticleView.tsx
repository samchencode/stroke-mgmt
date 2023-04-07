import React, { useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import type { WebViewMessageEvent } from 'react-native-webview';
import WebView from 'react-native-webview';
import type {
  WebViewEvent,
  WebViewEventHandler,
} from '@/infrastructure/rendering/WebViewEvent';

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

  return (
    <WebView
      source={{ html }}
      originWhitelist={['*']}
      style={{ width }}
      onMessage={handleMessage}
    />
  );
}

export { ArticleView };
