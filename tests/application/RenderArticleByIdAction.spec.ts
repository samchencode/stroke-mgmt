import { RenderArticleByIdAction } from '@/application/RenderArticleByIdAction';
import { Article, ArticleId, Designation } from '@/domain/models/Article';
import type { ArticleRenderer } from '@/domain/models/Article';
import type { GetArticleByIdAction } from '@/application/GetArticleByIdAction';
import { Image } from '@/domain/models/Image';

const stubRenderer: ArticleRenderer = {
  renderArticle: jest.fn().mockResolvedValue('rendered article'),
  renderDisclaimer: jest.fn().mockResolvedValue('rendered disclaimer'),
  renderStrokeFacts: jest.fn().mockResolvedValue('rendered stroke facts'),
  renderStrokeSigns: jest.fn().mockResolvedValue('rendered stroke signs'),
};

const article = new Article({
  summary: 'My Summary',
  thumbnail: new Image('/img.png'),
  id: new ArticleId('0'),
  title: 'example article',
  html: 'foo bar',
  designation: Designation.ARTICLE,
  shouldShowOnHomeScreen: true,
  lastUpdated: new Date(0),
});

const getArticleByIdAction = {
  execute: jest.fn().mockResolvedValue(article),
} as unknown as GetArticleByIdAction;

describe('RenderArticleAction', () => {
  describe('Instantiation', () => {
    it('should create an action', () => {
      const create = () =>
        new RenderArticleByIdAction(getArticleByIdAction, stubRenderer);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    it('should render an article', async () => {
      const action = new RenderArticleByIdAction(
        getArticleByIdAction,
        stubRenderer
      );
      const renderedHtml = await action.execute(new ArticleId('0'));
      expect(renderedHtml).toBe('rendered article');
    });
  });
});
