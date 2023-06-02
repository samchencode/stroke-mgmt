import type { GetAboutUsAction } from '@/application/GetAboutUsAction';
import type { Article } from '@/domain/models/Article';
import type { ArticleRenderer } from '@/domain/models/Article/ports/ArticleRenderer';

class RenderAboutUsAction {
  constructor(
    private readonly getAboutUsAction: GetAboutUsAction,
    private readonly articleRenderer: ArticleRenderer
  ) {}

  async execute(onStale: (html: string) => void) {
    const handleStale = (article: Article) => {
      this.articleRenderer.renderArticle(article).then(onStale);
    };
    const article = await this.getAboutUsAction.execute(handleStale);
    return this.articleRenderer.renderArticle(article);
  }
}

export { RenderAboutUsAction };
