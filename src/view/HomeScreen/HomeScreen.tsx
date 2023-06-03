import React, { useCallback } from 'react';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import {
  useWindowDimensions,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import type { AppNavigationProps } from '@/view/Router';
import type { GetAllArticlesAction } from '@/application/GetAllArticlesAction';
import type { Article, ArticleId } from '@/domain/models/Article';
import type { Algorithm, AlgorithmId } from '@/domain/models/Algorithm';
import type { GetAllAlgorithmsShownOnHomeScreenAction } from '@/application/GetAllAlgorithmsShownOnHomeScreenAction';
import type { GetAllTagsAction } from '@/application/GetAllTagsAction';
import { theme } from '@/view/theme';
import { ArticleList, AlgorithmList } from '@/view/HomeScreen/components';
import { useHasSeenDisclaimer } from '@/view/lib/useHasSeenDisclaimer';
import { useHeaderScrollResponder } from '@/view/Router/HeaderScrollContext';
import { useBottomNavigationBarHeight } from '@/view/lib/getBottomNavigationBarHeight';
import { useSetAndroidBottomNavigationBarColor } from '@/view/lib/useSetAndroidBottomNavigationBarColor';

function factory(
  getAllArticlesAction: GetAllArticlesAction,
  getAllAlgorithmsShownOnHomeScreenAction: GetAllAlgorithmsShownOnHomeScreenAction,
  getAllTagsAction: GetAllTagsAction
) {
  return function HomeScreen({ navigation }: AppNavigationProps<'HomeScreen'>) {
    const { width } = useWindowDimensions();
    const innerWidth =
      Math.min(width, theme.breakpoints.width.tablet) - 2 * theme.spaces.md;

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
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: bottomNavigationBarHeight }}
          onScroll={handleScroll}
          scrollEventThrottle={300}
        >
          <AlgorithmList
            getAllAlgorithms={useCallback(
              (cb: (as: Algorithm[]) => void) =>
                getAllAlgorithmsShownOnHomeScreenAction.execute(cb),
              []
            )}
            onSelectAlgorithm={handleSelectAlgorithm}
          />
          <ArticleList
            getAllArticles={useCallback(
              (cb: (as: Article[]) => void) => getAllArticlesAction.execute(cb),
              []
            )}
            getAllTags={useCallback((cb) => getAllTagsAction.execute(cb), [])}
            onSelectArticle={handleSelectArticle}
            style={styles.articleList}
            listWidth={innerWidth}
          />
        </ScrollView>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
  },
  scrollView: {
    flex: 1,
    maxWidth: theme.breakpoints.width.tablet,
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
