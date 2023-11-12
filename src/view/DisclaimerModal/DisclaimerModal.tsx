import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import type { RenderDisclaimerAction } from '@/application/RenderDisclaimerAction';
import type { RootNavigationProps } from '@/view/Router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DisclaimerView } from '@/view/DisclaimerModal/DisclaimerView';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { LoadingSpinnerView, TextButton } from '@/view/components';
import { theme } from '@/view/theme';
import { setSeenDisclaimer } from '@/view/lib/useHasSeenDisclaimer';
import { DisclaimerErrorView } from '@/view/DisclaimerModal/DisclaimerErrorView';

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

    const handleDismiss = useCallback(() => {
      setSeenDisclaimer();
      navigation.goBack();
    }, [navigation]);

    const onPressExternalLink = useCallback(
      (url: string) => {
        navigation.navigate('ExternalLinkModal', { url });
      },
      [navigation]
    );

    return (
      <View style={styles.container}>
        <View style={styles.background} />
        <View
          style={[
            styles.contentContainer,
            query.isError && styles.contentContainerWithError,
          ]}
        >
          <UseQueryResultView
            query={query}
            renderData={useCallback(
              (html: string) => (
                <>
                  <DisclaimerView
                    html={html}
                    onPressExternalLink={onPressExternalLink}
                  />
                  <TextButton
                    title="Got it"
                    onPress={handleDismiss}
                    style={styles.btnDismiss}
                  />
                </>
              ),
              [handleDismiss, onPressExternalLink]
            )}
            renderError={useCallback(
              (error) => (
                <DisclaimerErrorView error={error} />
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
    justifyContent: 'space-between',
    minHeight: 280,
    maxHeight: 560,
    minWidth: 280,
    maxWidth: 560,
    borderRadius: 28,
  },
  contentContainerWithError: {
    marginHorizontal: theme.spaces.md,
    padding: 0,
  },
  btnDismiss: {
    marginTop: theme.spaces.lg,
    alignSelf: 'flex-end',
  },
});

factory.$inject = ['renderDisclaimerAction'];

export { factory };
export type Type = ReturnType<typeof factory>;
