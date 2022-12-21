import type { ArticleRepository } from '@/domain/models/Article/ports/ArticleRepository';

class GetAllArticlesAction {
  repo: ArticleRepository;

  constructor(articleRepository: ArticleRepository) {
    this.repo = articleRepository;
  }

  async execute() {
    return this.repo.getAllArticles();
  }
}

export { GetAllArticlesAction };
