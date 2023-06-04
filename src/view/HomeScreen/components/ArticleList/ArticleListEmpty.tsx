import { theme } from '@/view/theme';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

function ArticleListEmpty() {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        This list is empty. Unselecting some filters might help.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 350,
    marginTop: theme.spaces.md,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spaces.md,
  },
  message: {
    ...theme.fonts.bodyMedium,
  },
});

export { ArticleListEmpty };
