import type { Algorithm, AlgorithmId } from '@/domain/models/Algorithm';
import type { AlgorithmCache } from '@/domain/services/Cache';

class GetAlgorithmByIdAction {
  constructor(private readonly algorithmCache: AlgorithmCache) {}

  async execute(id: AlgorithmId, onStaleCallback: (v: Algorithm) => void) {
    return this.algorithmCache.getById(id, onStaleCallback);
  }
}

export { GetAlgorithmByIdAction };
