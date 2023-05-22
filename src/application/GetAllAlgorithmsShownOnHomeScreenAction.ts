import type { Algorithm } from '@/domain/models/Algorithm';
import type { AlgorithmCache } from '@/domain/services/Cache';

class GetAllAlgorithmsShownOnHomeScreenAction {
  constructor(private readonly algorithmCache: AlgorithmCache) {}

  async execute(onStaleCallback: (v: Algorithm[]) => void) {
    return this.algorithmCache.getAllShownOnHomeScreen(onStaleCallback);
  }
}

export { GetAllAlgorithmsShownOnHomeScreenAction };
