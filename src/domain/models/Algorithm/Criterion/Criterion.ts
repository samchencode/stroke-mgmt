import type { GreaterThanCriterion } from '@/domain/models/Algorithm/Criterion/GreaterThanCriterion';
import type { GreaterThanOrEqualToCriterion } from '@/domain/models/Algorithm/Criterion/GreaterThanOrEqualToCriterion';
import type { LessThanCriterion } from '@/domain/models/Algorithm/Criterion/LessThanCriterion';
import type { LessThanOrEqualToCriterion } from '@/domain/models/Algorithm/Criterion/LessThanOrEqualToCriterion';
import type { NoCriterion } from '@/domain/models/Algorithm/Criterion/NoCriterion';

interface BaseCriterion {
  readonly type: string;
  check(v: number): boolean;
  is(other: BaseCriterion): boolean;
}

type Criterion =
  | GreaterThanCriterion
  | LessThanCriterion
  | NoCriterion
  | GreaterThanOrEqualToCriterion
  | LessThanOrEqualToCriterion;

type CriterionType = Criterion['type'];

export type { Criterion, CriterionType, BaseCriterion };
