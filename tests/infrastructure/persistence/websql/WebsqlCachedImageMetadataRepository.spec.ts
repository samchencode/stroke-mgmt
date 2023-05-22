import { CachedImageMetadata } from '@/domain/models/Image';
import { WebsqlCachedImageMetadataRepository } from '@/infrastructure/persistence/websql/WebsqlCachedImageMetadataRepository';
import {
  executeSql,
  resultSetToArray,
  sqlStr,
} from '@/infrastructure/persistence/websql/helpers';
import { openDatabase } from '@/vendor/websql';

describe('WebsqlCachedImageMetadataRepository', () => {
  let db: Database;

  beforeEach(() => {
    db = openDatabase(':memory:', '0.0', '', 10);
  });

  describe('Instantiation', () => {
    it('should be created with a websql database', async () => {
      const create = () => new WebsqlCachedImageMetadataRepository(db);
      expect(create).not.toThrow();
    });

    it('should create a table on instantiation', async () => {
      const repo = new WebsqlCachedImageMetadataRepository(db);
      await repo.ready;
      const query = sqlStr`
      SELECT name FROM sqlite_schema 
      WHERE type IN ('table','view') 
      AND name NOT LIKE 'sqlite_%'
      ORDER BY 1`;
      const [resultSet] = await executeSql(db, [query]);
      const results = resultSetToArray<{ name: string }>(resultSet);
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('cachedImageMetadata');
    });
  });

  describe('#get', () => {
    it('should get appropriate image metadata by sourceUrl', async () => {
      const createQuery = sqlStr`
      CREATE TABLE IF NOT EXISTS cachedImageMetadata (
        sourceUrl TEXT PRIMARY KEY,
        filePath TEXT,
        mimeType TEXT
      )`;

      const insertQuery1 = sqlStr`
      insert into cachedImageMetadata (sourceUrl, filePath, mimeType) values ('https://wordpress.com/sagittis/dui/vel/nisl/duis/ac.html', 'In.ppt', 'application/mspowerpoint');
      `;
      const insertQuery2 = sqlStr`
      insert into cachedImageMetadata (sourceUrl, filePath, mimeType) values ('https://foxnews.com/adipiscing/lorem/vitae/mattis/nibh/ligula/nec.json', 'BlanditNamNulla.ppt', 'application/powerpoint');
      `;
      const insertQuery3 = sqlStr`
      insert into cachedImageMetadata (sourceUrl, filePath, mimeType) values ('http://weibo.com/tincidunt.jsp', 'EgetOrci.jpeg', 'image/pjpeg');
      `;
      const insertQuery4 = sqlStr`
      insert into cachedImageMetadata (sourceUrl, filePath, mimeType) values ('https://dedecms.com/ligula/vehicula/consequat/morbi/a/ipsum/integer.js', 'EstCongueElementum.xls', 'application/x-msexcel');
      `;
      const insertQuery5 = sqlStr`
      insert into cachedImageMetadata (sourceUrl, filePath, mimeType) values ('https://uiuc.edu/mauris/lacinia/sapien/quis/libero/nullam/sit.jsp', 'SitAmet.pdf', 'application/pdf');
      `;

      await executeSql(db, [
        createQuery,
        insertQuery1,
        insertQuery2,
        insertQuery3,
        insertQuery4,
        insertQuery5,
      ]);

      const repo = new WebsqlCachedImageMetadataRepository(db);
      await repo.ready;

      const result = await repo.get(
        'https://uiuc.edu/mauris/lacinia/sapien/quis/libero/nullam/sit.jsp'
      );
      expect(result).toBeDefined();
      expect(result?.getFilePath()).toBe('SitAmet.pdf');
      expect(result?.getMimeType()).toBe('application/pdf');
    });
  });

  describe('#save', () => {
    it('should save new image metadata', async () => {
      const metadata = new CachedImageMetadata(
        'https://wordpress.com/vvvvvv.png',
        'file://cachedir/vvvvvv.png',
        'image/png'
      );

      const repo = new WebsqlCachedImageMetadataRepository(db);

      await repo.save(metadata);

      const query = sqlStr`SELECT sourceUrl, filePath, mimeType FROM cachedImageMetadata WHERE sourceUrl = 'https://wordpress.com/vvvvvv.png'`;

      const [resultSet] = await executeSql(db, [query]);
      expect(resultSet.rows).toHaveLength(1);
    });

    it('should update image metadata if sourceUrl already exists', async () => {
      const metadataOld = new CachedImageMetadata(
        'https://wordpress.com/vvvvvv.png',
        'file://cachedir/vvvvvv.png',
        'image/png'
      );
      const metadataNew = new CachedImageMetadata(
        'https://wordpress.com/vvvvvv.png',
        'file://cachedir/yyy.png',
        'image/png'
      );

      const repo = new WebsqlCachedImageMetadataRepository(db);

      await repo.save(metadataOld);
      await repo.save(metadataNew);

      const query = sqlStr`SELECT sourceUrl, filePath, mimeType FROM cachedImageMetadata WHERE sourceUrl = 'https://wordpress.com/vvvvvv.png'`;

      const [resultSet] = await executeSql(db, [query]);
      expect(resultSet.rows).toHaveLength(1);
      expect(resultSet.rows.item(0).filePath).toBe('file://cachedir/yyy.png');
    });
  });

  describe('#clearCache', () => {
    it('should remove all data', async () => {
      const createQuery = sqlStr`
      CREATE TABLE IF NOT EXISTS cachedImageMetadata (
        sourceUrl TEXT PRIMARY KEY,
        filePath TEXT,
        mimeType TEXT
      )`;

      const insertQuery1 = sqlStr`
      insert into cachedImageMetadata (sourceUrl, filePath, mimeType) values ('https://wordpress.com/sagittis/dui/vel/nisl/duis/ac.html', 'In.ppt', 'application/mspowerpoint');
      `;
      const insertQuery2 = sqlStr`
      insert into cachedImageMetadata (sourceUrl, filePath, mimeType) values ('https://foxnews.com/adipiscing/lorem/vitae/mattis/nibh/ligula/nec.json', 'BlanditNamNulla.ppt', 'application/powerpoint');
      `;
      const insertQuery3 = sqlStr`
      insert into cachedImageMetadata (sourceUrl, filePath, mimeType) values ('http://weibo.com/tincidunt.jsp', 'EgetOrci.jpeg', 'image/pjpeg');
      `;
      const insertQuery4 = sqlStr`
      insert into cachedImageMetadata (sourceUrl, filePath, mimeType) values ('https://dedecms.com/ligula/vehicula/consequat/morbi/a/ipsum/integer.js', 'EstCongueElementum.xls', 'application/x-msexcel');
      `;
      const insertQuery5 = sqlStr`
      insert into cachedImageMetadata (sourceUrl, filePath, mimeType) values ('https://uiuc.edu/mauris/lacinia/sapien/quis/libero/nullam/sit.jsp', 'SitAmet.pdf', 'application/pdf');
      `;

      await executeSql(db, [
        createQuery,
        insertQuery1,
        insertQuery2,
        insertQuery3,
        insertQuery4,
        insertQuery5,
      ]);

      const repo = new WebsqlCachedImageMetadataRepository(db);

      await repo.clearCache();

      const query = sqlStr`SELECT * FROM cachedImageMetadata`;

      const [resultSet] = await executeSql(db, [query]);
      expect(resultSet.rows).toHaveLength(0);
    });
  });
});
