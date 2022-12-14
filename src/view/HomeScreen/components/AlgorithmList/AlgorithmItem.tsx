import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { theme } from '@/view/theme';

type AlgorithmItemProps = {
  name: string;
};

function AlgorithmItem({ name }: AlgorithmItemProps) {
  return (
    <View style={styles.square}>
      <Image
        source={{ uri: 'https://placeimg.com/640/480/any' }}
        style={styles.image}
      />
      <Text style={styles.algotext}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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

export { AlgorithmItem };
