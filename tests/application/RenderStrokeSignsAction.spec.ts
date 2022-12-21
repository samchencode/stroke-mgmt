import { GetStrokeSignsAction } from '@/application/GetStrokeSignsAction';
import { RenderStrokeSignsAction } from '@/application/RenderStrokeSignsAction';
import type { ArticleRenderer } from '@/domain/models/Article';
import { FakeArticleRepository } from '@/infrastructure/persistence/fake/FakeArticleRepository';

const stubRenderer: ArticleRenderer = {
  renderArticle: jest.fn().mockResolvedValue('rendered article'),
  renderDisclaimer: jest.fn().mockResolvedValue('rendered disclaimer'),
  renderStrokeFacts: jest.fn().mockResolvedValue('rendered stroke facts'),
  renderStrokeSigns: jest.fn().mockResolvedValue('rendered stroke signs'),
};

describe('RenderStrokeSignsAction', () => {
  describe('Instantiation', () => {
    it('should create an action', () => {
      const repo = new FakeArticleRepository();
      const action = new GetStrokeSignsAction(repo);
      const create = () => new RenderStrokeSignsAction(action, stubRenderer);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    let getStrokeSigns: GetStrokeSignsAction;

    beforeEach(() => {
      const repo = new FakeArticleRepository();
      getStrokeSigns = new GetStrokeSignsAction(repo);
    });

    it('should render dislclaimer', async () => {
      const action = new RenderStrokeSignsAction(getStrokeSigns, stubRenderer);
      const renderedStr = await action.execute();
      expect(renderedStr).toBe('rendered stroke signs');
    });
  });
});
