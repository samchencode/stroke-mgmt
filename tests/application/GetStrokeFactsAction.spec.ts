import { GetStrokeFactsAction } from '@/application/GetStrokeFactsAction';
import { Designation } from '@/domain/models/Article';
import { FakeArticleRepository } from '@/infrastructure/persistence/fake/FakeArticleRepository';

describe('GetStrokeFactsAction', () => {
  describe('Instantiation', () => {
    it('should create an action', () => {
      const repo = new FakeArticleRepository();
      const create = () => new GetStrokeFactsAction(repo);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    let repo: FakeArticleRepository;

    beforeEach(() => {
      repo = new FakeArticleRepository();
    });

    it('should get the strokeFacts', async () => {
      const action = new GetStrokeFactsAction(repo);
      const strokeFacts = await action.execute();
      expect(strokeFacts.getDesignation().is(Designation.STROKE_FACTS));
    });
  });
});
