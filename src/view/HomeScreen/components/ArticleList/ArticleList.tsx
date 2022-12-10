import React from 'react';
import type { Article, ArticleId } from '@/domain/models/Article';
import { View } from 'react-native';
import { ArticleRow } from '@/view/HomeScreen/components/ArticleList/ArticleRow';

type ArticleListProps = {
  data: Article[];
  onSelectArticle: (id: ArticleId) => void;
};

function ArticleList({ data, onSelectArticle }: ArticleListProps) {
  return (
    <View>
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

export { ArticleList };
