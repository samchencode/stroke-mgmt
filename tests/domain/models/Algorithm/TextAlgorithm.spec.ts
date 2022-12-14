import {
  AlgorithmId,
  AlgorithmInfo,
  Outcome,
  TextAlgorithm,
} from '@/domain/models/Algorithm';

describe('TextAlgorithm', () => {
  describe('Instantiation', () => {
    it('should make a new TextAlgorithm', () => {
      const info = new AlgorithmInfo({
        title: 'test algo',
        body: 'this is the body text',
        summary: 'summary text',
        id: new AlgorithmId('0'),
        outcomes: [],
      });

      const create = () => new TextAlgorithm({ info });
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    let algo: TextAlgorithm;
    let outcome: Outcome;
    let nextAlgo: TextAlgorithm;

    beforeEach(() => {
      const nextInfo = new AlgorithmInfo({
        title: 'next algo',
        body: 'this is the next body text',
        summary: 'summary text',
        id: new AlgorithmId('1'),
        outcomes: [new Outcome({ title: 'title', body: 'body' })],
      });
      nextAlgo = new TextAlgorithm({ info: nextInfo });

      outcome = new Outcome({
        title: 'outcome title',
        body: 'outcome body',
        next: nextAlgo,
      });
      const info = new AlgorithmInfo({
        title: 'test algo',
        body: 'this is the body text',
        summary: 'summary text',
        id: new AlgorithmId('0'),
        outcomes: [outcome],
      });

      algo = new TextAlgorithm({ info });
    });

    it('should get title', () => {
      expect(algo.getTitle()).toBe('test algo');
    });

    it('should get body', () => {
      expect(algo.getBody()).toBe('this is the body text');
    });

    it('should have outcome', () => {
      expect(algo.hasOutcomes()).toBe(true);
    });

    it('should provide outcome', () => {
      expect(algo.getOutcomes()[0].is(outcome)).toBe(true);
    });

    it('should not have outcomes if outcomes array is empty', () => {
      const noOutcomesAlgoInfo = new AlgorithmInfo({
        id: new AlgorithmId('2'),
        title: 'test algo',
        body: 'this is the body text',
        summary: 'summary text',
        outcomes: [],
      });
      const noOutcomesAlgo = new TextAlgorithm({
        info: noOutcomesAlgoInfo,
      });
      expect(noOutcomesAlgo.hasOutcomes()).toBe(false);
    });

    it('should get next algorithm', () => {
      const [thisOutcome] = algo.getOutcomes();
      expect(thisOutcome.getNext()).toBe(nextAlgo);
      expect(nextAlgo.getOutcomes()[0].getNext()).toBeNull();
    });
  });
});
