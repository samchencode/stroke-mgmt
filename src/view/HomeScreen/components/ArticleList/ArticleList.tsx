import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { Article, ArticleId } from '@/domain/models/Article';
import { ArticleRow } from '@/view/HomeScreen/components/ArticleList/ArticleRow';
import { theme } from '@/view/theme';

type ArticleListProps = {
  data: Article[];
  onSelectArticle: (id: ArticleId) => void;
  style?: StyleProp<ViewStyle>;
};

function ArticleList({ data, onSelectArticle, style = {} }: ArticleListProps) {
  return (
    <View style={style}>
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
    ...theme.fonts.displayMedium,
  },
});

export { ArticleList };
