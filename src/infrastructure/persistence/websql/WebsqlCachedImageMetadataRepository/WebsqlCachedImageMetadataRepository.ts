import type { CachedImageMetadataRepository } from '@/domain/models/Image';
import { CachedImageMetadata } from '@/domain/models/Image';
import type { CachedImageMetadataRow } from '@/infrastructure/persistence/websql/WebsqlCachedImageMetadataRepository/tableSchema';
import type { WebsqlDatabase } from '@/infrastructure/persistence/websql/WebsqlDatabase';
import {
  executeSql,
  resultSetToArray,
  sqlStr,
} from '@/infrastructure/persistence/websql/helpers';

class WebsqlCachedImageMetadataRepository
  implements CachedImageMetadataRepository
{
  ready: Promise<void>;

  constructor(private readonly websqlDatabase: WebsqlDatabase) {
    this.ready = this.prepareDatabase();
  }

  private async prepareDatabase() {
    const query = sqlStr`
    CREATE TABLE IF NOT EXISTS cachedImageMetadata (
      sourceUrl TEXT PRIMARY KEY,
      filePath TEXT,
      mimeType TEXT
    )`;
    await executeSql(this.websqlDatabase, [query]);
  }

  async get(url: string): Promise<CachedImageMetadata | null> {
    await this.ready;
    const query = sqlStr`
    SELECT
      sourceUrl,
      filePath,
      mimeType
    FROM cachedImageMetadata
    WHERE sourceUrl = ${url}`;
    const [resultSet] = await executeSql(this.websqlDatabase, [query]);
    const results = resultSetToArray<CachedImageMetadataRow>(resultSet);
    if (results.length === 0) return null;
    const result = results[0];
    return new CachedImageMetadata(
      result.sourceUrl,
      result.filePath,
      result.mimeType
    );
  }

  async save(metadata: CachedImageMetadata): Promise<void> {
    await this.ready;
    if (await this.exists(metadata.getSourceUrl())) {
      return this.update(metadata);
    }
    const query = sqlStr`
      INSERT INTO cachedImageMetadata (sourceUrl, filePath, mimeType)
      VALUES (
        ${metadata.getSourceUrl()},
        ${metadata.getFilePath()},
        ${metadata.getMimeType()}
      )
    `;
    await executeSql(this.websqlDatabase, [query]);
    return undefined;
  }

  async clearCache(): Promise<void> {
    await this.ready;
    const query = sqlStr`DELETE FROM cachedImageMetadata`;
    await executeSql(this.websqlDatabase, [query]);
  }

  private async exists(sourceUrl: string) {
    await this.ready;
    const query = sqlStr`SELECT 1 FROM cachedImageMetadata WHERE sourceUrl = ${sourceUrl}`;
    const [resultSet] = await executeSql(this.websqlDatabase, [query]);
    return resultSet.rows.length !== 0;
  }

  private async update(metadata: CachedImageMetadata): Promise<void> {
    await this.ready;
    const query = sqlStr`
    UPDATE cachedImageMetadata
    SET
      filePath = ${metadata.getFilePath()},
      mimeType = ${metadata.getMimeType()}
    WHERE 
      sourceUrl = ${metadata.getSourceUrl()}
    `;
    await executeSql(this.websqlDatabase, [query]);
  }
}

export { WebsqlCachedImageMetadataRepository };
