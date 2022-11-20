import type { GetDisclaimerAction } from '@/application/GetDisclaimerAction';
import type { ArticleRenderer } from '@/domain/ports/ArticleRenderer';

class RenderDisclaimerAction {
  getDisclaimer: GetDisclaimerAction;

  renderer: ArticleRenderer;

  constructor(
    getDisclaimerAction: GetDisclaimerAction,
    articleRenderer: ArticleRenderer
  ) {
    this.getDisclaimer = getDisclaimerAction;
    this.renderer = articleRenderer;
  }

  async execute() {
    const article = await this.getDisclaimer.execute();
    return this.renderer.renderDisclaimer(article);
  }
}

export { RenderDisclaimerAction };
