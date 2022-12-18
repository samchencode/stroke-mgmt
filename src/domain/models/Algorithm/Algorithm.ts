import type { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';
import type { Outcome } from '@/domain/models/Algorithm/Outcome';

interface Algorithm {
  getId(): AlgorithmId;
  getTitle(): string;
  getBody(): string;
  getOutcomes(): Outcome[];
  hasOutcome(): boolean;
  is(other: Algorithm): boolean;
}

export type { Algorithm };
