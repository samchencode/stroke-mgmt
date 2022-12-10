import type { ArticleId } from '@/domain/models/Article';
import type { ArticleRepository } from '@/domain/ports/ArticleRepository';

class GetArticleByIdAction {
  repo: ArticleRepository;

  constructor(articleRepository: ArticleRepository) {
    this.repo = articleRepository;
  }

  async execute(id: ArticleId) {
    return this.repo.getArticleById(id);
  }
}

export { GetArticleByIdAction };
