import type { GetStrokeSignsAction } from '@/application/GetStrokeSignsAction';
import type { ArticleRenderer } from '@/domain/ports/ArticleRenderer';

class RenderStrokeSignsAction {
  getStrokeSigns: GetStrokeSignsAction;

  renderer: ArticleRenderer;

  constructor(
    getStrokeSignsAction: GetStrokeSignsAction,
    articleRenderer: ArticleRenderer
  ) {
    this.getStrokeSigns = getStrokeSignsAction;
    this.renderer = articleRenderer;
  }

  async execute() {
    const article = await this.getStrokeSigns.execute();
    return this.renderer.renderStrokeSigns(article);
  }
}

export { RenderStrokeSignsAction };
