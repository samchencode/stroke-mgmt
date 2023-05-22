import type { GetStrokeSignsAction } from '@/application/GetStrokeSignsAction';
import type { Article } from '@/domain/models/Article';
import type { ArticleRenderer } from '@/domain/models/Article/ports/ArticleRenderer';

class RenderStrokeSignsAction {
  constructor(
    private readonly getStrokeSignsAction: GetStrokeSignsAction,
    private readonly articleRenderer: ArticleRenderer
  ) {}

  async execute(onStale: (html: string) => void) {
    const handleStale = (article: Article) => {
      this.articleRenderer.renderArticle(article).then(onStale);
    };
    const article = await this.getStrokeSignsAction.execute(handleStale);
    return this.articleRenderer.renderStrokeSigns(article);
  }
}

export { RenderStrokeSignsAction };
