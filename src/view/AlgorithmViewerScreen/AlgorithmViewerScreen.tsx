import React, { useCallback } from 'react';
import { StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import type { AppNavigationProps } from '@/view/Router';
import type { RenderAlgorithmByIdAction } from '@/application/RenderAlgorithmByIdAction';
import type { RenderAlgorithmAction } from '@/application/RenderAlgorithmAction';
import { AlgorithmCollectionView } from '@/view/AlgorithmViewerScreen/components/AlgorithmCollectionView/AlgorithmCollectionView';

function factory(
  renderAlgorithmByIdAction: RenderAlgorithmByIdAction,
  renderAlgorithmAction: RenderAlgorithmAction
) {
  return function AlgorithmViewerScreen({
    route,
  }: AppNavigationProps<'AlgorithmViewerScreen'>) {
    const { id } = route.params;
    const { width } = useWindowDimensions();

    return (
      <ScrollView style={styles.container}>
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
