import type {
  Algorithm,
  AlgorithmId,
  AlgorithmVisitor,
  CachedAlgorithmRepository,
} from '@/domain/models/Algorithm';
import type { MutatingQueryFactory } from '@/infrastructure/persistence/websql/WebsqlCachedAlgorithmRepository/MutatingQueryFactory';
import { ScoredAlgorithmMutatingQueryFactory } from '@/infrastructure/persistence/websql/WebsqlCachedAlgorithmRepository/ScoredAlgorithmMutatingQueryFactory';
import { TextAlgorithmMutatingQueryFactory } from '@/infrastructure/persistence/websql/WebsqlCachedAlgorithmRepository/TextAlgorithmMutatingQueryFactory';
import { cachedAlgorithmRowToAlgorithm } from '@/infrastructure/persistence/websql/WebsqlCachedAlgorithmRepository/cachedAlgorithmRowToAlgorithm';
import type { CachedAlgorithmRow } from '@/infrastructure/persistence/websql/WebsqlCachedAlgorithmRepository/tableSchema';
import type { WebsqlDatabase } from '@/infrastructure/persistence/websql/WebsqlDatabase';
import {
  executeSql,
  resultSetToArray,
  sqlStr,
} from '@/infrastructure/persistence/websql/helpers';

class WebsqlCachedAlgorithmRepostiory implements CachedAlgorithmRepository {
  ready: Promise<void>;

  constructor(private readonly websqlDatabase: WebsqlDatabase) {
    this.ready = this.prepareDatabase();
    this.getMutatingQueryFactory = this.getMutatingQueryFactory.bind(this);
  }

  static $inject = ['websqlDatabase'];

  private async prepareDatabase() {
    const query = sqlStr`
    CREATE TABLE IF NOT EXISTS algorithms (
      id TEXT PRIMARY KEY,
      title TEXT,
      summary TEXT,
      body TEXT,
      thumbnailUri TEXT,
      outcomesJson TEXT,
      shouldShowOnHomeScreen INTEGER,
      lastUpdatedTimestamp INTEGER,
      switchesJson TEXT,
      type TEXT,
      citationsJson TEXT
    )`;
    await executeSql(this.websqlDatabase, [query]);
  }

  private getMutatingQueryFactory(algorithm: Algorithm) {
    let factory: MutatingQueryFactory | undefined;
    const visitor = {
      visitTextAlgorithm(algo) {
        factory = new TextAlgorithmMutatingQueryFactory(algo);
      },
      visitScoredAlgorithm(algo) {
        factory = new ScoredAlgorithmMutatingQueryFactory(algo);
      },
    } satisfies AlgorithmVisitor;
    algorithm.acceptVisitor(visitor);
    if (!factory)
      throw Error(
        `Algorithm (type=${algorithm.type}) was not visited by when creating query factory`
      );
    return factory;
  }

  async isEmpty(): Promise<boolean> {
    await this.ready;
    const query = sqlStr`SELECT count(*) AS c FROM algorithms`;
    const [resultSet] = await executeSql(this.websqlDatabase, [query]);
    const [result] = resultSetToArray<{ c: number }>(resultSet);
    return result.c === 0;
  }

  async saveAll(as: Algorithm[]): Promise<void> {
    await this.ready;
    const factories = as.map(this.getMutatingQueryFactory);
    const queries = factories.map((f) => f.makeSaveQuery());
    await executeSql(this.websqlDatabase, queries);
  }

  async update(a: Algorithm): Promise<void> {
    await this.ready;
    const factory = this.getMutatingQueryFactory(a);
    const query = factory.makeUpdateQuery();
    await executeSql(this.websqlDatabase, [query]);
  }

  async delete(a: AlgorithmId): Promise<void> {
    await this.ready;
    const query = sqlStr`DELETE FROM algorithms WHERE id = ${a.toString()}`;
    await executeSql(this.websqlDatabase, [query]);
  }

  async clearCache(): Promise<void> {
    await this.ready;
    const query = sqlStr`DROP TABLE algorithms`;
    await executeSql(this.websqlDatabase, [query]);
    this.ready = this.prepareDatabase();
  }

  async getAll(): Promise<Algorithm[]> {
    await this.ready;
    const query = sqlStr`
    SELECT
      id,
      title,
      summary,
      body,
      thumbnailUri,
      outcomesJson,
      shouldShowOnHomeScreen,
      lastUpdatedTimestamp,
      switchesJson,
      type,
      citationsJson
    FROM algorithms`;
    const [resultSet] = await executeSql(this.websqlDatabase, [query]);
    const rows = resultSetToArray<CachedAlgorithmRow>(resultSet);
    return rows.map(cachedAlgorithmRowToAlgorithm);
  }

  async getById(id: AlgorithmId): Promise<Algorithm> {
    await this.ready;
    const query = sqlStr`
    SELECT
      id,
      title,
      summary,
      body,
      thumbnailUri,
      outcomesJson,
      shouldShowOnHomeScreen,
      lastUpdatedTimestamp,
      switchesJson,
      type,
      citationsJson
    FROM algorithms
    WHERE id = ${id.toString()}`;
    const [resultSet] = await executeSql(this.websqlDatabase, [query]);
    const [row] = resultSetToArray<CachedAlgorithmRow>(resultSet);
    return cachedAlgorithmRowToAlgorithm(row);
  }

  async getAllShownOnHomeScreen(): Promise<Algorithm[]> {
    await this.ready;
    const query = sqlStr`
    SELECT
      id,
      title,
      summary,
      body,
      thumbnailUri,
      outcomesJson,
      shouldShowOnHomeScreen,
      lastUpdatedTimestamp,
      switchesJson,
      type,
      citationsJson
    FROM algorithms
    WHERE shouldShowOnHomeScreen`;
    const [resultSet] = await executeSql(this.websqlDatabase, [query]);
    const rows = resultSetToArray<CachedAlgorithmRow>(resultSet);
    return rows.map(cachedAlgorithmRowToAlgorithm);
  }

  async isAvailable(): Promise<boolean> {
    await this.ready;
    return true;
  }
}

export { WebsqlCachedAlgorithmRepostiory };
