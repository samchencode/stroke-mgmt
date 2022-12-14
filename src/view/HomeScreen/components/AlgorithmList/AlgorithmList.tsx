import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '@/view/theme';
import { AlgorithmItem } from '@/view/HomeScreen/components/AlgorithmList/AlgorithmItem';

const myArrayOfNames = ['alg1', 'alg2', 'alg3', 'alg4'];

function AlgorithmList() {
  return (
    <View>
      <Text style={styles.title}>Algorithms</Text>
      <ScrollView horizontal style={styles.carousel}>
        {myArrayOfNames.map((v) => (
          <AlgorithmItem name={v} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carousel: {
    height: 150,
  },
  image: { width: 100, height: 100 },
  title: {
    marginLeft: theme.spaces.lg,
    lineHeight: 60,
    fontSize: 42,
    fontWeight: 'bold',
  },
  algotext: {
    fontSize: 10,
  },
  square: {
    marginRight: theme.spaces.md,
    backgroundColor: 'gold',
  },
});

export { AlgorithmList };
