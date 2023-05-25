import React, { useCallback, useMemo, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import type { WebViewMessageEvent } from 'react-native-webview';
import { WebView } from 'react-native-webview';
import { theme } from '@/view/theme';
import type { WebViewEvent } from '@/infrastructure/rendering/WebViewEvent';
import { WebViewEventHandler } from '@/infrastructure/rendering/WebViewEvent';

type Props = {
  html: string;
};

function DisclaimerView({ html }: Props) {
  const { width } = useWindowDimensions();
  const maxWebviewWidth = 560;
  const screenWidthMinusSpace =
    width - theme.spaces.md * 2 - theme.spaces.lg * 2;
  const webViewWidth = Math.min(screenWidthMinusSpace, maxWebviewWidth);
  const [webViewHeight, setWebViewHeight] = useState(1);

  const eventHandler = useMemo(
    () =>
      new WebViewEventHandler({
        layout: ({ height }) => setWebViewHeight(height),
      }),
    []
  );

  const handleMessage = useCallback(
    ({ nativeEvent }: WebViewMessageEvent) => {
      const event = JSON.parse(nativeEvent.data) as WebViewEvent;
      eventHandler.handle(event);
    },
    [eventHandler]
  );

  return (
    <View style={{ height: webViewHeight }}>
      <WebView
        source={{ html }}
        originWhitelist={['*']}
        style={{ width: webViewWidth }}
        onMessage={handleMessage}
        scrollEnabled={false}
      />
    </View>
  );
}

export { DisclaimerView };
