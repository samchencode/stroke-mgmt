import { Tag } from '@/domain/models/Tag';
import { WebsqlCachedTagRepository } from '@/infrastructure/persistence/websql/WebsqlCachedTagRepository';
import {
  executeSql,
  resultSetToArray,
  sqlStr,
} from '@/infrastructure/persistence/websql/helpers';
import { openDatabase } from '@/vendor/websql';

describe('WebsqlCachedTagRepository', () => {
  let db: Database;

  beforeEach(() => {
    db = openDatabase(':memory:', '', '', 1000);
  });

  describe('Instantiation', () => {
    it('should be created with a db', () => {
      const create = () => new WebsqlCachedTagRepository(db);
      expect(create).not.toThrow();
    });

    it('should create a new table for tags upon instantiation if none exist', async () => {
      const repo = new WebsqlCachedTagRepository(db);
      await repo.ready;
      const query = sqlStr`
      SELECT name FROM sqlite_schema 
      WHERE type IN ('table','view') 
      AND name NOT LIKE 'sqlite_%'
      ORDER BY 1`;
      const [resultSet] = await executeSql(db, [query]);
      const results = resultSetToArray<{ name: string }>(resultSet);
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('tags');
    });
  });

  describe('#saveAll', () => {
    it('should save all tags provided', async () => {
      const tag0 = new Tag('Tag0', new Date(0));
      const tag1 = new Tag('Tag1', new Date(0));

      const repo = new WebsqlCachedTagRepository(db);
      await repo.saveAll([tag0, tag1]);

      const query = sqlStr`SELECT name FROM tags`;
      const [resultSet] = await executeSql(db, [query]);
      const results = resultSetToArray<{ name: string }>(resultSet);

      expect(results).toHaveLength(2);
      expect(results).toEqual(
        expect.arrayContaining([{ name: 'Tag0' }, { name: 'Tag1' }])
      );
    });
  });

  describe('#update', () => {
    it('should update given tag of the same name in the database', async () => {
      const createQuery = sqlStr`
      CREATE TABLE tags (
        name TEXT PRIMARY KEY,
        lastUpdatedTimestamp INTEGER,
        description TEXT
      )`;

      const insertQuery = sqlStr`INSERT INTO tags VALUES ('MyTag', 0, 'Ye old description')`;

      await executeSql(db, [createQuery, insertQuery]);

      const updatedTag = new Tag('MyTag', new Date(10), 'New description');

      const repo = new WebsqlCachedTagRepository(db);
      await repo.update(updatedTag);

      const selectQuery = sqlStr`SELECT * FROM tags`;
      const [resultSet] = await executeSql(db, [selectQuery]);
      const rows = resultSetToArray<{
        name: string;
        lastUpdatedTimestamp: number;
        description: string;
      }>(resultSet);

      expect(rows).toHaveLength(1);
      expect(rows[0].name).toBe('MyTag');
      expect(rows[0].lastUpdatedTimestamp).toBe(10);
      expect(rows[0].description).toBe('New description');
    });
  });

  describe('#delete', () => {
    it('should delete a given tag by its name', async () => {
      const createQuery = sqlStr`
      CREATE TABLE tags (
        name TEXT PRIMARY KEY,
        lastUpdatedTimestamp INTEGER,
        description TEXT
      )`;

      const insertQuery = sqlStr`
      INSERT INTO tags VALUES 
        ('MyTag0', 0, 'My description0'),
        ('MyTag1', 0, 'My description1')`;

      await executeSql(db, [createQuery, insertQuery]);

      const repo = new WebsqlCachedTagRepository(db);
      await repo.delete('MyTag0');

      const query = sqlStr`SELECT name FROM tags`;
      const [resultSet] = await executeSql(db, [query]);
      const rows = await resultSetToArray<{ name: string }>(resultSet);
      expect(rows).toHaveLength(1);
      expect(rows[0].name).toBe('MyTag1');
    });
  });

  describe('#clearCache', () => {
    it('should delete all tags', async () => {
      const createQuery = sqlStr`
      CREATE TABLE tags (
        name TEXT PRIMARY KEY,
        lastUpdatedTimestamp INTEGER,
        description TEXT
      )`;

      const insertQuery = sqlStr`
      INSERT INTO tags VALUES 
        ('MyTag0', 0, 'My description0'),
        ('MyTag1', 0, 'My description1')`;

      await executeSql(db, [createQuery, insertQuery]);

      const repo = new WebsqlCachedTagRepository(db);
      await repo.clearCache();

      const query = sqlStr`SELECT name FROM tags`;
      const [resultSet] = await executeSql(db, [query]);
      expect(resultSet.rows).toHaveLength(0);
    });
  });

  describe('#getAll', () => {
    it('should get all tags', async () => {
      const createQuery = sqlStr`
      CREATE TABLE tags (
        name TEXT PRIMARY KEY,
        lastUpdatedTimestamp INTEGER,
        description TEXT
      )`;

      const insertQuery = sqlStr`
      INSERT INTO tags VALUES 
        ('MyTag0', 0, 'My description0'),
        ('MyTag1', 0, 'My description1')`;

      await executeSql(db, [createQuery, insertQuery]);

      const repo = new WebsqlCachedTagRepository(db);
      const results = await repo.getAll();

      expect(results).toHaveLength(2);
      expect(results[0].getName()).toBe('MyTag0');
      expect(results[1].getName()).toBe('MyTag1');
    });
  });

  describe('#isAvailable', () => {
    it('should be available', async () => {
      const repo = new WebsqlCachedTagRepository(db);
      const result = await repo.isAvailable();
      expect(result).toBe(true);
    });
  });
});
