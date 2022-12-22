import { Article, ArticleId, Designation } from '@/domain/models/Article';
import { NodeFileSystem } from '@/infrastructure/file-system/node/NodeFileSystem';
import { EjsArticleRenderer } from '@/infrastructure/rendering/ejs/EjsArticleRenderer';

describe('EjsArticleRenderer', () => {
  let fs: NodeFileSystem;

  beforeAll(() => {
    jest.resetModules();
    jest.doMock(
      '@/infrastructure/rendering/ejs/EjsArticleRenderer/article.ejs',
      () => '@/infrastructure/rendering/ejs/EjsArticleRenderer/article.ejs'
    );
    jest.doMock(
      '@/infrastructure/rendering/ejs/EjsArticleRenderer/disclaimer.ejs',
      () => '@/infrastructure/rendering/ejs/EjsArticleRenderer/disclaimer.ejs'
    );

    fs = new NodeFileSystem();
  });

  describe('Instantiation', () => {
    it('should be created given file system with template', () => {
      const create = () => new EjsArticleRenderer(fs);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    it('should render article title and html', async () => {
      const article = new Article({
        id: new ArticleId('0'),
        title: 'hello world',
        html: '<h1>foo bar</h1>',
        designation: Designation.ARTICLE,
      });

      const renderer = new EjsArticleRenderer(fs);
      const html = await renderer.renderArticle(article);
      expect(html).toMatchSnapshot();
    });

    it('should render disclaimer html', async () => {
      const article = new Article({
        id: new ArticleId('1'),
        title: 'hello world',
        html: '<h1>foo bar</h1>',
        designation: Designation.DISCLAIMER,
      });

      const renderer = new EjsArticleRenderer(fs);
      const html = await renderer.renderDisclaimer(article);
      expect(html).toMatchSnapshot();
    });
  });
});
