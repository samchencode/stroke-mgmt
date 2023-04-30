import React, { useCallback } from 'react';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { StyleSheet, ScrollView } from 'react-native';
import type { AppNavigationProps } from '@/view/Router';
import type { GetAllArticlesAction } from '@/application/GetAllArticlesAction';
import type { ArticleId } from '@/domain/models/Article';
import type { AlgorithmId } from '@/domain/models/Algorithm';
import { ArticleList, AlgorithmList } from '@/view/HomeScreen/components';
import type { GetAllAlgorithmsAction } from '@/application/GetAllAlgorithmsAction';
import { theme } from '@/view/theme';
import { useHasSeenDisclaimer } from '@/view/HomeScreen/useHasSeenDisclaimer';
import { useHeaderScrollResponder } from '@/view/Router/HeaderScrollContext';
import { useBottomNavigationBarHeight } from '@/view/lib/getBottomNavigationBarHeight';
import { useSetAndroidBottomNavigationBarColor } from '@/view/lib/useSetAndroidBottomNavigationBarColor';

function factory(
  getAllArticlesAction: GetAllArticlesAction,
  getAllAlgorithmsAction: GetAllAlgorithmsAction
) {
  return function HomeScreen({ navigation }: AppNavigationProps<'HomeScreen'>) {
    const openDisclaimer = useCallback(() => {
      navigation.navigate('DisclaimerModal');
    }, [navigation]);

    useHasSeenDisclaimer(openDisclaimer);

    const handleSelectArticle = useCallback(
      (id: ArticleId) => {
        navigation.navigate('ArticleViewerScreen', { id });
      },
      [navigation]
    );

    const handleSelectAlgorithm = useCallback(
      (id: AlgorithmId) => {
        navigation.navigate('AlgorithmViewerScreen', { id });
      },
      [navigation]
    );

    type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;

    const handleScroll = useHeaderScrollResponder<ScrollEvent>(
      useCallback((e: ScrollEvent) => e.nativeEvent.contentOffset.y, [])
    );

    const bottomNavigationBarHeight = useBottomNavigationBarHeight();

    useSetAndroidBottomNavigationBarColor(theme.colors.surface, 'dark');

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: bottomNavigationBarHeight }}
        onScroll={handleScroll}
        scrollEventThrottle={300}
      >
        <AlgorithmList
          getAllAlgorithms={useCallback(
            () => getAllAlgorithmsAction.execute(),
            []
          )}
          onSelectAlgorithm={handleSelectAlgorithm}
        />
        <ArticleList
          getAllArticles={useCallback(() => getAllArticlesAction.execute(), [])}
          onSelectArticle={handleSelectArticle}
          style={styles.articleList}
        />
      </ScrollView>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: theme.spaces.md,
    paddingLeft: theme.spaces.md,
    paddingRight: theme.spaces.md,
  },
  articleList: {
    marginTop: theme.spaces.md,
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
