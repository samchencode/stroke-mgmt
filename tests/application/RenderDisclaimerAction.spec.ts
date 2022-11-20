import { GetDisclaimerAction } from '@/application/GetDisclaimerAction';
import { RenderDisclaimerAction } from '@/application/RenderDisclaimerAction';
import type { ArticleRenderer } from '@/domain/ports/ArticleRenderer';
import { FakeArticleRepository } from '@/infrastructure/persistence/fake/FakeArticleRepository';

const stubRenderer: ArticleRenderer = {
  renderArticle: jest.fn().mockResolvedValue('rendered article'),
  renderDisclaimer: jest.fn().mockResolvedValue('rendered disclaimer'),
  renderStrokeFacts: jest.fn().mockResolvedValue('rendered stroke facts'),
  renderStrokeSigns: jest.fn().mockResolvedValue('rendered stroke signs'),
};

describe('RenderDisclaimerAction', () => {
  describe('Instantiation', () => {
    it('should create an action', () => {
      const repo = new FakeArticleRepository();
      const action = new GetDisclaimerAction(repo);
      const create = () => new RenderDisclaimerAction(action, stubRenderer);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    let getDisclaimer: GetDisclaimerAction;

    beforeEach(() => {
      const repo = new FakeArticleRepository();
      getDisclaimer = new GetDisclaimerAction(repo);
    });

    it('should render dislclaimer', async () => {
      const action = new RenderDisclaimerAction(getDisclaimer, stubRenderer);
      const renderedStr = await action.execute();
      expect(renderedStr).toBe('rendered disclaimer');
    });
  });
});
