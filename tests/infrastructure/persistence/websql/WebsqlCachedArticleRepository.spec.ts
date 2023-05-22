import {
  Article,
  ArticleId,
  CachedArticleNotFoundError,
  Designation,
} from '@/domain/models/Article';
import { Image } from '@/domain/models/Image';
import { WebsqlCachedArticleRepository } from '@/infrastructure/persistence/websql/WebsqlCachedArticleRepository';
import {
  executeSql,
  resultSetToArray,
  sqlStr,
} from '@/infrastructure/persistence/websql/helpers';
import { openDatabase } from '@/vendor/websql';

describe('WebsqlCachedArticleRepository', () => {
  let db: Database;

  const articleZero = new Article({
    id: new ArticleId('0'),
    title: 'My Title 0',
    html: '<h1>Hello World 0</h1>',
    designation: Designation.ARTICLE,
    thumbnail: new Image('https://foo.io/bar.png'),
    tags: [],
    lastUpdated: new Date(),
    shouldShowOnHomeScreen: true,
  });
  const articleOne = new Article({
    id: new ArticleId('1'),
    title: 'My Title 1',
    html: '<h1>Hello World 1</h1>',
    designation: Designation.ARTICLE,
    thumbnail: new Image('https://foo.io/baz.png'),
    tags: [],
    lastUpdated: new Date(),
    shouldShowOnHomeScreen: true,
  });
  const articleTwo = new Article({
    id: new ArticleId('2'),
    title: 'My Title 2',
    html: '<h1>Hello World 2</h1>',
    designation: Designation.ARTICLE,
    thumbnail: new Image('https://foo.io/bar.png'),
    tags: [],
    lastUpdated: new Date(),
    shouldShowOnHomeScreen: true,
  });
  const disclaimer = new Article({
    id: new ArticleId('3'),
    title: 'My Disclaimer',
    html: '<h1>My Disclaimer</h1>',
    designation: Designation.DISCLAIMER,
    thumbnail: new Image('https://foo.io/disc.png'),
    tags: [],
    lastUpdated: new Date(),
    shouldShowOnHomeScreen: true,
  });

  beforeEach(() => {
    db = openDatabase(':memory:', '0.0', '', 0);
  });

  describe('Instantiation', () => {
    it('should be created with a websql database', () => {
      const create = () => new WebsqlCachedArticleRepository(db);
      expect(create).not.toThrow();
    });

    it('should initialize empty table on create', async () => {
      const repo = new WebsqlCachedArticleRepository(db);
      await repo.ready;
      const query = sqlStr`
      SELECT name FROM sqlite_schema 
      WHERE type IN ('table','view') 
      AND name NOT LIKE 'sqlite_%'
      ORDER BY 1`;
      const [resultSet] = await executeSql(db, [query]);
      const results = resultSetToArray<{ name: string }>(resultSet);
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('articles');
    });
  });

  describe('isEmpty', () => {
    it('should be empty on instantiation', async () => {
      const repo = new WebsqlCachedArticleRepository(db);
      expect(await repo.isEmpty()).toBe(true);
    });

    it('should not be empty if an article is present', async () => {
      const createQuery = sqlStr`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        html TEXT NOT NULL,
        summary TEXT,
        designation TEXT NOT NULL,
        thumbnailUri TEXT NOT NULL,
        tagsJson TEXT NOT NULL,
        lastUpdatedTimestamp INTEGER NOT NULL,
        shouldShowOnHomeScreen INTEGER NOT NULL
      )`;

      const insertQuery = sqlStr`INSERT INTO articles VALUES (
        '0', 'my title', '<h1>hai</h1>', NULL, 'Article', 'foo.png', '[]', 0, 1
      )`;

      await executeSql(db, [createQuery, insertQuery]);

      const repo = new WebsqlCachedArticleRepository(db);
      expect(await repo.isEmpty()).toBe(false);
    });
  });

  describe('saveAll', () => {
    it('should save one article', async () => {
      const repo = new WebsqlCachedArticleRepository(db);
      await repo.saveAll([articleZero]);
      expect(await repo.isEmpty()).toBe(false);
      const selectQuery = sqlStr`SELECT id FROM articles`;
      const [result] = await executeSql(db, [selectQuery]);
      expect(result.rows).toHaveLength(1);
      const rows = resultSetToArray<{ id: string }>(result);
      expect(rows).toEqual([{ id: '0' }]);
    });

    it('should save many articles', async () => {
      const repo = new WebsqlCachedArticleRepository(db);
      await repo.saveAll([articleZero, articleOne, articleTwo]);
      expect(await repo.isEmpty()).toBe(false);
      const selectQuery = sqlStr`SELECT id FROM articles`;
      const [result] = await executeSql(db, [selectQuery]);
      expect(result.rows).toHaveLength(3);
      const rows = resultSetToArray<{ id: string }>(result);
      expect(rows).toEqual([{ id: '0' }, { id: '1' }, { id: '2' }]);
    });
  });

  describe('update', () => {
    it('should update a saved article', async () => {
      const createQuery = sqlStr`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        html TEXT NOT NULL,
        summary TEXT,
        designation TEXT NOT NULL,
        thumbnailUri TEXT NOT NULL,
        tagsJson TEXT NOT NULL,
        lastUpdatedTimestamp INTEGER NOT NULL,
        shouldShowOnHomeScreen INTEGER DEFAULT 1
      )`;

      const insertQuery = sqlStr`INSERT INTO articles VALUES (
        '0', 'my title', '<h1>hai</h1>', NULL, 'Article', 'foo.png', '[]', 0, 1
      )`;

      await executeSql(db, [createQuery, insertQuery]);

      const repo = new WebsqlCachedArticleRepository(db);
      await repo.update(articleZero);

      const selectQuery = sqlStr`SELECT id, title FROM articles WHERE id = '0'`;
      const [resultSet] = await executeSql(db, [selectQuery]);

      expect(resultSet.rows).toHaveLength(1);
      const rows = resultSetToArray<{ id: string; title: string }>(resultSet);
      expect(rows[0]).toEqual({ id: '0', title: 'My Title 0' });
    });
  });

  describe('delete', () => {
    it('should delete one article', async () => {
      const createQuery = sqlStr`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        html TEXT NOT NULL,
        summary TEXT,
        designation TEXT NOT NULL,
        thumbnailUri TEXT NOT NULL,
        tagsJson TEXT NOT NULL,
        lastUpdatedTimestamp INTEGER NOT NULL,
        shouldShowOnHomeScreen INTEGER DEFAULT 1
      )`;

      const insertQuery = sqlStr`INSERT INTO articles VALUES (
        '0', 'my title', '<h1>hai</h1>', NULL, 'Article', 'foo.png', '[]', 0, 1
      )`;

      await executeSql(db, [createQuery, insertQuery]);

      const repo = new WebsqlCachedArticleRepository(db);
      await repo.delete(new ArticleId('0'));

      const selectQuery = sqlStr`SELECT * FROM articles WHERE id = '0'`;
      const [resultSet] = await executeSql(db, [selectQuery]);
      expect(resultSet.rows).toHaveLength(0);
    });

    it('should delete only one article when others exist', async () => {
      const createQuery = sqlStr`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        html TEXT NOT NULL,
        summary TEXT,
        designation TEXT NOT NULL,
        thumbnailUri TEXT NOT NULL,
        tagsJson TEXT NOT NULL,
        lastUpdatedTimestamp INTEGER NOT NULL,
        shouldShowOnHomeScreen INTEGER DEFAULT 1
      )`;

      const insertQueryOne = sqlStr`INSERT INTO articles VALUES (
        '0', 'My first title', '<h1>hai</h1>', NULL, 'Article', 'foo.png', '[]', 0, 1
      )`;
      const insertQueryTwo = sqlStr`INSERT INTO articles VALUES (
        '1', 'My second title', '<h1>hello</h1>', 'quick summary', 'Article', 'bar.png', '[]', 0, 1
      )`;

      await executeSql(db, [createQuery, insertQueryOne, insertQueryTwo]);

      const repo = new WebsqlCachedArticleRepository(db);
      await repo.delete(new ArticleId('0'));

      const selectQueryOne = sqlStr`SELECT * FROM articles WHERE id = '0'`;
      const selectQueryTwo = sqlStr`SELECT * FROM articles WHERE id = '1'`;
      const [resultSetOne, resultSetTwo] = await executeSql(db, [
        selectQueryOne,
        selectQueryTwo,
      ]);
      expect(resultSetOne.rows).toHaveLength(0);
      expect(resultSetTwo.rows).toHaveLength(1);
    });
  });

  describe('clearCache', () => {
    it('should delete all cached articles', async () => {
      const createQuery = sqlStr`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        html TEXT NOT NULL,
        summary TEXT,
        designation TEXT NOT NULL,
        thumbnailUri TEXT NOT NULL,
        tagsJson TEXT NOT NULL,
        lastUpdatedTimestamp INTEGER NOT NULL,
        shouldShowOnHomeScreen INTEGER DEFAULT 1
      )`;

      const insertQueryOne = sqlStr`INSERT INTO articles VALUES (
        '0', 'My first title', '<h1>hai</h1>', NULL, 'Article', 'foo.png', '[]', 0, 1
      )`;
      const insertQueryTwo = sqlStr`INSERT INTO articles VALUES (
        '1', 'My second title', '<h1>hello</h1>', 'quick summary', 'Article', 'bar.png', '[]', 0, 1
      )`;
      await executeSql(db, [createQuery, insertQueryOne, insertQueryTwo]);

      const repo = new WebsqlCachedArticleRepository(db);
      await repo.clearCache();

      const selectQuery = sqlStr`SELECT * FROM articles`;
      const [resultSet] = await executeSql(db, [selectQuery]);
      expect(resultSet.rows).toHaveLength(0);
    });
  });

  describe('getByDesignation', () => {
    it('should get articles by designation', async () => {
      const repo = new WebsqlCachedArticleRepository(db);
      await repo.saveAll([articleZero, articleOne, articleTwo, disclaimer]);
      const articles = await repo.getByDesignation(Designation.ARTICLE);
      expect(articles).toHaveLength(3);
    });
    it('should get disclaimer', async () => {
      const repo = new WebsqlCachedArticleRepository(db);
      await repo.saveAll([articleZero, articleOne, articleTwo, disclaimer]);
      const articles = await repo.getByDesignation(Designation.DISCLAIMER);
      expect(articles).toHaveLength(1);
      expect(articles[0].is(disclaimer)).toBe(true);
    });
  });

  describe('getById', () => {
    it('should get an article by id', async () => {
      const repo = new WebsqlCachedArticleRepository(db);
      await repo.saveAll([articleZero, articleOne, articleTwo, disclaimer]);
      const article = await repo.getById(new ArticleId('0'));
      expect(article.is(articleZero)).toBe(true);
    });

    it('should throw error if cannot find article', async () => {
      const repo = new WebsqlCachedArticleRepository(db);
      await repo.saveAll([articleZero, articleOne, articleTwo, disclaimer]);
      const promise = repo.getById(new ArticleId('1000'));
      await expect(promise).rejects.toBeInstanceOf(CachedArticleNotFoundError);
    });
  });

  describe('getAll', () => {
    it('should get all articles', async () => {
      const repo = new WebsqlCachedArticleRepository(db);
      await repo.saveAll([articleZero, articleOne, articleTwo, disclaimer]);
      const articles = await repo.getAll();
      expect(articles).toHaveLength(4);
    });
  });
});
