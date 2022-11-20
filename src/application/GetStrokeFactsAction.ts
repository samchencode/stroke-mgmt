import { Designation } from '@/domain/models/Article';
import type { ArticleRepository } from '@/domain/ports/ArticleRepository';

class GetStrokeFactsAction {
  private repo: ArticleRepository;

  constructor(articleRepository: ArticleRepository) {
    this.repo = articleRepository;
  }

  async execute() {
    const [strokeFacts] = await this.repo.getArticlesByDesignation(
      Designation.STROKE_FACTS
    );
    return strokeFacts;
  }
}

export { GetStrokeFactsAction };
