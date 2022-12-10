import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from '@/view/StatusBar';
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

    const { width } = useWindowDimensions();

    return (
      <View style={styles.container}>
        <StatusBar textColor="auto" translucent />
        <WebView source={{ html }} originWhitelist={['*']} style={{ width }} />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export { factory };
export type Type = ReturnType<typeof factory>;
