import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import type { WebViewMessageEvent } from 'react-native-webview';
import { WebView } from 'react-native-webview';
import { TextButton } from '@/view/components';
import { theme } from '@/view/theme';
import type { WebViewEvent } from '@/infrastructure/rendering/WebViewEvent';
import { WebViewEventHandler } from '@/infrastructure/rendering/WebViewEvent';

type Props = {
  onDismiss: () => void;
  html: string;
};

function DisclaimerView({ onDismiss, html }: Props) {
  const { width } = useWindowDimensions();
  const webViewWidth = width - theme.spaces.md * 2 - theme.spaces.lg * 2;
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
    <>
      <View style={{ height: webViewHeight }}>
        <WebView
          source={{ html }}
          originWhitelist={['*']}
          style={{ width: webViewWidth }}
          onMessage={handleMessage}
          scrollEnabled={false}
        />
      </View>
      <TextButton
        title="Got it"
        onPress={onDismiss}
        style={styles.btnDismiss}
      />
    </>
  );
}
const styles = StyleSheet.create({
  btnDismiss: {
    marginTop: theme.spaces.lg,
    alignSelf: 'flex-end',
  },
});

export { DisclaimerView };
