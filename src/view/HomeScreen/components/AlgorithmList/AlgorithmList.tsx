import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { theme } from '@/view/theme';
import type { Algorithm } from '@/domain/models/Algorithm';
import { AlgorithmId } from '@/domain/models/Algorithm';
import { AlgorithmItem } from '@/view/HomeScreen/components/AlgorithmList/AlgorithmItem';

type AlgorithmListProps = {
  data: Algorithm[];
  onSelectAlgorithm: (id: AlgorithmId) => void;
  style?: StyleProp<ViewStyle>;
};

function AlgorithmList({
  data,
  onSelectAlgorithm,
  style = {},
}: AlgorithmListProps) {
  const handleSelectAlgorithm = useCallback(
    (id: string) => {
      const algorithmId = new AlgorithmId(id);
      onSelectAlgorithm(algorithmId);
    },
    [onSelectAlgorithm]
  );
  return (
    <View style={style}>
      <Text style={styles.title}>Algorithms</Text>
      <ScrollView horizontal style={styles.scrollview}>
        {data.map((algorithm) => (
          <AlgorithmItem
            id={algorithm.getId().toString()}
            name={algorithm.getTitle()}
            key={algorithm.getId().toString()}
            body={algorithm.getSummary()}
            onPress={handleSelectAlgorithm}
            style={styles.item}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: theme.fonts.displayMedium,
  scrollview: {
    marginTop: theme.spaces.md,
  },
  item: {
    marginRight: theme.spaces.sm,
  },
});

export { AlgorithmList };
