import type { Algorithm } from '@/domain/models/Algorithm/Algorithm';
import type { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';

class AlgorithmMetadata {
  constructor(
    private readonly id: AlgorithmId,
    private readonly lastUpdated: Date
  ) {}

  getId() {
    return this.id;
  }

  getLastUpdated() {
    return this.lastUpdated;
  }

  is(other: Algorithm | AlgorithmMetadata) {
    return this.id.is(other.getId());
  }
}

export { AlgorithmMetadata };
