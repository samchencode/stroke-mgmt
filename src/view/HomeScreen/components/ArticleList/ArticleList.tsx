import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { Article, ArticleId } from '@/domain/models/Article';
import { theme } from '@/view/theme';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { ArticleListFilled } from '@/view/HomeScreen/components/ArticleList/ArticleListFilled';
import { ArticleListError } from '@/view/HomeScreen/components/ArticleList/ArticleListError';
import { ArticleListLoading } from '@/view/HomeScreen/components/ArticleList/ArticleListLoading';
import { useQuery } from '@tanstack/react-query';

type ArticleListProps = {
  getAllArticles: () => Promise<Article[]>;
  onSelectArticle: (id: ArticleId) => void;
  style?: StyleProp<ViewStyle>;
};

function ArticleList({
  getAllArticles,
  onSelectArticle,
  style = {},
}: ArticleListProps) {
  const query = useQuery({
    queryKey: ['articles'],
    queryFn: getAllArticles,
  });

  return (
    <View style={style}>
      <Text style={styles.title}>Articles</Text>
      <UseQueryResultView
        query={query}
        renderData={useCallback(
          (data: Article[]) => (
            <ArticleListFilled data={data} onSelectArticle={onSelectArticle} />
          ),
          [onSelectArticle]
        )}
        renderError={useCallback(
          () => (
            <ArticleListError />
          ),
          []
        )}
        renderLoading={useCallback(
          () => (
            <ArticleListLoading />
          ),
          []
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...theme.fonts.titleLarge,
  },
});

export { ArticleList };
