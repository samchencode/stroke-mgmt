import type {
  Article,
  ArticleId,
  CachedArticleRepository,
} from '@/domain/models/Article';
import type { ImageCache } from '@/domain/models/Image';

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

async function createArticles(
  imageCache: ImageCache,
  cacheRepository: CachedArticleRepository,
  articles: Article[]
) {
  const savePromise = cacheRepository.saveAll(articles);
  const saveImagePromises = articles.map((a) => {
    const uri = a.getThumbnail().getUri();
    if (!uri.match(/^https?:\/\//)) return Promise.resolve();
    return imageCache.saveImageIfNotExists(uri);
  });
  return Promise.allSettled([savePromise, ...saveImagePromises]);
}

async function updateArticles(
  imageCache: ImageCache,
  cacheRepository: CachedArticleRepository,
  articles: Article[]
) {
  const updatePromises = articles.map((v) => cacheRepository.update(v));
  const saveImagePromises = articles.map((a) => {
    const uri = a.getThumbnail().getUri();
    if (!uri.match(/^https?:\/\//)) return Promise.resolve();
    return imageCache.saveImageIfNotExists(uri);
  });
  return Promise.allSettled(updatePromises.concat(saveImagePromises));
}

async function deleteArticles(
  cacheRepository: CachedArticleRepository,
  ids: ArticleId[]
) {
  const promises = ids.map((v) => cacheRepository.delete(v));
  return Promise.allSettled(promises);
}

export async function updateCache(
  imageCache: ImageCache,
  cacheRepository: CachedArticleRepository,
  sourceResult: Article[],
  cacheResult: Article[]
) {
  const diffResult = diff(sourceResult, cacheResult);
  const createPromise = createArticles(
    imageCache,
    cacheRepository,
    diffResult.articlesToCreate
  );
  const updatePromise = updateArticles(
    imageCache,
    cacheRepository,
    diffResult.articlesToUpdate
  );
  const deletePromise = deleteArticles(cacheRepository, diffResult.idsToDelete);
  const promises = [createPromise, updatePromise, deletePromise];
  await Promise.allSettled(promises);
}
