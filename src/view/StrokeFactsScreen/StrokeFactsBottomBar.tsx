import { Button } from '@/view/components';
import { theme } from '@/view/theme';
import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';

type Props = {
  onPressButton: () => void;
};

function StrokeFactsBottomBar({ onPressButton }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Button title="Got it!" onPress={onPressButton} style={styles.button} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.secondaryContainer,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  container: {
    height: 80,
    paddingVertical: 12,
    paddingRight: theme.spaces.md,
    backgroundColor: theme.colors.secondaryContainer,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    alignSelf: 'flex-start',
    marginLeft: theme.spaces.md,
  },
});

export { StrokeFactsBottomBar };
