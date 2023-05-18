import type { Tag } from '@/domain/models/Tag';
import { SourceUnavailableEmptyCacheResultError } from '@/domain/services/Cache/SourceUnavailableEmptyCacheResultError';
import type { Getter } from '@/domain/services/Cache/Getter';

async function sourceUnavailableGet(cacheGetter: Getter<Tag[]>) {
  const cacheResult = await cacheGetter();
  if (cacheResult.length === 0)
    throw new SourceUnavailableEmptyCacheResultError();
  return cacheResult;
}

export { sourceUnavailableGet };
