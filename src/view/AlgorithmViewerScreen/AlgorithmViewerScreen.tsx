import React, { useCallback, useContext, useRef, useState } from 'react';
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import type { AppNavigationProps } from '@/view/Router';
import type { RenderAlgorithmByIdAction } from '@/application/RenderAlgorithmByIdAction';
import type { RenderAlgorithmAction } from '@/application/RenderAlgorithmAction';
import { AlgorithmCollectionView } from '@/view/AlgorithmViewerScreen/components/AlgorithmCollectionView/AlgorithmCollectionView';
import { HeaderScrollContext } from '@/view/Router/HeaderScrollContext';

function factory(
  renderAlgorithmByIdAction: RenderAlgorithmByIdAction,
  renderAlgorithmAction: RenderAlgorithmAction
) {
  return function AlgorithmViewerScreen({
    route,
  }: AppNavigationProps<'AlgorithmViewerScreen'>) {
    const { id } = route.params;
    const { width } = useWindowDimensions();
    const scrollView = useRef<ScrollView>(null);
    const [height, setHeight] = useState(0);

    const handleNextAlgorithm = useCallback(() => {
      scrollView.current?.scrollToEnd({ animated: true });
    }, []);

    const headerScrollState = useContext(HeaderScrollContext);

    const handleScroll = useCallback(
      ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset } = nativeEvent;
        headerScrollState.setScrolledToTop(contentOffset.y === 0);
      },
      [headerScrollState]
    );

    return (
      <ScrollView
        style={styles.container}
        ref={scrollView}
        onLayout={useCallback(
          (e: LayoutChangeEvent) => setHeight(e.nativeEvent.layout.height - 20),
          []
        )}
        onScroll={handleScroll}
        scrollEventThrottle={300}
      >
        <AlgorithmCollectionView
          width={width}
          initialId={id}
          renderAlgorithm={useCallback(
            (a) => renderAlgorithmAction.execute(a),
            []
          )}
          renderAlgorithmById={useCallback(
            (aId) => renderAlgorithmByIdAction.execute(aId),
            []
          )}
          onNextAlgorithm={handleNextAlgorithm}
          minHeight={height}
        />
      </ScrollView>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
