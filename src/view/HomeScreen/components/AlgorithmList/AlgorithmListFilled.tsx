import React, { useCallback } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { AlgorithmId } from '@/domain/models/Algorithm';
import type { Algorithm } from '@/domain/models/Algorithm';
import { theme } from '@/view/theme';
import { AlgorithmItem } from '@/view/HomeScreen/components/AlgorithmList/AlgorithmItem';

type Props = {
  data: Algorithm[];
  onSelectAlgorithm: (id: AlgorithmId) => void;
};

function AlgorithmListFilled({ data, onSelectAlgorithm }: Props) {
  const handleSelectAlgorithm = useCallback(
    (id: string) => {
      const algorithmId = new AlgorithmId(id);
      onSelectAlgorithm(algorithmId);
    },
    [onSelectAlgorithm]
  );

  return (
    <ScrollView horizontal style={styles.scrollview}>
      {data.map((algorithm) => (
        <AlgorithmItem
          id={algorithm.getId().toString()}
          name={algorithm.getTitle()}
          key={algorithm.getId().toString()}
          body={algorithm.getSummary()}
          imageUri={algorithm.getThumbnail().getUri()}
          onPress={handleSelectAlgorithm}
          style={styles.item}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollview: {
    marginTop: theme.spaces.md,
    paddingBottom: theme.spaces.xs,
  },
  item: {
    marginRight: theme.spaces.sm,
  },
});

export { AlgorithmListFilled };
