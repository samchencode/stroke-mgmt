import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import type { AppNavigationProps } from '@/view/Router';
import type { GetAllArticlesAction } from '@/application/GetAllArticlesAction';
import type { Article, ArticleId } from '@/domain/models/Article';
import { ArticleList, AlgorithmList } from '@/view/HomeScreen/components';
import { theme } from '@/view/theme';

function factory(getAllArticlesAction: GetAllArticlesAction) {
  return function HomeScreen({ navigation }: AppNavigationProps<'HomeScreen'>) {
    useEffect(() => {
      navigation.navigate('DisclaimerModal');
    }, [navigation]);

    const [articles, setArticles] = useState<Article[]>([]);
    useEffect(() => {
      getAllArticlesAction.execute().then((a) => setArticles(a));
    }, []);

    const handleSelectArticle = useCallback(
      (id: ArticleId) => {
        navigation.navigate('ArticleViewerScreen', { id });
      },
      [navigation]
    );

    return (
      <ScrollView style={styles.container}>
        <AlgorithmList />
        <ArticleList
          data={articles.slice(10, 20)}
          onSelectArticle={handleSelectArticle}
        />
      </ScrollView>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carousel: {
    height: 150,
  },
  image: { width: 100, height: 100 },
  title: {
    marginLeft: theme.spaces.lg,
    lineHeight: 60,
    fontSize: 42,
    fontWeight: 'bold',
  },
  algotext: {
    fontSize: 10,
  },
  square: {
    marginRight: theme.spaces.md,
    backgroundColor: 'gold',
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
