import { GetAllAlgorithmsAction } from '@/application/GetAllAlgorithmsAction';
import { ScoredAlgorithm, TextAlgorithm } from '@/domain/models/Algorithm';
import { FakeAlgorithmRepository } from '@/infrastructure/persistence/fake/FakeAlgorithmRepository';

describe('GetAllAlgorithmsAction', () => {
  describe('Instantiation', () => {
    it('should create new action given repo', () => {
      const repo = new FakeAlgorithmRepository();
      const create = () => new GetAllAlgorithmsAction(repo);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    it('should get the fake algorithms', async () => {
      const repo = new FakeAlgorithmRepository();
      const action = new GetAllAlgorithmsAction(repo);
      const results = await action.execute();
      expect(results).toEqual(
        expect.arrayContaining([
          expect.any(ScoredAlgorithm),
          expect.any(TextAlgorithm),
        ])
      );
    });
  });
});
