import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import type { AppNavigationProps } from '@/view/Router';
import type { GetAllArticlesAction } from '@/application/GetAllArticlesAction';
import type { Article, ArticleId } from '@/domain/models/Article';
import { ArticleList } from '@/view/HomeScreen/components';

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
});

export { factory };
export type Type = ReturnType<typeof factory>;
