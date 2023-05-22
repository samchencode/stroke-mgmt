import type { ArticleId } from '@/domain/models/Article/ArticleId';

class ArticleNotFoundError extends Error {
  name = 'ArticleNotFoundError';

  constructor(id: ArticleId) {
    super();
    this.message = `Article with id of ${id} could not be found`;
  }
}

export { ArticleNotFoundError };
