import type { CachedTagRepository } from '@/domain/models/Tag';
import { Tag } from '@/domain/models/Tag';
import type { CachedTagRow } from '@/infrastructure/persistence/websql/WebsqlCachedTagRepository/tableSchema';
import type { WebsqlDatabase } from '@/infrastructure/persistence/websql/WebsqlDatabase';
import {
  executeSql,
  resultSetToArray,
  sqlStr,
} from '@/infrastructure/persistence/websql/helpers';

class WebsqlCachedTagRepository implements CachedTagRepository {
  ready: Promise<void>;

  constructor(private readonly websqlDatabase: WebsqlDatabase) {
    this.ready = this.prepareDatabase();
  }

  static $inject = ['websqlDatabase'];

  async prepareDatabase() {
    const query = sqlStr`
    CREATE TABLE IF NOT EXISTS tags (
      name TEXT PRIMARY KEY,
      lastUpdatedTimestamp INTEGER,
      description TEXT
    )`;

    await executeSql(this.websqlDatabase, [query]);
  }

  async saveAll(tags: Tag[]): Promise<void> {
    await this.ready;
    const queries = tags.map(
      (t) => sqlStr`
      INSERT INTO tags (name, lastUpdatedTimestamp, description)
      VALUES (
        ${t.getName()},
        ${t.getLastUpdated().getTime()},
        ${t.getDescription()}
      )`
    );
    await executeSql(this.websqlDatabase, queries);
  }

  async update(tag: Tag): Promise<void> {
    await this.ready;
    const query = sqlStr`
      UPDATE tags
      SET
        lastUpdatedTimestamp = ${tag.getLastUpdated().getTime()},
        description = ${tag.getDescription()}
      WHERE name = ${tag.getName()}`;

    await executeSql(this.websqlDatabase, [query]);
  }

  async delete(tagName: string): Promise<void> {
    await this.ready;
    const query = sqlStr`DELETE FROM tags WHERE name = ${tagName}`;
    await executeSql(this.websqlDatabase, [query]);
  }

  async clearCache(): Promise<void> {
    await this.ready;
    const query = sqlStr`DELETE FROM tags`;
    await executeSql(this.websqlDatabase, [query]);
  }

  async getAll(): Promise<Tag[]> {
    await this.ready;
    const query = sqlStr`
    SELECT
      name, 
      lastUpdatedTimestamp,
      description
    FROM tags`;
    const [resultSet] = await executeSql(this.websqlDatabase, [query]);
    const rows = resultSetToArray<CachedTagRow>(resultSet);
    return rows.map(
      (r) => new Tag(r.name, new Date(r.lastUpdatedTimestamp), r.description)
    );
  }

  async isAvailable(): Promise<boolean> {
    await this.ready;
    return true;
  }
}

export { WebsqlCachedTagRepository };
