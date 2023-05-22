import React, { useCallback, useEffect, useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Text } from 'react-native';
import type {
  Algorithm,
  AlgorithmId,
  RenderedAlgorithm,
} from '@/domain/models/Algorithm';
import { useQuery } from '@tanstack/react-query';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { AlgorithmView } from '@/view/AlgorithmViewerScreen/components/AlgorithmView';
import { LoadingSpinnerView } from '@/view/components';

type Props = {
  id: AlgorithmId;
  renderAlgorithm: (a: Algorithm) => Promise<RenderedAlgorithm>;
  renderAlgorithmById: (id: AlgorithmId) => Promise<RenderedAlgorithm>;
  appendToCollection: (after: AlgorithmId, newId: AlgorithmId) => void;
  width: number;
  style?: StyleProp<ViewStyle>;
};

function AlgorithmCollectionItem({
  id,
  renderAlgorithm,
  renderAlgorithmById,
  appendToCollection,
  width,
  style = {},
}: Props) {
  const [renderedAlgorithm, setRenderedAlgorithm] =
    useState<RenderedAlgorithm | null>(null);

  const query = useQuery({
    queryKey: ['algorithm', id.toString()],
    queryFn: () => renderAlgorithmById(id),
    staleTime: Infinity,
    // TODO: don't update view onfocus and on network change
    // 1. if you do, it resets algo state probably so need to clear the collection
    // --> annoying UX?
    // 2. good middle ground would be to check if it requires an update by .lastUpdated comparison
    // and if it does, show a snackbar or banner with option to refresh.
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
    (nextId: AlgorithmId, thisAlgorithm: Algorithm) => {
      const thisId = thisAlgorithm.getId();
      appendToCollection(thisId, nextId);
    },
    [appendToCollection]
  );

  return (
    <UseQueryResultView
      query={query}
      renderError={useCallback(
        () => (
          <Text>Uh oh, something went wrong!</Text>
        ),
        []
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
            />
          ) : (
            <Text>Oh no! Something went wrong!</Text>
          ),
        [
          handleChangeAlgorithm,
          handleNextAlgorithm,
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

export { AlgorithmCollectionItem };
