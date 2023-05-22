import React, { useCallback, useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { ScrollView, StyleSheet } from 'react-native';
import type {
  Algorithm,
  AlgorithmId,
  RenderedAlgorithm,
} from '@/domain/models/Algorithm';
import { theme } from '@/view/theme';
import { useHeaderScrollResponder } from '@/view/Router/HeaderScrollContext';
import { AlgorithmCollection } from '@/view/AlgorithmViewerScreen/components/AlgorithmCollectionView/AlgorithmCollection';
import { AlgorithmCollectionItem } from '@/view/AlgorithmViewerScreen/components/AlgorithmCollectionView/AlgorithmCollectionItem';

type Props = {
  width: number;
  minHeight: number;
  renderAlgorithm: (a: Algorithm) => Promise<RenderedAlgorithm>;
  renderAlgorithmById: (id: AlgorithmId) => Promise<RenderedAlgorithm>;
  initialId: AlgorithmId;
};

function BaseAlgorithmCollectionView({
  width,
  minHeight,
  renderAlgorithmById,
  renderAlgorithm,
  initialId,
}: Props) {
  const scrollView = useRef<ScrollView>(null);
  const scrollToEnd = useCallback(() => {
    scrollView.current?.scrollToEnd({ animated: true });
  }, []);
  const handleScroll = useHeaderScrollResponder<
    NativeSyntheticEvent<NativeScrollEvent>
  >(useCallback((e) => e.nativeEvent.contentOffset.y, []));

  const [collection, setCollection] = useState(
    AlgorithmCollection.fromInitial(initialId)
  );

  const handleAppendToCollection = useCallback(
    (after: AlgorithmId, newId: AlgorithmId) => {
      const newCollection = collection.append(after, newId);
      setCollection(newCollection);
      setTimeout(scrollToEnd, 300);
    },
    [collection, scrollToEnd]
  );

  return (
    <ScrollView
      ref={scrollView}
      onScroll={handleScroll}
      scrollEventThrottle={300}
    >
      {collection.getIds().map((id, i, arr) => (
        <AlgorithmCollectionItem
          key={id.toString()}
          id={id}
          width={width}
          style={[styles.algorithm, arr.length - 1 === i && { minHeight }]}
          renderAlgorithm={renderAlgorithm}
          renderAlgorithmById={renderAlgorithmById}
          appendToCollection={handleAppendToCollection}
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
