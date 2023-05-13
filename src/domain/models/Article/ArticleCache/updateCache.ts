import type { Article } from '@/domain/models/Article/Article';
import type { ArticleId } from '@/domain/models/Article/ArticleId';
import type { CachedArticleRepository } from '@/domain/models/Article/ports/CachedArticleRepository';

type DiffResult = {
  articlesToCreate: Article[];
  articlesToUpdate: Article[];
  idsToDelete: ArticleId[];
};

function shouldCreate(v: {
  source: Article | null;
  cache: Article | null;
}): v is { source: Article; cache: null } {
  return v.source !== null && v.cache === null;
}

function shouldDelete(v: {
  source: Article | null;
  cache: Article | null;
}): v is { source: null; cache: Article } {
  return v.source === null && v.cache !== null;
}

function areMatched(v: {
  source: Article | null;
  cache: Article | null;
}): v is { source: Article; cache: Article } {
  return v.source !== null && v.cache !== null;
}

function diff(sourceArticles: Article[], cacheArticles: Article[]): DiffResult {
  type ResultsById = {
    [key: string]: {
      source: Article | null;
      cache: Article | null;
    };
  };
  let resultsById = sourceArticles.reduce((ag, v) => {
    const key = v.getId().toString();
    // eslint-disable-next-line no-param-reassign
    ag[key] = { source: v, cache: null };
    return ag;
  }, {} as ResultsById);
  resultsById = cacheArticles.reduce((ag, v) => {
    const key = v.getId().toString();
    const s = ag[key]?.source ?? null;
    // eslint-disable-next-line no-param-reassign
    ag[key] = { source: s, cache: v };
    return ag;
  }, resultsById);

  const articles = Object.values(resultsById);
  const idsToDelete = articles.filter(shouldDelete).map((v) => v.cache.getId());
  const articlesToCreate = articles.filter(shouldCreate).map((v) => v.source);
  const articlesToUpdate = articles
    .filter(areMatched)
    .filter((v) => v.source.getLastUpdated() > v.cache.getLastUpdated())
    .map((v) => v.source);

  return { idsToDelete, articlesToCreate, articlesToUpdate };
}

export async function updateCache(
  cacheRepository: CachedArticleRepository,
  sourceResult: Article[],
  cacheResult: Article[]
) {
  const diffResult = diff(sourceResult, cacheResult);
  const createPromise = cacheRepository.saveAll(diffResult.articlesToCreate);
  const updatePromises = diffResult.articlesToUpdate.map((v) =>
    cacheRepository.update(v)
  );
  const deletePromises = diffResult.idsToDelete.map((v) =>
    cacheRepository.delete(v)
  );
  const promises = [createPromise, ...updatePromises, ...deletePromises];
  await Promise.allSettled(promises);
}
