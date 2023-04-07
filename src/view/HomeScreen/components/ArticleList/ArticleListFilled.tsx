import type { Article, ArticleId } from '@/domain/models/Article';
import { ArticleRow } from '@/view/HomeScreen/components/ArticleList/ArticleRow';
import React from 'react';

type Props = {
  data: Article[];
  onSelectArticle: (id: ArticleId) => void;
};

function ArticleListFilled({ data, onSelectArticle }: Props) {
  return (
    <>
      {data.map((a) => (
        <ArticleRow
          key={a.getId().toString()}
          title={a.getTitle()}
          id={a.getId()}
          onSelectArticle={onSelectArticle}
        />
      ))}
    </>
  );
}

export { ArticleListFilled };
