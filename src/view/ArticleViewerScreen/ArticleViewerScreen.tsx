import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from '@/view/StatusBar';
import type { AppNavigationProps } from '@/view/Router';
import type { RenderArticleByIdAction } from '@/application/RenderArticleByIdAction';

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

    return (
      <View style={styles.container}>
        <StatusBar textColor="auto" translucent />
        <WebView
          source={{ html }}
          originWhitelist={['*']}
          style={{ width }}
          scrollEnabled={false}
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
