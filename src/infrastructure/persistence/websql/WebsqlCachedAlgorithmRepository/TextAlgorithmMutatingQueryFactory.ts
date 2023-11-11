import type { TextAlgorithm } from '@/domain/models/Algorithm';
import type { MutatingQueryFactory } from '@/infrastructure/persistence/websql/WebsqlCachedAlgorithmRepository/MutatingQueryFactory';
import { serializeOutcomes } from '@/infrastructure/persistence/websql/WebsqlCachedAlgorithmRepository/serializeOutcomes';
import type { Query } from '@/infrastructure/persistence/websql/helpers';
import { sqlStr } from '@/infrastructure/persistence/websql/helpers';

class TextAlgorithmMutatingQueryFactory implements MutatingQueryFactory {
  constructor(private readonly algo: TextAlgorithm) {}

  makeSaveQuery() {
    const serializedOutcomes = serializeOutcomes(this.algo.getOutcomes());
    const serializedCitations = JSON.stringify(this.algo.getCitations());
    return sqlStr`
    INSERT INTO algorithms (
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
    ) VALUES (
      ${this.algo.getId().toString()},
      ${this.algo.getTitle()},
      ${this.algo.getSummary()},
      ${this.algo.getBody()},
      ${this.algo.getThumbnail().getUri()},
      ${serializedOutcomes},
      ${this.algo.getShouldShowOnHomeScreen() ? 1 : 0},
      ${this.algo.getLastUpdated().getTime()},
      '[]',
      ${this.algo.type},
      ${serializedCitations}
    )`;
  }

  makeUpdateQuery(): Query {
    const serializedOutcomes = serializeOutcomes(this.algo.getOutcomes());
    const serializedCitations = JSON.stringify(this.algo.getCitations());
    return sqlStr`
    UPDATE algorithms SET
      title = ${this.algo.getTitle()},
      summary = ${this.algo.getSummary()},
      body = ${this.algo.getBody()},
      thumbnailUri = ${this.algo.getThumbnail().getUri()},
      outcomesJson = ${serializedOutcomes},
      shouldShowOnHomeScreen = ${this.algo.getShouldShowOnHomeScreen() ? 1 : 0},
      lastUpdatedTimestamp = ${this.algo.getLastUpdated().getTime()},
      citationsJson = ${serializedCitations}
    WHERE
      id = ${this.algo.getId().toString()} AND
      type = ${this.algo.type}
    `;
  }
}

export { TextAlgorithmMutatingQueryFactory };
