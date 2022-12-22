import ejs from 'ejs';
import type { Article } from '@/domain/models/Article';
import type { ArticleRenderer } from '@/domain/models/Article/ports/ArticleRenderer';
import type { FileSystem } from '@/infrastructure/file-system/FileSystem';

class EjsArticleRenderer implements ArticleRenderer {
  ready: Promise<void>;

  fs: FileSystem;

  articleTemplate: ejs.TemplateFunction | null = null;

  disclaimerTemplate: ejs.TemplateFunction | null = null;

  constructor(fileSystem: FileSystem) {
    this.fs = fileSystem;
    this.ready = new Promise((s) => {
      this.init().then(s);
    });
  }

  private async init(): Promise<void> {
    const articleTemplate = await this.fs.getAssetAsString(
      require('@/infrastructure/rendering/ejs/templates/article.ejs')
    );
    this.articleTemplate = ejs.compile(articleTemplate);
    const disclaimerTemplate = await this.fs.getAssetAsString(
      require('@/infrastructure/rendering/ejs/templates/disclaimer.ejs')
    );
    this.disclaimerTemplate = ejs.compile(disclaimerTemplate);
  }

  async renderArticle(article: Article): Promise<string> {
    await this.ready;
    if (!this.articleTemplate) throw new Error('Article template not found');
    return this.articleTemplate({
      title: article.getTitle(),
      body: article.getHtml(),
    });
  }

  async renderDisclaimer(article: Article): Promise<string> {
    await this.ready;
    if (!this.disclaimerTemplate)
      throw new Error('Disclaimer template not found');
    return this.disclaimerTemplate({
      title: article.getTitle(),
      body: article.getHtml(),
    });
  }

  async renderStrokeFacts(article: Article): Promise<string> {
    return this.renderArticle(article);
  }

  async renderStrokeSigns(article: Article): Promise<string> {
    return this.renderArticle(article);
  }
}

export { EjsArticleRenderer };
