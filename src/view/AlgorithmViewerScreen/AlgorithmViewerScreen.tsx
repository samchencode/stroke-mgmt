import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import type { AppNavigationProps } from '@/view/Router';
import type { GetAlgorithmByIdAction } from '@/application/GetAlgorithmByIdAction';
import type { RenderAlgorithmAction } from '@/application/RenderAlgorithmAction';
import type { Algorithm, AlgorithmId } from '@/domain/models/Algorithm';
import { AlgorithmView } from '@/view/AlgorithmViewerScreen/components/AlgorithmView';

function factory(
  getAlgorithmByIdAction: GetAlgorithmByIdAction,
  renderAlgorithmAction: RenderAlgorithmAction
) {
  return function AlgorithmViewerScreen({
    route,
  }: AppNavigationProps<'AlgorithmViewerScreen'>) {
    const { id } = route.params;

    const { width } = useWindowDimensions();

    const [html, setHtml] = useState('');
    const [algo, setAlgo] = useState<Algorithm | null>(null);

    useEffect(() => {
      getAlgorithmByIdAction.execute(id).then(setAlgo);
    }, [id]);

    useEffect(() => {
      if (!algo) return;
      renderAlgorithmAction.execute(algo).then(setHtml);
    }, [algo]);

    const handleChangeAlgorithm = useCallback((a: Algorithm) => setAlgo(a), []);
    const handleNextAlgorithm = useCallback((aId: AlgorithmId) => {
      alert(aId.toString());
    }, []);

    if (!algo || !html) return <View style={styles.container} />;

    return (
      <View style={styles.container}>
        <AlgorithmView
          width={width}
          html={html}
          algorithm={algo}
          onChangeAlgorithm={handleChangeAlgorithm}
          onNextAlgorithm={handleNextAlgorithm}
        />
      </View>
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
