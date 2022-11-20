import ejs from 'ejs';
import type { Article } from '@/domain/models/Article';
import type { ArticleRenderer } from '@/domain/ports/ArticleRenderer';
import type { FileSystem } from '@/application/ports/FileSystem';

class EjsArticleRenderer implements ArticleRenderer {
  ready: Promise<void>;

  fs: FileSystem;

  template: ejs.TemplateFunction | null = null;

  constructor(fileSystem: FileSystem) {
    this.fs = fileSystem;
    this.ready = new Promise((s) => {
      this.init().then(s);
    });
  }

  private async init(): Promise<void> {
    const templateStr = await this.fs.getAssetAsString(
      // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
      require('@/infrastructure/rendering/ejs/templates/article.ejs')
    );
    this.template = ejs.compile(templateStr);
  }

  async renderArticle(article: Article): Promise<string> {
    await this.ready;
    if (!this.template) throw new Error('EJS template not found');
    return this.template({
      title: article.getTitle(),
      body: article.getHtml(),
    });
  }

  async renderDisclaimer(article: Article): Promise<string> {
    return this.renderArticle(article);
  }

  async renderStrokeFacts(article: Article): Promise<string> {
    return this.renderArticle(article);
  }

  async renderStrokeSigns(article: Article): Promise<string> {
    return this.renderArticle(article);
  }
}

export { EjsArticleRenderer };
