import type { Algorithm } from '@/domain/models/Algorithm/Algorithm';

interface AlgorithmRenderer {
  render(algorithm: Algorithm): Promise<string>;
}

export { AlgorithmRenderer };
