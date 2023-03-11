import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import { Button } from '@/view/components';
import { WebViewEventHandler } from '@/infrastructure/rendering/WebViewEvent';
import type { WebViewEvent } from '@/infrastructure/rendering/WebViewEvent';
import { theme } from '@/view/theme';

type StrokeFactsViewProps = {
  height: number;
  width: number;
  onPressButton: () => void;
  html: string;
};

function StrokeFactsView({
  height,
  width,
  onPressButton,
  html,
}: StrokeFactsViewProps) {
  const webViewHeight = height * 0.6;

  const eventHandler = useMemo(() => new WebViewEventHandler({}), []);

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
          style={{ width }}
          scrollEnabled={false}
          onMessage={handleMessage}
        />
      </View>
      <Button title="Got it!" onPress={onPressButton} style={styles.button} />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    marginLeft: theme.spaces.md,
  },
});

export { StrokeFactsView };
