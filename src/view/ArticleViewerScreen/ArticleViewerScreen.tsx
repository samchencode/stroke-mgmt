import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import type { WebViewMessageEvent } from 'react-native-webview';
import { WebView } from 'react-native-webview';
import { StatusBar } from '@/view/StatusBar';
import type { AppNavigationProps } from '@/view/Router';
import type { RenderArticleByIdAction } from '@/application/RenderArticleByIdAction';
import type { WebViewEvent } from '@/infrastructure/rendering/WebViewEvent';
import { WebViewEventHandler } from '@/infrastructure/rendering/WebViewEvent';

function factory(renderArticleByIdAction: RenderArticleByIdAction) {
  return function ArticleViewerScreen({
    route,
  }: AppNavigationProps<'ArticleViewerScreen'>) {
    const { id } = route.params;

    const [html, setHtml] = useState('');
    useEffect(() => {
      renderArticleByIdAction.execute(id).then((h) => setHtml(h));
    }, [id]);

    const { width } = useWindowDimensions();

    const eventHandler = useMemo(() => new WebViewEventHandler({}), []);

    const handleMessage = useCallback(
      ({ nativeEvent }: WebViewMessageEvent) => {
        const event = JSON.parse(nativeEvent.data) as WebViewEvent;
        eventHandler.handle(event);
      },
      [eventHandler]
    );

    return (
      <View style={styles.container}>
        <StatusBar textColor="auto" translucent />
        <WebView
          source={{ html }}
          originWhitelist={['*']}
          style={{ width }}
          onMessage={handleMessage}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export { factory };
export type Type = ReturnType<typeof factory>;
