import type { AlgorithmType } from '@/domain/models/Algorithm/Algorithm';

const ALGORITHM_TYPES = {
  TEXT_ALGORITHM: 'TextAlgorithm',
  SCORED_ALGORITHM: 'ScoredAlgorithm',
} satisfies Record<string, AlgorithmType>;

export type { AlgorithmType };
export { ALGORITHM_TYPES };
export { TextAlgorithm } from '@/domain/models/Algorithm/TextAlgorithm';
export { ScoredAlgorithm } from '@/domain/models/Algorithm/ScoredAlgorithm';
export type { Algorithm } from '@/domain/models/Algorithm/Algorithm';
export type { AlgorithmVisitor } from '@/domain/models/Algorithm/AlgorithmVisitor';
export { AlgorithmInfo } from '@/domain/models/Algorithm/AlgorithmInfo';
export { AlgorithmId } from '@/domain/models/Algorithm/AlgorithmId';
export { Outcome } from '@/domain/models/Algorithm/Outcome';
export type { AlgorithmRepository } from '@/domain/models/Algorithm/ports/AlgorithmRepository/AlgorithmRepository';
export type { AlgorithmRenderer } from '@/domain/models/Algorithm/ports/AlgorithmRenderer';
export {
  GreaterThanCriterion,
  LessThanCriterion,
  GreaterThanOrEqualToCriterion,
  LessThanOrEqualToCriterion,
  NoCriterion,
  CRITERION_TYPES,
} from '@/domain/models/Algorithm/Criterion';
export type {
  Criterion,
  CriterionType,
} from '@/domain/models/Algorithm/Criterion';
export {
  Switch,
  YesNoSwitch,
  SwitchId,
  Level,
  LevelId,
} from '@/domain/models/Algorithm/Switch';
export { RenderedAlgorithm } from '@/domain/models/Algorithm/RenderedAlgorithm';
export { AlgorithmMetadata } from '@/domain/models/Algorithm/AlgorithmMetadata';
export type { CachedAlgorithmRepository } from '@/domain/models/Algorithm/ports/CachedAlgorithmRepository';
export { CachedAlgorithmNotFoundError } from '@/domain/models/Algorithm/ports/CachedAlgorithmRepository';
export { AlgorithmNotFoundError } from '@/domain/models/Algorithm/ports/AlgorithmRepository';
export { NullAlgorithm } from '@/domain/models/Algorithm/NullAlgorithm';
