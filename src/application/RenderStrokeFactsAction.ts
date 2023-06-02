import type { GetStrokeFactsAction } from '@/application/GetStrokeFactsAction';
import type { Article } from '@/domain/models/Article';
import type { ArticleRenderer } from '@/domain/models/Article/ports/ArticleRenderer';

class RenderStrokeFactsAction {
  constructor(
    private readonly getStrokeFactsAction: GetStrokeFactsAction,
    private readonly articleRenderer: ArticleRenderer
  ) {}

  async execute(onStale: (html: string) => void) {
    const handleStale = (article: Article) => {
      this.articleRenderer.renderArticle(article).then(onStale);
    };
    const article = await this.getStrokeFactsAction.execute(handleStale);
    return this.articleRenderer.renderArticle(article);
  }
}

export { RenderStrokeFactsAction };
