import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import type { AppNavigationProps } from '@/view/Router';
import type { RenderArticleByIdAction } from '@/application/RenderArticleByIdAction';
import { WebViewEventHandler } from '@/infrastructure/rendering/WebViewEvent';
import { ArticleId } from '@/domain/models/Article';
import { ArticleView } from '@/view/ArticleViewerScreen/components';
import { useQuery } from '@tanstack/react-query';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { LoadingSpinnerView } from '@/view/components';

function factory(renderArticleByIdAction: RenderArticleByIdAction) {
  return function ArticleViewerScreen({
    route,
    navigation,
  }: AppNavigationProps<'ArticleViewerScreen'>) {
    const { id } = route.params;

    const query = useQuery({
      queryKey: ['article', id],
      queryFn: () => renderArticleByIdAction.execute(id),
    });

    const eventHandler = useMemo(
      () =>
        new WebViewEventHandler({
          articlelinkpressed: ({ articleId }) => {
            navigation.navigate('ArticleViewerScreen', {
              id: new ArticleId(articleId),
            });
          },
        }),
      [navigation]
    );

    return (
      <View style={styles.container}>
        <UseQueryResultView
          query={query}
          renderData={useCallback(
            (html: string) => (
              <ArticleView html={html} eventHandler={eventHandler} />
            ),
            [eventHandler]
          )}
          renderError={useCallback(
            () => (
              <Text>Uh oh! Something went wrong!</Text>
            ),
            []
          )}
          renderLoading={useCallback(
            () => (
              <LoadingSpinnerView />
            ),
            []
          )}
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
