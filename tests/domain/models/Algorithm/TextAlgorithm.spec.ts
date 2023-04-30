import {
  AlgorithmId,
  AlgorithmInfo,
  Outcome,
  TextAlgorithm,
} from '@/domain/models/Algorithm';
import { Image } from '@/domain/models/Image';

describe('TextAlgorithm', () => {
  describe('Instantiation', () => {
    it('should make a new TextAlgorithm', () => {
      const info = new AlgorithmInfo({
        thumbnail: new Image('/foo.png'),
        title: 'test algo',
        body: 'this is the body text',
        summary: 'summary text',
        id: new AlgorithmId('0'),
        outcomes: [],
        shouldShowOnHomeScreen: true,
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
        thumbnail: new Image('/foo.png'),
        title: 'next algo',
        body: 'this is the next body text',
        summary: 'summary text',
        id: new AlgorithmId('1'),
        outcomes: [new Outcome({ title: 'title', body: 'body' })],
        shouldShowOnHomeScreen: true,
      });
      nextAlgo = new TextAlgorithm({ info: nextInfo });

      outcome = new Outcome({
        title: 'outcome title',
        body: 'outcome body',
        next: new AlgorithmId('1'),
      });
      const info = new AlgorithmInfo({
        thumbnail: new Image('/foo.png'),
        title: 'test algo',
        body: 'this is the body text',
        summary: 'summary text',
        id: new AlgorithmId('0'),
        outcomes: [outcome],
        shouldShowOnHomeScreen: true,
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
        thumbnail: new Image('/foo.png'),
        id: new AlgorithmId('2'),
        title: 'test algo',
        body: 'this is the body text',
        summary: 'summary text',
        outcomes: [],
        shouldShowOnHomeScreen: true,
      });
      const noOutcomesAlgo = new TextAlgorithm({
        info: noOutcomesAlgoInfo,
      });
      expect(noOutcomesAlgo.hasOutcomes()).toBe(false);
    });

    it('should get next algorithm', () => {
      const [thisOutcome] = algo.getOutcomes();
      expect(thisOutcome.getNext()?.is(new AlgorithmId('1'))).toBe(true);
      expect(nextAlgo.getOutcomes()[0].getNext()).toBeNull();
    });
  });
});
