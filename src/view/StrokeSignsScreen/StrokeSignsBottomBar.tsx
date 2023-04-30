import { Button } from '@/view/components';
import { Checkbox } from '@/view/components/Checkbox';
import { theme } from '@/view/theme';
import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';

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
        <Checkbox
          value={checkboxValue}
          onChange={onChangeCheckbox}
          style={styles.checkbox}
          label="Don't show again"
        />
        <Button
          title="Proceed"
          onPress={onPressButton}
          style={styles.button}
          underlayColor={theme.colors.opacity(0.08).onPrimaryContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.secondaryContainer,
    ...theme.elevations[2],
  },
  container: {
    height: 72,
    paddingVertical: 12,
    paddingRight: theme.spaces.md,
    backgroundColor: theme.colors.secondaryContainer,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    alignSelf: 'flex-start',
    marginLeft: theme.spaces.md,
    height: 48,
  },
  checkbox: {
    marginLeft: theme.spaces.md,
  },
});

export { StrokeSignsBottomBar };
