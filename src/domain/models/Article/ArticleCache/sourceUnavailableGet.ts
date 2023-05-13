import { SourceUnavailableCacheEmptyError } from '@/domain/models/Article/ArticleCache/SourceUnavailableCacheEmptyError';
import type { CachedArticleRepository } from '@/domain/models/Article/ports/CachedArticleRepository';

type Getter<T> = () => Promise<T>;

async function sourceUnavailableGet<T>(
  cacheRepository: CachedArticleRepository,
  cacheGetter: Getter<T>
) {
  if (await cacheRepository.isEmpty())
    throw new SourceUnavailableCacheEmptyError();
  return cacheGetter();
}

export { sourceUnavailableGet };
