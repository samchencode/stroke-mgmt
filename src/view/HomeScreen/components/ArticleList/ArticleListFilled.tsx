import type { Article, ArticleId } from '@/domain/models/Article';
import { ArticleRow } from '@/view/HomeScreen/components/ArticleList/ArticleRow';
import React from 'react';
import sanitizeHtml from 'sanitize-html';

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
          subtitle={a.getSummary((h) => sanitizeHtml(h, { allowedTags: [] }))}
          id={a.getId()}
          imageUri={a.getThumbnail().getUri()}
          onSelectArticle={onSelectArticle}
        />
      ))}
    </>
  );
}

export { ArticleListFilled };
