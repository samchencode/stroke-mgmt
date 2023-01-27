import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import type { WebViewMessageEvent } from 'react-native-webview';
import { WebView } from 'react-native-webview';
import type { RenderDisclaimerAction } from '@/application/RenderDisclaimerAction';
import { TextButton } from '@/view/components';
import type { RootNavigationProps } from '@/view/Router';
import { theme } from '@/view/theme';
import type { WebViewEvent } from '@/infrastructure/rendering/WebViewEvent';
import { WebViewEventHandler } from '@/infrastructure/rendering/WebViewEvent';

function factory(renderDisclaimerAction: RenderDisclaimerAction) {
  return function DisclaimerModal({
    navigation,
  }: RootNavigationProps<'DisclaimerModal'>) {
    const [html, setHtml] = useState('');
    useEffect(() => {
      renderDisclaimerAction.execute().then((h) => setHtml(h));
    }, []);

    const handleDismiss = useCallback(() => navigation.goBack(), [navigation]);

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
      <View style={styles.container}>
        <View style={styles.background} />
        <View style={styles.contentContainer}>
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
            onPress={handleDismiss}
            style={styles.btnDismiss}
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
  contentContainer: {
    backgroundColor: theme.colors.background,
    padding: theme.spaces.lg,
    minHeight: 280,
    maxHeight: 560,
    borderRadius: 28,
  },
  btnDismiss: {
    marginTop: theme.spaces.lg,
    alignSelf: 'flex-end',
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
