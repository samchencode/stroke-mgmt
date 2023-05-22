import type { ScoredAlgorithm } from '@/domain/models/Algorithm';
import type { MutatingQueryFactory } from '@/infrastructure/persistence/websql/WebsqlCachedAlgorithmRepository/MutatingQueryFactory';
import { serializeOutcomes } from '@/infrastructure/persistence/websql/WebsqlCachedAlgorithmRepository/serializeOutcomes';
import { serializeSwitches } from '@/infrastructure/persistence/websql/WebsqlCachedAlgorithmRepository/serializeSwitches';
import type { Query } from '@/infrastructure/persistence/websql/helpers';
import { sqlStr } from '@/infrastructure/persistence/websql/helpers';

class ScoredAlgorithmMutatingQueryFactory implements MutatingQueryFactory {
  constructor(private readonly algo: ScoredAlgorithm) {}

  makeSaveQuery(): Query {
    const serializedOutcomes = serializeOutcomes(this.algo.getOutcomes());
    const serializedSwitches = serializeSwitches(this.algo.getSwitches());
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
      type
    ) VALUES (
      ${this.algo.getId().toString()},
      ${this.algo.getTitle()},
      ${this.algo.getSummary()},
      ${this.algo.getBody()},
      ${this.algo.getThumbnail().getUri()},
      ${serializedOutcomes},
      ${this.algo.getShouldShowOnHomeScreen() ? 1 : 0},
      ${this.algo.getLastUpdated().getTime()},
      ${serializedSwitches},
      ${this.algo.type}
    )`;
  }

  makeUpdateQuery(): Query {
    const serializedOutcomes = serializeOutcomes(this.algo.getOutcomes());
    const serializedSwitches = serializeSwitches(this.algo.getSwitches());
    return sqlStr`
    UPDATE algorithms SET 
      title = ${this.algo.getTitle()},
      summary = ${this.algo.getSummary()},
      body = ${this.algo.getBody()},
      thumbnailUri = ${this.algo.getThumbnail().getUri()},
      outcomesJson = ${serializedOutcomes},
      shouldShowOnHomeScreen = ${this.algo.getShouldShowOnHomeScreen() ? 1 : 0},
      lastUpdatedTimestamp = ${this.algo.getLastUpdated().getTime()},
      switchesJson = ${serializedSwitches}
    WHERE 
      id = ${this.algo.getId().toString()} AND
      type = ${this.algo.type}
    `;
  }
}

export { ScoredAlgorithmMutatingQueryFactory };
