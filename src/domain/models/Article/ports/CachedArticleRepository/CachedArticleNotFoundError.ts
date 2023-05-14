import type { ArticleId } from '@/domain/models/Article/ArticleId';

class CachedArticleNotFoundError extends Error {
  name = 'CachedArticleNotFoundError';

  constructor(id: ArticleId) {
    super();
    this.message = `Article with id of ${id} could not be found in the cache`;
  }
}

export { CachedArticleNotFoundError };
