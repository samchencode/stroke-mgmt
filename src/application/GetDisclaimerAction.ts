import { Designation } from '@/domain/models/Article';
import type { ArticleRepository } from '@/domain/ports/ArticleRepository';

class GetDisclaimerAction {
  private repo: ArticleRepository;

  constructor(articleRepository: ArticleRepository) {
    this.repo = articleRepository;
  }

  async execute() {
    const [disclaimer] = await this.repo.getArticlesByDesignation(
      Designation.DISCLAIMER
    );
    return disclaimer;
  }
}

export { GetDisclaimerAction };
