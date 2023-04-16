import { Button } from '@/view/components';
import { Checkbox } from '@/view/components/Checkbox';
import { theme } from '@/view/theme';
import React from 'react';
import { SafeAreaView, View, StyleSheet, Text } from 'react-native';

type Props = {
  onPressButton: () => void;
  onChangeCheckbox: (v: boolean) => void;
  checkboxValue: boolean;
};

function StrokeSignsBottomBar({
  onPressButton,
  onChangeCheckbox,
  checkboxValue,
}: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.dontShowField}>
          <Checkbox
            value={checkboxValue}
            onChange={onChangeCheckbox}
            style={styles.checkbox}
          />
          <Text>Don&apos;t show again</Text>
        </View>
        <Button title="Proceed" onPress={onPressButton} style={styles.button} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    marginLeft: theme.spaces.md,
  },
  dontShowField: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginLeft: theme.spaces.md,
    marginRight: theme.spaces.sm,
  },
});

export { StrokeSignsBottomBar };
