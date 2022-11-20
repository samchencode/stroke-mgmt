import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import type { Type as StrokeFactsScreen } from '@/view/StrokeFactsScreen';

function factory(StrokeFactsScreen: StrokeFactsScreen) {
  return function App() {
    return (
      <View style={styles.container}>
        <StrokeFactsScreen />
        {/* eslint-disable-next-line react/style-prop-object */}
        <StatusBar style="auto" />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type Type = ReturnType<typeof factory>;

export { factory };
export type { Type };
