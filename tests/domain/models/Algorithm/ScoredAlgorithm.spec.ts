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
import { YesNoSwitch, SwitchId } from '@/domain/models/Algorithm/Switch';
import { Image } from '@/domain/models/Image';

describe('ScoredAlgorithm', () => {
  describe('Instantiation', () => {
    it('should create a new scored algorithm', () => {
      const info = new AlgorithmInfo({
        thumbnail: new Image('/foo.png'),
        id: new AlgorithmId('0'),
        title: 'my algo',
        body: 'body text',
        summary: 'summary text',
        outcomes: [],
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });

      const switches = [
        new YesNoSwitch({
          id: new SwitchId('0'),
          label: 'switch label text',
          valueIfActive: 3,
        }),
      ];

      const create = () => new ScoredAlgorithm({ info, switches });
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    let algo: ScoredAlgorithm;
    let outcome: Outcome;
    let aSwitch: YesNoSwitch;

    beforeEach(() => {
      outcome = new Outcome({
        title: 'outcome title',
        body: 'outcome body',
      });

      const info = new AlgorithmInfo({
        thumbnail: new Image('/foo.png'),
        id: new AlgorithmId('0'),
        title: 'test algo',
        body: 'this is the body text',
        summary: 'summary text',
        outcomes: [outcome],
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });

      aSwitch = new YesNoSwitch({
        id: new SwitchId('0'),
        label: 'switch label text',
        valueIfActive: 3,
        description: 'demo switch',
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
      expect(algo.hasOutcomes()).toBe(false);
    });

    it('should set switch', () => {
      expect(algo.hasOutcomes()).toBe(false);
      const newAlgo = algo.setSwitchById(aSwitch.getId(), YesNoSwitch.YES);
      expect(newAlgo.hasOutcomes()).toBe(true);
      expect(newAlgo.getDisplayedOutcomes()).toHaveLength(1);
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
        lastUpdated: new Date(0),
      });
      let noOutcomesAlgo = new ScoredAlgorithm({
        info: noOutcomesAlgoInfo,
        switches: [aSwitch],
      });
      expect(noOutcomesAlgo.hasOutcomes()).toBe(false);
      noOutcomesAlgo = noOutcomesAlgo.setSwitchById(
        aSwitch.getId(),
        YesNoSwitch.NO
      );
      expect(noOutcomesAlgo.hasOutcomes()).toBe(false);
    });

    it('should return empty array calling getDisplayedOutcomes with no outcomes defined', () => {
      const noOutcomesAlgoInfo = new AlgorithmInfo({
        thumbnail: new Image('/foo.png'),
        id: new AlgorithmId('2'),
        title: 'test algo',
        body: 'this is the body text',
        summary: 'summary text',
        outcomes: [],
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const noOutcomesAlgo = new ScoredAlgorithm({
        info: noOutcomesAlgoInfo,
        switches: [aSwitch],
      }).setSwitchById(aSwitch.getId(), YesNoSwitch.YES);
      expect(noOutcomesAlgo.getDisplayedOutcomes()).toEqual([]);
    });

    it('should return empty array calling getDisplayedOutcomes before all switches are set', () => {
      expect(algo.getDisplayedOutcomes()).toEqual([]);
    });

    it('should return empty array if score meets no outcome criterion', () => {
      const gt5Outcome = new Outcome({
        title: 'outcome title',
        body: 'outcome body',
        criterion: new GreaterThanCriterion(5),
      });

      const info = new AlgorithmInfo({
        thumbnail: new Image('/foo.png'),
        id: new AlgorithmId('0'),
        title: 'test algo',
        body: 'this is the body text',
        summary: 'summary text',
        outcomes: [gt5Outcome],
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });

      const val0Switch = new YesNoSwitch({
        id: new SwitchId('0'),
        label: 'switch label text',
        valueIfActive: 0,
      });

      const switches = [val0Switch];

      const unfulfillingAlgo = new ScoredAlgorithm({
        info,
        switches,
      }).setSwitchById(val0Switch.getId(), YesNoSwitch.YES);

      expect(unfulfillingAlgo.getDisplayedOutcomes()).toEqual([]);
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
        thumbnail: new Image('/foo.png'),
        id: new AlgorithmId('0'),
        title: 'test algo',
        body: 'this is the body text',
        summary: 'summary text',
        outcomes: [gt5Outcome, lt7Outcome],
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });

      const val6Switch = new YesNoSwitch({
        id: new SwitchId('0'),
        label: 'switch label text',
        valueIfActive: 6,
      });

      const switches = [val6Switch];

      const doubleFulfillingAlgo = new ScoredAlgorithm({
        info,
        switches,
      }).setSwitchById(val6Switch.getId(), YesNoSwitch.YES);

      expect(doubleFulfillingAlgo.getDisplayedOutcomes()).toHaveLength(2);
    });

    it('should return null if no next algorithm', () => {
      const [outcomeWithoutNext] = algo
        .setSwitchById(aSwitch.getId(), YesNoSwitch.YES)
        .getDisplayedOutcomes();
      expect(outcomeWithoutNext.getNext()).toBeNull();
    });

    it('should throw error if given no switches', () => {
      const info = new AlgorithmInfo({
        thumbnail: new Image('/foo.png'),
        id: new AlgorithmId('0'),
        title: 'test algo',
        body: 'this is the body text',
        summary: 'summary text',
        outcomes: [outcome],
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const create = () => new ScoredAlgorithm({ info, switches: [] });
      expect(create).toThrowError('No switches');
    });

    it('should throw error if switchid not found', () => {
      const info = new AlgorithmInfo({
        thumbnail: new Image('/foo.png'),
        id: new AlgorithmId('0'),
        title: 'test algo',
        body: 'this is the body text',
        summary: 'summary text',
        outcomes: [outcome],
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });

      const val6Switch = new YesNoSwitch({
        id: new SwitchId('0'),
        label: 'switch label text',
        valueIfActive: 6,
      });

      const switches = [val6Switch];

      const oneSwitchAlgo = new ScoredAlgorithm({ info, switches });
      const boom = () =>
        oneSwitchAlgo.setSwitchById(new SwitchId('1'), YesNoSwitch.NO);
      expect(boom).toThrowError('id 1');
    });

    it('should preserve order of switches after setting switch', () => {
      const info = new AlgorithmInfo({
        thumbnail: new Image('/foo.png'),
        id: new AlgorithmId('0'),
        title: 'test algo',
        body: 'this is the body text',
        summary: 'summary text',
        outcomes: [outcome],
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });

      const val6Switch = new YesNoSwitch({
        id: new SwitchId('0'),
        label: 'switch label text',
        valueIfActive: 6,
      });

      const val4Switch = new YesNoSwitch({
        id: new SwitchId('1'),
        label: 'switch label text',
        valueIfActive: 4,
      });

      const switches = [val6Switch, val4Switch];
      const multiSwitchAlgo = new ScoredAlgorithm({ info, switches });
      const resultAlgo = multiSwitchAlgo.setSwitchById(
        new SwitchId('1'),
        YesNoSwitch.YES
      );
      const switchIds = resultAlgo
        .getSwitches()
        .map((s) => s.getId().toString());
      expect(switchIds).toEqual(['0', '1']);
    });
  });
});
