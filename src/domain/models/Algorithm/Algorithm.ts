import type { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';
import type { AlgorithmParams } from '@/domain/models/Algorithm/AlgorithmInfo';
import type { AlgorithmVisitor } from '@/domain/models/Algorithm/AlgorithmVisitor';
import type { Outcome } from '@/domain/models/Algorithm/Outcome';
import type { ScoredAlgorithm } from '@/domain/models/Algorithm/ScoredAlgorithm';
import type { TextAlgorithm } from '@/domain/models/Algorithm/TextAlgorithm';
import type { Image } from '@/domain/models/Image';

interface BaseAlgorithm {
  readonly type: string;
  getId(): AlgorithmId;
  getTitle(): string;
  getSummary(): string;
  getBody(): string;
  getThumbnail(): Image;
  getOutcomes(): Outcome[];
  hasOutcomes(): boolean;
  getShouldShowOnHomeScreen(): boolean;
  getLastUpdated(): Date;
  is(other: Algorithm): boolean;
  acceptVisitor(v: AlgorithmVisitor): void;
  setMetadata(info: Partial<AlgorithmParams>): Algorithm;
}

type Algorithm = TextAlgorithm | ScoredAlgorithm;
type AlgorithmType = Algorithm['type'];

export type { Algorithm, BaseAlgorithm, AlgorithmType };
