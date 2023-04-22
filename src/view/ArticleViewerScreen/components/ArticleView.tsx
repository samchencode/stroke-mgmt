import React, { useCallback, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import type { WebViewMessageEvent } from 'react-native-webview';
import WebView from 'react-native-webview';
import type {
  WebViewEvent,
  WebViewEventHandler,
} from '@/infrastructure/rendering/WebViewEvent';
import type { WebViewScrollEvent } from 'react-native-webview/lib/WebViewTypes';
import { HeaderScrollContext } from '@/view/Router/HeaderScrollContext';

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

  const headerScrollState = useContext(HeaderScrollContext);

  const handleScroll = useCallback(
    ({ nativeEvent }: WebViewScrollEvent) => {
      const { contentOffset } = nativeEvent;
      headerScrollState.setScrolledToTop(contentOffset.y === 0);
    },
    [headerScrollState]
  );

  return (
    <WebView
      source={{ html }}
      originWhitelist={['*']}
      style={{ width }}
      onMessage={handleMessage}
      onScroll={handleScroll}
    />
  );
}

export { ArticleView };
