import { Designation } from '@/domain/models/Article';
import type { ArticleRepository } from '@/domain/models/Article/ports/ArticleRepository';

class GetStrokeSignsAction {
  private repo: ArticleRepository;

  constructor(articleRepository: ArticleRepository) {
    this.repo = articleRepository;
  }

  async execute() {
    const [strokeSigns] = await this.repo.getByDesignation(
      Designation.STROKE_SIGNS
    );
    return strokeSigns;
  }
}

export { GetStrokeSignsAction };
