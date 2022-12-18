import {
  Outcome,
  AlgorithmId,
  AlgorithmInfo,
  ScoredAlgorithm,
} from '@/domain/models/Algorithm';
import {
  GreaterThanCriterion,
  LessThanCriterion,
} from '@/domain/models/Algorithm/Criterion';
import { Switch } from '@/domain/models/Algorithm/Switch';
import { SwitchId } from '@/domain/models/Algorithm/SwitchId';

describe('ScoredAlgorithm', () => {
  describe('Instantiation', () => {
    it('should create a new scored algorithm', () => {
      const info = new AlgorithmInfo({
        id: new AlgorithmId('0'),
        title: 'my algo',
        body: 'body text',
        outcomes: [],
      });

      const switches = [
        new Switch({
          id: new SwitchId('0'),
          label: 'switch label text',
          value: 3,
        }),
      ];

      const create = () => new ScoredAlgorithm({ info, switches });
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    let algo: ScoredAlgorithm;
    let outcome: Outcome;
    let aSwitch: Switch;

    beforeEach(() => {
      outcome = new Outcome({
        title: 'outcome title',
        body: 'outcome body',
      });

      const info = new AlgorithmInfo({
        id: new AlgorithmId('0'),
        title: 'test algo',
        body: 'this is the body text',
        outcomes: [outcome],
      });

      aSwitch = new Switch({
        id: new SwitchId('0'),
        label: 'switch label text',
        value: 3,
      });

      const switches = [aSwitch];

      algo = new ScoredAlgorithm({ info, switches });
    });

    it('should get title', () => {
      expect(algo.getTitle()).toBe('test algo');
    });

    it('should get body', () => {
      expect(algo.getBody()).toBe('this is the body text');
    });

    it('should have not outcome before switch is set', () => {
      expect(algo.hasOutcome()).toBe(false);
    });

    it('should set switch', () => {
      expect(algo.hasOutcome()).toBe(false);
      const newAlgo = algo.toggleSwitch(aSwitch);
      expect(newAlgo.hasOutcome()).toBe(true);
      expect(newAlgo.getOutcomes()).toHaveLength(1);
    });

    it('should not have outcomes if outcomes array is empty', () => {
      const noOutcomesAlgoInfo = new AlgorithmInfo({
        id: new AlgorithmId('2'),
        title: 'test algo',
        body: 'this is the body text',
        outcomes: [],
      });
      let noOutcomesAlgo = new ScoredAlgorithm({
        info: noOutcomesAlgoInfo,
        switches: [aSwitch],
      });
      expect(noOutcomesAlgo.hasOutcome()).toBe(false);
      noOutcomesAlgo = noOutcomesAlgo.toggleSwitch(aSwitch);
      expect(noOutcomesAlgo.hasOutcome()).toBe(false);
    });

    it('should return empty array calling getOutcomes with no outcomes defined', () => {
      const noOutcomesAlgoInfo = new AlgorithmInfo({
        id: new AlgorithmId('2'),
        title: 'test algo',
        body: 'this is the body text',
        outcomes: [],
      });
      const noOutcomesAlgo = new ScoredAlgorithm({
        info: noOutcomesAlgoInfo,
        switches: [aSwitch],
      }).toggleSwitch(aSwitch);
      expect(noOutcomesAlgo.getOutcomes()).toEqual([]);
    });

    it('should return empty array calling getOutcomes before all switches are set', () => {
      expect(algo.getOutcomes()).toEqual([]);
    });

    it('should return empty array if score meets no outcome criterion', () => {
      const gt5Outcome = new Outcome({
        title: 'outcome title',
        body: 'outcome body',
        criterion: new GreaterThanCriterion(5),
      });

      const info = new AlgorithmInfo({
        id: new AlgorithmId('0'),
        title: 'test algo',
        body: 'this is the body text',
        outcomes: [gt5Outcome],
      });

      const val0Switch = new Switch({
        id: new SwitchId('0'),
        label: 'switch label text',
        value: 0,
      });

      const switches = [val0Switch];

      const unfulfillingAlgo = new ScoredAlgorithm({
        info,
        switches,
      }).toggleSwitch(val0Switch);

      expect(unfulfillingAlgo.getOutcomes()).toEqual([]);
    });

    it('should return both if score meets two outcome criteria', () => {
      const gt5Outcome = new Outcome({
        title: 'outcome title',
        body: 'outcome body',
        criterion: new GreaterThanCriterion(5),
      });

      const lt7Outcome = new Outcome({
        title: 'outcome 2 title',
        body: 'outcome 2 body',
        criterion: new LessThanCriterion(7),
      });

      const info = new AlgorithmInfo({
        id: new AlgorithmId('0'),
        title: 'test algo',
        body: 'this is the body text',
        outcomes: [gt5Outcome, lt7Outcome],
      });

      const val6Switch = new Switch({
        id: new SwitchId('0'),
        label: 'switch label text',
        value: 6,
      });

      const switches = [val6Switch];

      const doubleFulfillingAlgo = new ScoredAlgorithm({
        info,
        switches,
      }).toggleSwitch(val6Switch);

      expect(doubleFulfillingAlgo.getOutcomes()).toHaveLength(2);
    });

    it('should return null if no next algorithm', () => {
      const [outcomeWithoutNext] = algo.toggleSwitch(aSwitch).getOutcomes();
      expect(outcomeWithoutNext.getNext()).toBeNull();
    });

    it('should throw error if given no switches', () => {
      const info = new AlgorithmInfo({
        id: new AlgorithmId('0'),
        title: 'test algo',
        body: 'this is the body text',
        outcomes: [outcome],
      });
      const create = () => new ScoredAlgorithm({ info, switches: [] });
      expect(create).toThrowError('No switches');
    });
  });
});
