import React from 'react';
import { View, Text } from 'react-native';

export function ListEmptyComponent() {
  return (
    <View>
      <Text>This list is empty. Unselecting some filters might help.</Text>
    </View>
  );
}
