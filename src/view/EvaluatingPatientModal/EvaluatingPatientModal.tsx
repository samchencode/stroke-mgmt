import React, { useCallback } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import type { RootNavigationProps } from '@/view/Router';
import { theme } from '@/view/theme';
import { TextButton } from '@/view/components';

function EvaluatingPatientModal({
  route,
  navigation,
}: RootNavigationProps<'EvaluatingPatientModal'>) {
  const handleDismiss = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const { suggestedAlgorithmId } = route.params;

  const handlePressYes = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'App',
          state: {
            index: 1,
            routes: [
              { name: 'HomeScreen' },
              {
                name: 'AlgorithmViewerScreen',
                params: { id: suggestedAlgorithmId },
              },
            ],
          },
        },
      ],
    });
  }, [navigation, suggestedAlgorithmId]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Start AIS algorithm?</Text>
        <Text style={styles.subtitle}>
          Would you like to skip the articles and begin the acute ischemic
          stroke algorithm? This may be helpful if you are currently evaluating
          a patient.
        </Text>
        <View style={styles.buttonGroup}>
          <TextButton title="No" onPress={handleDismiss} />
          <TextButton title="Yes" onPress={handlePressYes} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    backgroundColor: 'black',
    opacity: 0.25,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  contentContainer: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    ...theme.elevations[3],
    padding: theme.spaces.lg,
    minWidth: 280,
    maxWidth: 560,
    borderRadius: 28,
  },
  buttonGroup: {
    marginTop: theme.spaces.lg,
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  title: {
    ...theme.fonts.headlineSmall,
    color: theme.colors.onSurface,
  },
  subtitle: {
    ...theme.fonts.bodyMedium,
    color: theme.colors.onSurfaceVariant,
    marginTop: theme.spaces.md,
  },
});

export { EvaluatingPatientModal };
