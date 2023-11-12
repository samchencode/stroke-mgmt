import type { Article } from '@/domain/models/Article';
import { Designation } from '@/domain/models/Article';
import type { ArticleCache } from '@/domain/services/Cache';

class GetAboutUsAction {
  constructor(private readonly articleCache: ArticleCache) {}

  static $inject = ['articleCache'];

  async execute(onStale: (articles: Article) => void) {
    const results = await this.articleCache.getByDesignation(
      Designation.ABOUT,
      ([a]) => onStale(a)
    );
    if (results.length < 1) {
      throw new Error("Uh oh, the about us article couldn't be found");
    }
    return results[0];
  }
}

export { GetAboutUsAction };
