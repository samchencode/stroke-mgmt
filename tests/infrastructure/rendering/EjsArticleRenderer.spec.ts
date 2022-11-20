import { Article, ArticleId, Designation } from '@/domain/models/Article';
import { FakeFileSystem } from '@/infrastructure/file-system/fake/FakeFileSystem';
import { EjsArticleRenderer } from '@/infrastructure/rendering/ejs/EjsArticleRenderer';

describe('EjsArticleRenderer', () => {
  describe('Instantiation', () => {
    beforeAll(() => {
      jest.resetModules();
      jest.doMock(
        '@/infrastructure/rendering/ejs/templates/article.ejs',
        () => 0
      );
    });

    it('should be created given file system with template', () => {
      const ffs = new FakeFileSystem({
        0: '<html><head><title><%= title %></title></head><body><%= body %></body></html>',
      });
      const create = () => new EjsArticleRenderer(ffs);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    let ffs: FakeFileSystem;

    beforeAll(() => {
      jest.resetModules();
      jest.doMock(
        '@/infrastructure/rendering/ejs/templates/article.ejs',
        () => 0
      );
    });

    beforeEach(() => {
      ffs = new FakeFileSystem({
        0: '<html><head><title><%= title %></title></head><body><%- body %></body></html>',
      });
    });

    it('should render article title and html', async () => {
      const article = new Article({
        id: new ArticleId('0'),
        title: 'hello world',
        html: '<h1>foo bar</h1>',
        designation: Designation.ARTICLE,
      });

      const renderer = new EjsArticleRenderer(ffs);
      const html = await renderer.renderArticle(article);
      const expected =
        '<html><head><title>hello world</title></head><body><h1>foo bar</h1></body></html>';
      expect(html).toBe(expected);
    });
  });
});
