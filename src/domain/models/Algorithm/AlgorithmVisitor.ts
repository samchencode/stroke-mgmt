import type { ScoredAlgorithm } from '@/domain/models/Algorithm/ScoredAlgorithm';
import type { TextAlgorithm } from '@/domain/models/Algorithm/TextAlgorithm';

interface AlgorithmVisitor {
  visitTextAlgorithm(algo: TextAlgorithm): void;
  visitScoredAlgorithm(algo: ScoredAlgorithm): void;
}

export { AlgorithmVisitor };
