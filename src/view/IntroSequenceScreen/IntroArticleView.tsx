import React, { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { ArticleId } from '@/domain/models/Article';
import type { WebViewEvent } from '@/infrastructure/rendering/WebViewEvent';
import { WebViewEventHandler } from '@/infrastructure/rendering/WebViewEvent';
import type { RenderArticleByIdAction } from '@/application/RenderArticleByIdAction';
import { theme } from '@/view/theme';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { ScreenErrorView } from '@/view/error-handling';
import { LoadingSpinnerView } from '@/view/components';

type Props = {
  id: ArticleId;
  renderArticleByIdAction: RenderArticleByIdAction;
  onPressExternalLink: (url: string) => void;
};

function IntroArticleView({
  id,
  renderArticleByIdAction,
  onPressExternalLink,
}: Props) {
  const eventHandler = useMemo(
    () =>
      new WebViewEventHandler({
        linkpressed: ({ href }) => {
          onPressExternalLink(href);
        },
      }),
    [onPressExternalLink]
  );

  const handleMessage = useCallback(
    ({ nativeEvent }: WebViewMessageEvent) => {
      const event = JSON.parse(nativeEvent.data) as WebViewEvent;
      eventHandler.handle(event);
    },
    [eventHandler]
  );

  const queryClient = useQueryClient();
  const onStale = (html: string) =>
    queryClient.setQueryData(['article', id], html);

  const query = useQuery({
    queryKey: ['article', id],
    queryFn: () => renderArticleByIdAction.execute(id, onStale),
  });

  const renderData = useCallback(
    (html: string) => (
      <WebView
        source={{ html }}
        originWhitelist={['*']}
        onMessage={handleMessage}
        style={styles.webView}
      />
    ),
    [handleMessage]
  );

  const renderError = useCallback(
    (error: unknown) => (
      <ScreenErrorView
        error={error}
        message={`We had trouble retrieving the intro article (id: ${id}). If there is internet, then refreshing or clearing the cache may help. Restarting the app might also help.`}
      />
    ),
    [id]
  );

  const renderLoading = useCallback(() => <LoadingSpinnerView />, []);

  return (
    <UseQueryResultView
      query={query}
      renderData={renderData}
      renderError={renderError}
      renderLoading={renderLoading}
    />
  );
}

const styles = StyleSheet.create({
  webView: {
    backgroundColor: theme.colors.background,
  },
});

export { IntroArticleView };
