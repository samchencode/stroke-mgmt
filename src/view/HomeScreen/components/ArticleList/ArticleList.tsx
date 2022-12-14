import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Article, ArticleId } from '@/domain/models/Article';
import { ArticleRow } from '@/view/HomeScreen/components/ArticleList/ArticleRow';
import { theme } from '@/view/theme';

type ArticleListProps = {
  data: Article[];
  onSelectArticle: (id: ArticleId) => void;
};

function ArticleList({ data, onSelectArticle }: ArticleListProps) {
  return (
    <View>
      <Text style={styles.title}>Articles</Text>
      {data.map((a) => (
        <ArticleRow
          key={a.getId().toString()}
          title={a.getTitle()}
          id={a.getId()}
          onSelectArticle={onSelectArticle}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginLeft: theme.spaces.lg,
    lineHeight: 60,
    fontSize: 42,
    fontWeight: 'bold',
  },
});

export { ArticleList };
