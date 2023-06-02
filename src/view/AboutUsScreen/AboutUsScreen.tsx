import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { RenderAboutUsAction } from '@/application/RenderAboutUsAction';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LoadingSpinnerView } from '@/view/components';
import { AboutUsView } from '@/view/AboutUsScreen/AboutUsView';
import type { AppNavigationProps } from '@/view/Router';
import { WebViewEventHandler } from '@/infrastructure/rendering/WebViewEvent';
import { ArticleId } from '@/domain/models/Article';

type Props = AppNavigationProps<'AboutUsScreen'>;

function factory(renderAboutUsAction: RenderAboutUsAction) {
  return function AboutUsScreen({ navigation }: Props) {
    const queryClient = useQueryClient();
    const onStale = (html: string) =>
      queryClient.setQueryData(['stroke-facts'], html);

    const query = useQuery({
      queryKey: ['stroke-facts'],
      queryFn: () => renderAboutUsAction.execute(onStale),
      retry: false,
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
              <AboutUsView html={html} eventHandler={eventHandler} />
            ),
            [eventHandler]
          )}
          renderError={useCallback(
            () => (
              <Text>Oops something went wrong!</Text>
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
