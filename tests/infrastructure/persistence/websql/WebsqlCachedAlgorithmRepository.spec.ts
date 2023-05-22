import {
  ALGORITHM_TYPES,
  AlgorithmId,
  AlgorithmInfo,
  GreaterThanCriterion,
  LessThanCriterion,
  NoCriterion,
  ScoredAlgorithm,
  SwitchId,
  TextAlgorithm,
  YesNoSwitch,
} from '@/domain/models/Algorithm';
import { Image } from '@/domain/models/Image';
import { NullImage } from '@/domain/models/Image/NullImage';
import { WebsqlCachedAlgorithmRepostiory } from '@/infrastructure/persistence/websql/WebsqlCachedAlgorithmRepository/WebsqlCachedAlgorithmRepository';
import {
  executeSql,
  resultSetToArray,
  sqlStr,
} from '@/infrastructure/persistence/websql/helpers';
import { openDatabase } from '@/vendor/websql';

describe('WebsqlCachedAlgorithmRepository', () => {
  let db: Database;

  const createTableQuery = sqlStr`
  CREATE TABLE algorithms (
    id TEXT PRIMARY KEY,
    title TEXT,
    summary TEXT,
    body TEXT,
    thumbnailUri TEXT,
    outcomesJson TEXT,
    shouldShowOnHomeScreen INTEGER,
    lastUpdatedTimestamp INTEGER,
    switchesJson TEXT,
    type TEXT
  )`;

  const insertTextAlgorithmQuery1 = sqlStr`
  INSERT INTO algorithms VALUES (
    '1',
    'My Title',
    'My Summary',
    '<h1>Body Text</h1>',
    'https://foobar.com/img-1.png',
    '[{"title":"MyTitle1","body":"OutcomeBody1","criterion":{"type":"NoCriterion","threshold":null},"next":null}]',
    1,
    0,
    '[]',
    'TextAlgorithm'
  )`;

  const insertTextAlgorithmQuery2 = sqlStr`
  INSERT INTO algorithms VALUES (
    '2',
    'My Title 2',
    'My Summary 2',
    '<h1>Body Text 2</h1>',
    'https://foobar.com/img-2.png',
    '[{"title":"MyTitle1","body":"OutcomeBody1","criterion":{"type":"NoCriterion","threshold":null},"next":null},{"title":"MyTitle2","body":"OutcomeBody2","criterion":{"type":"NoCriterion","threshold":null},"next":"1"}]',
    0,
    0,
    '[]',
    'TextAlgorithm'
  )`;

  const insertScoredAlgorithmQuery3 = sqlStr`
  INSERT INTO algorithms VALUES (
    '3',
    'My Title 3',
    'My Summary 3',
    '<h1>Body Text 3</h1>',
    'https://foobar.com/img-3.png',
    '[{"title":"MyTitle1","body":"OutcomeBody1","criterion":{"type":"LessThanCriterion","threshold":1},"next":"0"},{"title":"MyTitle2","body":"OutcomeBody2","criterion":{"type":"GreaterThanCriterion","threshold":0},"next":"1"}]',
    1,
    0,
    '[{"id":"1","label":"MySwitch1","levels":[{"id":"0","label":"No","value":0},{"id":"1","label":"Yes","value":1}],"description":null},{"id":"2","label":"MySwitch2","levels":[{"id":"0","label":"No","value":0},{"id":"1","label":"Yes","value":1}],"description":"MyDescription2"}]',
    'ScoredAlgorithm'
  )`;

  beforeEach(() => {
    db = openDatabase(':memory:', '0', '', 1000);
  });

  describe('Instantiation', () => {
    it('should be created with a websql database', () => {
      const create = () => new WebsqlCachedAlgorithmRepostiory(db);
      expect(create).not.toThrow();
    });

    it('should initialize empty table on instantiation if none exists', async () => {
      const repo = new WebsqlCachedAlgorithmRepostiory(db);
      await repo.ready;

      const query = sqlStr`
      SELECT name FROM sqlite_schema 
      WHERE type IN ('table','view') 
      AND name NOT LIKE 'sqlite_%'
      ORDER BY 1`;
      const [resultSet] = await executeSql(db, [query]);
      const results = resultSetToArray<{ name: string }>(resultSet);
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('algorithms');
    });
  });

  describe('#isEmpty', () => {
    it('should be empty when instantiated', async () => {
      const repo = new WebsqlCachedAlgorithmRepostiory(db);
      const result = await repo.isEmpty();
      expect(result).toBe(true);
    });

    it('should not be empty if there is at least one row in the table', async () => {
      await executeSql(db, [createTableQuery, insertTextAlgorithmQuery1]);

      const repo = new WebsqlCachedAlgorithmRepostiory(db);
      const result = await repo.isEmpty();
      expect(result).toBe(false);
    });
  });

  describe('#saveAll', () => {
    it('should save a collection of algorithms', async () => {
      const algorithmInfo0 = new AlgorithmInfo({
        id: new AlgorithmId('0'),
        title: 'Algorithm 0',
        summary: 'Summary 0',
        body: '<h1>Body 0</h1>',
        thumbnail: new NullImage(),
        outcomes: [],
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const textAlgorithm = new TextAlgorithm({ info: algorithmInfo0 });
      const algorithmInfo1 = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'Algorithm 1',
        summary: 'Summary 1',
        body: '<h1>Body 0</h1>',
        thumbnail: new NullImage(),
        outcomes: [],
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const scoredAlgorithm = new ScoredAlgorithm({
        info: algorithmInfo1,
        switches: [
          new YesNoSwitch({
            label: 'Switch',
            id: new SwitchId('0'),
            valueIfActive: 1,
          }),
        ],
      });

      const repo = new WebsqlCachedAlgorithmRepostiory(db);
      await repo.saveAll([textAlgorithm, scoredAlgorithm]);

      const query = sqlStr`SELECT id, type FROM algorithms ORDER BY id ASC`;
      const [resultSet] = await executeSql(db, [query]);
      expect(resultSet.rows).toHaveLength(2);
      const result = resultSetToArray<{ id: string; type: string }>(resultSet);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('0');
      expect(result[1].id).toBe('1');
      expect(result[0].type).toBe(ALGORITHM_TYPES.TEXT_ALGORITHM);
      expect(result[1].type).toBe(ALGORITHM_TYPES.SCORED_ALGORITHM);
    });
  });

  describe('#update', () => {
    it('should update an existing algorithm', async () => {
      await executeSql(db, [createTableQuery, insertTextAlgorithmQuery1]);

      const algorithmInfo = new AlgorithmInfo({
        id: new AlgorithmId('1'),
        title: 'Algorithm 1',
        summary: 'Summary 1',
        body: '<h1>Body 1</h1>',
        thumbnail: new Image('https://www.foobar.com/img.png'),
        outcomes: [],
        shouldShowOnHomeScreen: true,
        lastUpdated: new Date(0),
      });
      const textAlgorithm = new TextAlgorithm({ info: algorithmInfo });

      const repo = new WebsqlCachedAlgorithmRepostiory(db);
      await repo.update(textAlgorithm);

      const query = sqlStr`SELECT id, title, summary, body FROM algorithms`;
      const [resultSet] = await executeSql(db, [query]);
      expect(resultSet.rows).toHaveLength(1);
      const results = resultSetToArray<{
        id: string;
        title: string;
        summary: string;
        body: string;
      }>(resultSet);
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('1');
      expect(results[0].title).toBe('Algorithm 1');
      expect(results[0].summary).toBe('Summary 1');
      expect(results[0].body).toBe('<h1>Body 1</h1>');
    });
  });

  describe('#delete', () => {
    it('should delete algorithm specified by id', async () => {
      await executeSql(db, [
        createTableQuery,
        insertTextAlgorithmQuery1,
        insertTextAlgorithmQuery2,
      ]);

      const repo = new WebsqlCachedAlgorithmRepostiory(db);
      await repo.delete(new AlgorithmId('1'));

      const query = sqlStr`SELECT id FROM algorithms;`;
      const [resultSet] = await executeSql(db, [query]);
      expect(resultSet.rows).toHaveLength(1);
      const results = resultSetToArray<{ id: string }>(resultSet);
      expect(results[0].id).toBe('2');
    });
  });

  describe('#clearCache', () => {
    it('should delete all algorithms to clear the cache', async () => {
      await executeSql(db, [
        createTableQuery,
        insertTextAlgorithmQuery1,
        insertTextAlgorithmQuery2,
      ]);

      const repo = new WebsqlCachedAlgorithmRepostiory(db);
      await repo.clearCache();

      const query = sqlStr`SELECT * FROM algorithms;`;
      const [resultSet] = await executeSql(db, [query]);
      expect(resultSet.rows).toHaveLength(0);
    });
  });

  describe('#getAll', () => {
    it('should get scored algorithms', async () => {
      await executeSql(db, [createTableQuery, insertScoredAlgorithmQuery3]);

      const repo = new WebsqlCachedAlgorithmRepostiory(db);
      const results = await repo.getAll();

      expect(results).toHaveLength(1);
      expect(results[0].getId().toString()).toBe('3');
      expect(results[0].type).toBe(ALGORITHM_TYPES.SCORED_ALGORITHM);
      const result = results[0] as ScoredAlgorithm;
      expect(result.getOutcomes()).toHaveLength(2);
      expect(result.getSwitches()).toHaveLength(2);
      const outcomes = result.getOutcomes();
      expect(outcomes[0].getTitle()).toBe('MyTitle1');
      expect(outcomes[1].getTitle()).toBe('MyTitle2');
      expect(outcomes[0].getBody()).toBe('OutcomeBody1');
      expect(outcomes[1].getBody()).toBe('OutcomeBody2');
      expect(outcomes[0].getNext()?.toString()).toBe('0');
      expect(outcomes[1].getNext()?.toString()).toBe('1');
      expect(outcomes[0].getCriterion()).toBeInstanceOf(LessThanCriterion);
      expect(outcomes[1].getCriterion()).toBeInstanceOf(GreaterThanCriterion);
      const switches = result.getSwitches();
      expect(switches[0].getLabel()).toBe('MySwitch1');
      expect(switches[1].getLabel()).toBe('MySwitch2');
      expect(switches[0].getDescription()).toBeUndefined();
      expect(switches[1].getDescription()).toBe('MyDescription2');
      expect(switches[0].getLevels()).toHaveLength(2);
      expect(switches[1].getLevels()).toHaveLength(2);
    });

    it('should get text algorithms', async () => {
      await executeSql(db, [createTableQuery, insertTextAlgorithmQuery2]);

      const repo = new WebsqlCachedAlgorithmRepostiory(db);
      const results = await repo.getAll();

      expect(results).toHaveLength(1);
      expect(results[0].getId().toString()).toBe('2');
      expect(results[0].type).toBe(ALGORITHM_TYPES.TEXT_ALGORITHM);
      const result = results[0] as TextAlgorithm;
      expect(result.getOutcomes()).toHaveLength(2);
      const outcomes = result.getOutcomes();
      expect(outcomes[0].getTitle()).toBe('MyTitle1');
      expect(outcomes[1].getTitle()).toBe('MyTitle2');
      expect(outcomes[0].getBody()).toBe('OutcomeBody1');
      expect(outcomes[1].getBody()).toBe('OutcomeBody2');
      expect(outcomes[0].getNext()).toBeNull();
      expect(outcomes[1].getNext()?.toString()).toBe('1');
      expect(outcomes[0].getCriterion()).toBeInstanceOf(NoCriterion);
      expect(outcomes[1].getCriterion()).toBeInstanceOf(NoCriterion);
    });

    it('should get multiple cached algorithms', async () => {
      await executeSql(db, [
        createTableQuery,
        insertTextAlgorithmQuery1,
        insertScoredAlgorithmQuery3,
      ]);

      const repo = new WebsqlCachedAlgorithmRepostiory(db);

      const results = await repo.getAll();
      expect(results).toHaveLength(2);
      expect(results[0].getId().toString()).toBe('1');
      expect(results[1].getId().toString()).toBe('3');
      expect(results[0].type).toBe(ALGORITHM_TYPES.TEXT_ALGORITHM);
      expect(results[1].type).toBe(ALGORITHM_TYPES.SCORED_ALGORITHM);
    });
  });

  describe('#getById', () => {
    it('should get a text algorithm by id', async () => {
      await executeSql(db, [createTableQuery, insertTextAlgorithmQuery2]);

      const repo = new WebsqlCachedAlgorithmRepostiory(db);
      const result = await repo.getById(new AlgorithmId('2'));

      expect(result.getId().toString()).toBe('2');
      expect(result.type).toBe(ALGORITHM_TYPES.TEXT_ALGORITHM);
      expect(result.getOutcomes()).toHaveLength(2);
      const outcomes = result.getOutcomes();
      expect(outcomes[0].getTitle()).toBe('MyTitle1');
      expect(outcomes[1].getTitle()).toBe('MyTitle2');
      expect(outcomes[0].getBody()).toBe('OutcomeBody1');
      expect(outcomes[1].getBody()).toBe('OutcomeBody2');
      expect(outcomes[0].getNext()).toBeNull();
      expect(outcomes[1].getNext()?.toString()).toBe('1');
      expect(outcomes[0].getCriterion()).toBeInstanceOf(NoCriterion);
      expect(outcomes[1].getCriterion()).toBeInstanceOf(NoCriterion);
    });

    it('should get a scored algorithm', async () => {
      await executeSql(db, [createTableQuery, insertScoredAlgorithmQuery3]);

      const repo = new WebsqlCachedAlgorithmRepostiory(db);
      const result = await repo.getById(new AlgorithmId('3'));

      expect(result.getId().toString()).toBe('3');
      expect(result.type).toBe(ALGORITHM_TYPES.SCORED_ALGORITHM);
      const scoredAlgorithm = result as ScoredAlgorithm;
      expect(scoredAlgorithm.getOutcomes()).toHaveLength(2);
      expect(scoredAlgorithm.getSwitches()).toHaveLength(2);
      const outcomes = result.getOutcomes();
      expect(outcomes[0].getTitle()).toBe('MyTitle1');
      expect(outcomes[1].getTitle()).toBe('MyTitle2');
      expect(outcomes[0].getBody()).toBe('OutcomeBody1');
      expect(outcomes[1].getBody()).toBe('OutcomeBody2');
      expect(outcomes[0].getNext()?.toString()).toBe('0');
      expect(outcomes[1].getNext()?.toString()).toBe('1');
      expect(outcomes[0].getCriterion()).toBeInstanceOf(LessThanCriterion);
      expect(outcomes[1].getCriterion()).toBeInstanceOf(GreaterThanCriterion);
      const switches = scoredAlgorithm.getSwitches();
      expect(switches[0].getLabel()).toBe('MySwitch1');
      expect(switches[1].getLabel()).toBe('MySwitch2');
      expect(switches[0].getDescription()).toBeUndefined();
      expect(switches[1].getDescription()).toBe('MyDescription2');
      expect(switches[0].getLevels()).toHaveLength(2);
      expect(switches[1].getLevels()).toHaveLength(2);
    });
  });

  describe('#getAllShownOnHomeScreen', () => {
    it('should only get algorithms that should be shown on home screen', async () => {
      await executeSql(db, [
        createTableQuery,
        insertTextAlgorithmQuery1,
        insertTextAlgorithmQuery2,
        insertScoredAlgorithmQuery3,
      ]);

      const repo = new WebsqlCachedAlgorithmRepostiory(db);
      const results = await repo.getAllShownOnHomeScreen();

      expect(results).toHaveLength(2);
      expect(results[0].getId().toString()).toBe('1');
      expect(results[1].getId().toString()).toBe('3');
    });
  });

  describe('#isAvailable', () => {
    it('should be available', async () => {
      const repo = new WebsqlCachedAlgorithmRepostiory(db);
      const result = await repo.isAvailable();
      expect(result).toBe(true);
    });
  });
});
