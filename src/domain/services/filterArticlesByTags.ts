import type { Article } from '@/domain/models/Article';
import type { Tag } from '@/domain/models/Tag';

function filterArticlesByTag(articles: Article[], tag: Tag) {
  return articles.filter((a) => a.hasTag(tag));
}

function filterArticlesByTags(articles: Article[], tags: Tag[]) {
  return tags.reduce((ag, v) => filterArticlesByTag(ag, v), articles);
}

export { filterArticlesByTags };
