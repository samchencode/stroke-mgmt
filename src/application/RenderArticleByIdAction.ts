import type { Article, ArticleId } from '@/domain/models/Article';
import type { GetArticleByIdAction } from '@/application/GetArticleByIdAction';
import type { ArticleRenderer } from '@/domain/models/Article/ports/ArticleRenderer';

class RenderArticleByIdAction {
  constructor(
    private getArticleByIdAction: GetArticleByIdAction,
    private articleRenderer: ArticleRenderer
  ) {}

  static $inject = ['getArticleByIdAction', 'articleRenderer'];

  async execute(id: ArticleId, onStale: (html: string) => void) {
    const handleStale = (article: Article) => {
      this.articleRenderer.renderArticle(article).then(onStale);
    };
    const article = await this.getArticleByIdAction.execute(id, handleStale);
    return this.articleRenderer.renderArticle(article);
  }
}

export { RenderArticleByIdAction };
