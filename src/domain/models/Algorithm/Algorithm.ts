import type { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';
import type { AlgorithmVisitor } from '@/domain/models/Algorithm/AlgorithmVisitor';
import type { Outcome } from '@/domain/models/Algorithm/Outcome';
import type { Image } from '@/domain/models/Image';

interface Algorithm {
  getId(): AlgorithmId;
  getTitle(): string;
  getSummary(): string;
  getBody(): string;
  getThumbnail(): Image;
  getOutcomes(): Outcome[];
  hasOutcomes(): boolean;
  getshouldShowOnHomeScreen(): boolean;
  is(other: Algorithm): boolean;
  acceptVisitor(v: AlgorithmVisitor): void;
}

export type { Algorithm };
