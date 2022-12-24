import type { Algorithm } from '@/domain/models/Algorithm/Algorithm';
import type { Outcome } from '@/domain/models/Algorithm/Outcome';

interface AlgorithmRenderer {
  renderAlgorithm(algorithm: Algorithm): Promise<string>;
  renderOutcome(outcome: Outcome): Promise<string>;
}

export { AlgorithmRenderer };
