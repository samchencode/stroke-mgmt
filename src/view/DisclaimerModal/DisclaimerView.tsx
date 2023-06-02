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
  const { width, height } = useWindowDimensions();
  // minus padding of modal
  const maxWebviewWidth = 560 - theme.spaces.lg * 2;
  // minus margin of screen and padding of modal
  const screenWidthMinusSpace =
    width - theme.spaces.md * 2 - theme.spaces.lg * 2;

  const webViewWidth = Math.min(screenWidthMinusSpace, maxWebviewWidth);
  const [webViewInnerHeight, setWebViewInnerHeight] = useState(1);
  // minus button, button margin and padding of modal
  const maxWebviewHeight = Math.min(height, 560) - theme.spaces.lg * 3 - 40;
  const webViewHeight = Math.min(webViewInnerHeight, maxWebviewHeight);

  const eventHandler = useMemo(
    () =>
      new WebViewEventHandler({
        layout: ({ height: h }) => setWebViewInnerHeight(h),
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
        style={{
          width: webViewWidth,
          backgroundColor: theme.colors.background,
        }}
        onMessage={handleMessage}
        scrollEnabled={webViewInnerHeight > maxWebviewHeight}
      />
    </View>
  );
}

export { DisclaimerView };
