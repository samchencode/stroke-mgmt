import React, { useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import type {
  Algorithm,
  AlgorithmId,
  RenderedAlgorithm,
} from '@/domain/models/Algorithm';
import { theme } from '@/view/theme';
import { AlgorithmCollectionItem } from '@/view/AlgorithmViewerScreen/components/AlgorithmCollectionView/AlgorithmCollectionItem';
import { useAlgorithmCollection } from '@/view/AlgorithmViewerScreen/components/AlgorithmCollectionView/useAlgorithmCollection';
import { useScrollBehavior } from '@/view/AlgorithmViewerScreen/components/AlgorithmCollectionView/useScrollBehavior';

type Props = {
  width: number;
  minHeight: number;
  renderAlgorithm: (a: Algorithm) => Promise<RenderedAlgorithm>;
  renderAlgorithmById: (
    id: AlgorithmId,
    onStale: (id: RenderedAlgorithm) => void
  ) => Promise<RenderedAlgorithm>;
  initialId: AlgorithmId;
};

function BaseAlgorithmCollectionView({
  width,
  minHeight,
  renderAlgorithmById,
  renderAlgorithm,
  initialId,
}: Props) {
  const { scrollToEnd, scrollView, handleScroll } = useScrollBehavior();

  const {
    collection,
    handleAppendToCollection,
    handleDropItemsFromCollectionAfter,
  } = useAlgorithmCollection(
    initialId,
    useCallback(() => setTimeout(scrollToEnd, 300), [scrollToEnd])
  );

  return (
    <ScrollView
      ref={scrollView}
      onScroll={handleScroll}
      scrollEventThrottle={300}
    >
      {collection.getIds().map(({ id, uuid }, i, arr) => (
        <AlgorithmCollectionItem
          key={uuid}
          id={id}
          uuid={uuid}
          width={width}
          style={[styles.algorithm, arr.length - 1 === i && { minHeight }]}
          renderAlgorithm={renderAlgorithm}
          renderAlgorithmById={renderAlgorithmById}
          appendToCollection={handleAppendToCollection}
          dropItemsFromCollectionAfter={handleDropItemsFromCollectionAfter}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  algorithm: {
    marginBottom: theme.spaces.lg,
  },
});

export const AlgorithmCollectionView = React.memo(BaseAlgorithmCollectionView);
