import type { CachedArticleRepository } from '@/domain/models/Article/ports/CachedArticleRepository';
import { updateCache } from '@/domain/models/Article/ArticleCache/updateCache';
import type { Article } from '@/domain/models/Article/Article';
import { ArticleNotFoundError } from '@/domain/models/Article/ports/ArticleRepository';
import { NullArticle } from '@/domain/models/Article/NullArticle';

type SingleGetter = () => Promise<Article>;
type SingleCallback = (res: Article) => void;
type Getter = () => Promise<Article[]>;
type Callback = (res: Article[]) => void;

async function retryUntilSuccess(
  getter: Getter,
  maxRetries = 3
): Promise<Article[]> {
  try {
    const result = await getter();
    return result;
  } catch (e) {
    if (e instanceof ArticleNotFoundError) throw e;
    if (maxRetries !== 0) return retryUntilSuccess(getter, maxRetries - 1);
    throw e;
  }
}

function isStale(sourceResult: Article[], cacheResult: Article[]): boolean {
  // check to make sure the number of results are the same
  if (sourceResult.length !== cacheResult.length) return true;

  // look for deleted or newly created articles
  const sourceArticleIds = new Set(
    sourceResult.map((r) => r.getId().toString())
  );
  const cacheArticleIds = new Set(cacheResult.map((r) => r.getId().toString()));
  const inSourceNotCache = [...sourceArticleIds.values()].find(
    (id) => !cacheArticleIds.has(id)
  );
  const inCacheNotSource = [...cacheArticleIds.values()].find(
    (id) => !sourceArticleIds.has(id)
  );
  if (inSourceNotCache !== undefined || inCacheNotSource !== undefined)
    return true;

  // look for cached articles that are older than lastUpdated date.
  type ResultsById = {
    [key: string]: {
      sourceResult: Article | null;
      cacheResult: Article | null;
    };
  };
  // 1. group by id into an object keyed by id, values are {source, cache}
  let resultsById = sourceResult.reduce((ag, v) => {
    const key = v.getId().toString();
    // eslint-disable-next-line no-param-reassign
    ag[key] = { sourceResult: v, cacheResult: null };
    return ag;
  }, {} as ResultsById);
  resultsById = cacheResult.reduce((ag, v) => {
    const key = v.getId().toString();
    const s = ag[key]?.sourceResult ?? null;
    // eslint-disable-next-line no-param-reassign
    ag[key] = { sourceResult: s, cacheResult: v };
    return ag;
  }, resultsById);
  // 2. for all object.values() find at least one that source.date > cache.date
  const staleArticle = Object.values(resultsById).find(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (v) => v.sourceResult!.getLastUpdated() > v.cacheResult!.getLastUpdated()
  );
  if (staleArticle !== undefined) return true;
  return false;
}

async function updateCacheAndRunCallbackIfStale(
  cacheRepository: CachedArticleRepository,
  sourcePromise: Promise<Article[]>,
  cachePromise: Promise<Article[]>,
  onStaleCallback: Callback
) {
  const cacheResult = await cachePromise;
  let sourceResult: Article[] | null = null;
  try {
    sourceResult = await sourcePromise;
  } catch (e) {
    if (!(e instanceof ArticleNotFoundError)) throw e;
  }
  if (sourceResult === null) {
    await updateCache(cacheRepository, [], cacheResult);
    onStaleCallback([new NullArticle()]);
    return;
  }
  if (!isStale(sourceResult, cacheResult)) return;
  onStaleCallback(sourceResult);
  await updateCache(cacheRepository, sourceResult, cacheResult);
}

async function sourceAvailableGetMultiple(
  cacheRepository: CachedArticleRepository,
  sourceGetter: Getter,
  cacheGetter: Getter,
  onStaleCallback: Callback
): Promise<Article[]> {
  let cacheIsEmpty;
  try {
    cacheIsEmpty = await cacheRepository.isEmpty();
  } catch {
    cacheIsEmpty = true;
  }

  const cachePromise = cacheGetter();
  const sourcePromise = retryUntilSuccess(sourceGetter);
  if (cacheIsEmpty) {
    const sourceResult = await sourcePromise;
    updateCache(cacheRepository, sourceResult, []);
    return sourceResult;
  }

  try {
    const cacheResult = await cachePromise;
    updateCacheAndRunCallbackIfStale(
      cacheRepository,
      sourcePromise,
      cachePromise,
      onStaleCallback
    );
    return cacheResult;
  } catch {
    return sourcePromise;
  }
}

async function sourceAvailableGetSingle(
  cacheRepository: CachedArticleRepository,
  sourceGetter: SingleGetter,
  cacheGetter: SingleGetter,
  onStaleCallback: SingleCallback
): Promise<Article> {
  const [result] = await sourceAvailableGetMultiple(
    cacheRepository,
    () => sourceGetter().then((r) => [r]),
    () => cacheGetter().then((r) => [r]),
    ([r]) => onStaleCallback(r)
  );
  return result;
}

export { sourceAvailableGetMultiple, sourceAvailableGetSingle };
