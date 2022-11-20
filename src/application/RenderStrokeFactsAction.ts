import type { GetStrokeFactsAction } from '@/application/GetStrokeFactsAction';
import type { ArticleRenderer } from '@/domain/ports/ArticleRenderer';

class RenderStrokeFactsAction {
  getStrokeFacts: GetStrokeFactsAction;

  renderer: ArticleRenderer;

  constructor(
    getStrokeFactsAction: GetStrokeFactsAction,
    articleRenderer: ArticleRenderer
  ) {
    this.getStrokeFacts = getStrokeFactsAction;
    this.renderer = articleRenderer;
  }

  async execute() {
    const article = await this.getStrokeFacts.execute();
    return this.renderer.renderStrokeFacts(article);
  }
}

export { RenderStrokeFactsAction };
