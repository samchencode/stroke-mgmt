import type { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';

class AlgorithmNotFoundError extends Error {
  name = 'AlgorithmNotFoundError';

  constructor(id: AlgorithmId) {
    super(`Algorithm with id of ${id} could not be found.`);
  }
}

export { AlgorithmNotFoundError };
