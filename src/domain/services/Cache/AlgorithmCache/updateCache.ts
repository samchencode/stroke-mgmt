import type {
  Algorithm,
  AlgorithmId,
  CachedAlgorithmRepository,
} from '@/domain/models/Algorithm';
import type { ImageCache } from '@/domain/models/Image';

type DiffResult = {
  algorithmsToCreate: Algorithm[];
  algorithmsToUpdate: Algorithm[];
  idsToDelete: AlgorithmId[];
};

function shouldCreate(v: {
  source: Algorithm | null;
  cache: Algorithm | null;
}): v is { source: Algorithm; cache: null } {
  return v.source !== null && v.cache === null;
}

function shouldDelete(v: {
  source: Algorithm | null;
  cache: Algorithm | null;
}): v is { source: null; cache: Algorithm } {
  return v.source === null && v.cache !== null;
}

function areMatched(v: {
  source: Algorithm | null;
  cache: Algorithm | null;
}): v is { source: Algorithm; cache: Algorithm } {
  return v.source !== null && v.cache !== null;
}

function diff(
  sourceAlgorithms: Algorithm[],
  cacheAlgorithms: Algorithm[]
): DiffResult {
  type ResultsById = {
    [key: string]: {
      source: Algorithm | null;
      cache: Algorithm | null;
    };
  };
  let resultsById = sourceAlgorithms.reduce((ag, v) => {
    const key = v.getId().toString();
    // eslint-disable-next-line no-param-reassign
    ag[key] = { source: v, cache: null };
    return ag;
  }, {} as ResultsById);
  resultsById = cacheAlgorithms.reduce((ag, v) => {
    const key = v.getId().toString();
    const s = ag[key]?.source ?? null;
    // eslint-disable-next-line no-param-reassign
    ag[key] = { source: s, cache: v };
    return ag;
  }, resultsById);

  const algorithms = Object.values(resultsById);
  const idsToDelete = algorithms
    .filter(shouldDelete)
    .map((v) => v.cache.getId());
  const algorithmsToCreate = algorithms
    .filter(shouldCreate)
    .map((v) => v.source);
  const algorithmsToUpdate = algorithms
    .filter(areMatched)
    .filter((v) => v.source.getLastUpdated() > v.cache.getLastUpdated())
    .map((v) => v.source);

  return { idsToDelete, algorithmsToCreate, algorithmsToUpdate };
}

async function createAlgorithms(
  imageCache: ImageCache,
  cacheRepository: CachedAlgorithmRepository,
  algorithms: Algorithm[]
) {
  const savePromise = cacheRepository.saveAll(algorithms);
  const saveImagePromises = algorithms.map((a) => {
    const uri = a.getThumbnail().getUri();
    if (!uri.match(/^https?:\/\//)) return Promise.resolve();
    return imageCache.saveImageIfNotExists(uri);
  });
  return Promise.allSettled([savePromise, ...saveImagePromises]);
}

async function updateAlgorithms(
  imageCache: ImageCache,
  cacheRepository: CachedAlgorithmRepository,
  algorithms: Algorithm[]
) {
  const updatePromises = algorithms.map((v) => cacheRepository.update(v));
  const saveImagePromises = algorithms.map((a) => {
    const uri = a.getThumbnail().getUri();
    if (!uri.match(/^https?:\/\//)) return Promise.resolve();
    return imageCache.saveImageIfNotExists(uri);
  });
  return Promise.allSettled(updatePromises.concat(saveImagePromises));
}

async function deleteAlgorithms(
  cacheRepository: CachedAlgorithmRepository,
  ids: AlgorithmId[]
) {
  const promises = ids.map((v) => cacheRepository.delete(v));
  return Promise.allSettled(promises);
}

export async function updateCache(
  imageCache: ImageCache,
  cacheRepository: CachedAlgorithmRepository,
  sourceResult: Algorithm[],
  cacheResult: Algorithm[]
) {
  const diffResult = diff(sourceResult, cacheResult);
  const createPromise = createAlgorithms(
    imageCache,
    cacheRepository,
    diffResult.algorithmsToCreate
  );
  const updatePromise = updateAlgorithms(
    imageCache,
    cacheRepository,
    diffResult.algorithmsToUpdate
  );
  const deletePromise = deleteAlgorithms(
    cacheRepository,
    diffResult.idsToDelete
  );
  const promises = [createPromise, updatePromise, deletePromise];
  await Promise.allSettled(promises);
}
