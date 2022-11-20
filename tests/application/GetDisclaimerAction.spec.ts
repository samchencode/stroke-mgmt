import { GetDisclaimerAction } from '@/application/GetDisclaimerAction';
import { Designation } from '@/domain/models/Article';
import { FakeArticleRepository } from '@/infrastructure/persistence/fake/FakeArticleRepository';

describe('GetDisclaimerAction', () => {
  describe('Instantiation', () => {
    it('should create an action', () => {
      const repo = new FakeArticleRepository();
      const create = () => new GetDisclaimerAction(repo);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    let repo: FakeArticleRepository;

    beforeEach(() => {
      repo = new FakeArticleRepository();
    });

    it('should get the disclaimer', async () => {
      const action = new GetDisclaimerAction(repo);
      const disclaimer = await action.execute();
      expect(disclaimer.getDesignation().is(Designation.DISCLAIMER));
    });
  });
});
