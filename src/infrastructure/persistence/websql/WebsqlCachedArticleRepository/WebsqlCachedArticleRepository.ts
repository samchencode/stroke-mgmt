import type {
  Article,
  ArticleId,
  BaseDesignation,
  CachedArticleRepository,
} from '@/domain/models/Article';
import { CachedArticleNotFoundError } from '@/domain/models/Article';
import { cachedArticleRowToArticle } from '@/infrastructure/persistence/websql/WebsqlCachedArticleRepository/cachedArticleRowToArticle';
import type { CachedArticleRow } from '@/infrastructure/persistence/websql/WebsqlCachedArticleRepository/tableSchema';
import type { WebsqlDatabase } from '@/infrastructure/persistence/websql/WebsqlDatabase';
import {
  executeSql,
  resultSetToArray,
  sqlStr,
} from '@/infrastructure/persistence/websql/helpers';

class WebsqlCachedArticleRepository implements CachedArticleRepository {
  ready: Promise<void>;

  constructor(private readonly websqlDatabase: WebsqlDatabase) {
    this.ready = this.prepareDatabase();
  }

  static $inject = ['websqlDatabase'];

  private async prepareDatabase() {
    const createQuery = sqlStr`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      html TEXT NOT NULL,
      summary TEXT,
      designation TEXT NOT NULL,
      thumbnailUri TEXT NOT NULL,
      tagsJson TEXT NOT NULL,
      citationsJson TEXT NOT NULL,
      lastUpdatedTimestamp INTEGER NOT NULL,
      shouldShowOnHomeScreen INTEGER NOT NULL
    )`;
    await executeSql(this.websqlDatabase, [createQuery]);
  }

  async isEmpty(): Promise<boolean> {
    await this.ready;
    const query = sqlStr`SELECT count(*) AS c FROM articles`;
    const [resultSet] = await executeSql(this.websqlDatabase, [query]);
    const [result] = resultSetToArray<{ c: number }>(resultSet);
    return result.c === 0;
  }

  async saveAll(articles: Article[]): Promise<void> {
    await this.ready;
    const queries = articles.map(
      (a) => sqlStr`
      INSERT INTO articles (
        id,
        title,
        html,
        summary,
        designation,
        thumbnailUri,
        tagsJson,
        citationsJson,
        lastUpdatedTimestamp,
        shouldShowOnHomeScreen
      ) VALUES (
        ${a.getId().toString()},
        ${a.getTitle().toString()},
        ${a.getHtml()},
        ${a.getSummaryOrNull()},
        ${a.getDesignation().toString()},
        ${a.getThumbnail().getUri()},
        ${JSON.stringify(a.getTags())},
        ${JSON.stringify(a.getCitations())},
        ${a.getLastUpdated().getTime()},
        ${a.getshouldShowOnHomeScreen() ? 1 : 0}
      )`
    );
    await executeSql(this.websqlDatabase, queries);
  }

  async update(a: Article): Promise<void> {
    await this.ready;
    const query = sqlStr`
    UPDATE articles SET
      title = ${a.getTitle().toString()},
      html = ${a.getHtml()},
      summary = ${a.getSummaryOrNull()},
      designation = ${a.getDesignation().toString()},
      thumbnailUri = ${a.getThumbnail().getUri()},
      tagsJson = ${JSON.stringify(a.getTags())},
      citationsJson = ${JSON.stringify(a.getCitations())},
      lastUpdatedTimestamp = ${a.getLastUpdated().getTime()},
      shouldShowOnHomeScreen = ${a.getshouldShowOnHomeScreen() ? 1 : 0}
    WHERE id = ${a.getId().toString()}`;

    await executeSql(this.websqlDatabase, [query]);
  }

  async delete(a: ArticleId): Promise<void> {
    await this.ready;
    const query = sqlStr`DELETE FROM articles WHERE id = ${a
      .getId()
      .toString()}`;
    await executeSql(this.websqlDatabase, [query]);
  }

  async clearCache(): Promise<void> {
    await this.ready;
    const query = sqlStr`DELETE FROM articles`;
    await executeSql(this.websqlDatabase, [query]);
  }

  async getByDesignation(d: BaseDesignation): Promise<Article[]> {
    await this.ready;
    const query = sqlStr`SELECT * FROM articles WHERE designation = ${d.toString()}`;
    const [resultSet] = await executeSql(this.websqlDatabase, [query]);
    const rows = resultSetToArray<CachedArticleRow>(resultSet);
    return rows.map(cachedArticleRowToArticle);
  }

  async getById(id: ArticleId): Promise<Article> {
    await this.ready;
    const query = sqlStr`SELECT * FROM articles WHERE id = ${id.toString()}`;
    const [resultSet] = await executeSql(this.websqlDatabase, [query]);
    if (resultSet.rows.length === 0) throw new CachedArticleNotFoundError(id);
    const [row] = resultSetToArray<CachedArticleRow>(resultSet);
    return cachedArticleRowToArticle(row);
  }

  async getAll(): Promise<Article[]> {
    await this.ready;
    const query = sqlStr`SELECT * FROM articles`;
    const [resultSet] = await executeSql(this.websqlDatabase, [query]);
    const rows = resultSetToArray<CachedArticleRow>(resultSet);
    return rows.map(cachedArticleRowToArticle);
  }

  async isAvailable(): Promise<boolean> {
    await this.ready;
    return true;
  }
}

export { WebsqlCachedArticleRepository };
