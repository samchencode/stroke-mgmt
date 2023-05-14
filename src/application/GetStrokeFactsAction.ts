import type { Article } from '@/domain/models/Article';
import { Designation } from '@/domain/models/Article';
import type { ArticleCache } from '@/domain/services/Cache';

class GetStrokeFactsAction {
  constructor(private readonly articleCache: ArticleCache) {}

  async execute(onStale: (articles: Article) => void) {
    const results = await this.articleCache.getByDesignation(
      Designation.STROKE_FACTS,
      ([a]) => onStale(a)
    );
    if (results.length < 1)
      throw new Error("Uh oh, the stroke facts article couldn't be found");
    return results[0];
  }
}

export { GetStrokeFactsAction };
