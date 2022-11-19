import type { BaseDesignation } from '@/domain/models/Article';
import { ArticleId, Designation, Article } from '@/domain/models/Article';

describe('Article', () => {
  describe('Instantiation', () => {
    it('should create a new article', () => {
      const title = 'my article';
      const html = '<h1>Hello World</h1>';
      const id = new ArticleId('1');
      const designation = Designation.ARTICLE;

      const create = () => new Article({ id, title, html, designation });
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    let title: string;
    let html: string;
    let id: ArticleId;
    let designation: BaseDesignation;

    beforeEach(() => {
      title = 'my article';
      html = '<h1>Hello World</h1>';
      id = new ArticleId('1');
      designation = Designation.ARTICLE;
    });

    it('should get title, body, id, designation', () => {
      const article = new Article({ id, title, html, designation });
      expect(article.getTitle()).toBe(title);
      expect(article.getHtml()).toBe(html);
      expect(article.getId().is(id)).toBe(true);
      expect(article.getDesignation().is(designation)).toBe(true);
    });
  });
});
