import type { GetDisclaimerAction } from '@/application/GetDisclaimerAction';
import type { Article } from '@/domain/models/Article';
import type { ArticleRenderer } from '@/domain/models/Article/ports/ArticleRenderer';

class RenderDisclaimerAction {
  constructor(
    private readonly getDisclaimerAction: GetDisclaimerAction,
    private readonly articleRenderer: ArticleRenderer
  ) {}

  static $inject = ['getDisclaimerAction', 'articleRenderer'];

  async execute(onStale: (html: string) => void) {
    const handleStale = (article: Article) => {
      this.articleRenderer.renderDisclaimer(article).then(onStale);
    };
    const article = await this.getDisclaimerAction.execute(handleStale);
    return this.articleRenderer.renderDisclaimer(article);
  }
}

export { RenderDisclaimerAction };
