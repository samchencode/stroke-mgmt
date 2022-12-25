import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import type { AppNavigationProps } from '@/view/Router';
import type { GetAllArticlesAction } from '@/application/GetAllArticlesAction';
import type { Article, ArticleId } from '@/domain/models/Article';
import type { Algorithm, AlgorithmId } from '@/domain/models/Algorithm';
import { ArticleList, AlgorithmList } from '@/view/HomeScreen/components';
import type { GetAllAlgorithmsAction } from '@/application/GetAllAlgorithmsAction';
import { theme } from '@/view/theme';
import { StatusBar } from '@/view/StatusBar';

function factory(
  getAllArticlesAction: GetAllArticlesAction,
  getAllAlgorithmsAction: GetAllAlgorithmsAction
) {
  return function HomeScreen({ navigation }: AppNavigationProps<'HomeScreen'>) {
    useEffect(() => {
      navigation.navigate('DisclaimerModal');
    }, [navigation]);

    const [articles, setArticles] = useState<Article[]>([]);
    const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
    useEffect(() => {
      getAllArticlesAction.execute().then((a) => setArticles(a));
      getAllAlgorithmsAction.execute().then((a) => setAlgorithms(a));
    }, []);

    const handleSelectArticle = useCallback(
      (id: ArticleId) => {
        navigation.navigate('ArticleViewerScreen', { id });
      },
      [navigation]
    );

    const handleSelectAlgorithm = useCallback((id: AlgorithmId) => {
      alert(`Pressed algorithm with id of ${id.toString()}`);
    }, []);

    return (
      <ScrollView style={styles.container}>
        <StatusBar translucent textColor="auto" />
        <AlgorithmList
          data={algorithms}
          onSelectAlgorithm={handleSelectAlgorithm}
        />
        <ArticleList
          data={articles.slice(10, 20)}
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
    marginTop: theme.spaces.lg,
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
