import type { Article } from '@/domain/models/Article';
import type { ArticleRenderer } from '@/domain/ports/ArticleRenderer';

class RenderArticleAction {
  renderer: ArticleRenderer;

  constructor(articleRenderer: ArticleRenderer) {
    this.renderer = articleRenderer;
  }

  async execute(article: Article) {
    return this.renderer.renderArticle(article);
  }
}

export { RenderArticleAction };
