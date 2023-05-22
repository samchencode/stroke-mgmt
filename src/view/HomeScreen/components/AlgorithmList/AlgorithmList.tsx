import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { theme } from '@/view/theme';
import type { AlgorithmId, Algorithm } from '@/domain/models/Algorithm';
import { AlgorithmListFilled } from '@/view/HomeScreen/components/AlgorithmList/AlgorithmListFilled';
import { AlgorithmListError } from '@/view/HomeScreen/components/AlgorithmList/AlgorithmListError';
import { AlgorithmListLoading } from '@/view/HomeScreen/components/AlgorithmList/AlgorithmListLoading';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';

type AlgorithmListProps = {
  getAllAlgorithms: (cb: (as: Algorithm[]) => void) => Promise<Algorithm[]>;
  onSelectAlgorithm: (id: AlgorithmId) => void;
  style?: StyleProp<ViewStyle>;
};

function AlgorithmList({
  getAllAlgorithms,
  onSelectAlgorithm,
  style = {},
}: AlgorithmListProps) {
  const queryClient = useQueryClient();
  const onAlgorithmsStale = (algorithms: Algorithm[]) =>
    queryClient.setQueryData(['algorithms'], algorithms);

  const query = useQuery({
    queryKey: ['algorithms'],
    queryFn: () => getAllAlgorithms(onAlgorithmsStale),
  });

  return (
    <View style={style}>
      <Text style={styles.title}>Algorithms</Text>
      <UseQueryResultView
        query={query}
        renderData={useCallback(
          (data: Algorithm[]) => (
            <AlgorithmListFilled
              data={data}
              onSelectAlgorithm={onSelectAlgorithm}
            />
          ),
          [onSelectAlgorithm]
        )}
        renderError={useCallback(
          () => (
            <AlgorithmListError />
          ),
          []
        )}
        renderLoading={useCallback(
          () => (
            <AlgorithmListLoading />
          ),
          []
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: theme.fonts.titleLarge,
});

export { AlgorithmList };
