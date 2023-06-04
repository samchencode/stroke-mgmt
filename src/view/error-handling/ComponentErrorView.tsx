import { thrownToString } from '@/view/error-handling/thrownToString';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  error: unknown;
};

function ComponentErrorView({ error }: Props) {
  return (
    <View style={styles.container}>
      <Text>Oops there was an error: {thrownToString(error)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export { ComponentErrorView };
