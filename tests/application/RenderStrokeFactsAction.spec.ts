import { GetStrokeFactsAction } from '@/application/GetStrokeFactsAction';
import { RenderStrokeFactsAction } from '@/application/RenderStrokeFactsAction';
import type { ArticleRenderer } from '@/domain/ports/ArticleRenderer';
import { FakeArticleRepository } from '@/infrastructure/persistence/fake/FakeArticleRepository';

const stubRenderer: ArticleRenderer = {
  renderArticle: jest.fn().mockResolvedValue('rendered article'),
  renderDisclaimer: jest.fn().mockResolvedValue('rendered disclaimer'),
  renderStrokeFacts: jest.fn().mockResolvedValue('rendered stroke facts'),
  renderStrokeSigns: jest.fn().mockResolvedValue('rendered stroke signs'),
};

describe('RenderStrokeFactsAction', () => {
  describe('Instantiation', () => {
    it('should create an action', () => {
      const repo = new FakeArticleRepository();
      const action = new GetStrokeFactsAction(repo);
      const create = () => new RenderStrokeFactsAction(action, stubRenderer);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    let getStrokeFacts: GetStrokeFactsAction;

    beforeEach(() => {
      const repo = new FakeArticleRepository();
      getStrokeFacts = new GetStrokeFactsAction(repo);
    });

    it('should render dislclaimer', async () => {
      const action = new RenderStrokeFactsAction(getStrokeFacts, stubRenderer);
      const renderedStr = await action.execute();
      expect(renderedStr).toBe('rendered stroke facts');
    });
  });
});
