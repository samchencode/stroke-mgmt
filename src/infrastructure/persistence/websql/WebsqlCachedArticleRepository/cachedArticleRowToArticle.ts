import { Article, ArticleId, Designation } from '@/domain/models/Article';
import { Citation } from '@/domain/models/Citation';
import { Image } from '@/domain/models/Image';
import { Tag } from '@/domain/models/Tag';
import type {
  CachedArticleRow,
  CitationsJson,
  TagsJson,
} from '@/infrastructure/persistence/websql/WebsqlCachedArticleRepository/tableSchema';

function cachedArticleRowToArticle(row: CachedArticleRow): Article {
  return new Article({
    id: new ArticleId(row.id),
    title: row.title,
    html: row.html,
    summary: row.summary ?? undefined,
    designation: Designation.fromString(row.designation),
    thumbnail: new Image(row.thumbnailUri),
    tags: (JSON.parse(row.tagsJson) as TagsJson).map(
      (t) => new Tag(t.name, new Date(t.lastUpdatedIsoString), t.description)
    ),
    shouldShowOnHomeScreen: row.shouldShowOnHomeScreen === 1,
    lastUpdated: new Date(row.lastUpdatedTimestamp),
    citations: (JSON.parse(row.citationsJson) as CitationsJson).map(
      (c) => new Citation(c.value)
    ),
  });
}

export { cachedArticleRowToArticle };
