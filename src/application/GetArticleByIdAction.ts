import type { Article, ArticleId } from '@/domain/models/Article';
import type { ArticleCache } from '@/domain/services/Cache';

class GetArticleByIdAction {
  constructor(private readonly articleCache: ArticleCache) {}

  async execute(id: ArticleId, onStale: (article: Article) => void) {
    return this.articleCache.getById(id, onStale);
  }
}

export { GetArticleByIdAction };
