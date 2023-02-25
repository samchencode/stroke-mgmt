import type { ArticleId } from '@/domain/models/Article';
import type { ArticleRepository } from '@/domain/models/Article/ports/ArticleRepository';

class GetArticleByIdAction {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(id: ArticleId) {
    return this.articleRepository.getById(id);
  }
}

export { GetArticleByIdAction };
