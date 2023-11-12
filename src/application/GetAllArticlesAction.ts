import type { Article } from '@/domain/models/Article';
import { Designation } from '@/domain/models/Article';
import type { ArticleCache } from '@/domain/services/Cache';

class GetAllArticlesAction {
  constructor(private readonly articleCache: ArticleCache) {}

  static $inject = ['articleCache'];

  async execute(onStale: (articles: Article[]) => void) {
    return this.articleCache.getByDesignation(Designation.ARTICLE, onStale);
  }
}

export { GetAllArticlesAction };
