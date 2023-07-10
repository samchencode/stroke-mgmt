import React, { useCallback } from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, StyleSheet } from 'react-native';
import type {
  Algorithm,
  AlgorithmId,
  RenderedAlgorithm,
} from '@/domain/models/Algorithm';
import { theme } from '@/view/theme';
import { AlgorithmCollectionItem } from '@/view/AlgorithmViewerScreen/components/AlgorithmCollectionView/AlgorithmCollectionItem';
import { useAlgorithmCollection } from '@/view/AlgorithmViewerScreen/components/AlgorithmCollectionView/useAlgorithmCollection';
import type { AlgorithmIdWithUuid } from '@/view/AlgorithmViewerScreen/components/AlgorithmCollectionView/AlgorithmCollection';
import { useScrollBehavior } from '@/view/AlgorithmViewerScreen/components/AlgorithmCollectionView/useScrollBehavior';
import type { ArticleId } from '@/domain/models/Article';

type Props = {
  width: number;
  minHeight: number;
  renderAlgorithm: (a: Algorithm) => Promise<RenderedAlgorithm>;
  renderAlgorithmById: (
    id: AlgorithmId,
    onStale: (id: RenderedAlgorithm) => void
  ) => Promise<RenderedAlgorithm>;
  onPressArticleLink: (id: ArticleId) => void;
  onPressExternalLink: (url: string) => void;
  initialId: AlgorithmId;
};

function BaseAlgorithmCollectionView({
  width,
  minHeight,
  renderAlgorithmById,
  renderAlgorithm,
  onPressArticleLink,
  onPressExternalLink,
  initialId,
}: Props) {
  const { scrollToEnd, flatList, handleScroll } = useScrollBehavior();

  const {
    collection,
    handleAppendToCollection,
    handleDropItemsFromCollectionAfter,
  } = useAlgorithmCollection(
    initialId,
    useCallback(() => setTimeout(scrollToEnd, 300), [scrollToEnd])
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<AlgorithmIdWithUuid>) => (
      <AlgorithmCollectionItem
        key={item.uuid}
        id={item.id}
        uuid={item.uuid}
        width={width}
        style={[
          styles.algorithm,
          collection.length - 1 === index && { minHeight },
        ]}
        renderAlgorithm={renderAlgorithm}
        renderAlgorithmById={renderAlgorithmById}
        appendToCollection={handleAppendToCollection}
        dropItemsFromCollectionAfter={handleDropItemsFromCollectionAfter}
        onPressArticleLink={onPressArticleLink}
        onPressExternalLink={onPressExternalLink}
      />
    ),
    [
      collection.length,
      handleAppendToCollection,
      handleDropItemsFromCollectionAfter,
      minHeight,
      onPressArticleLink,
      onPressExternalLink,
      renderAlgorithm,
      renderAlgorithmById,
      width,
    ]
  );

  const getListItemKey = useCallback(
    (item: AlgorithmIdWithUuid) => item.uuid,
    []
  );

  return (
    <FlatList
      data={collection.getIds()}
      renderItem={renderItem}
      keyExtractor={getListItemKey}
      ref={flatList}
      onScroll={handleScroll}
      scrollEventThrottle={300}
      initialNumToRender={3}
      maxToRenderPerBatch={3}
    />
  );
}

const styles = StyleSheet.create({
  algorithm: {
    marginBottom: theme.spaces.lg,
  },
});

export const AlgorithmCollectionView = React.memo(BaseAlgorithmCollectionView);
