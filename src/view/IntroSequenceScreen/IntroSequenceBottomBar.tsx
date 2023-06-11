import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { Button, Checkbox } from '@/view/components';
import { theme } from '@/view/theme';

type Props = {
  onPressButton: () => void;
  onChangeCheckbox: (v: boolean) => void;
  checkboxValue: boolean;
  checkboxVisible: boolean;
  buttonTitle?: string;
};

function IntroSequenceBottomBar({
  onPressButton,
  onChangeCheckbox,
  checkboxValue,
  checkboxVisible,
  buttonTitle = 'Proceed',
}: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.container,
          checkboxVisible && styles.containerWithCheckbox,
        ]}
      >
        {checkboxVisible && (
          <Checkbox
            value={checkboxValue}
            onChange={onChangeCheckbox}
            style={styles.checkbox}
            label="Don't show again"
          />
        )}
        <Button
          title={buttonTitle}
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  containerWithCheckbox: {
    justifyContent: 'space-between',
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

export { IntroSequenceBottomBar };
