import type { CachedTagRepository, Tag } from '@/domain/models/Tag';
import { determineCacheOperations } from '@/domain/services/Cache/determineCacheOperations';

function updateCache(
  cacheRepository: CachedTagRepository,
  sourceResult: Tag[],
  cacheResult: Tag[]
) {
  const changes = determineCacheOperations(sourceResult, cacheResult, (t) =>
    t.getName()
  );

  const savePromise = cacheRepository.saveAll(changes.toCreate);
  const updatePromises = changes.toUpdate.map((v) => cacheRepository.update(v));
  const deletePromises = changes.toDelete.map((v) => cacheRepository.delete(v));

  return Promise.all([savePromise, ...updatePromises, ...deletePromises]);
}

export { updateCache };
