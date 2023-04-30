import type { Article } from '@/domain/models/Article';
import type { Tag } from '@/domain/models/Tag';
import { filterArticlesByTags } from '@/domain/services/filterArticlesByTags';

function filterArticlesOnHomeOrByTags(articles: Article[], tags: Tag[]) {
  if (tags.length > 0) return filterArticlesByTags(articles, tags);

  const articlesShownOnHomeScreen = articles.filter((a) =>
    a.getshouldShowOnHomeScreen()
  );
  return articlesShownOnHomeScreen;
}

export { filterArticlesOnHomeOrByTags };
