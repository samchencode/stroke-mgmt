import type { Algorithm } from '@/domain/models/Algorithm/Algorithm';

interface AlgorithmRenderer {
  renderAlgorithm(algorithm: Algorithm): Promise<string>;
}

export { AlgorithmRenderer };
