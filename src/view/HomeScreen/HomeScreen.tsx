import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AppNavigationProps } from '@/view/Router';

function factory() {
  return function HomeScreen({ navigation }: AppNavigationProps<'HomeScreen'>) {
    useEffect(() => {
      navigation.navigate('DisclaimerModal');
    }, [navigation]);

    return (
      <View style={styles.container}>
        <Text>Hello from HomeScreen</Text>
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
