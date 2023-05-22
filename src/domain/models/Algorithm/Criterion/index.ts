import type { CriterionType } from '@/domain/models/Algorithm/Criterion/Criterion';

const CRITERION_TYPES = {
  GREATER_THAN_CRITERION: 'GreaterThanCriterion',
  LESS_THAN_CRITERION: 'LessThanCriterion',
  NO_CRITERION: 'NoCriterion',
  GREATER_THAN_OR_EQUAL_TO_CRITERION: 'GreaterThanOrEqualToCriterion',
  LESS_THAN_OR_EQUAL_TO_CRITERION: 'LessThanOrEqualToCriterion',
} satisfies Record<string, CriterionType>;

export { GreaterThanCriterion } from '@/domain/models/Algorithm/Criterion/GreaterThanCriterion';
export { GreaterThanOrEqualToCriterion } from '@/domain/models/Algorithm/Criterion/GreaterThanOrEqualToCriterion';
export { LessThanCriterion } from '@/domain/models/Algorithm/Criterion/LessThanCriterion';
export { LessThanOrEqualToCriterion } from '@/domain/models/Algorithm/Criterion/LessThanOrEqualToCriterion';
export { NoCriterion } from '@/domain/models/Algorithm/Criterion/NoCriterion';
export type { Criterion } from '@/domain/models/Algorithm/Criterion/Criterion';
export type { CriterionType };
export { CRITERION_TYPES };
