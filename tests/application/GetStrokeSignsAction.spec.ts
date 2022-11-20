import { GetStrokeSignsAction } from '@/application/GetStrokeSignsAction';
import { Designation } from '@/domain/models/Article';
import { FakeArticleRepository } from '@/infrastructure/persistence/fake/FakeArticleRepository';

describe('GetStrokeSignsAction', () => {
  describe('Instantiation', () => {
    it('should create an action', () => {
      const repo = new FakeArticleRepository();
      const create = () => new GetStrokeSignsAction(repo);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    let repo: FakeArticleRepository;

    beforeEach(() => {
      repo = new FakeArticleRepository();
    });

    it('should get the strokeSigns', async () => {
      const action = new GetStrokeSignsAction(repo);
      const strokeSigns = await action.execute();
      expect(strokeSigns.getDesignation().is(Designation.STROKE_SIGNS));
    });
  });
});
