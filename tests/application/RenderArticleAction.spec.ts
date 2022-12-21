import { RenderArticleAction } from '@/application/RenderArticleAction';
import { Article, ArticleId, Designation } from '@/domain/models/Article';
import type { ArticleRenderer } from '@/domain/models/Article';

const stubRenderer: ArticleRenderer = {
  renderArticle: jest.fn().mockResolvedValue('rendered article'),
  renderDisclaimer: jest.fn().mockResolvedValue('rendered disclaimer'),
  renderStrokeFacts: jest.fn().mockResolvedValue('rendered stroke facts'),
  renderStrokeSigns: jest.fn().mockResolvedValue('rendered stroke signs'),
};

describe('RenderArticleAction', () => {
  describe('Instantiation', () => {
    it('should create an action', () => {
      const create = () => new RenderArticleAction(stubRenderer);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    it('should render an article', async () => {
      const article = new Article({
        id: new ArticleId('0'),
        title: 'example article',
        html: 'foo bar',
        designation: Designation.ARTICLE,
      });
      const action = new RenderArticleAction(stubRenderer);
      const renderedHtml = await action.execute(article);
      expect(renderedHtml).toBe('rendered article');
    });
  });
});
