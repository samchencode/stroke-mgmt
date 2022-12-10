import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from '@/view/StatusBar';
import { theme } from '@/view/theme';
import type { GetArticleByIdAction } from '@/application/GetArticleByIdAction';
import type { AppNavigationProps } from '@/view/Router';
import type { RenderArticleAction } from '@/application/RenderArticleAction';

function factory(
  getArticleByIdAction: GetArticleByIdAction,
  renderArticleAction: RenderArticleAction
) {
  return function ArticleViewerScreen({
    route,
  }: AppNavigationProps<'ArticleViewerScreen'>) {
    const { id } = route.params;

    const [html, setHtml] = useState('');
    useEffect(() => {
      getArticleByIdAction
        .execute(id)
        .then((a) => renderArticleAction.execute(a))
        .then((h) => setHtml(h));
    }, [id]);

    const { width, height } = useWindowDimensions();
    const webViewHeight = height * 0.6;

    return (
      <View style={styles.container}>
        <StatusBar textColor="auto" backgroundColor={theme.colors.background} />
        <View style={{ height: webViewHeight }}>
          <WebView
            source={{ html }}
            originWhitelist={['*']}
            style={{ width }}
          />
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export { factory };
export type Type = ReturnType<typeof factory>;
