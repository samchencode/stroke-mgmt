import type { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';

class CachedAlgorithmNotFoundError extends Error {
  name = 'CachedAlgorithmNotFoundError';

  constructor(id: AlgorithmId) {
    super();
    this.message = `Algorithm with id of ${id} could not be found in the cache`;
  }
}

export { CachedAlgorithmNotFoundError };
