import {
  AlgorithmId,
  AlgorithmInfo,
  GreaterThanCriterion,
  Outcome,
  RenderedAlgorithm,
  RenderedAlgorithmCollection,
  ScoredAlgorithm,
  Switch,
  SwitchId,
  TextAlgorithm,
} from '@/domain/models/Algorithm';

describe('RenderedAlgorithm', () => {
  describe('Instantiation', () => {
    it('should create a rendered algorithm with an algo and an html string', () => {
      const html = '<h1>hai</h1>';
      const algo = new TextAlgorithm({
        info: new AlgorithmInfo({
          id: new AlgorithmId('10000'),
          title: 'hai',
          body: 'hai',
          outcomes: [],
          summary: 'test algo',
        }),
      });
      const create = () => new RenderedAlgorithm(algo, html);
      expect(create).not.toThrowError();
    });

    it('should create collection with at least one rendered algorithm', () => {
      const html = '<h1>hai</h1>';
      const algo = new TextAlgorithm({
        info: new AlgorithmInfo({
          id: new AlgorithmId('10000'),
          title: 'hai',
          body: 'hai',
          outcomes: [],
          summary: 'test algo',
        }),
      });
      const rAlgo = new RenderedAlgorithm(algo, html);
      const create = () => new RenderedAlgorithmCollection(rAlgo);
      expect(create).not.toThrowError();
      const createWithArr = () => new RenderedAlgorithmCollection([rAlgo]);
      expect(createWithArr).not.toThrowError();
    });

    it('should throw error if no algos', () => {
      const create = () => new RenderedAlgorithmCollection([]);
      expect(create).toThrowError('at least one algorithm');
    });
  });

  describe('Behavior', () => {
    let algo1: ScoredAlgorithm;
    let algo2: TextAlgorithm;
    let algo3: TextAlgorithm;

    beforeEach(() => {
      algo3 = new TextAlgorithm({
        info: new AlgorithmInfo({
          id: new AlgorithmId('30'),
          title: 'this is an example text algo',
          body: 'this is an example text algo',
          outcomes: [],
          summary: 'test algo',
        }),
      });

      algo2 = new TextAlgorithm({
        info: new AlgorithmInfo({
          id: new AlgorithmId('20'),
          title: 'this is an example text algo',
          body: 'this is an example text algo',
          outcomes: [],
          summary: 'test algo',
        }),
      });

      algo1 = new ScoredAlgorithm({
        info: new AlgorithmInfo({
          id: new AlgorithmId('10'),
          title: 'this is an example scored algo',
          body: 'this is an example scored algo',
          outcomes: [
            new Outcome({
              title: 'example outcome',
              body: 'example outcome',
              next: algo2,
              criterion: new GreaterThanCriterion(2),
            }),
          ],
          summary: 'test algo',
        }),
        switches: [
          new Switch({
            id: new SwitchId('0'),
            label: 'example switch',
            value: 3,
          }),
        ],
      });
    });

    it('should update a scoredAlgorithm', () => {
      const rAlgo = new RenderedAlgorithm(algo1, 'dummy html');
      const collection = new RenderedAlgorithmCollection([rAlgo]);
      const storedAlgo = collection.get()[0].getAlgorithm() as ScoredAlgorithm;
      expect(collection.length).toBe(1);
      expect(storedAlgo.calculateScore()).toBe(0);

      algo1 = algo1.setSwitchById(new SwitchId('0'), true);
      const updatedCollection = collection.setAlgorithm(
        new RenderedAlgorithm(algo1, 'dummmy html updated')
      );
      expect(updatedCollection.length).toBe(1);

      const updatedStoredAlgo = updatedCollection
        .get()[0]
        .getAlgorithm() as ScoredAlgorithm;
      expect(updatedStoredAlgo.calculateScore()).toBe(3);
    });

    it('should remove all algorithms after an updated algorithm', () => {
      const rAlgo1 = new RenderedAlgorithm(algo1, 'dummy html for algo 1');
      const rAlgo3 = new RenderedAlgorithm(algo3, 'dummy html for algo 3');
      const collection = new RenderedAlgorithmCollection([rAlgo1, rAlgo3]);
      expect(collection.length).toBe(2);
      algo1 = algo1.setSwitchById(new SwitchId('0'), true);
      const updatedCollection = collection.setAlgorithm(
        new RenderedAlgorithm(algo1, 'updated dummy html for algo 1')
      );
      expect(updatedCollection.length).toBe(1);
      expect(
        updatedCollection.get()[0].getAlgorithmId().is(algo1.getId())
      ).toBe(true);
    });

    it('should add new algo to collection after algo that triggered it', () => {
      const rAlgo1 = new RenderedAlgorithm(algo1, 'dummy html');
      const collection = new RenderedAlgorithmCollection(rAlgo1);
      algo1 = algo1.setSwitchById(new SwitchId('0'), true);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const nextAlgo = algo1.getOutcomes()[0].getNext()!;
      const updatedCollection = collection.selectAlgorithm(
        new RenderedAlgorithm(nextAlgo, 'dummy next algo html'),
        algo1
      );
      expect(updatedCollection.length).toBe(2);
      expect(
        updatedCollection.get()[1].getAlgorithmId().is(nextAlgo.getId())
      ).toBe(true);
    });

    it('should delete all elements beyond a newly added algorithm', () => {
      const rAlgo1 = new RenderedAlgorithm(algo1, 'dummy html for algo 1');
      const rAlgo3 = new RenderedAlgorithm(algo3, 'dummy html for algo 3');
      const collection = new RenderedAlgorithmCollection([rAlgo1, rAlgo3]);
      const updatedCollection = collection.selectAlgorithm(
        new RenderedAlgorithm(algo2, 'dummy html for algo 2'),
        algo1
      );
      expect(updatedCollection).toHaveLength(2);
      expect(
        updatedCollection.get()[1].getAlgorithmId().is(algo2.getId())
      ).toBe(true);
    });
  });
});
