import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { AppNavigationProps } from '@/view/Router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { IconButton, LoadingSpinnerView } from '@/view/components';
import { theme } from '@/view/theme';
import { useSetAndroidBottomNavigationBarColor } from '@/view/lib/useSetAndroidBottomNavigationBarColor';
import { ScreenErrorView } from '@/view/error-handling';
import type { GetIntroSequenceAction } from '@/application/GetIntroSequenceAction';
import type { IntroSequence } from '@/domain/models/IntroSequence';
import type { RenderArticleByIdAction } from '@/application/RenderArticleByIdAction';
import { IntroArticleView } from '@/view/IntroSequenceScreen/IntroArticleView';
import { IntroSequenceBottomBar } from '@/view/IntroSequenceScreen/IntroSequenceBottomBar';
import { useShouldShow } from '@/view/IntroSequenceScreen/useShouldShow';
import { useNavigationState } from '@react-navigation/native';

function factory(
  getIntroSequenceAction: GetIntroSequenceAction,
  renderArticleByIdAction: RenderArticleByIdAction
) {
  return function IntroSequenceScreen({
    navigation,
  }: AppNavigationProps<'IntroSequenceScreen'>) {
    useSetAndroidBottomNavigationBarColor(
      theme.colors.secondaryContainer,
      'dark'
    );

    const [sequenceCursor, setSequenceCursor] = useState(0);
    const queryClient = useQueryClient();
    const onIntroStale = (seq: IntroSequence) => {
      queryClient.setQueryData(['intro-sequence'], seq);
      setSequenceCursor(0);
    };
    const query = useQuery({
      queryKey: ['intro-sequence'],
      queryFn: () => getIntroSequenceAction.execute(onIntroStale),
    });
    const isLastArticle =
      !query.isLoading &&
      !!query.data &&
      sequenceCursor + 1 === query.data.getArticleIds().length;

    const [checkboxValue, setCheckboxValue, saveShouldShow] = useShouldShow();

    // initial start = no, hasBack is true once nav to modal...
    const { index, routes } = useNavigationState((state) => state);
    const prevRouteName: string | undefined = routes?.[index - 1]?.name;
    const shouldShowBack =
      prevRouteName === 'HomeScreen' || sequenceCursor !== 0;

    const handlePressBack = useCallback(() => {
      if (sequenceCursor > 0) {
        setSequenceCursor(sequenceCursor - 1);
        return;
      }
      if (prevRouteName === 'HomeScreen') {
        // if cursor is at first article and came from home screen
        navigation.goBack();
      }
    }, [navigation, prevRouteName, sequenceCursor]);

    const [seenEvalPtModal, setSeenEvalPtModal] = useState(false);

    const handlePressButton = useCallback(() => {
      if (query.isError) {
        navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
        return;
      }
      if (query.isLoading || !query.data) return;
      const suggestAfterId = query.data.getSuggestAlgorithmAfterArticleId();
      const currentId = query.data.getArticleIds()[sequenceCursor];
      const suggestedAlgorithmId = query.data.getSuggestedAlgorithmId();
      if (suggestAfterId.is(currentId) && !seenEvalPtModal) {
        setSeenEvalPtModal(true);
        navigation.navigate('EvaluatingPatientModal', { suggestedAlgorithmId });
        return;
      }
      const { length } = query.data.getArticleIds();
      if (sequenceCursor !== length - 1) {
        // not done with sequence
        setSequenceCursor(sequenceCursor + 1);
      } else {
        // done with sequence
        saveShouldShow();
        navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
      }
    }, [
      navigation,
      query.data,
      query.isError,
      query.isLoading,
      saveShouldShow,
      seenEvalPtModal,
      sequenceCursor,
    ]);

    const renderData = useCallback(
      (seq: IntroSequence) => (
        <IntroArticleView
          id={seq.getArticleIds()[sequenceCursor]}
          renderArticleByIdAction={renderArticleByIdAction}
        />
      ),
      [sequenceCursor]
    );

    const renderError = useCallback(
      (error: unknown) => (
        <ScreenErrorView
          error={error}
          message="We had trouble retrieving the list of introductory articles. If there is internet, then refreshing or clearing the cache may help. Restarting the app might also help."
        />
      ),
      []
    );

    const renderLoading = useCallback(() => <LoadingSpinnerView />, []);

    return (
      <View style={styles.container}>
        <UseQueryResultView
          query={query}
          renderData={renderData}
          renderError={renderError}
          renderLoading={renderLoading}
        />
        <IntroSequenceBottomBar
          onPressButton={handlePressButton}
          onChangeCheckbox={setCheckboxValue}
          checkboxValue={checkboxValue}
          checkboxVisible={isLastArticle}
          buttonTitle={query.isError ? 'Go Home' : 'Proceed'}
        />
        {shouldShowBack && (
          <IconButton
            iconName="arrow-left"
            onPress={handlePressBack}
            style={styles.backButton}
          />
        )}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: theme.spaces.sm,
    left: theme.spaces.xs,
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
