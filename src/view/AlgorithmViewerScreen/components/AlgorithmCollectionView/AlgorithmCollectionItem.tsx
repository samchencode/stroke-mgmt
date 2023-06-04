import React, { useCallback, useEffect, useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import type {
  Algorithm,
  AlgorithmId,
  RenderedAlgorithm,
} from '@/domain/models/Algorithm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { AlgorithmView } from '@/view/AlgorithmViewerScreen/components/AlgorithmView';
import { LoadingSpinnerView } from '@/view/components';
import type { ArticleId } from '@/domain/models/Article';
import { ScreenErrorView } from '@/view/error-handling';

type Props = {
  id: AlgorithmId;
  uuid: string;
  renderAlgorithm: (a: Algorithm) => Promise<RenderedAlgorithm>;
  renderAlgorithmById: (
    id: AlgorithmId,
    onStale: (id: RenderedAlgorithm) => void
  ) => Promise<RenderedAlgorithm>;
  appendToCollection: (afterUuid: string, newId: AlgorithmId) => void;
  dropItemsFromCollectionAfter: (afterUuid: string) => void;
  width: number;
  onPressArticleLink: (id: ArticleId) => void;
  style?: StyleProp<ViewStyle>;
};

function BaseAlgorithmCollectionItem({
  id,
  uuid,
  renderAlgorithm,
  renderAlgorithmById,
  appendToCollection,
  dropItemsFromCollectionAfter,
  width,
  onPressArticleLink,
  style = {},
}: Props) {
  const [renderedAlgorithm, setRenderedAlgorithm] =
    useState<RenderedAlgorithm | null>(null);
  const queryClient = useQueryClient();
  const handleStale = (rAlgo: RenderedAlgorithm) =>
    queryClient.setQueryData(['algorithm', id.toString()], rAlgo);

  const query = useQuery({
    queryKey: ['algorithm', id.toString()],
    queryFn: () => renderAlgorithmById(id, handleStale),
    structuralSharing: (oldData, newData) => {
      if (!oldData) return newData;
      const isStale =
        oldData.getAlgorithm().getLastUpdated() <
        newData.getAlgorithm().getLastUpdated();
      if (isStale) {
        // runs once after both handleStale and query's refetch
        dropItemsFromCollectionAfter(uuid);
        return newData;
      }
      return oldData;
    },
  });

  useEffect(() => {
    if (query.isSuccess) setRenderedAlgorithm(query.data);
  }, [query.data, query.isSuccess]);

  const handleChangeAlgorithm = useCallback(
    async (newAlgorithmState: Algorithm) => {
      const rAlgo = await renderAlgorithm(newAlgorithmState);
      setRenderedAlgorithm(rAlgo);
    },
    [renderAlgorithm]
  );

  const handleNextAlgorithm = useCallback(
    (nextId: AlgorithmId) => {
      appendToCollection(uuid, nextId);
    },
    [appendToCollection, uuid]
  );

  return (
    <UseQueryResultView
      query={query}
      renderError={useCallback(
        (error) => (
          <View style={styles.errorView}>
            <ScreenErrorView
              error={error}
              message={`We had trouble getting this algorithm (id: ${id}). If there is internet, then refreshing or clearing the cache may help. Restarting the app might also help.`}
            />
          </View>
        ),
        [id]
      )}
      renderData={useCallback(
        () =>
          renderedAlgorithm ? (
            <AlgorithmView
              algorithm={renderedAlgorithm.getAlgorithm()}
              html={renderedAlgorithm.getHtml()}
              width={width}
              onChangeAlgorithm={handleChangeAlgorithm}
              onNextAlgorithm={handleNextAlgorithm}
              style={style}
              onPressArticleLink={onPressArticleLink}
            />
          ) : (
            <Text>Oh no! Something went wrong!</Text>
          ),
        [
          handleChangeAlgorithm,
          handleNextAlgorithm,
          onPressArticleLink,
          renderedAlgorithm,
          style,
          width,
        ]
      )}
      renderLoading={useCallback(
        () => (
          <LoadingSpinnerView />
        ),
        []
      )}
    />
  );
}

const styles = StyleSheet.create({
  errorView: {
    height: 350,
  },
});

export const AlgorithmCollectionItem = React.memo(BaseAlgorithmCollectionItem);
