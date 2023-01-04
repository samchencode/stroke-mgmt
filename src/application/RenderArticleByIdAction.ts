import type { ArticleId } from '@/domain/models/Article';
import type { GetArticleByIdAction } from '@/application/GetArticleByIdAction';
import type { ArticleRenderer } from '@/domain/models/Article/ports/ArticleRenderer';

class RenderArticleByIdAction {
  constructor(
    private getArticleByIdAction: GetArticleByIdAction,
    private articleRenderer: ArticleRenderer
  ) {}

  async execute(id: ArticleId) {
    const article = await this.getArticleByIdAction.execute(id);
    return this.articleRenderer.renderArticle(article);
  }
}

export { RenderArticleByIdAction };
