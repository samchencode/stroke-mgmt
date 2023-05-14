import React, { useCallback } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import type { RenderDisclaimerAction } from '@/application/RenderDisclaimerAction';
import type { RootNavigationProps } from '@/view/Router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DisclaimerView } from '@/view/DisclaimerModal/DisclaimerView';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { LoadingSpinnerView } from '@/view/components';
import { theme } from '@/view/theme';

function factory(renderDisclaimerAction: RenderDisclaimerAction) {
  return function DisclaimerModal({
    navigation,
  }: RootNavigationProps<'DisclaimerModal'>) {
    const queryClient = useQueryClient();
    const onStale = (html: string) =>
      queryClient.setQueryData(['disclaimer'], html);

    const query = useQuery({
      queryKey: ['disclaimer'],
      queryFn: () => renderDisclaimerAction.execute(onStale),
      retry: false,
    });

    const handleDismiss = useCallback(() => navigation.goBack(), [navigation]);

    return (
      <View style={styles.container}>
        <View style={styles.background} />
        <View style={styles.contentContainer}>
          <UseQueryResultView
            query={query}
            renderData={useCallback(
              (html: string) => (
                <DisclaimerView onDismiss={handleDismiss} html={html} />
              ),
              [handleDismiss]
            )}
            renderError={useCallback(
              () => (
                <Text>Uh oh! Something went wrong!</Text>
              ),
              []
            )}
            renderLoading={useCallback(
              () => (
                <LoadingSpinnerView />
              ),
              []
            )}
          />
        </View>
      </View>
    );
  };
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
    backgroundColor: theme.colors.background,
    padding: theme.spaces.lg,
    minHeight: 280,
    maxHeight: 560,
    borderRadius: 28,
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
