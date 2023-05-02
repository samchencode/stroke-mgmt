import type { Article } from '@/domain/models/Article/Article';
import type { ArticleId } from '@/domain/models/Article/ArticleId';

class ArticleMetadata {
  constructor(
    private readonly id: ArticleId,
    private readonly lastUpdated: Date
  ) {}

  getId() {
    return this.id;
  }

  getLastUpdated() {
    return this.lastUpdated;
  }

  is(other: ArticleMetadata | Article) {
    return this.id.is(other.getId());
  }
}

export { ArticleMetadata };
